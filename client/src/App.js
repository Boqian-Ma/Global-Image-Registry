import "./App.css";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Components
import MainFeaturedPost from "./components/MainFeaturePost";
import Header from "./components/Header";
import Album from "./components/Album";

// Contracts
import ImageOwnership from "./contracts/ImageOwnership.json";
const contractAddr = "0xb7b7251221aDCa2FF2ab3e970C0a6232c5939e77";

function App() {
  const [state, setState] = useState({
    web3: null,
    web3Provider: null,
    address: null,
    contracts: null,
    modified: 0,
  });

  const [web3Ready, setWeb3Ready] = useState(false);

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
      const web3 = new Web3(web3Provider);
      setState((prevState) => ({
        ...prevState,
        web3: web3,
        web3Provider: web3Provider,
      }));

      // set account address
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => {
          // Return the address of the wallet 
          console.log(typeof res[0]);
          setState((prevState) => ({
            ...prevState,
            address: res[0].toLowerCase(),
          }));
        });
    };
    initWeb3();
  }, []);

  useEffect(() => {
    // Setup listener for when user changes metamask address 
    async function listenForMMChange() {
      window.ethereum.on("accountsChanged", async () => {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        setState((prev) => ({
          ...prev,
          address: accounts[0].toLowerCase(),
        }));
      });
    }
    listenForMMChange();
  }, []);

  useEffect(() => {
    // import contract ABI and connect to blockchain instance
    const initContracts = async () => {
      if (!state.web3Provider) return;
      const { abi } = ImageOwnership;
      const imageOwnershipContract = new state.web3.eth.Contract(
        abi,
        contractAddr
      );
      console.log(imageOwnershipContract);
      setState((prevState) => ({
        ...prevState,
        contracts: { ImageOwnership: imageOwnershipContract },
      }));
    };
    initContracts();
  }, [state.web3Provider]);

  useEffect(() => {
    // Do not render components until contract is ready to be called
    if (
      state.web3 === null ||
      state.web3Provider === null ||
      state.address === null ||
      state.contracts === null
    )
      return;
    setWeb3Ready(true);
  }, [state]);

  const mainFeaturedPost = {
    title: "Global Image Registry",
    description: "Decentralised, Immutable, Transparent.",
    image: "https://source.unsplash.com/random",
    imageText: "GIR",
    // linkText: "Upload an Image Now",
  };

  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header
          loginState={state.address}
          state={state}
          setState={setState}
        />
        <main>
          <MainFeaturedPost
            post={mainFeaturedPost}
            loginState={state.address}
            state={state}
            setState={setState}
          />
        </main>
        {web3Ready && <Album web3State={state}/>}
      </Container>
    </ThemeProvider>
  );
}

export default App;
