import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Tooltip,
  Legend,
  ComposedChart
} from "recharts";
import { makeStyles } from "@mui/styles";
import { Box, Paper, CircularProgress } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  ipokLineContainer: {
    width: "45vw !important",
  },
  ipokContainer: {
    margin: "1rem !important",
  },
  customTooltip: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    fontSize: "12px",
  }
}));

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

const transformData = (arr) =>
  arr
    //   .filter(([y, x]) => x *100 <= 0.2) // Filter elements where x <= 0.2
    .map(([y, x]) => ({ risk: x * 100, return: y * 100 }));

  
const transformFunds = (arr) =>
  arr.map((x, index) => ({
    risk: x["fund_risk"] * 100, 
    return: x["fund_returns"] * 100,
    colorIndex: index % COLORS.length,
    name: x.fund_name,
    // Add a type marker to identify scatter points
    dataType: "fund"
  }));

// Custom shape for the scatter points
const CustomizedShape = (props) => {
  const { cx, cy, payload } = props;
  const color = COLORS[payload.colorIndex];
  
  return (
    <circle cx={cx} cy={cy} r={4} fill={color} />
  );
};

// Custom tooltip that only shows for points with dataType="fund"
const CustomTooltip = (props) => {
  const { active, payload, classes } = props;
  
  if (active && payload && payload.length) {
    // Find the payload item that has dataType="fund"
    const fundPayload = payload.find(p => p.payload && p.payload.dataType === "fund");
    
    if (fundPayload) {
      return (
        <div className={props.classes.customTooltip}>
          <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>{fundPayload.payload.name}</p>
          <p style={{ margin: "2px 0" }}>Risk: {fundPayload.payload.risk.toFixed(2)}%</p>
          <p style={{ margin: "2px 0" }}>Return: {fundPayload.payload.return.toFixed(2)}%</p>
        </div>
      );
    }
  }
  
  return null;
};

const EfficientFrontierChart = () => {
  const [efficientFrontierDataWSS, setefficientFrontierDataWSS] =
    useState(null);
  const [efficientFrontierDataWOSS, setefficientFrontierDataWOSS] =
    useState(null);
  const [funds, setFunds] = useState(null)

  const [loadingWSS, setLoadingWSS] = useState(true);
  const [loadingWOSS, setLoadingWOSS] = useState(true);
  const [loadingFunds, setLoadingFunds] = useState(true);
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

  useEffect(() => {
      fetch("http://127.0.0.1:5000/fund_statistics")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch fund statistics.");
          return res.json();
        })
        .then((data) => {
          setFunds(data.funds_performance_table);
          setLoadingFunds(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingFunds(false);
        });
    }, []);
  

  if (
    efficientFrontierDataWSS === null ||
    efficientFrontierDataWOSS === null ||
    funds === null ||
    loadingWSS ||
    loadingWOSS ||
    loadingFunds
  ) {
    return <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>;
  }

  const aboveWSS = transformData(efficientFrontierDataWSS.above_gmpv);
  const belowWSS = transformData(efficientFrontierDataWSS.below_gmpv);

  const aboveWOSS = transformData(efficientFrontierDataWOSS.above_gmpv);
  const belowWOSS = transformData(efficientFrontierDataWOSS.below_gmpv);

  const individualFunds = transformFunds(funds);

  // Add a dataType marker to line data to distinguish from fund data
  const markLineData = (data) => data.map(item => ({ ...item, dataType: "line" }));
  
  const markedAboveWSS = markLineData(aboveWSS);
  const markedBelowWSS = markLineData(belowWSS);
  const markedAboveWOSS = markLineData(aboveWOSS);
  const markedBelowWOSS = markLineData(belowWOSS);

  return (
    <Box width="80%"
    height="100%" 
    display="flex"
    justifyContent="center"
    alignItems="center"
    component={Paper}>
      <Box
        width="90%"
        height="90%"
        display="flex"
        justifyContent="center"
      >
        <ResponsiveContainer>
          <ComposedChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <XAxis
              dataKey="risk"
              type="number"
              domain={[0, (dataMax) => Number((dataMax * 1.05).toFixed(2))]}
              tick={{ fontFamily: "'Roboto', sans-serif", fontSize: "1.2rem" }}
              label={{ value: 'Risk (%)', position: 'insideBottom', offset: -10, fontSize: '1.2rem' }}
              />
            <YAxis
              dataKey="return"
              type="number"
              domain={[
                (dataMin) => Number((dataMin * 1.05).toFixed(2)),
                (dataMax) => Number((dataMax * 1.2).toFixed(2)),
              ]}
              tick={{ fontFamily: "'Roboto', sans-serif", fontSize: "1.2rem" }}
              label={{ value: 'Return (%)', angle: -90, position: 'left', offset: 10, fontSize: '1.2rem' }}
            />
            
            {/* Use custom tooltip that only responds to funds */}
            <Tooltip 
              content={<CustomTooltip classes={classes} />} 
              cursor={{ strokeDasharray: '3 3' }}
            />
            
            <Line
              name="Below frontier (With Short Sales)"
              type="monotone"
              data={markedBelowWSS}
              dataKey="return"
              stroke="#8884d8"
              dot={false}
              activeDot={false}
              strokeDasharray="5 5"
              legendType="none"
              isAnimationActive={false}
            />

            <Line
              name="Efficient frontier (With Short Sales)"
              type="monotone"
              data={markedAboveWSS}
              dataKey="return"
              stroke="#8884d8"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />

            <Line
              name="Below frontier (Without Short Sales)"
              type="monotone"
              data={markedBelowWOSS}
              dataKey="return"
              stroke="#ff0000"
              dot={false}
              activeDot={false}
              strokeDasharray="5 5"
              legendType="none"
              isAnimationActive={false}
            />

            <Line
              name="Efficient frontier (Without Short Sales)"
              type="monotone"
              data={markedAboveWOSS}
              dataKey="return"
              stroke="#ff0000"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
            
            <Scatter 
              name="Individual Funds" 
              data={individualFunds} 
              shape={<CustomizedShape />}
              fill="#000000"
            />
            
            <Legend verticalAlign="bottom" wrapperStyle={{ bottom: 0 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default EfficientFrontierChart;