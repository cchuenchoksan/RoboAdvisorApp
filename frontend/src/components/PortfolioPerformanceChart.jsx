import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as LineTooltip, Legend, 
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import axios from 'axios';

const PortfolioPerformanceChart = ({ riskAversion }) => {
  const initialEquity = 1000; // can adjust with backend
  const period = 90; // can adjust with backend
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPerformanceData = async () => {
      const response = await axios.post('http://127.0.0.1:5000/portfolio_performance', {
        risk_aversion: riskAversion,
        period: period
      });
      setPerformanceData(response.data.performance_data);
      setLoading(false);
    };
  
    fetchPerformanceData();
  }, [riskAversion]);
  
  if (loading) return <Typography>Loading portfolio data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  // Generate vertical reference lines based on visible X ticks
  const xTickDays = performanceData
  .filter((_, index) => index % 2 === 1 || index === performanceData.length - 1)
  .map((item, index) => ({
    day: item.day,
    key: `ref-line-${index}-${item.day}` // ensure unique keys
  }));

  const referenceLines = xTickDays.map(tick => (
  <ReferenceLine 
    key={tick.key}
    x={tick.day}
    stroke="#ccc"
    strokeDasharray="3 3"
  />
  ));

  const values = performanceData.map(d => Number(d.value));
  const minY = values.length > 0 ? 0.98*Math.min(...values) : 0;
  const maxY = values.length > 0 ? 1.02*Math.max(...values) : 10000;
  
  console.log("minY:", minY, "maxY:", maxY);
  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recommended Portfolio Performance in Past {period} Days
      </Typography>
      <Box sx={{ width: '100%', height: 'auto', minHeight: '400px', flex: 1 }}>
        <ResponsiveContainer width="100%" height={750}>
          <LineChart
            data={performanceData}
            margin={{ top: 5, right: 20 }}
          >
            {/* Horizontal grid lines only */}
            <CartesianGrid 
              horizontal={true}
              vertical={false}
              strokeDasharray="3 3" 
            />
            
            <ReferenceLine 
              y={initialEquity} 
              stroke="#facc15"
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{
                value: 'Initial Equity', 
                position: 'insideTopRight', 
                fill: '#facc15',
                fontSize: 12
              }}
            />
            {referenceLines}

            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              ticks={performanceData
                .filter((_, index) => index % 2 === 1 || index === performanceData.length - 1)
                .map(item => item.day)}
              tickMargin={5}
            />
            <YAxis domain={[minY, maxY]}
                   tickFormatter={(val) => val.toFixed(0)} />
            <LineTooltip 
              formatter={(value) => [value.toFixed(2), "Value"]} 
              labelFormatter={(label) => `${label}`}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              payload={[
                { value: 'Portfolio Value', type: 'line', id: 'ID01', color: '#8884d8' },
                { value: `Initial Equity: ${initialEquity}`, type: 'line', id: 'ID02', color: '#facc15' },
              ]}
            />

            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default PortfolioPerformanceChart;