# Deployment Guide

## Prerequisites
- Node.js and npm installed.
- MetaMask browser extension.
- Hardhat installed globally (`npm install -g hardhat`).

## Steps to Deploy

### 1. Install Dependencies
- Navigate to the project root directory.
- Run `npm install` to install backend dependencies.
- Navigate to the `client` directory and run `npm install` to install frontend dependencies.

### 2. Compile the Smart Contract
- Run `npx hardhat compile` to compile the smart contract.

### 3. Deploy the Smart Contract
- Update the `scripts/deploy.js` file with your desired network configuration.
- Run `npx hardhat run scripts/deploy.js --network <network-name>`.
- Note the deployed contract address.

### 4. Configure the Frontend
- Navigate to `client/src/context/ContractContext.jsx`.
- Update `REACT_APP_CONTRACT_ADDRESS` with the deployed contract address.

### 5. Start the Application
- Navigate to the `client` directory.
- Run `npm start` to launch the frontend.