import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GIRImageCard from "./GIRImageCard";
import {useEffect, useState} from "react";
import { Typography } from "@mui/material";

const theme = createTheme();
/*Main component that holds the image objects from the contract*/

export default function Album({web3State}) {
  const [imageNums, setImageNums] = useState([]);
  const [myImages, setMyImages] = useState([]);
  useEffect(() => {
    const initAlbum = async () => {
      try {
        const numImgs = await web3State.contracts.ImageOwnership.methods.getNumImages().call({ from: web3State.address });
        const temp = [];
        const temp2 = [];
        for (let i = 0; i < numImgs; ++i) {
          const owner = (await web3State.contracts.ImageOwnership.methods.getImageOwner(i).call({ from: web3State.address})).toLowerCase()
          console.log(owner, web3State.address)
          if (owner === web3State.address) {
            temp2.push(i)
          } else {
            temp.push(i);
          }
        }
        setImageNums(temp);
        setMyImages(temp2);
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
          <Typography>My Images</Typography>
          <Grid container spacing={4}>
            {myImages.map((card) => (
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
