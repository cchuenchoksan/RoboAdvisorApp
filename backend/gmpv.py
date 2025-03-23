from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize, LinearConstraint

import matplotlib.pyplot as plt
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from collections import defaultdict

np.random.seed(42)

app = Flask(__name__)

# Fund tickers (replace with actual tickers if available)
fund_tickers = [
    "0P00011STA.SI", "0P0001JJ08.SI", "0P0001I4B6.SI", "0P0000Y077.SI",
    "0P0000Y35A", "0P0000K7H9", "0P0000TJCX", "0P00000DS2",
    "0P000019D5", "0P00008SN2.F"
]

# Download fund data from Yahoo Finance
fund_data = yf.download(fund_tickers, period="3y", interval="1d")['Close']
fund_data = fund_data.interpolate()

# Compute daily returns
returns = fund_data.pct_change().dropna().T.values

# Compute the average return for each fund
avg_returns = np.mean(returns, axis=1)

# Compute the variance-covariance matrix of returns
cov_matrix = np.cov(returns)

# Compute standard deviations
std_devs = np.sqrt(np.diag(cov_matrix))

# Risk-free rate assumption
risk_free_rate = 0.02 / 252  # Annualized 2% converted to daily

# Compute Sharpe ratios
sharpe_ratios = (avg_returns - risk_free_rate) / std_devs


# Compute correlation matrix
correlation_matrix = pd.DataFrame(returns, index=fund_tickers).T.corr()

# Portfolio performance 
# def portfolio_performance(weights, avg_returns, cov_matrix):
#     ret = np.dot(weights, avg_returns)
#     vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
#     return ret, vol


# funds page
# Efficient frontier function
def efficient_frontier(short_sales=True):
    num_assets = len(avg_returns)
    result = []
    for target_return in np.linspace(min(avg_returns), max(avg_returns), 50):
        def objective(weights):
            return np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
        constraints = [
            {'type': 'eq', 'fun': lambda w: np.sum(w) - 1},
            {'type': 'eq', 'fun': lambda w: np.dot(w, avg_returns) - target_return}
        ]
        bounds = None if short_sales else [(0, 1)] * num_assets 
        init_guess = np.ones(num_assets) / num_assets  
        opt = minimize(objective, init_guess, bounds=bounds, constraints=constraints)
        if opt.success:
            result.append([target_return, opt.fun])
    return np.array(result) if result else np.array([]).reshape(0, 2)

@app.route('/efficient_frontier', methods=['GET']) # ?short_sales=true/false
def get_efficient_frontier():
    short_sales = request.args.get('short_sales', 'true').lower() == 'true'
    frontier = efficient_frontier(short_sales=short_sales)
    return jsonify({"efficient_frontier": frontier.tolist()})

@app.route('/fund_statistics', methods=['GET'])
def get_fund_statistics():
    statistics = []
    for i, ticker in enumerate(fund_tickers):
        statistics.append({
            "fund": ticker,
            "average_return": avg_returns[i],
            "standard_deviation": std_devs[i],
            "sharpe_ratio": sharpe_ratios[i]
        })
    return jsonify({"fund_statistics": statistics})

@app.route('/correlation_matrix', methods=['GET'])
def get_correlation_matrix():
    return jsonify(correlation_matrix.to_dict())



# portfolio page
def utility_function(weights, mean_returns, cov_matrix, risk_aversion):
    """Utility function to minimize."""
    returns = np.dot(weights, mean_returns)
    risk = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    return -(returns - 0.5 * risk_aversion * risk ** 2)

def optimal_portfolio(mean_returns, cov_matrix, risk_aversion, short_sales):
    """Calculate optimal portfolio."""
    num_assets = len(mean_returns)
    constraints = [{'type': 'eq', 'fun': lambda w: np.sum(w) - 1}]
    constraints = LinearConstraint(np.ones(num_assets), 1, 1)
    bounds = None if short_sales else [(0, 1)] * num_assets 

    best_result = None
    best_utility = float('-inf')

    initial_guesses = [
        np.ones(num_assets) / num_assets,  # Equal weights
        np.random.random(num_assets),      # Random weights
    ]
    for init_guess in initial_guesses:
        # Normalize the initial guess to sum to 1
        if np.sum(init_guess) != 0:
            init_guess = init_guess / np.sum(init_guess)
        else:
            init_guess = np.ones(num_assets) / num_assets
            
        opt = minimize(utility_function, init_guess, args=(mean_returns, cov_matrix, risk_aversion),
                       bounds=bounds, constraints=constraints, method='trust-constr')
        
        if opt.success:
            utility = -utility_function(opt.x, mean_returns, cov_matrix, risk_aversion)
            if best_result is None or utility > best_utility:
                best_result = opt.x
                best_utility = utility
    
    if best_result is not None:
        return best_result
    else:
        print("Optimization failed for all initial guesses")
        return np.ones(num_assets) / num_assets

# @app.route('/port_breakdown_api', methods=['POST'])
def port_breakdown():
    data = request.get_json()
    risk_aversion = data.get('risk_aversion')
    
    if risk_aversion is None:
        return jsonify({"error": "No risk profile found"}), 400
    
    
    if risk_aversion < 1e-6:
        short_sales = False
    else:
        short_sales = True
        
    optimal_weights = optimal_portfolio(avg_returns, cov_matrix, risk_aversion, short_sales=short_sales)

    ratio = [{"stock_name": yf.Ticker(i).info["longName"], "percentage": optimal_weights[i]} for i in range(len(fund_tickers))]
    
    port_return = np.dot(optimal_weights, avg_returns)
    port_risk = np.sqrt(np.dot(optimal_weights.T, np.dot(cov_matrix, optimal_weights)))
    port_sharpe = (port_return - risk_free_rate) / port_risk
    
    port_performance = {
        "returns": port_return,
        "risk": port_risk,
        "sharpe": port_sharpe
    }
    
    response = {
        "ratio": ratio,
        "port_performance": port_performance
    }
    
    return jsonify(response)



if __name__ == '__main__':
    app.run(debug=True)
