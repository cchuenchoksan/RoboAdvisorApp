import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import robotImage from '../assets/robot.png'; // adjust the path as needed

// Color palette
const colorPalette = {
  prussianBlue: '#212D40',
  charcoal: '#364156',
  platinum: '#DBDBDB',
  jasper: '#D66853',
  roseTaupe: '#7D4E57'
};

const InvestmentBotPrompt = ({ handleButtonClick }) => {
  return (
    <Box 
      sx={{ 
        p: 4,
        borderRadius: '8px',
        border: `1px solid ${colorPalette.platinum}`,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box
          component="img"
          src={robotImage}
          alt="Investment Bot"
          sx={{
            width: 150,
            height: 150,
            mb: 3,
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
          }}
        />
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            textAlign: "center",
            color: colorPalette.charcoal,
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          If you want the portfolio that best fits you, take the test now!
        </Typography>
        <Button
          variant="contained"
          onClick={handleButtonClick}
          sx={{
            mt: 1,
            mb: 2,
            px: 4,
            py: 1.5,
            backgroundColor: colorPalette.jasper,
            color: '#FFFFFF',
            fontWeight: 600,
            borderRadius: '6px',
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: colorPalette.roseTaupe,
            },
            boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          Take Test
        </Button>
      </Box>
    </Box>
  );
};

export default InvestmentBotPrompt;