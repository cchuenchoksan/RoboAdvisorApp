import React, { useState, useEffect } from 'react';
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
    width: "45vw !important",
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

const EfficientFrontier = (props) => {
  const [efficientFrontierData, setefficientFrontierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/efficient_frontier?short_sales=' + props.shortSales);
        const result = await response.json();
        setefficientFrontierData(result);
        setLoading(false);
        console.log(result);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (efficientFrontierData) {
      setData({
        labels: efficientFrontierData.efficient_frontier.map((point) => point[0] * 100),
        datasets: [
          {
            label: "Efficient frontier",
            data: efficientFrontierData.efficient_frontier.map((point) => point[1] * 100),
            borderColor: "rgb(218, 118, 18)",
            backgroundColor: "rgba(236, 176, 8, 0.8)",
            fill: false,
            tension: 0.1,
          },
        ],
      });
    }
  }, [efficientFrontierData]);

  const options = {
    responsive: true,
    indexAxis: "y",
    interaction: {
      mode: null, // This disables all hover interactions
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          // Include a percentage sign in the ticks
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
          // Include a percentage sign in the ticks
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box component={Paper} className={classes.ipokContainer} display={"block"}>
      {data && (
        <Line
          data={data}
          options={options}
          className={classes.ipokLineContainer}
        />
      )}
    </Box>
  );
};

export default EfficientFrontier;
