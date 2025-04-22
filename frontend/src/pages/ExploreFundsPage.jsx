import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import EfficientFrontierChart from "../components/EfficientFrontier";
import FundsTable from "../components/FundsTable";
import CorrelationMatrix from "../components/heatmap";
import PortfolioBarChart from "../components/PortfolioBarChart";

// Color palette
const colorPalette = {
  prussianBlue: '#212D40',
  charcoal: '#364156',
  platinum: '#DBDBDB',
  jasper: '#D66853',
  roseTaupe: '#7D4E57'
};

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

  const SectionTitle = ({ children }) => (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      sx={{ width: "100%", pt: 7, mb: 3 }}
    >
      <Divider sx={{ flex: 1, maxWidth: "200px", borderColor: colorPalette.platinum }} />
      <Typography 
        variant="h4" 
        sx={{
          fontFamily: "sans-serif",
          fontWeight: 600,
          color: colorPalette.prussianBlue,
          px: 4,
        }}
      >
        {children}
      </Typography>
      <Divider sx={{ flex: 1, maxWidth: "200px", borderColor: colorPalette.platinum }} />
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh", pb: 8 }}>
      <SectionTitle>Efficient Frontier</SectionTitle>

      <Box display="flex" justifyContent="center" height="80vh">
        <EfficientFrontierChart />
      </Box>

      <SectionTitle>Global Minimum Variance Portfolios</SectionTitle>
      
      <Box marginY={2} display="flex" justifyContent="center">
        {!loadingGmvpWSS && !loadingGmvpWOSS ? (
          <Box
            width="85%"
            component={Paper}
            elevation={2}
            sx={{
              padding: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center", 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
              border: `1px solid ${colorPalette.platinum}`,
            }}
          >
            <PortfolioBarChart
              data={gmvpWOSS}
              title="Without Short Sales"
              height={700}
              barheight={350}
              margin={2}
            />
            <PortfolioBarChart
              data={gmvpWSS}
              title="With Short Sales"
              height={700}
              barheight={350}
              margin={2}
            />
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" my={6}>
            <CircularProgress sx={{ color: colorPalette.jasper }} />
            <Typography sx={{ mt: 2, color: colorPalette.charcoal }}>
              Loading portfolio data...
            </Typography>
          </Box>
        )}
      </Box>

      <SectionTitle>Funds Breakdown</SectionTitle>
      
      <Box display="flex" justifyContent="center">
        <Box width="90%">
          <FundsTable />
        </Box>
      </Box>
      
      <SectionTitle>Correlation Matrix</SectionTitle>
      
      <Box display="flex" justifyContent="center" alignItems="center" mb={8}>
        <Box
          width="85%"
          component={Paper}
          elevation={2}
          sx={{
            borderRadius: "8px",
            overflow: "hidden",
            border: `1px solid ${colorPalette.platinum}`,
          }}
        >
          <CorrelationMatrix />
        </Box>
      </Box>
    </Box>
  );
};

export default ExploreFundsPage;