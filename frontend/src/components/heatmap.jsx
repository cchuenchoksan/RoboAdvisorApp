import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const CorrelationMatrix = () => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  
useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/correlation_matrix');
        const data = res.data;
  
        const keys = Object.keys(data);           // original order
        const reversedKeys = [...keys].reverse(); // for Y-axis
  
        setLabels(keys); // X-axis uses original order
  
        const transformedData = reversedKeys.map(rowKey => ({
          name: rowKey,
          data: keys.map(colKey => ({
            x: colKey,
            y: parseFloat(data[rowKey][colKey].toFixed(5))
          }))
        }));
  
        setSeries(transformedData);
      } catch (err) {
        console.error('Error fetching correlation matrix:', err);
      }
    };
  
    fetchData();
  }, []);
  

  const options = {
    chart: {
      type: "heatmap",
      toolbar: { show: false },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            { from: -1, to: -0.5, color: "#d73027", name: "Negative High" },
            { from: -0.5, to: 0, color: "#f46d43", name: "Negative Low" },
            { from: 0, to: 0.5, color: "#fee08b", name: "Positive Low" },
            { from: 0.5, to: 1, color: "#1a9850", name: "Positive High" },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#000"],
      },
      formatter: (val) => val.toFixed(3),
    },
    xaxis: {
      categories: labels,
      labels: {
        rotate: -45,
        style: { fontSize: "10px" },
      },
    },
    yaxis: {
      categories: series.map(s => s.name),
      labels: {
        style: { fontSize: "10px" },
      },
    },
    title: {
      text: "Correlation Matrix",
      align: "center",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
  };

  return (
    <div style={{ width: "1500px", maxWidth: "100%" }}>
      <Chart options={options} series={series} type="heatmap" height={600} />
    </div>
  );
};

export default CorrelationMatrix;
