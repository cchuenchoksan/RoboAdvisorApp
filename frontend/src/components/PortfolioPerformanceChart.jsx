import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, Legend as LineLegend } from 'recharts';
import axios from 'axios';

const PortfolioPerformanceChart = ({ riskAversion }) => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const response = await axios.post('http://127.0.0.1:5000/portfolio_performance', {
          risk_aversion: riskAversion,
          period: 30
        });

        setPerformanceData(response.data.performance_data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load portfolio performance data');
        setLoading(false);
        console.error('Error fetching portfolio data:', err);
      }
    };

    fetchPerformanceData();
  }, [riskAversion]);

  if (loading) return <Typography>Loading portfolio data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ flex: "1 1 70%", p: 2, border: "1px solid grey", borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Portfolio Performance (Past 30 Days)
      </Typography>
      <LineChart
        width={900}
        height={600}
        data={performanceData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis /> {/* Removed the domain prop */}
        <LineTooltip />
        <LineLegend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </Box>
  );
};

export default PortfolioPerformanceChart;