import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GIRImageCard from "./GIRImageCard";
import {useEffect, useState} from "react";
import { CircularProgress, Typography } from "@mui/material";

const theme = createTheme();
/*Main component that holds the image objects from the contract*/

export default function Album({web3State, setState}) {
  const [imageNums, setImageNums] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [myLicenceImages, setLicenceImages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initAlbum = async () => {
      setLoading(true)
      try {
        const numImgs = await web3State.contracts.ImageOwnership.methods.getNumImages().call({ from: web3State.address });
        const marketPlace = [];
        const owned = [];
        const licencing = [];
        for (let i = 0; i < numImgs; ++i) {
          const owner = (await web3State.contracts.ImageOwnership.methods.getImageOwner(i).call({ from: web3State.address})).toLowerCase()
          const isLicencing = (await web3State.contracts.ImageOwnership.methods.isAddrLicencingImage(i).call({ from: web3State.address}))
          console.log(owner, web3State.address)
          if (owner === web3State.address) {
            owned.push(i)
          } else if (isLicencing) {
            licencing.push(i);
          } else {
            marketPlace.push(i)
          }
        }
        setImageNums(marketPlace);
        setMyImages(owned);
        setLicenceImages(licencing)
      } catch (err) {
        console.log("Error fetching ids from chain", err)
      }
      setLoading(false)
    }
    initAlbum();
  }, [web3State])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Container maxWidth="md" sx={{ paddingBottom: '50px'}}>
          {loading && <CircularProgress />}
          {!loading && <>
            <Grid container spacing={4}>
              {imageNums.map((card) => (
                <Grid item key={card} xs={12} sm={6} md={4}>
                  <GIRImageCard id={card} state={web3State} setState={setState}/>
                </Grid>
              ))}
            </Grid>
            <Typography>My Images</Typography>
            <Grid container spacing={4}>
              {myImages.map((card) => (
                <Grid item key={card} xs={12} sm={6} md={4}>
                  <GIRImageCard id={card} state={web3State} setState={setState}/>
                </Grid>
              ))}
            </Grid>
            <br></br>
            <Typography>Images I'm Licensing</Typography>
            <Grid container spacing={4}>
              {myLicenceImages.map((card) => (
                <Grid item key={card} xs={12} sm={6} md={4}>
                  <GIRImageCard id={card} state={web3State} setState={setState}/>
                </Grid>
              ))}
            </Grid>
          </>}
        </Container>
      </main>
    </ThemeProvider>
  );
}
