import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

function createData(name, desc, ret, std, sr) {
  return { name, desc, ret, std, sr };
}

const rows = [
  createData(
    "Eastspring Investments - Japan Dynamic Fund",
    "An amazing fund in Japan",
    10,
    2,
    5
  ),
  createData(
    "BGF Asian High Yield Bond A8 SGD",
    "Vivi's favorite fund",
    5,
    0.5,
    10
  ),
  createData("Allianz Global Oppc Bd AMg H2 SGD", "Insurance fund", -2, 2, -1),
  createData(
    "PIMCO GIS Income E SGD Hedged Inc",
    "Cheen Hao's recommended fund",
    4,
    0.8,
    5
  ),
  createData(
    "JPMorgan Funds - Emerging Markets Dividend Fund",
    "Scammed Fund",
    -3,
    0.4,
    -7.5
  ),
  createData(
    "Natixis International Funds (Lux) I - Harris Associates U.S. Value Equity Fund S/A(USD)",
    "Some random US fund stuff I dont know",
    7,
    0.8,
    8.75
  ),
];

export default function BasicTable() {
  return (
    <Box display={"block"}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "Bold" }}>Funds</TableCell>
              <TableCell align="right" sx={{ fontWeight: "Bold" }}>
                Description
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "Bold" }}>
                Average Returns (%)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "Bold" }}>
                Average Risk (std %)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "Bold" }}>
                Sharpe Ratio
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.desc}</TableCell>
                <TableCell align="right">{row.ret}</TableCell>
                <TableCell align="right">{row.std}</TableCell>
                <TableCell align="right">{row.sr}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
