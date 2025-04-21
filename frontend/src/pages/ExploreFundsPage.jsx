import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import EfficientFrontierChart from "../components/EfficientFrontier";
import FundsTable from "../components/FundsTable";
import CorrelationMatrix from "../components/heatmap";
import PortfolioBarChart from "../components/PortfolioBarChart";

const ExploreFundsPage = () => {
  const [gmvpWSS, setGmvpWSS] = useState(null);
  const [gmvpWOSS, setGmvpWOSS] = useState(null);
  const [loadingGmvpWSS, setLoadingGmvpWSS] = useState(true);
  const [loadingGmvpWOSS, setLoadingGmvpWOSS] = useState(true);

  useEffect(() => {
    const fetchGmvpWSS = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/gmvp?short_sales=true"
        );
        const result = await response.json();
        const data = result["weights"].map((x) => ({
          name: x["name"],
          value: x["value"] * 100,
        }));

        setGmvpWSS(data);
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
        console.log("res", result);

        const data = result["weights"].map((x) => ({
          name: x["name"],
          value: x["value"] * 100,
        }));

        setGmvpWOSS(data);
        setLoadingGmvpWOSS(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingGmvpWOSS(false);
      }
    };

    fetchGmvpWOSS();
  }, []);

  return (
    <Box>
      <Box display={"flex"} justifyContent={"center"} marginTop={"3vh"} marginBottom={"1vh"}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          sx={{ fontFamily: "sans-serif", fontSize: "1.5rem", width: "100%" }}
        >
          <Typography variant="h4">Efficient Frontier</Typography>
        </Box>
      </Box>

      <Box display={"flex"} justifyContent={"center"} height={"50vh"}>
        <EfficientFrontierChart />
      </Box>

      <Box display={"flex"} justifyContent={"center"} marginTop={"7vh"}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          sx={{ fontFamily: "sans-serif", fontSize: "1.5rem", width: "100%" }}
        >
          <Typography variant="h4">
            Global Minimum Variance Portfolios
          </Typography>
        </Box>
      </Box>
      <Box marginY={2} display={"flex"} justifyContent={"center"}>
        {!loadingGmvpWSS | !loadingGmvpWSS ? (
          <Box
            width="80%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            component={Paper}
            padding={4}
            elevation={3} // stronger shadow
            sx={{
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px) scale(1.0001)",
                boxShadow: 5,
              },
            }}
          >
            <PortfolioBarChart
              data={gmvpWOSS}
              title="Without Short Sales"
              height={700}
              barheight={350}
            />
            <PortfolioBarChart
              data={gmvpWSS}
              title="With Short Sales"
              height={700}
              barheight={350}
            />
          </Box>
        ) : (
          <CircularProgress />
        )}
      </Box>

      <Box display={"flex"} justifyContent={"center"} marginTop={"7vh"}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          sx={{ fontFamily: "sans-serif", fontSize: "1.5rem", width: "100%" }}
        >
          <Typography variant="h4">Funds Breakdown</Typography>
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"center"}>
        <Box width={"90vw"}>
          <FundsTable />
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"center"} marginTop={"7vh"} marginBottom={"2vh"}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          sx={{ fontFamily: "sans-serif", fontSize: "1.5rem", width: "100%" }}
        >
          <Typography variant="h4">Correlation Matrix</Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box
          height={"100%"}
          width={"80%"}
          component={Paper}
          elevation={3} // stronger shadow
          sx={{
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px) scale(1.0001)",
              boxShadow: 5,
            },
          }}
        >
          <CorrelationMatrix />
        </Box>
      </Box>
    </Box>
  );
};

export default ExploreFundsPage;
