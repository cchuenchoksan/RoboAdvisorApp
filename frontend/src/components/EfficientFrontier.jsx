import React from "react";
import Box from "@mui/material/Box";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Paper from "@mui/material/Paper";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  ipokLineContainer: {
    width: "70vw !important",
  },
  ipokContainer: {
    margin: "1rem !important",
  },
}));

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EfficientFrontier = () => {
  const classes = useStyles();
  const polynomial = (y) => y * y; // x = y^2
  const points = [];
  const range = 10;

  for (let y = -range; y <= range; y += 0.1) {
    const x = polynomial(y);
    points.push({ x: x, y: Math.round(y * 1000) / 1000 });
  }
  const data = {
    labels: points.map((point) => point.y),
    datasets: [
      {
        label: "Efficient frontier",
        data: points.map((point) => point.x),
        borderColor: "rgb(218, 118, 18)",
        backgroundColor: "rgba(236, 176, 8, 0.8)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, ticks) {
            return value + "%";
          },
        },
        title: {
          display: true,
          text: "Risk",
        },
      },
      y: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, ticks) {
            return value + "%";
          },
        },
        title: {
          display: true,
          text: "Returns",
        },
      },
    },
  };

  return (
      <Box component={Paper} className={classes.ipokContainer} display={"block"}>
        <Line
          data={data}
          options={options}
          className={classes.ipokLineContainer}
        />
      </Box>
  );
};

export default EfficientFrontier;
