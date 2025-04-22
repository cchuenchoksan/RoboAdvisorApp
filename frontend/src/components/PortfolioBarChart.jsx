// PortfolioBarChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

// Color palette
const colorPalette = {
  prussianBlue: '#212D40',
  charcoal: '#364156',
  platinum: '#DBDBDB',
  jasper: '#D66853',
  roseTaupe: '#7D4E57'
};

// Don't change the individual asset colors as requested
const COLORS = [
  "#0088FE", // blue
  "#00C49F", // teal
  "#FFBB28", // yellow-orange
  "#FF8042", // orange
  "#A28EFF", // purple
  "#FF6699", // pink
  "#33CC33", // green
  "#FF4444", // red
  "#00CED1", // dark turquoise
  "#9966CC", // amethyst
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '10px 14px',
          border: `1px solid ${colorPalette.platinum}`,
          borderRadius: '4px',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: colorPalette.prussianBlue, fontWeight: 600 }}>
          Asset: {label}
        </Typography>
        <Typography variant="body2" sx={{ color: colorPalette.charcoal, mt: 0.5 }}>
          Allocation: <strong>{payload[0].value.toFixed(2)}%</strong>
        </Typography>
      </Paper>
    );
  }
  return null;
};

function PortfolioBarChart({
  data,
  width = 500,
  height = 600,
  barheight = 250,
  title = "Recommended Portfolio Allocation",
  margin=0
}) {
  return (
    <Box
    //   component={Paper}
      elevation={2}
      sx={{
        margin: margin,
        borderRadius: '8px',
        backgroundColor: '#fff',
        border: `1px solid ${colorPalette.platinum}`,
        width: width + 40,
        height: height + 40,
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{
          color: colorPalette.prussianBlue,
          fontWeight: 600,
          textAlign: 'center',
          mb: 3,
        }}
      >
        {title}
      </Typography>
      
      <ResponsiveContainer width="100%" height={height - 50}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={colorPalette.platinum}
            vertical={false}
          />
          <YAxis 
            domain={[-100, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: colorPalette.charcoal }}
            axisLine={{ stroke: colorPalette.charcoal }}
            tickLine={{ stroke: colorPalette.charcoal }}
          />
          <XAxis
            dataKey="name"
            angle={-80}
            textAnchor="end"
            interval={0}
            height={barheight}
            tick={{ fill: colorPalette.charcoal, fontSize: 12 }}
            axisLine={{ stroke: colorPalette.charcoal }}
            tickLine={{ stroke: colorPalette.charcoal }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              fontFamily: "'Roboto', sans-serif",
              color: colorPalette.charcoal,
            }}
          />
          <Bar 
            dataKey="value" 
            name="Allocation"
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke={colorPalette.charcoal}
                strokeWidth={0.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default PortfolioBarChart;