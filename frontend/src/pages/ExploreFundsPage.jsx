import React from "react";
import Box from "@mui/material/Box";

import EfficientFrontier from '../components/EfficientFrontier'
import FundsTable from '../components/FundsTable'

import { makeStyles } from "@mui/styles";

const ExploreFundsPage = () => {

  return (
    <Box>
    <Box display={"flex"} justifyContent={"center"} height={"50vh"}>
      <EfficientFrontier />
    </Box>
      <FundsTable />
    </Box>
  );
};

export default ExploreFundsPage;
