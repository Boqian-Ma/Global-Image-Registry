# Global-Image-Registry

# Running client

## Install dependencies

cd client
npm install

## Start server

cd client
npm start

# Truffle commands

cd truffle

Compile: truffle compile
Migrate: truffle migrate
Test contracts: truffle test

<!-- Run dev server: npm run dev -->


# Running locally
This article goes through the ganache metamask setup: https://asifwaquar.com/connect-metamask-to-localhost/
## Ganache 
The truffle configuration file current deploys the contracts to Ganache running on 127.0.0.1 on port 7545

## Connecting metamask
* Add a new network on metamask: RPC url will be whatever you are running on Ganche, default is: http://127.0.0.1:7545, chainId is 1337 for Ganache
* Once connected to Ganache, import some accounts to metamask using the private keys in Ganache

## Deploying Contracts
To interact with smart contracts through the frontend after making a change to the smart contracts, generally you will need to run:
  truffle migrate --reset
This clears the previous contract deployment and will deploy it to another address.
Get the contract address from the truffle migrate output and paste it into the App.js file on line 16~ for the variable contractAddr.

