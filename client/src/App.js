import "./App.css";
// import ImageUploadComponent from "./components/ImageUploadComponent";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TruffleContract from "@truffle/contract";
import Web3 from "web3";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Components
import Navbar from "./components/Navbar";
import Masonry from "./components/Masonry";
import MainFeaturedPost from "./components/MainFeaturePost";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Album from "./components/Album";

// Contracts
import ImageFactory from "./contracts/ImageFactory.json";

// Pages
import Home from "./pages";

// import truffleConfig from "../../truffle/truffle-config";
// const truffleContract = require("@truffle/contract");

function App() {
  const [state, setState] = useState({
    web3: null,
    web3Provider: null,
    address: null,
    contracts: {},
  });

  const [storageValue, setStorageValue] = useState(0);

  useEffect(() => {
    const initWeb3 = async () => {
      // get web3 provider
      var web3Provider;
      if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
          // User denied account access...
          console.error("User denied account access");
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
      }

      // set state
      const web3 = new Web3(App.web3Provider);
      setState({ web3: web3, web3Provider: web3Provider });

      // set account address
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        // Return the address of the wallet
        setState({ address: res });
        // alert(res);
      });
      // return App.initContracts();
    };

    const initContracts = () => {
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = ImageFactory.networks[networkId];
      // var ImageFactoryArtifact = ;

      var imageFactoryContract = TruffleContract(ImageFactory);

      setState({
        contracts: { ImageFactory: imageFactoryContract },
      });

      setState({
        contracts: { ImageFactory: { setProvider: state.web3Provider } },
      });
    };

    initWeb3();
    initContracts();
  }, []);

  const runExample = async () => {
    const { accounts, contract } = state;
  };

  const mainFeaturedPost = {
    title: "Global Image Registry",
    description: "Decentralised, Immutable, Transparent.",
    image: "https://source.unsplash.com/random",
    imageText: "GIR",
    // linkText: "Upload an Image Now",
  };

  const theme = createTheme();

  return (
    // <Router>
    //   <Navbar loginState={state.address} />
    //   <MainFeaturedPost post={mainFeaturedPost} />
    //   <Routes>
    //     <Route path="/" exact component={Home} />
    //   </Routes>

    //   {/* <ImageCollection /> */}
    //   <br></br>
    //   <Masonry columnCount="4" gap="5" />

    //   <Footer
    //     title="Footer"
    //     description="Something here to give the footer a purpose!"
    //   />
    // </Router>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header loginState={state.address} />
        <main>
          <MainFeaturedPost
            post={mainFeaturedPost}
            loginState={state.address}
          />
          {/* <Grid container spacing={4}>
              {featuredPosts.map((post) => (
                <FeaturedPost key={post.title} post={post} />
              ))}
            </Grid> */}
        </main>
        <Album />
      </Container>
      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </ThemeProvider>
  );
}

export default App;
