import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

function ScoreProgress({ score, maxScore = 10, styleLabel = "Moderate" }) {
  // 计算进度百分比
  const progress = (score / maxScore) * 100;

  return (
    <Box sx={{ p: 2, border: "1px solid grey", borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Your Investment Preferences
      </Typography>

      {/* 用户得分 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" gutterBottom textAlign="center">
          <strong>Your Score:</strong> {score}/{maxScore} ({styleLabel})
        </Typography>
        <Box sx={{ position: "relative" }}>
          {/* 进度条 */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#4caf50", // 绿色表示用户得分
              },
            }}
          />
          {/* 两端的标签 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Conservative
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aggressive
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ScoreProgress;