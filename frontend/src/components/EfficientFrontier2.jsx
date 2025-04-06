import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components in Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EfficientFrontierChart = () => {
  // Sample data for the Efficient Frontier (both upper and lower)
  const data = {
    labels: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], // x-axis: risk (standard deviation)
    datasets: [
      {
        label: 'Upper Efficient Frontier',
        data: [0.05, 0.1, 0.15, 0.2, 0.25, 0.28, 0.3, 0.35], // y-axis: return (upper frontier)
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Lower Efficient Frontier',
        data: [0.05, 0.04, 0.03, 0.02, 0.01], // y-axis: return (lower frontier)
        fill: false,
        borderColor: 'rgb(255, 99, 132)', // Red color for lower frontier
        tension: 0.1,
        borderDash: [5, 5], // Dash the lower frontier line to differentiate
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `Return: ${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Risk (Standard Deviation)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Return',
        },
      },
    },
  };

  return (
    <div>
      <h2>Efficient Frontier (Upper and Lower Sections)</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default EfficientFrontierChart;
