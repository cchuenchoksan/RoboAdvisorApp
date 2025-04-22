import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PortfolioBarChart from "../components/PortfolioBarChart";
import ScoreProgress from "../components/ScoreProgress";
import PortfolioPerformanceChart from "../components/PortfolioPerformanceChart";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  CircularProgress,
  Typography,
} from "@mui/material";
import InvestmentBotPrompt from "../components/OptimiseLanding";
import axios from "axios";

// Color palette
const colorPalette = {
  prussianBlue: "#212D40",
  charcoal: "#364156",
  platinum: "#DBDBDB",
  jasper: "#D66853",
  roseTaupe: "#7D4E57",
};

function dataToleranceMap(score) {
  if (score < 0 || score > 100 || typeof score !== "number") {
    return "Invalid score";
  }

  if (score >= 0 && score <= 25) {
    return "Very cautious";
  } else if (score >= 26 && score <= 33) {
    return "Cautious";
  } else if (score >= 34 && score <= 44) {
    return "Moderately cautious";
  } else if (score >= 45 && score <= 56) {
    return "Balanced";
  } else if (score >= 57 && score <= 67) {
    return "Moderately aggressive";
  } else if (score >= 68 && score <= 79) {
    return "Aggressive";
  } else if (score >= 80 && score <= 100) {
    return "Very aggressive";
  }
}

function OptimisePortPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [portfolioData, setPortfolioData] = useState(null);

  // Get data from questionnaire
  const questionnaireData = location.state?.questionnaireData || null;
  const [riskAversion, setRiskAversion] = useState(questionnaireData);

  const handleButtonClick = () => {
    navigate("/QuestionnairePage");
  };

  if (questionnaireData === null) {
    return <InvestmentBotPrompt handleButtonClick={handleButtonClick} />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:5000/ratio_breakdown_api?risk_aversion=" +
            questionnaireData
        );
        setPortfolioData(res.data);
      } catch (err) {
        console.error("Error fetching ratio breakdown:", err);
      }
    };

    fetchData();
  }, [questionnaireData]);

  if (portfolioData === null) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={4}
        height="70vh"
      >
        <CircularProgress sx={{ color: colorPalette.jasper }} />
        <Typography sx={{ mt: 2, color: colorPalette.charcoal }}>
          Building your personalized portfolio...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "100%",
        overflow: "hidden",
        backgroundColor: "#fafafa",
        minHeight: "90vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          textAlign: "center",
          color: colorPalette.prussianBlue,
          fontWeight: 600,
        }}
      >
        Your Personalized Portfolio
      </Typography>

      <Grid container spacing={3} sx={{ width: "100%" }}>
        {/* Left column */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3} sx={{ height: "100%" }}>
            {/* ScoreProgress card with reduced height */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px solid ${colorPalette.platinum}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: colorPalette.prussianBlue,
                  fontWeight: 600,
                }}
              >
                Your Risk Profile
              </Typography>
              <ScoreProgress
                score={questionnaireData}
                styleLabel={dataToleranceMap(questionnaireData)}
                sx={{ height: "100%" }}
              />
            </Paper>

            {/* Portfolio bar chart - flexible height */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${colorPalette.platinum}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: colorPalette.prussianBlue,
                  fontWeight: 600,
                }}
              >
                Portfolio Allocation
              </Typography>
              <Box
                sx={{
                  textAlign: "center",
                  borderRadius: 1,
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PortfolioBarChart data={portfolioData} />
              </Box>
            </Paper>
          </Stack>
        </Grid>

        {/* Right column - chart and button */}
        <Grid item xs={12} md={7}>
          <Stack spacing={3} sx={{ height: "100%" }}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px solid ${colorPalette.platinum}`,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: colorPalette.prussianBlue,
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Recommended Portfolio Performance in Past 90 Days
              </Typography>
              <PortfolioPerformanceChart riskAversion={questionnaireData} />
            </Paper>

            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/QuestionnairePage")}
              sx={{
                height: 50,
                backgroundColor: colorPalette.jasper,
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor: colorPalette.roseTaupe,
                },
              }}
            >
              Take Test Again
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OptimisePortPage;
