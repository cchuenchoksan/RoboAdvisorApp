import React from "react";
import Box from "@mui/material/Box";

import EfficientFrontierChart from "../components/EfficientFrontier";
import FundsTable from "../components/FundsTable";
import CorrelationMatrix from "../components/heatmap";

const ExploreFundsPage = () => {
  return (
    <Box>
      <Box display={"flex"} justifyContent={"center"} marginTop={"2vh"}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          sx={{ fontFamily: "sans-serif", fontSize: "1.5rem", width: "100%" }}
        >
          Efficient Frontier
        </Box>
      </Box>

      <Box display={"flex"} justifyContent={"center"} height={"45vh"}>
        <EfficientFrontierChart />
      </Box>

      <Box display={"flex"} justifyContent={"center"}>
        <Box width={"90vw"}>
          <FundsTable />
        </Box>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        height={"60vh"}
        width={"100"}
      >
        <CorrelationMatrix />
      </Box>
    </Box>
  );
};

export default ExploreFundsPage;
