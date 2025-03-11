from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize

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

# Portfolio performance 
# def portfolio_performance(weights, avg_returns, cov_matrix):
#     ret = np.dot(weights, avg_returns)
#     vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
#     return ret, vol

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

@app.route('/efficient_frontier', methods=['GET'])
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

if __name__ == '__main__':
    app.run(debug=True)
