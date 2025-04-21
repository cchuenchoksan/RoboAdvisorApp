import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PortfolioPieChart from "../components/PortfolioPieChart";
import PortfolioBarChart from "../components/PortfolioBarChart";
import ScoreProgress from "../components/ScoreProgress";
import PortfolioPerformanceChart from "../components/PortfolioPerformanceChart";
import { Box, Button, Grid, Paper, Stack, CircularProgress } from '@mui/material';
import InvestmentBotPrompt from "../components/OptimiseLanding";
import axios from "axios";

function dataToleranceMap(score) {
  if (score < 0 || score > 100 || typeof score !== 'number') {
      return 'Invalid score';
  }

  if (score >= 0 && score <= 25) {
      return 'Very cautious';
  } else if (score >= 26 && score <= 33) {
      return 'Cautious';
  } else if (score >= 34 && score <= 44) {
      return 'Moderately cautious';
  } else if (score >= 45 && score <= 56) {
      return 'Balanced';
  } else if (score >= 57 && score <= 67) {
      return 'Moderately aggressive';
  } else if (score >= 68 && score <= 79) {
      return 'Aggressive';
  } else if (score >= 80 && score <= 100) {
      return 'Very aggressive';
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
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: "100%", overflow: "hidden" }}>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        {/* Left column */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2} sx={{ height: "100%" }}>
            {/* ScoreProgress card with reduced height */}
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
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
                p: 2, 
                borderRadius: 2, 
                flex: 1,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <PortfolioBarChart data={portfolioData} />
            </Paper>
          </Stack>
        </Grid>
        
        {/* Right column - chart and button */}
        <Grid item xs={12} md={8}>
          <Stack spacing={2} sx={{ height: "100%" }}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                flex: 1,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <PortfolioPerformanceChart riskAversion={questionnaireData} />
            </Paper>
            
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/QuestionnairePage")}
              sx={{ height: 48 }}
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
