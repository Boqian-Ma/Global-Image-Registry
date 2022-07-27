import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GIRImageCard from "./GIRImageCard";
import {useEffect, useState} from "react";

const theme = createTheme();
/*Main component that holds the image objects from the contract*/

export default function Album({web3State}) {
  const [imageNums, setImageNums] = useState([]);
  useEffect(() => {
    const initAlbum = async () => {
      try {
        const numImgs = await web3State.contracts.ImageOwnership.methods.getNumImages().call({ from: web3State.address });
        const temp = [];
        for (let i = 0; i < numImgs; ++i) {
          temp.push(i);
        }
        setImageNums(temp);
      } catch (err) {
        console.log("Error fetching ids from chain", err)
      }
    }
    initAlbum();
  }, [web3State])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Container maxWidth="md" sx={{ paddingBottom: '50px'}}>
          <Grid container spacing={4}>
            {imageNums.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <GIRImageCard id={card} state={web3State}/>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
