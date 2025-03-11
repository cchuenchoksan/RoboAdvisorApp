import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.optimize import minimize
import yfinance as yf

# Fund tickers (replace with actual tickers if available)
fund_tickers = [
    "0P00011STA.SI", "0P0001JJ08.SI", "0P0001I4B6.SI", "0P0000Y077.SI",
    "0P0000Y35A", "0P0000K7H9", "0P0000TJCX", "0P00000DS2",
    "0P000019D5", "0P00008SN2.F"
]

# Download fund data from Yahoo Finance
fund_data = yf.download(fund_tickers, period="3y", interval="1d")['Close']
fund_data = fund_data.interpolate()  # Handle missing data using linear interpolation
#fund_data = fund_data.iloc[::-1]  # Reverse the data for chronological order

# Compute daily returns
returns = fund_data.pct_change().dropna().T.values  # Convert to numpy array (funds as columns)

# Compute the average return for each fund
avg_returns = np.mean(returns, axis=1)

# Compute the variance-covariance matrix of returns
cov_matrix = np.cov(returns)

# Portfolio performance (expected return and volatility)
def portfolio_performance(weights, avg_returns, cov_matrix):
    ret = np.dot(weights, avg_returns)  # Expected portfolio return
    vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))  # Portfolio volatility
    return ret, vol

# Efficient frontier function
def efficient_frontier(short_sales=True):
    num_assets = len(avg_returns)
    result = []

    # Generate target returns for the efficient frontier
    for target_return in np.linspace(min(avg_returns), max(avg_returns), 50):
        # Objective function to minimize (portfolio volatility)
        def objective(weights):
            return np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))

        # Constraints: Weights sum to 1 and target return constraint
        constraints = [
            {'type': 'eq', 'fun': lambda w: np.sum(w) - 1},  # Weights sum to 1
            {'type': 'eq', 'fun': lambda w: np.dot(w, avg_returns) - target_return}  # Target return constraint
        ]

        # Bounds: no short sales if short_sales=False
        bounds = None if short_sales else [(0, 1)] * num_assets 
        init_guess = np.ones(num_assets) / num_assets  # Equal initial guess

        # Optimize the objective function
        opt = minimize(objective, init_guess, bounds=bounds, constraints=constraints)

        if opt.success:
            result.append([target_return, opt.fun])  # Store [return, volatility]

    return np.array(result) if result else np.array([]).reshape(0, 2)  # Ensure 2D format

# Plot the efficient frontier with and without short sales
def plot_efficient_frontier():
    frontier_with_short_sales = efficient_frontier(short_sales=True)
    frontier_without_short_sales = efficient_frontier(short_sales=False)
    
    plt.figure(figsize=(12, 8))

    # Plot efficient frontier with and without short sales
    plt.plot(frontier_with_short_sales[:, 1], frontier_with_short_sales[:, 0], label="With Short Sales", c='blue', lw=2)
    plt.plot(frontier_without_short_sales[:, 1], frontier_without_short_sales[:, 0], label="No Short Sales", c='red', lw=2)

    # Plot individual funds as black circles
    plt.scatter(np.sqrt(np.diag(cov_matrix)), avg_returns, marker='o', c='black', label="Funds", zorder=5)

    # Adding the Global Minimum Variance Portfolio (GMVP)
    gmvp_weights = get_gmvp(short_sales=True)
    gmvp_return, gmvp_volatility = portfolio_performance(gmvp_weights, avg_returns, cov_matrix)
    plt.scatter(gmvp_volatility, gmvp_return, color='green', marker='*', s=200, label='Global Minimum Variance Portfolio (GMVP)', zorder=10)

    # Customize plot appearance
    plt.xlabel("Volatility (Risk)", fontsize=14)
    plt.ylabel("Expected Return", fontsize=14)
    plt.title("Efficient Frontier with and without Short Sales", fontsize=16)
    plt.legend()
    plt.grid(True)

    # Adding more detailed annotations to make the plot clearer
    for i in range(len(fund_tickers)):
        plt.text(np.sqrt(cov_matrix[i, i]), avg_returns[i] + 0.001, fund_tickers[i], fontsize=10)

    # Show plot
    plt.tight_layout()
    plt.show()

# Global Minimum Variance Portfolio (GMVP)
def get_gmvp(short_sales=True):
    num_assets = len(avg_returns)
    def objective(weights):
        return np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    constraints = ({'type': 'eq', 'fun': lambda w: np.sum(w) - 1},)  # Weights sum to 1
    bounds = None if short_sales else [(0, 1)] * num_assets
    init_guess = np.ones(num_assets) / num_assets
    opt = minimize(objective, init_guess, bounds=bounds, constraints=constraints)
    
    return opt.x if opt.success else None

# Plotting avg_returns as a bar plot
def plot_avg_returns():
    plt.figure(figsize=(10, 6))
    plt.bar(fund_tickers, avg_returns, color='teal')
    plt.title("Average Returns of Funds", fontsize=16)
    plt.xlabel("Fund Tickers", fontsize=14)
    plt.ylabel("Average Return", fontsize=14)
    plt.xticks(rotation=45)
    plt.grid(True)
    plt.tight_layout()
    plt.show()

# Plotting cov_matrix as a heatmap
def plot_cov_matrix():
    plt.figure(figsize=(10, 6))
    sns.heatmap(cov_matrix, annot=True, cmap='coolwarm', xticklabels=fund_tickers, yticklabels=fund_tickers)
    plt.title("Covariance Matrix of Fund Returns", fontsize=16)
    plt.xlabel("Fund Tickers", fontsize=14)
    plt.ylabel("Fund Tickers", fontsize=14)
    plt.tight_layout()
    plt.show()

# Run the analysis and plot the efficient frontier
if __name__ == "__main__":
    plot_efficient_frontier()
    plot_avg_returns()
    plot_cov_matrix()
