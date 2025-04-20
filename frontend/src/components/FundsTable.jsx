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

const API_URL = "http://127.0.0.1:5000/fund_statistics";

function formatPercentage(value) {
  return (value * 100).toFixed(2) + "%";
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
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="funds table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Fund Name</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Description
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Avg Returns (%)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Risk (std %)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Sharpe Ratio
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funds.map((fund) => (
              <TableRow key={fund.fund_name}>
                <TableCell component="th" scope="row">
                  {fund.fund_name}
                </TableCell>
                <TableCell align="right">{fund.fund_description}</TableCell>
                <TableCell align="right">
                  {formatPercentage(fund.fund_returns)}
                </TableCell>
                <TableCell align="right">
                  {formatPercentage(fund.fund_risk)}
                </TableCell>
                <TableCell align="right">
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
