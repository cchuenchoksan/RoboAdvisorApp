import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import robotImage from '../assets/robot.png'; // adjust the path as needed

const InvestmentBotPrompt = ({ handleButtonClick }) => {
  return (
    <Box sx={{ p: 3 }}>
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
    </Box>
  );
};

export default InvestmentBotPrompt;
