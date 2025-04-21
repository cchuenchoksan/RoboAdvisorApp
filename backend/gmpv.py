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

df = pd.read_csv("./fund_info.csv", delimiter="|", index_col="ticker")

fund_descriptions_dict = df.to_dict("index")

short_sale_threshold = 10  # Risk aversion threshold for short sales
# app = Flask(__name__)

# Fund tickers (replace with actual tickers if available)
fund_tickers = [
    "0P00011STA.SI",
    "0P0001JJ08.SI",
    "0P0001I4B6.SI",
    "0P0000Y077.SI",
    "0P0000Y35A",
    "0P0000K7H9",
    "0P00006OI1.SI",
    "0P00000DS2",
    "0P000019D5",
    "0P00008SN2.F",
]

fund_names = {}
for ticker in fund_tickers:
    try:
        fund = yf.Ticker(ticker)
        info = fund.info
        fund_names[ticker] = info.get("longName", "Name not available")
    except Exception as e:
        fund_names[ticker] = f"Error: {str(e)}"

# Download fund data from Yahoo Finance
fund_data = yf.download(fund_tickers, period="3y", interval="1d")["Close"]
fund_data = fund_data.interpolate()
fund_data = fund_data[fund_tickers]

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
    weights_list = []

    for target_return in np.linspace(min(avg_returns), max(avg_returns), 50):

        def objective(weights):
            return np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))

        constraints = [
            {"type": "eq", "fun": lambda w: np.sum(w) - 1},
            {"type": "eq", "fun": lambda w: np.dot(w, avg_returns) - target_return},
        ]

        bounds = [(-1, 1)] * num_assets if short_sales else [(0, 1)] * num_assets
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
            weights_list.append(opt.x)

    result = np.array(result) if result else np.array([]).reshape(0, 2)
    weights_list = np.array(weights_list) if weights_list else np.array([]).reshape(0, num_assets)

    if result.size > 0:
        gmpv_index = np.argmin(result[:, 1])

        above_gmpv = result[gmpv_index:]
        below_gmpv = result[: gmpv_index + 1]
        gmvp_point = result[gmpv_index]
        gmvp_weights = weights_list[gmpv_index]

        return above_gmpv, below_gmpv, gmvp_point, gmvp_weights
    else:
        return (
            np.array([]).reshape(0, 2),
            np.array([]).reshape(0, 2),
            np.array([]),
            np.array([]),
        )


    
@app.route("/gmvp", methods=["GET"])  # ?short_sales=true/false
def get_gmvp_point():
    short_sales = request.args.get("short_sales", "true").lower() == "true"
    _, _, gmvp_point, gmvp_weights = efficient_frontier(short_sales=short_sales)
    weights = gmvp_weights.tolist()
    if gmvp_point.size > 0:
        res = jsonify({
            "risk": gmvp_point[1],
            "return": gmvp_point[0],
            "weights": [{"name": fund_names[ticker], "value": weights[i]} for i, ticker in enumerate(fund_tickers)]
        })
    else:
        res = jsonify({"error": "GMVP not found"})

    res.headers["Access-Control-Allow-Origin"] = "*"
    res.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    res.headers["Access-Control-Allow-Headers"] = (
        "Origin, Content-Type, X-Requested-With"
    )
    return res



@app.route("/efficient_frontier", methods=["GET"])  # ?short_sales=true/false
def get_efficient_frontier():
    short_sales = request.args.get("short_sales", "true").lower() == "true"
    above_gmpv, below_gmpv, _, _ = efficient_frontier(short_sales=short_sales)
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
    risk_profile = data.get('risk_aversion')
    period = data.get('period', 30)  # Default to 30 days if not provided
    period  = min(period, 252*2)  # Limit to max 2 years

    risk_aversion = profile_to_risk_aversion(risk_profile)

    print(f"Risk Profile:{risk_profile},Risk aversion: {risk_aversion}, Period: {period}")
    if risk_aversion is None:
        return jsonify({"error": "No risk profile found"}), 400

    short_sales = risk_aversion <= short_sale_threshold  # if risk aversion is lower than the threshold, which means risk seeking, then allow short sales

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
                "fund_ticker": fund_tickers[i],
                "fund_name": fund_info.get("longName", ticker),
                # "fund_description": fund_info.get(
                #     "longBusinessSummary", "No description available"
                # ),
                "fund_description": fund_descriptions_dict[fund_tickers[i]]["short_description"],
                # "fund_link": fund_info.get("website", "No link available"),
                "fund_returns": avg_returns[i],
                "fund_risk": std_devs[i],
                "fund_sharpe": sharpe_ratios[i],
            }
        )
    res = jsonify({"funds_performance_table": statistics})
    # Manually add CORS headers
    res.headers["Access-Control-Allow-Origin"] = "*"
    res.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    res.headers["Access-Control-Allow-Headers"] = (
        "Origin, Content-Type, X-Requested-With"
    )
    return res


@app.route("/correlation_matrix", methods=["GET"])
def get_correlation_matrix():
    return jsonify(correlation_matrix.to_dict())


# portfolio page
def utility_function(weights, mean_returns, cov_matrix, risk_aversion):
    """Utility function to minimize."""
    returns = np.dot(weights, mean_returns)
    risk = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    return -(returns - 0.5 * risk_aversion * risk**2)


def profile_to_risk_aversion(risk_profile_score, min_A=1, max_A=20):
    """
    Converts a risk profile score (0-100) to a risk aversion coefficient A.
    Higher scores mean less risk aversion.
    """
    normalized_score = risk_profile_score / 100  # 0 to 1
    return max_A - normalized_score * (max_A - min_A)


def optimal_portfolio(mean_returns, cov_matrix, risk_aversion, short_sales):
    """Calculate optimal portfolio."""
    num_assets = len(mean_returns)
    constraints = [{"type": "eq", "fun": lambda w: np.sum(w) - 1}]
    constraints = LinearConstraint(np.ones(num_assets), 1, 1)
    bounds = [(-1, 1)] * num_assets if short_sales else [(0, 1)] * num_assets # add some short sales limits

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

    if risk_aversion > short_sale_threshold:
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

@app.route('/ratio_breakdown_api', methods=['GET'])
def ratio_breakdown():
    # data = request.get_json()
    # risk_aversion = data.get("risk_aversion")
    risk_profile = float(request.args.get("risk_aversion"))
    if risk_profile is None:
        return jsonify({"error": "No risk profile found"}), 400

    risk_aversion = profile_to_risk_aversion(risk_profile)
    
    if risk_aversion > short_sale_threshold:
        short_sales = False
    else:
        short_sales = True

    optimal_weights = optimal_portfolio(
        avg_returns, cov_matrix, risk_aversion, short_sales=short_sales
    )

    ratio = [
        {
            "name": yf.Ticker(fund_tickers[i]).info["shortName"],
            "value": optimal_weights[i] * 100,
        }
        for i in range(len(fund_tickers))
    ]
    res = jsonify(ratio)
    # Manually add CORS headers
    res.headers["Access-Control-Allow-Origin"] = "*"
    res.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    res.headers["Access-Control-Allow-Headers"] = (
        "Origin, Content-Type, X-Requested-With"
    )

    return res


if __name__ == "__main__":
    app.run(debug=True)
