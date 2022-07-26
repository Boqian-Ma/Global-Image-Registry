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
//import ImageFactory from "./contracts/ImageFactory.json";
import ImageOwnership from "./contracts/ImageOwnership.json"

// Pages
import Home from "./pages";

// import truffleConfig from "../../truffle/truffle-config";
// const truffleContract = require("@truffle/contract");
const contractAddr = "0xFDa7c33eE9dbAF73258F76e72547EAD3ddAa017d"

function App() {
  const [state, setState] = useState({
    web3: null,
    web3Provider: null,
    address: null,
    contracts: null,
    modified: 0,
  });
  
  const [web3Ready, setWeb3Ready] = useState(false)


  useEffect(() =>  {
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
      const web3 = new Web3(web3Provider);
      setState(prevState => ({ 
        ...prevState,
        web3: web3, 
        web3Provider: web3Provider
        }
      ));

      // set account address
       await window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        // Return the address of the wallet
        console.log(typeof res[0])
        setState(prevState => ({ 
          ...prevState,
          address: (res[0]).toLowerCase()
          }
        ))
        // alert(res);
      });
      // return App.initContracts();
    };
    initWeb3();
    
  }, []);
  
  useEffect(() => {
    async function listenForMMChange() {
      window.ethereum.on("accountsChanged", async () => {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log(accounts)
        setState(prev => ({
          ...prev,
          address: (accounts[0]).toLowerCase()
        }
        ))
      })
    }
    listenForMMChange();
  }, [])
  
  useEffect(() => {
    const initContracts = async  () => {
      if (!state.web3Provider) return;
      const { abi } = ImageOwnership;
      // const networkID = await state.web3.eth.net.getId();
      // console.log("NetworkId", networkID)
      const imageOwnershipContract = new state.web3.eth.Contract(abi, contractAddr)
      console.log(imageOwnershipContract);
      // const numImg = await imageOwnershipContract.methods.getNumImages().call({ from: state.address })
      // console.log("numImg: ", numImg)
      setState(prevState => ({
        ...prevState,
        contracts: { ImageOwnership : imageOwnershipContract }
      }))
    };
    initContracts();
  }, [state.web3Provider])
  
  useEffect(() => {
    if (state.web3 === null || state.web3Provider === null || state.address === null || state.contracts === null) return
    setWeb3Ready(true);
  }, [state])
 
  useEffect(() =>{
    //console.log("State has been updated", state)
  }, [state])

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
        <Header loginState={state.address} state={state} updateState={setState}/>
        <main>
          <MainFeaturedPost
            post={mainFeaturedPost}
            loginState={state.address}
            state={state}
            updateState={setState}
          />
          {/* <Grid container spacing={4}>
              {featuredPosts.map((post) => (
                <FeaturedPost key={post.title} post={post} />
              ))}
            </Grid> */}
        </main>
        {web3Ready && <Album web3State={state}/>}
      </Container>
      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </ThemeProvider>
  );
}

export default App;
