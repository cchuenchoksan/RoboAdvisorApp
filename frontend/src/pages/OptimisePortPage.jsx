import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PortfolioPieChart from "../components/PortfolioPieChart";
import ScoreProgress from "../components/ScoreProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import robotImage from "../assets/robot.png";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, Legend as LineLegend } from "recharts";

// TODO: Fake Data: portfolio weight
const portfolioData = [
  { name: "Stocks", value: 40 },
  { name: "Bonds", value: 30 },
  { name: "Real Estate", value: 20 },
  { name: "Cash", value: 10 },
];

// TODO: Fake Data: performance of optimal portfolio in last 30 days
const performanceData = [
  { day: "Day 1", value: 1000 },
  { day: "Day 5", value: 1020 },
  { day: "Day 10", value: 1010 },
  { day: "Day 15", value: 1050 },
  { day: "Day 20", value: 1080 },
  { day: "Day 25", value: 1070 },
  { day: "Day 30", value: 1100 },
];

// TODO: Fake Data: Questionnaire
const fakeQuestionnaireData = {
  utilityScore: 8,
  riskTolerance_score: "Moderate",
};

function OptimisePortPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);

  // get data from questionnare
  const questionnaireData = location.state?.questionnaireData || null;

  const handleButtonClick = () => {
    navigate("/QuestionnairePage");
  };

  return (
    <Box sx={{ p: 3 }}>
      {questionnaireData ? (
        // 问卷提交后的页面
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* 左边：得分和饼图 */}
          <Box sx={{ flex: "1 1 30%", display: "flex", flexDirection: "column", gap: 3 }}>

            <ScoreProgress
              score={fakeQuestionnaireData.utilityScore}
              styleLabel={fakeQuestionnaireData.riskTolerance_score}
            />

            <PortfolioPieChart data={portfolioData} />

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
          <Box sx={{ flex: "1 1 70%", p: 2, border: "1px solid grey", borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Performance (Past 30 Days)
            </Typography>
            <LineChart
              width={600}
              height={400}
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
          </Box>
        </Box>
      ) : (
        // 初始页面
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            component="img"
            src={robotImage}
            alt="Investment Bot"
            sx={{
              width: 150,
              height: 150,
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              textAlign: "center",
              color: "text.primary",
            }}
          >
            If you want the portfolio that best fits you, take the test now!
          </Typography>
          <Button
            variant="contained"
            onClick={handleButtonClick}
            sx={{
              mt: 2,
              mb: 2,
              px: 4,
              py: 1,
            }}
          >
            Take Test
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default OptimisePortPage;