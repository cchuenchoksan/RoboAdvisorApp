import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

// Color palette
const colorPalette = {
  prussianBlue: '#212D40',
  charcoal: '#364156',
  platinum: '#DBDBDB',
  jasper: '#D66853',
  roseTaupe: '#7D4E57'
};

const API_URL = "http://127.0.0.1:5000/fund_statistics";

function formatPercentage(value) {
  return (value * 100).toFixed(4) + "%";
}

export default function FundStatisticsTable() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch fund statistics.");
        return res.json();
      })
      .then((data) => {
        setFunds(data.funds_performance_table);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: colorPalette.jasper }} />
        <Typography sx={{ mt: 2, color: colorPalette.charcoal }}>
          Loading fund data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography sx={{ color: colorPalette.jasper, fontWeight: 500 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          width: "90%",
          maxWidth: 1200,
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          overflow: "hidden",
          border: `1px solid ${colorPalette.platinum}`,
        }}
      >
        {/* <Box p={3} bgcolor={colorPalette.prussianBlue}>
          <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 500 }}>
            Fund Statistics
          </Typography>
        </Box> */}
        
        <Table sx={{ minWidth: 650 }} aria-label="funds table">
          <TableHead sx={{ backgroundColor: colorPalette.platinum }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: colorPalette.prussianBlue }}>
                Ticker
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: colorPalette.prussianBlue }}>
                Fund Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: colorPalette.prussianBlue }}>
                Description
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", color: colorPalette.prussianBlue }}>
                Avg Returns (%)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", color: colorPalette.prussianBlue }}>
                Risk (std %)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", color: colorPalette.prussianBlue }}>
                Sharpe Ratio
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funds.map((fund, index) => (
              <TableRow 
                key={fund.fund_name}
                sx={{ 
                  '&:nth-of-type(odd)': { 
                    backgroundColor: 'rgba(219, 219, 219, 0.1)' 
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(214, 104, 83, 0.05)'
                  }
                }}
              >
                <TableCell sx={{ color: colorPalette.charcoal, fontWeight: 500 }}>
                  {fund.fund_ticker}
                </TableCell>
                <TableCell component="th" scope="row" sx={{ color: colorPalette.prussianBlue }}>
                  {fund.fund_name}
                </TableCell>
                <TableCell sx={{ color: colorPalette.charcoal }}>
                  {fund.fund_description}
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: fund.fund_returns > 0 ? '#2e7d32' : '#d32f2f',
                  fontWeight: 500
                }}>
                  {formatPercentage(fund.fund_returns)}
                </TableCell>
                <TableCell align="right" sx={{ color: colorPalette.charcoal }}>
                  {formatPercentage(fund.fund_risk)}
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: fund.fund_sharpe > 0 ? '#2e7d32' : '#d32f2f',
                  fontWeight: 500
                }}>
                  {fund.fund_sharpe.toFixed(4)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}