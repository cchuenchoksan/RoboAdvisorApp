import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

// Color palette
const colorPalette = {
  prussianBlue: '#212D40',
  charcoal: '#364156',
  platinum: '#DBDBDB',
  jasper: '#D66853',
  roseTaupe: '#7D4E57'
};

function ScoreProgress({ score, maxScore = 100, styleLabel = "Moderate" }) {
  const progress = (score / maxScore) * 100;
  
  // Updated color map using the color palette with gradient variations
  const styleColorMap = {
    "Very cautious": "#1976d2",
    "Cautious": "#2196f3",
    "Moderately cautious": "#4caf50",
    "Balanced": "#ffb300",
    "Moderately aggressive": "#ff7043",
    "Aggressive": "#f44336",
    "Very aggressive": "#d32f2f",
  };

  const barColor = styleColorMap[styleLabel] || colorPalette.charcoal;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        textAlign="center"
        sx={{ 
          color: colorPalette.prussianBlue,
          fontWeight: 600,
          mb: 2
        }}
      >
        Your Investment Preferences
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="body1" 
          gutterBottom 
          textAlign="center"
          sx={{ 
            mb: 2,
            color: colorPalette.charcoal,
            fontWeight: 500
          }}
        >
          <strong>Your Score:</strong> {score}/{maxScore} 
          <Box 
            component="span" 
            sx={{ 
              ml: 1,
              color: barColor,
              fontWeight: 600,
              display: 'inline-block',
              px: 1,
              py: 0.3,
              borderRadius: 1,
              backgroundColor: `${barColor}15`,
            }}
          >
            {styleLabel}
          </Box>
        </Typography>
        <Box sx={{ position: "relative" }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: colorPalette.platinum,
              "& .MuiLinearProgress-bar": {
                backgroundColor: barColor,
                transition: "transform 1s ease-in-out",
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1.5,
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: colorPalette.charcoal,
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            >
              Very cautious
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: colorPalette.charcoal,
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            >
              Very aggressive
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ScoreProgress;