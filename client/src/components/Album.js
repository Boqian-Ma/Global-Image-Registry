import * as React from "react";
// import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
// import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GIRImageCard from "./GIRImageCard";
import {useEffect, useState} from "react";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const cards = [0, 1, 2, 3, 4, 5];
const myCards = [0,1,2];

const theme = createTheme();

export default function Album({web3State}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Container maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <GIRImageCard id={card}/>
              </Grid>
            ))}
          </Grid>
            <Box sx={{paddingBlock: 2}}>
              <Typography component="h3">My Images</Typography>
            </Box>
            <Grid container spacing={4}>
            {myCards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <GIRImageCard id={card} userAddress={web3State.address}/>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
