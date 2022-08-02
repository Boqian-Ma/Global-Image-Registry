# Global-Image-Registry

This repository contains the source code of Global Image Registry, a decentralised solution to preserve image copyright ownership with functionalities
for ownership transfer and license.

# Running client

Install dependencies

```
cd client
npm install
```

Start frontend server

```
cd client
npm start
```

# Truffle commands

```
cd truffle
```

```
Compile: truffle compile
Migrate: truffle migrate
Test contracts: truffle test
```

# Running locally

This article goes through the ganache metamask setup: https://asifwaquar.com/connect-metamask-to-localhost/

## Ganache

The truffle configuration file current deploys the contracts to Ganache running on 127.0.0.1 on port 7545

## Connecting metamask

- Add a new network on metamask: RPC url will be whatever you are running on Ganche, default is: http://127.0.0.1:7545, chainId is 1337 for Ganache
- Once connected to Ganache, import some accounts to metamask using the private keys in Ganache

## Deploying Contracts and connect contract

To connect a deployed contract:

**Get the contract address from the truffle migrate output and paste it into the App.js file on line 16~ for the variable contractAddr.**

To interact with smart contracts through the frontend after making a change to the smart contracts, generally you will need to run:

```
truffle migrate --reset
```

This clears the previous contract deployment and will deploy it to another address.
