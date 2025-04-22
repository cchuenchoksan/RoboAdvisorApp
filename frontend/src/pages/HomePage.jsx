import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AdbIcon from "@mui/icons-material/Adb";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

// Color palette
const colorPalette = {
  prussianBlue: '#212D40',
  charcoal: '#364156',
  platinum: '#DBDBDB',
  jasper: '#D66853',
  roseTaupe: '#7D4E57'
};

const useStyles = makeStyles(() => ({
  ipokBtn: {
    color: `${colorPalette.jasper} !important`,
    borderColor: `${colorPalette.jasper} !important`,
    margin: "0.5rem",
    "&:hover": {
      backgroundColor: `${colorPalette.jasper}20 !important`,
      transition: "background-color 0.3s ease",
    }
  },
  ipokLink: {
    margin: "0.5rem",
  },
  welcomeText: {
    color: colorPalette.charcoal,
    fontFamily: "sans-serif",
  },
  sloganText: {
    color: colorPalette.roseTaupe,
    fontFamily: "sans-serif",
  }
}));

function HomePage() {
  const classes = useStyles();
  return (
    <div style={{ backgroundColor: colorPalette.platinum, minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          padding: "2rem",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            padding: "3rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            backgroundColor: "#fff",
            maxWidth: "90%",
            width: "600px",
          }}
        >
          <Box sx={{ fontFamily: "sans-serif", fontSize: "2.5rem" }} className={classes.welcomeText}>
            Welcome to{" "}
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: "block",
              fontFamily: "monospace",
              fontWeight: "bold",
              fontSize: "4rem",
              letterSpacing: ".3rem",
              color: colorPalette.prussianBlue,
              textDecoration: "none",
            }}
          >
            <AdbIcon sx={{ fontSize: "3.5rem", color: colorPalette.prussianBlue }} />IPOK-α
          </Typography>
          <Box sx={{ fontFamily: "sans-serif", fontSize: "1.5rem" }} className={classes.sloganText}>
            Where funds are fun.
          </Box>
          <Box sx={{
            mt: "3rem",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <Link to="/ExploreFundsPage" className={classes.ipokLink}>
              <Button 
                variant="outlined" 
                className={classes.ipokBtn}
                sx={{ 
                  borderWidth: "2px", 
                  fontWeight: "bold",
                  padding: "0.5rem 1.5rem"
                }}
              >
                Explore Funds
              </Button>
            </Link>
            <Link to="/OptimisePortPage" className={classes.ipokLink}>
              <Button 
                variant="outlined" 
                className={classes.ipokBtn}
                sx={{ 
                  borderWidth: "2px", 
                  fontWeight: "bold",
                  padding: "0.5rem 1.5rem"
                }}
              >
                Find Your Port
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default HomePage;