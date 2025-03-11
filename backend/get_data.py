import yfinance as yf

# Fund tickers (replace with actual tickers if available)
fund_tickers = [
    "0P00011STA.SI", "0P0001JJ08.SI", "0P0001I4B6.SI", "0P0000Y077.SI",
    "0P0000Y35A", "0P0000K7H9", "0P0000TJCX", "0P00000DS2",
    "0P000019D5", "0P00008SN2.F"
]

# Download fund data
fund_data = yf.download(fund_tickers, period="3y", interval="1d")['Close']
fund_data_filled = fund_data.interpolate()
fund_data_filled = fund_data_filled.iloc[::-1]
fund_data_filled.to_csv("fund_data.csv")

print("Fund data has been saved to 'fund_data.csv'")