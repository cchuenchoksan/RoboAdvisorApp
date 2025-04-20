// EfficientFrontierChart.jsx
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { makeStyles } from "@mui/styles";
import { Box, Paper } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  ipokLineContainer: {
    width: "45vw !important",
  },
  ipokContainer: {
    margin: "1rem !important",
  },
}));

const transformData = (arr) =>
  arr
    //   .filter(([y, x]) => x *100 <= 0.2) // Filter elements where x <= 0.2
    .map(([y, x]) => ({ risk: x * 100, return: y * 100 }));

const EfficientFrontierChart = () => {
  const [efficientFrontierDataWSS, setefficientFrontierDataWSS] =
    useState(null);
  const [efficientFrontierDataWOSS, setefficientFrontierDataWOSS] =
    useState(null);
  const [loadingWSS, setLoadingWSS] = useState(true);
  const [loadingWOSS, setLoadingWOSS] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    const fetchDataWSS = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/efficient_frontier?short_sales=true"
        );
        const result = await response.json();
        setefficientFrontierDataWSS(result);
        setLoadingWSS(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingWSS(false);
      }
    };

    fetchDataWSS();
  }, []);

  useEffect(() => {
    const fetchDataWOSS = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/efficient_frontier?short_sales=false"
        );
        const result = await response.json();
        setefficientFrontierDataWOSS(result);
        setLoadingWOSS(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingWOSS(false);
      }
    };

    fetchDataWOSS();
  }, []);

  if (
    efficientFrontierDataWSS === null ||
    efficientFrontierDataWOSS === null ||
    loadingWSS ||
    loadingWOSS
  ) {
    return <div>Loading...</div>;
  }

  const aboveWSS = transformData(efficientFrontierDataWSS.above_gmpv);
  const belowWSS = transformData(efficientFrontierDataWSS.below_gmpv);

  const aboveWOSS = transformData(efficientFrontierDataWOSS.above_gmpv);
  const belowWOSS = transformData(efficientFrontierDataWOSS.below_gmpv);

  return (
    <Box width={"80%"}
    height={"100%"} 
    display={"flex"}
    justifyContent={"center"}
    alignItems={"center"}
    component={Paper}>
      <Box
        width={"90%"}
        height={"90%"}
        display={"flex"}
        justifyContent={"center"}
      >
        <ResponsiveContainer>
          <LineChart>
            <XAxis
              dataKey="risk"
              type="number"
              domain={[0, (dataMax) => Number((dataMax * 1.05).toFixed(2))]}
              tick={{ fontFamily: "'Roboto', sans-serif", fontSize: "1.2rem" }}
            />
            <YAxis
              dataKey="return"
              type="number"
              domain={[
                (dataMin) => Number((dataMin * 1.05).toFixed(2)),
                (dataMax) => Number((dataMax * 1.2).toFixed(2)),
              ]}
              tick={{ fontFamily: "'Roboto', sans-serif", fontSize: "1.2rem" }}
            />
            <Line
              type="monotone"
              data={belowWSS}
              dataKey="return"
              stroke="#8884d8" // Color for first line
              dot={false}
              activeDot={false}
            />

            <Line
              type="monotone"
              data={aboveWSS}
              dataKey="return"
              stroke="#82ca9d" // Color for second line
              dot={false}
              activeDot={false}
            />

            <Line
              type="monotone"
              data={belowWOSS}
              dataKey="return"
              stroke="#ff7300" // Color for third line
              dot={false}
              activeDot={false}
            />

            <Line
              type="monotone"
              data={aboveWOSS}
              dataKey="return"
              stroke="#ff0000" // Color for fourth line
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default EfficientFrontierChart;
