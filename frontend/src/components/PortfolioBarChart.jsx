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
} from "recharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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

function PortfolioBarChart({
  data,
  width = 500,
  height = 600,
  barheight = 250,
  title = "Recommended Portfolio Allocation",
}) {
    console.log(data);
    
  return (
    <Box>

      <Typography variant="h6" gutterBottom>
        <Box display={"flex"} justifyContent={"center"}>
          {title}
        </Box>
      </Typography>
      <BarChart
        width={width}
        height={height}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis 
            domain={[-100, 100]}
        />
        <XAxis
          dataKey="name"
          angle={-80}
          textAnchor="end"
          interval={0}
          height={barheight}
        />
        <Tooltip
          formatter={(value) => `${value.toFixed(2)}%`}
          labelFormatter={(label) => `Asset: ${label}`}
        />
        <Bar dataKey="value" fill="#000000">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </Box>
  );
}

export default PortfolioBarChart;
