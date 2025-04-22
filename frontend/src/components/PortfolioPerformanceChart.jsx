import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as LineTooltip, Legend, 
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import axios from 'axios';

// Color palette
const colorPalette = {
  prussianBlue: '#212D40',
  charcoal: '#364156',
  platinum: '#DBDBDB',
  jasper: '#D66853',
  roseTaupe: '#7D4E57'
};

const PortfolioPerformanceChart = ({ riskAversion }) => {
  const initialEquity = 1000; // can adjust with backend
  const period = 90; // can adjust with backend
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/portfolio_performance', {
          risk_aversion: riskAversion,
          period: period
        });
        setPerformanceData(response.data.performance_data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio performance:', err);
        setError('Failed to load portfolio performance data');
        setLoading(false);
      }
    };
  
    fetchPerformanceData();
  }, [riskAversion]);
  
  if (loading) return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="400px">
      <CircularProgress sx={{ color: colorPalette.jasper }} />
      <Typography sx={{ mt: 2, color: colorPalette.charcoal }}>
        Loading portfolio performance data...
      </Typography>
    </Box>
  );
  
  if (error) return (
    <Typography sx={{ color: colorPalette.jasper, textAlign: 'center', my: 4 }}>
      {error}
    </Typography>
  );

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
      stroke={colorPalette.platinum}
      strokeDasharray="3 3"
    />
  ));

  const values = performanceData.map(d => Number(d.value));
  const minY = values.length > 0 ? 0.98*Math.min(...values) : 0;
  const maxY = values.length > 0 ? 1.02*Math.max(...values) : 10000;
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${colorPalette.platinum}`,
            p: 1.5,
            borderRadius: 1,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <Typography sx={{ color: colorPalette.prussianBlue, fontWeight: 600, mb: 0.5 }}>
            Day {label}
          </Typography>
          <Typography sx={{ color: colorPalette.charcoal }}>
            Value: <span style={{ fontWeight: 600 }}>${Number(payload[0].value).toFixed(2)}</span>
          </Typography>
          {payload[0].value > initialEquity ? (
            <Typography sx={{ color: '#2e7d32', fontSize: '0.875rem', mt: 0.5 }}>
              +{((payload[0].value - initialEquity) / initialEquity * 100).toFixed(2)}% from initial
            </Typography>
          ) : payload[0].value < initialEquity ? (
            <Typography sx={{ color: '#d32f2f', fontSize: '0.875rem', mt: 0.5 }}>
              {((payload[0].value - initialEquity) / initialEquity * 100).toFixed(2)}% from initial
            </Typography>
          ) : (
            <Typography sx={{ color: colorPalette.charcoal, fontSize: '0.875rem', mt: 0.5 }}>
              No change from initial
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ width: '100%', height: 'auto', minHeight: '400px', flex: 1 }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={performanceData}
            margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
          >
            {/* Horizontal grid lines only */}
            <CartesianGrid 
              horizontal={true}
              vertical={false}
              strokeDasharray="3 3" 
              stroke={colorPalette.platinum}
            />
            
            <ReferenceLine 
              y={initialEquity} 
              stroke={colorPalette.roseTaupe}
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{
                value: 'Initial Equity', 
                position: 'insideTopRight', 
                fill: colorPalette.roseTaupe,
                fontSize: 12
              }}
            />
            {referenceLines}

            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12, fill: colorPalette.charcoal }}
              ticks={performanceData
                .filter((_, index) => index % 2 === 1 || index === performanceData.length - 1)
                .map(item => item.day)}
              tickMargin={5}
              stroke={colorPalette.charcoal}
            />
            <YAxis 
              domain={[minY, maxY]}
              tickFormatter={(val) => val.toFixed(0)}
              tick={{ fontSize: 12, fill: colorPalette.charcoal }}
              stroke={colorPalette.charcoal}
            />
            <LineTooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ paddingTop: 10 }}
              payload={[
                { value: 'Portfolio Value', type: 'line', id: 'ID01', color: colorPalette.jasper },
                { value: `Initial Equity: $${initialEquity}`, type: 'line', id: 'ID02', color: colorPalette.roseTaupe },
              ]}
            />

            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={colorPalette.jasper}
              activeDot={{ r: 8, fill: colorPalette.jasper, stroke: '#fff' }}
              strokeWidth={2.5}
              dot={{ r: 0 }}
              name="Portfolio Value"
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default PortfolioPerformanceChart;