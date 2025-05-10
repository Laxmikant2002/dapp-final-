# Deployment Details & Architecture

## Overview
This document describes the deployment details, architecture, and testnet-specific notes for the Voting DApp as of the latest blockchain-only version.

---

## Deployment Details

- **Smart Contract Name:** Vote
- **Testnet Used:** Sepolia
- **RPC Endpoint:** https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
- **WebSocket Endpoint:** wss://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
- **Deployed Contract Address:**
  - _[Insert your deployed contract address here after deployment]_  
- **Deployer Account:**
  - _[Insert deployer address used for deployment]_  
- **Frontend Contract Config:**
  - `client/src/contracts/contract-address.json` and `Vote.json` are updated automatically by the deploy script.

---

## Deployment Steps

1. **Fund your Sepolia wallet** with test ETH from a [Sepolia faucet](https://sepoliafaucet.com/).
2. **Set up your `.env` file** in the project root:
   ```
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
   SEPOLIA_PRIVATE_KEY=your_sepolia_private_key
   ```
3. **Deploy the contract:**
   ```sh
   npx hardhat run scripts/deploy.js --network sepolia
   ```
   - This will update the contract address and ABI in the frontend automatically.
4. **Configure MetaMask** to use Sepolia and import your funded account.
5. **Start the frontend:**
   ```sh
   cd client
   npm start
   ```
6. **Test all flows** (register, vote, admin actions, results, etc.) using MetaMask and Sepolia.
7. **Verify transactions** on [Sepolia Etherscan](https://sepolia.etherscan.io/).

---

## Architecture Overview

### System Diagram
```
┌─────────────────┐     ┌────────────────────┐     ┌────────────────────────────┐
│                 │     │                    │     │                            │
│  React Frontend │────▶│  ContractContext   │────▶│  Ethereum Sepolia Testnet  │
│                 │     │  (Ethers.js)       │     │  (Vote Smart Contract)     │
└─────────────────┘     └────────────────────┘     └────────────────────────────┘
        │
        ▼
┌─────────────────┐
│  MetaMask       │
└─────────────────┘
```

### Key Components
- **Frontend:** React app, connects to blockchain via MetaMask and Ethers.js.
- **ContractContext:** Handles wallet connection, contract instance, and all contract calls.
- **Smart Contract:** All voting logic, election management, and results are on-chain.
- **No Firebase:** All authentication and data are now blockchain-based.

---

## Testnet-Specific Notes & Issues
- **Gas Estimation:** Sepolia may have higher/lower gas requirements than local Hardhat. Always check MetaMask prompts.
- **Transaction Delays:** Sepolia blocks may take longer than local dev. Wait for confirmations.
- **Faucet Limits:** Sepolia faucets may have rate limits. Plan ahead for test ETH.
- **Contract Address:** Always update the frontend config after each deployment.
- **MetaMask Network:** Ensure MetaMask is set to Sepolia, not localhost, for testnet testing.
- **Etherscan Verification:** You can verify your contract on Sepolia Etherscan for transparency.

---

## References
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Alchemy Sepolia Docs](https://docs.alchemy.com/reference/sepolia)

---

**Update this document with your actual contract address and deployer account after deployment.** 