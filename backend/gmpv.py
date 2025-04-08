from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize, LinearConstraint

import matplotlib.pyplot as plt
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from collections import defaultdict
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

np.random.seed(42)

app = Flask(__name__)

# Fund tickers (replace with actual tickers if available)
fund_tickers = [
    "0P00011STA.SI",
    "0P0001JJ08.SI",
    "0P0001I4B6.SI",
    "0P0000Y077.SI",
    "0P0000Y35A",
    "0P0000K7H9",
    "0P0000TJCX",
    "0P00000DS2",
    "0P000019D5",
    "0P00008SN2.F",
]

# Download fund data from Yahoo Finance
fund_data = yf.download(fund_tickers, period="3y", interval="1d")["Close"]
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
            {"type": "eq", "fun": lambda w: np.sum(w) - 1},
            {"type": "eq", "fun": lambda w: np.dot(w, avg_returns) - target_return},
        ]
        bounds = None if short_sales else [(0, 1)] * num_assets
        init_guess = np.ones(num_assets) / num_assets
        opt = minimize(
            objective,
            init_guess,
            bounds=bounds,
            constraints=constraints,
            options={
                "maxiter": 10000,
                "ftol": 1e-9,
                "xtol": 1e-9,
            },
        )
        if opt.success:
            result.append([target_return, opt.fun])
    result = np.array(result) if result else np.array([]).reshape(0, 2)

    if result.size > 0:
        gmpv_index = np.argmin(result[:, 1])

        # split
        above_gmpv = result[gmpv_index:]
        below_gmpv = result[: gmpv_index + 1]

        return above_gmpv, below_gmpv
    else:
        return np.array([]).reshape(0, 2), np.array([]).reshape(0, 2)


@app.route("/efficient_frontier", methods=["GET"])  # ?short_sales=true/false
def get_efficient_frontier():
    short_sales = request.args.get("short_sales", "true").lower() == "true"
    above_gmpv, below_gmpv = efficient_frontier(short_sales=short_sales)
    # res = jsonify({"efficient_frontier": frontier.tolist()})
    res = jsonify(
        {"above_gmpv": above_gmpv.tolist(), "below_gmpv": below_gmpv.tolist()}
    )
    # Manually add CORS headers
    res.headers["Access-Control-Allow-Origin"] = "*"
    res.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    res.headers["Access-Control-Allow-Headers"] = (
        "Origin, Content-Type, X-Requested-With"
    )
    return res

@app.route('/portfolio_performance', methods=['POST'])
def portfolio_performance():
    """API to get the performance of the optimal portfolio over the last 30 days."""
    data = request.get_json()
    risk_aversion = data.get('risk_aversion')
    period = data.get('period', 30)  # Default to 30 days if not provided
    period  = min(period, 252*2)  # Limit to max 2 years

    if risk_aversion is None:
        return jsonify({"error": "No risk profile found"}), 400

    
    short_sales = risk_aversion >= 1e-6

    # Calculate optimal portfolio weights
    optimal_weights = optimal_portfolio(avg_returns, cov_matrix, risk_aversion, short_sales=short_sales)

    # Calculate portfolio performance over the last periods
    last_period_returns = fund_data.iloc[-period:].pct_change().dropna()
    portfolio_values = [1000] 
    for daily_return in last_period_returns.values:
        portfolio_values.append(portfolio_values[-1] * (1 + np.dot(optimal_weights, daily_return)))
    performance_data = [{"day": f"Day {i+1}", "value": value} for i, value in enumerate(portfolio_values)]

    return jsonify({"performance_data": performance_data})

@app.route("/fund_statistics", methods=["GET"])
def get_fund_statistics():
    statistics = []
    for i, ticker in enumerate(fund_tickers):
        fund_info = yf.Ticker(ticker).info
        statistics.append(
            {
                "fund_name": fund_info.get("longName", ticker),
                "fund_description": fund_info.get(
                    "longBusinessSummary", "No description available"
                ),
                # "fund_link": fund_info.get("website", "No link available"),
                "fund_returns": avg_returns[i],
                "fund_risk": std_devs[i],
                "fund_sharpe": sharpe_ratios[i],
            }
        )
    return jsonify({"funds_performance_table": statistics})


@app.route("/correlation_matrix", methods=["GET"])
def get_correlation_matrix():
    return jsonify(correlation_matrix.to_dict())


# portfolio page
def utility_function(weights, mean_returns, cov_matrix, risk_aversion):
    """Utility function to minimize."""
    returns = np.dot(weights, mean_returns)
    risk = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    return -(returns - 0.5 * risk_aversion * risk**2)


def optimal_portfolio(mean_returns, cov_matrix, risk_aversion, short_sales):
    """Calculate optimal portfolio."""
    num_assets = len(mean_returns)
    constraints = [{"type": "eq", "fun": lambda w: np.sum(w) - 1}]
    constraints = LinearConstraint(np.ones(num_assets), 1, 1)
    bounds = [(-0.5, 1.5)] * num_assets if short_sales else [(0, 1)] * num_assets # add some short sales limits

    best_result = None
    best_utility = float("-inf")

    initial_guesses = [
        np.ones(num_assets) / num_assets,  # Equal weights
        np.random.random(num_assets),  # Random weights
    ]
    for init_guess in initial_guesses:
        # Normalize the initial guess to sum to 1
        if np.sum(init_guess) != 0:
            init_guess = init_guess / np.sum(init_guess)
        else:
            init_guess = np.ones(num_assets) / num_assets

        opt = minimize(
            utility_function,
            init_guess,
            args=(mean_returns, cov_matrix, risk_aversion),
            bounds=bounds,
            constraints=constraints,
            method="trust-constr",
        )

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
    risk_aversion = data.get("risk_aversion")

    if risk_aversion is None:
        return jsonify({"error": "No risk profile found"}), 400

    if risk_aversion < 1e-6:
        short_sales = False
    else:
        short_sales = True

    optimal_weights = optimal_portfolio(
        avg_returns, cov_matrix, risk_aversion, short_sales=short_sales
    )

    ratio = [
        {
            "stock_name": yf.Ticker(fund_tickers[i]).info["longName"],
            "percentage": optimal_weights[i],
        }
        for i in range(len(fund_tickers))
    ]

    port_return = np.dot(optimal_weights, avg_returns)
    port_risk = np.sqrt(np.dot(optimal_weights.T, np.dot(cov_matrix, optimal_weights)))
    port_sharpe = (port_return - risk_free_rate) / port_risk

    port_performance = {
        "returns": port_return,
        "risk": port_risk,
        "sharpe": port_sharpe,
    }

    response = {"ratio": ratio, "port_performance": port_performance}

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
