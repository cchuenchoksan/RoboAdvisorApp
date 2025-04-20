import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PortfolioPieChart from "../components/PortfolioPieChart";
import PortfolioBarChart from "../components/PortfolioBarChart";
import ScoreProgress from "../components/ScoreProgress";
import PortfolioPerformanceChart from "../components/PortfolioPerformanceChart";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InvestmentBotPrompt from "../components/OptimiseLanding";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

// // TODO: Fake Data: performance of optimal portfolio in last 30 days
// const performanceData = [
//   { day: "Day 1", value: 1000 },
//   { day: "Day 5", value: 1020 },
//   { day: "Day 10", value: 1010 },
//   { day: "Day 15", value: 1050 },
//   { day: "Day 20", value: 1080 },
//   { day: "Day 25", value: 1070 },
//   { day: "Day 30", value: 1100 },
// ];


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
  const [riskAversion, setRiskAversion] = useState(0.5);
  const [portfolioData, setPortfolioData] = useState(null);

  // get data from questionnare
  const questionnaireData = location.state?.questionnaireData || null;

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
  }, []);

  if (portfolioData === null) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  questionnaireData

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", gap: 3 }}>
        {/* 左边：得分和饼图 */}
        <Box
          sx={{
            flex: "1 1 30%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <ScoreProgress
            score={questionnaireData}
            styleLabel={dataToleranceMap(questionnaireData)}
          />

          <PortfolioBarChart data={portfolioData} />

          {/* 重新测试按钮 */}
          <Button
            variant="contained"
            onClick={() => navigate("/QuestionnairePage")}
            sx={{ mt: 2 }}
          >
            Take Test Again
          </Button>
        </Box>

        {/* 右边：折线图 */}
        {/* <Box sx={{ flex: "1 1 70%", p: 2, border: "1px solid grey", borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Performance (Past 30 Days)
            </Typography>
            <LineChart
              width={900}
              height={600}
              data={performanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <LineTooltip />
              <LineLegend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </Box> */}
        <PortfolioPerformanceChart riskAversion={riskAversion} />
      </Box>
    </Box>
  );
}

export default OptimisePortPage;
