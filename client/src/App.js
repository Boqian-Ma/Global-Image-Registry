import "./App.css";
// import ImageUploadComponent from "./components/ImageUploadComponent";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { TruffleContract } from "@truffle/contract";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import getWeb3 from "./utils/getWeb3";
import Web3 from "web3";
import ImageFactory from "./contracts/ImageFactory.json";

import Home from "./pages";

// import truffleConfig from "../../truffle/truffle-config";

const truffleContract = require("@truffle/contract");

function App() {
  const [state, setState] = useState({
    web3: null,
    web3Provider: null,
    accounts: null,
    contracts: {},
  });
  const [storageValue, setStorageValue] = useState(0);

  useEffect(() => {
    const initWeb3 = async () => {
      // get web3 provider
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
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
        App.web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        App.web3Provider = new Web3.providers.HttpProvider(
          "http://localhost:7545"
        );
      }
      // set state
      const web3 = new Web3(App.web3Provider);
      setState({ web3: web3, web3Provider: App.web3Provider });
      return App.initContracts();
    };

    const initContracts = () => {
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = ImageFactory.networks[networkId];
      var ImageFactoryArtifact = ImageFactory.json();
      setState({
        contracts: { ImageFactory: TruffleContract(ImageFactoryArtifact) },
      });
      state.contracts.ImageFactory.setProvider(state.web3Provider);
    };

    initWeb3();
  }, []);

  const runExample = async () => {
    const { accounts, contract } = state;
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>state</li>
          </ul>
        </nav>
      </div>
      <Navbar />
      <Routes>
        <Route path="/" exact component={Home} />
        {/* <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/contact-us" component={Contact} />
        <Route path="/sign-up" component={SignUp} /> */}
      </Routes>
    </Router>
  );
}

export default App;
