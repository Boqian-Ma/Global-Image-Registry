// import Web3 from "web3";
// let getWeb3 = new Promise(function (resolve, reject) {
//   window.addEventListener("load", function () {
//     var results;
//     // var web3 = window.web3;

//     // if (typeof web3 !== "undefined") {
//     //   web3 = new Web3(web3.currentProvider);
//     //   results = {
//     //     web3: web3,
//     //   };
//     //   resolve(results);
//     // } else {
//     //   var provider = new Web3.providers.HttpProvider("http://localhost:7545");
//     //   web3 = new Web3(provider);
//     //   results = {
//     //     web3: web3,
//     //   };
//     //   resolve(results);
//     // }

//     if (window.ethereum) {
//       App.web3Provider = window.ethereum;
//       try {
//         // Request account access
//         await window.ethereum.request({ method: "eth_requestAccounts" });
//       } catch (error) {
//         // User denied account access...
//         console.error("User denied account access");
//       }
//     }
//     // Legacy dapp browsers...
//     else if (window.web3) {
//       App.web3Provider = window.web3.currentProvider;
//     }
//     // If no injected web3 instance is detected, fall back to Ganache
//     else {
//       App.web3Provider = new Web3.providers.HttpProvider(
//         "http://localhost:7545"
//       );
//     }
//     web3 = new Web3(App.web3Provider);

//     resolve(web3);

//   });
// });
// export default getWeb3;
