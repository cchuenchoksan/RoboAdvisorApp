import React from "react";
import Box from "@mui/material/Box";

import EfficientFrontier from "../components/EfficientFrontier";
import EfficientFrontierChart from "../components/EfficientFrontier2";
import FundsTable from "../components/FundsTable";

import { makeStyles } from "@mui/styles";

const ExploreFundsPage = () => {
  return (
    <Box>
      
      <Box display={"flex"} justifyContent={"center"} marginTop={"2vh"}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          sx={{ fontFamily: "sans-serif", fontSize: "1.5rem", width: "100%" }}
        >
          With Short Selling
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          sx={{ fontFamily: "sans-serif", fontSize: "1.5rem", width: "100%" }}
        >
          Without Short Selling
        </Box>
      </Box>
      
      <Box display={"flex"} justifyContent={"center"} height={"45vh"}>
        <EfficientFrontier shortSales="true"/>
        <EfficientFrontier shortSales="false"/>
      </Box>

      <Box display={"flex"} justifyContent={"center"}>
        <Box width={"90vw"}>
        <FundsTable />
        </Box>
      </Box>

      <EfficientFrontierChart />
    </Box>
  );
};

export default ExploreFundsPage;
