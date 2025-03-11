import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AdbIcon from "@mui/icons-material/Adb";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';

import { makeStyles } from '@mui/styles';
// import './style/HomePage.css'

const useStyles = makeStyles((theme) => ({
  ipokBtn: {
    color: "#fd7f20 !important",
    borderColor: "#fd7f20 !important",
    margin: "0.5rem",
  },
  ipokLink: {
    margin: "0.5rem",
  }
}));

function HomePage() {
  const classes = useStyles();
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Box>
          <Box sx={{ fontFamily: "sans-serif", fontSize: "2.5rem" }}>
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
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <AdbIcon sx={{ fontSize: "3.5rem" }} />IPOK-α
          </Typography>
          <Box sx={{ fontFamily: "sans-serif", fontSize: "1.5rem" }}>
            Where funds are fun.
          </Box>
          <Box sx={{
            mt: "3rem"
          }}>
            <Link to="/ExploreFundsPage" className={classes.ipokLink}><Button variant="outlined" className={classes.ipokBtn}>Explore Funds</Button></Link>
            <Link to="/OptimisePortPage" className={classes.ipokLink}><Button variant="outlined" className={classes.ipokBtn}>Find Your Port</Button></Link>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default HomePage;
