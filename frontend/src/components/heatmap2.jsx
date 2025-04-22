import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";

// Brand color palette
const colorPalette = {
  prussianBlue: '#212D40',
  charcoal: '#364156',
  platinum: '#DBDBDB',
  jasper: '#D66853',
  roseTaupe: '#7D4E57'
};

const CovarianceMatrix = () => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://127.0.0.1:5000/var_cov_matrix');
        const data = res.data;
  
        const keys = Object.keys(data);           // original order
        const reversedKeys = [...keys].reverse(); // for Y-axis
  
        setLabels(keys); // X-axis uses original order
  
        const transformedData = reversedKeys.map(rowKey => ({
          name: rowKey,
          data: keys.map(colKey => ({
            x: colKey,
            y: parseFloat((data[rowKey][colKey] * 10000).toFixed(5))
          }))
        }));
  
        setSeries(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching correlation matrix:', err);
        setError('Failed to load correlation data');
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  // Function to determine text color based on background brightness
  const getTextColor = (value) => {
    // For very light or very dark backgrounds, adjust text color for readability
    if (value > 0.7 || value < -0.7) return "#FFFFFF";
    if (value > -0.3 && value < 0.3) return "#000000"; 
    return "#000000";
  };

  const options = {
    chart: {
      type: "heatmap",
      toolbar: { show: true },
      background: '#FFFFFF',
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.9,
        radius: 0,
        useFillColorAsStroke: false,
        colorScale: {
          ranges: [
            { from: -5, to: -3.5, color: '#c0392b', name: "Strong Negative" },   // Dark red
            { from: -3.5, to: -2, color: '#e74c3c', name: "Medium Negative" },   // Medium red
            { from: -2, to: -0.5, color: '#f39c12', name: "Weak Negative" },     // Orange
            { from: -0.5, to: 0.5, color: '#f1c40f', name: "Neutral" },          // Yellow
            { from: 0.5, to: 2, color: '#27ae60', name: "Weak Positive" },       // Light green
            { from: 2, to: 3.5, color: '#2ecc71', name: "Medium Positive" },     // Medium green
            { from: 3.5, to: 5, color: '#16a085', name: "Strong Positive" }      // Dark green

          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#000000'],
        fontWeight: 600,
        fontSize: '12px'
      },
      formatter: function(val) {
        return val.toFixed(2);
      }
    },
    stroke: {
      width: 1
    },
    xaxis: {
      categories: labels,
      labels: {
        rotate: -45,
        style: { 
          fontSize: "12px",
          colors: colorPalette.charcoal
        },
      },
      axisTicks: {
        color: colorPalette.platinum
      },
      axisBorder: {
        color: colorPalette.platinum
      }
    },
    yaxis: {
      categories: series.map(s => s.name),
      labels: {
        style: { 
          fontSize: "12px",
          colors: colorPalette.charcoal
        },
      }
    },
    grid: {
      borderColor: colorPalette.platinum,
      padding: {
        right: 5,
        left: 5
      }
    },
    theme: {
      mode: 'light',
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Roboto, Arial, sans-serif'
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const value = w.globals.series[seriesIndex][dataPointIndex];
        const xLabel = w.globals.labels[dataPointIndex];
        const yLabel = w.globals.seriesNames[seriesIndex];
        
        let correlationStrength = "";
        if (value >= 0.7) correlationStrength = "Strong positive correlation";
        else if (value >= 0.4) correlationStrength = "Medium positive correlation";
        else if (value >= 0.1) correlationStrength = "Weak positive correlation";
        else if (value > -0.1) correlationStrength = "No significant correlation";
        else if (value > -0.4) correlationStrength = "Weak negative correlation";
        else if (value > -0.7) correlationStrength = "Medium negative correlation";
        else correlationStrength = "Strong negative correlation";
        
        return `<div class="custom-tooltip" style="padding: 10px; background: white; border: 1px solid ${colorPalette.platinum}; box-shadow: 0 2px 8px rgba(0,0,0,0.15); border-radius: 4px;">
          <div style="font-weight: bold; margin-bottom: 5px; color: ${colorPalette.prussianBlue};">${xLabel} vs ${yLabel}</div>
          <div style="color: ${colorPalette.charcoal};">Correlation: <span style="font-weight: 500;">${value.toFixed(3)}</span></div>
          <div style="color: ${colorPalette.charcoal}; font-style: italic; font-size: 11px; margin-top: 3px;">${correlationStrength}</div>
        </div>`;
      }
    },
    legend: {
      labels: {
        colors: colorPalette.charcoal
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="600px">
        <CircularProgress sx={{ color: colorPalette.jasper }} />
        <Typography sx={{ mt: 2, color: colorPalette.charcoal }}>
          Loading correlation data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="600px">
        <Typography sx={{ color: colorPalette.jasper, fontWeight: 500 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      component={Paper} 
      elevation={2}
      sx={{
        width: "100%",
        // maxWidth: "1500px",
        padding: "20px",
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        border: `1px solid ${colorPalette.platinum}`,
      }}
    >
      <Chart 
        options={options} 
        series={series} 
        type="heatmap" 
        height={600}
      />
      <Typography style={{ fontStyle: 'italic', fontSize: '0.8em', color: '#555', paddingLeft: "20px" }}>
        * Values are multiplied by 10,000 to keep the range meaningful.
      </Typography>
    </Box>
  );
};

export default CovarianceMatrix;