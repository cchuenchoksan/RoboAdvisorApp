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
  ComposedChart,
} from "recharts";
import { makeStyles } from "@mui/styles";
import { Box, Paper, CircularProgress, Typography } from "@mui/material";

// Color palette
const colorPalette = {
  prussianBlue: '#212D40',
  charcoal: '#364156',
  platinum: '#DBDBDB',
  jasper: '#D66853',
  roseTaupe: '#7D4E57'
};

const useStyles = makeStyles(() => ({
  ipokLineContainer: {
    width: "45vw !important",
  },
  ipokContainer: {
    margin: "1rem !important",
    backgroundColor: "#FFFFFF",
  },
  customTooltip: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    border: `1px solid ${colorPalette.platinum}`,
    padding: "12px",
    borderRadius: "4px",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.15)",
    fontSize: "13px",
    fontFamily: "'Roboto', sans-serif",
  },
  chartTitle: {
    color: colorPalette.prussianBlue,
    fontWeight: 600,
    marginBottom: "1rem",
    textAlign: "center",
    fontFamily: "'Roboto', sans-serif",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "400px",
    backgroundColor: colorPalette.platinum,
    borderRadius: "8px",
  },
  loadingText: {
    marginTop: "1rem",
    color: colorPalette.charcoal,
    fontFamily: "'Roboto', sans-serif",
  }
}));

// Don't change the individual asset colors as specified
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
    .map(([y, x]) => ({ risk: x * 100, return: y * 100 }));

const transformFunds = (arr) =>
  arr.map((x, index) => ({
    risk: x["fund_risk"] * 100,
    return: x["fund_returns"] * 100,
    colorIndex: index % COLORS.length,
    name: x.fund_name,
    dataType: "fund",
  }));

// Custom shape for the scatter points
const CustomizedShape = (props) => {
  const { cx, cy, payload } = props;
  const color = COLORS[payload.colorIndex];

  return <circle cx={cx} cy={cy} r={6} fill={color} />;
};

// Custom tooltip that only shows for points with dataType="fund"
const CustomTooltip = (props) => {
  const { active, payload, classes } = props;

  if (active && payload && payload.length) {
    // Find the payload item that has dataType="fund"
    const fundPayload = payload.find(
      (p) => p.payload && p.payload.dataType === "fund"
    );

    if (fundPayload) {
      return (
        <div className={props.classes.customTooltip}>
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold", color: colorPalette.prussianBlue }}>
            {fundPayload.payload.name}
          </p>
          <p style={{ margin: "3px 0", color: colorPalette.charcoal }}>
            Risk: <span style={{ fontWeight: "500" }}>{fundPayload.payload.risk.toFixed(2)}%</span>
          </p>
          <p style={{ margin: "3px 0", color: colorPalette.charcoal }}>
            Return: <span style={{ fontWeight: "500" }}>{fundPayload.payload.return.toFixed(2)}%</span>
          </p>
        </div>
      );
    }
  }

  return null;
};

const CustomSquare = (props) => {
  const { cx, cy, fill } = props;
  const size = 8;
  return (
    <rect
      x={cx - size / 2}
      y={cy - size / 2}
      width={size}
      height={size}
      fill={fill}
    />
  );
};

const EfficientFrontierChart = () => {
  const [efficientFrontierDataWSS, setefficientFrontierDataWSS] =
    useState(null);
  const [efficientFrontierDataWOSS, setefficientFrontierDataWOSS] =
    useState(null);
  const [funds, setFunds] = useState(null);
  const [gmvpWSS, setGmvpWSS] = useState(null);
  const [gmvpWOSS, setGmvpWOSS] = useState(null);

  const [loadingWSS, setLoadingWSS] = useState(true);
  const [loadingWOSS, setLoadingWOSS] = useState(true);
  const [loadingFunds, setLoadingFunds] = useState(true);
  const [loadingGmvpWSS, setLoadingGmvpWSS] = useState(true);
  const [loadingGmvpWOSS, setLoadingGmvpWOSS] = useState(true);

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

  useEffect(() => {
    const fetchGmvpWSS = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/gmvp?short_sales=true"
        );
        const result = await response.json();
        setGmvpWSS(result);
        setLoadingGmvpWSS(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingGmvpWSS(false);
      }
    };

    fetchGmvpWSS();
  }, []);

  useEffect(() => {
    const fetchGmvpWOSS = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/gmvp?short_sales=false"
        );
        const result = await response.json();
        setGmvpWOSS(result);
        setLoadingGmvpWOSS(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingGmvpWOSS(false);
      }
    };

    fetchGmvpWOSS();
  }, []);

  if (
    efficientFrontierDataWSS === null ||
    efficientFrontierDataWOSS === null ||
    funds === null ||
    gmvpWSS === null ||
    gmvpWOSS === null ||
    loadingWSS ||
    loadingWOSS ||
    loadingFunds ||
    loadingGmvpWSS ||
    loadingGmvpWOSS
  ) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress sx={{ color: colorPalette.jasper }} size={60} thickness={4} />
        <Typography variant="body1" className={classes.loadingText}>
          Loading chart data...
        </Typography>
      </Box>
    );
  }

  const aboveWSS = transformData(efficientFrontierDataWSS.above_gmpv);
  const belowWSS = transformData(efficientFrontierDataWSS.below_gmpv);

  const aboveWOSS = transformData(efficientFrontierDataWOSS.above_gmpv);
  const belowWOSS = transformData(efficientFrontierDataWOSS.below_gmpv);

  const individualFunds = transformFunds(funds);

  // Add a dataType marker to line data to distinguish from fund data
  const markLineData = (data) =>
    data.map((item) => ({ ...item, dataType: "line" }));

  const markedAboveWSS = markLineData(aboveWSS);
  const markedBelowWSS = markLineData(belowWSS);
  const markedAboveWOSS = markLineData(aboveWOSS);
  const markedBelowWOSS = markLineData(belowWOSS);

  return (
    <Box
      width="85%"
      height="100%"
      component={Paper}
      elevation={2}
      sx={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        },
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        overflow: "hidden",
        border: `1px solid ${colorPalette.platinum}`,
      }}
    >
      <Box width="92%" height="90%" display="flex" justifyContent="center" margin="auto" py={4}>
        <ResponsiveContainer>
          <ComposedChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
            <XAxis
              dataKey="risk"
              type="number"
              domain={[0, (dataMax) => Number((dataMax * 1.05).toFixed(2))]}
              tick={{ fontFamily: "'Roboto', sans-serif", fontSize: "0.9rem", fill: colorPalette.charcoal }}
              label={{
                value: "Risk (%)",
                position: "insideBottom",
                offset: -10,
                fontSize: "1rem",
                fill: colorPalette.prussianBlue,
              }}
              stroke={colorPalette.charcoal}
            />
            <YAxis
              dataKey="return"
              type="number"
              domain={[
                (dataMin) => Number((dataMin * 1.05).toFixed(2)),
                (dataMax) => Number((dataMax * 1.2).toFixed(2)),
              ]}
              tick={{ fontFamily: "'Roboto', sans-serif", fontSize: "0.9rem", fill: colorPalette.charcoal }}
              label={{
                value: "Return (%)",
                angle: -90,
                position: "left",
                offset: 10,
                fontSize: "1rem",
                fill: colorPalette.prussianBlue,
              }}
              stroke={colorPalette.charcoal}
            />

            {/* Use custom tooltip that only responds to funds */}
            <Tooltip
              content={<CustomTooltip classes={classes} />}
              cursor={{ strokeDasharray: "3 3" }}
            />

            <Line
              name="Below frontier (With Short Sales)"
              type="monotone"
              data={markedBelowWSS}
              dataKey="return"
              stroke={colorPalette.prussianBlue}
              dot={false}
              activeDot={false}
              strokeDasharray="5 5"
              legendType="none"
              isAnimationActive={false}
              strokeWidth={1.5}
            />

            <Line
              name="Efficient frontier (With Short Sales)"
              type="monotone"
              data={markedAboveWSS}
              dataKey="return"
              stroke={colorPalette.prussianBlue}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />

            <Line
              name="Below frontier (Without Short Sales)"
              type="monotone"
              data={markedBelowWOSS}
              dataKey="return"
              stroke={colorPalette.jasper}
              dot={false}
              activeDot={false}
              strokeDasharray="5 5"
              legendType="none"
              isAnimationActive={false}
              strokeWidth={1.5}
            />

            <Line
              name="Efficient frontier (Without Short Sales)"
              type="monotone"
              data={markedAboveWOSS}
              dataKey="return"
              stroke={colorPalette.jasper}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />

            <Scatter
              name="Individual Funds"
              data={individualFunds}
              shape={<CustomizedShape />}
              fill="#000000"
              legendType="none"
            />

            <Scatter 
              name="GMVP (Without Short Sales)"
              dataKey="return"
              data={[{
                risk: gmvpWOSS["risk"] * 100,
                return: gmvpWOSS["return"] * 100,
                name: "GMVP (Without Short Sales)"
              }]}
              fill={colorPalette.jasper}
              shape={<CustomSquare />}
              legendType="square"
            />

            <Scatter 
              name="GMVP (With Short Sales)"
              dataKey="return"
              data={[{
                risk: gmvpWSS["risk"] * 100,
                return: gmvpWSS["return"] * 100,
                name: "GMVP (With Short Sales)"
              }]}
              fill={colorPalette.prussianBlue}
              shape={<CustomSquare />}
              legendType="square"
            />
            <Legend 
              verticalAlign="bottom" 
              wrapperStyle={{ 
                bottom: 0, 
                fontFamily: "'Roboto', sans-serif",
                fontSize: "0.9rem",
                color: colorPalette.charcoal
              }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default EfficientFrontierChart;