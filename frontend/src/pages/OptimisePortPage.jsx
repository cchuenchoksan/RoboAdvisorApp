import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FundsTable from "../components/FundsTable";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import robotImage from "../assets/robot.png";

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
      {questionnaireData ? ( // if get data from questionnaire, show score and optimized portfolio
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Your Investment Preferences
          </Typography>
          <Typography variant="body1">
            <strong>Utitlity score:</strong> {questionnaireData.utilityScore}
          </Typography>
          <Typography variant="body1">
            <strong>Risk Tolerance:</strong> {questionnaireData.riskTolerance_score}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/QuestionnairePage")} // user can do questionnaire again
            sx={{ mt: 3 }}
          >
            Take Test Again
          </Button>
        </Box>
      ) : ( // else direct user to take test
        <>
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
        </>
      )}

      <FundsTable />
    </Box>
  );
}

export default OptimisePortPage;