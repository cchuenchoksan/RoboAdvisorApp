import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

function ScoreProgress({ score, maxScore = 100, styleLabel = "Moderate" }) {
  const progress = (score / maxScore) * 100;
  const styleColorMap = {
    "Very cautious": "#1976d2",
    "Cautious": "#2196f3",
    "Moderately cautious": "#4caf50",
    "Balanced": "#ffb300",
    "Moderately aggressive": "#ff7043",
    "Aggressive": "#f44336",
    "Very aggressive": "#d32f2f",
  };

  const barColor = styleColorMap[styleLabel] || "#4caf50";

  return (
    <Box sx={{ p: 2, border: "1px solid grey", borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Your Investment Preferences
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" gutterBottom textAlign="center">
          <strong>Your Score:</strong> {score}/{maxScore} ({styleLabel})
        </Typography>
        <Box sx={{ position: "relative" }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: barColor,
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Very cautious
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Very aggressive
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ScoreProgress;