// PortfolioPieChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function PortfolioPieChart({ data, width = 300, height = 300, title = "Recommended Portfolio Allocation" }) {
  return (
    <Box sx={{ textAlign: "center", p: 2, border: "1px solid grey", borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <PieChart width={width} height={height}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Box>
  );
}

export default PortfolioPieChart;