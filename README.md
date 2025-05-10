# Blockchain-based Voting System

A decentralized voting application built with React and Hardhat.

## Prerequisites

- Node.js (v14 or higher)
- MetaMask browser extension
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Voting-Dapp-master
```

2. Install dependencies:
```bash
# Install root dependencies
npm install --legacy-peer-deps

# Install client dependencies
cd client
npm install --legacy-peer-deps
cd ..
```

## Running the Application

1. Start the local blockchain (Hardhat):
```bash
npx hardhat node
```

2. Deploy the smart contract (in a new terminal):
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. Start the React client (in a new terminal):
```bash
cd client
npm start
```

## MetaMask Setup

1. Open MetaMask and add a new network:
   - Network Name: Localhost 8545
   - RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

2. Import one of the test accounts provided by Hardhat:
   - Private keys are displayed when you start the Hardhat node
   - Example: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

---

## Sepolia Network: HTTP vs WebSocket Endpoints

### 1. Which to Choose: HTTP or WebSocket?

- **HTTP (https://eth-sepolia.g.alchemy.com/v2/...)**  
  Use this for most contract deployments, reads, and transactions.  
  It is the standard for Hardhat, Ethers.js, and most frontend DApps.

- **WebSocket (wss://eth-sepolia.g.alchemy.com/v2/...)**  
  Use this if you need to listen for real-time blockchain events (e.g., contract events, new blocks) in your frontend or backend.  
  Not required for basic contract interaction, deployment, or most DApp features.

**For your Voting DApp, use the HTTP endpoint unless you specifically need real-time event subscriptions.**

### 2. How to Connect in Hardhat

In your `.env` file:
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/XkEY4OdJqhiZlqUwpyebLxlTH1v5JA1p
SEPOLIA_PRIVATE_KEY=your_private_key
```

In `hardhat.config.js`:
```js
sepolia: {
  url: process.env.SEPOLIA_RPC_URL,
  accounts: [process.env.SEPOLIA_PRIVATE_KEY]
}
```

### 3. How to Connect in Ethers.js (Frontend/Backend)

```js
import { ethers } from "ethers";

// HTTP provider (recommended for most use cases)
const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/XkEY4OdJqhiZlqUwpyebLxlTH1v5JA1p");

// WebSocket provider (only if you need real-time events)
const wsProvider = new ethers.providers.WebSocketProvider("wss://eth-sepolia.g.alchemy.com/v2/XkEY4OdJqhiZlqUwpyebLxlTH1v5JA1p");
```

### Summary Table

| Use Case                | Endpoint to Use | Example Code/Config                                      |
|-------------------------|-----------------|----------------------------------------------------------|
| Deploy/Read/Write       | HTTP            | `url: "https://eth-sepolia.g.alchemy.com/v2/..."`        |
| Listen to Events        | WebSocket       | `wss://eth-sepolia.g.alchemy.com/v2/...`                 |

**For your current system, use the HTTP endpoint for Hardhat and your frontend unless you need real-time event listening.**

---

## Application Features

### Admin Role
- Login with admin credentials
- Create and manage elections
- View election results
- Approve voter registrations

### Voter Role
- Connect wallet
- Register as a voter
- View active elections
- Cast votes
- Verify votes

### Results Export
- On the Results page, you can now export election results as a CSV file using the "Export Results as CSV" button. This uses the `json2csv` library for formatting.

## Components Using Contract Calls
- `ContractContext.jsx`: Handles all blockchain connection logic and provides contract instance.
- `Register.jsx`: Registers a voter using the smart contract.
- `Elections.jsx`: Fetches and displays elections from the contract.
- `CandidateDetails.jsx`: Fetches candidate details and allows voting via the contract.
- `Verify.jsx`: Verifies a vote using the contract.
- `Results.jsx`: Fetches and displays results from the contract, and now supports CSV export.
- `AdminDashboard.jsx`: Admin actions (create, end election, etc.) via contract calls.

## Project Structure

```
Voting-Dapp-master/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── contracts/    # Deployed contract artifacts
│   │   └── services/     # Contract services
├── contracts/             # Smart contracts
│   └── Vote.sol          # Main voting contract
├── scripts/              # Deployment scripts
└── test/                # Contract tests
```

## Smart Contract

The main contract (`Vote.sol`) includes the following features:
- Voter registration
- Candidate registration
- Voting mechanism
- Result calculation
- Emergency stop functionality
- Feedback submission

## Development

To run tests:
```bash
npx hardhat test
```

## Troubleshooting

1. If you encounter dependency issues:
   - Use `--legacy-peer-deps` flag with npm install
   - Clear npm cache: `npm cache clean --force`

2. If MetaMask connection fails:
   - Ensure you're connected to the correct network (Localhost 8545)
   - Check if the Hardhat node is running
   - Verify the contract is deployed correctly

## License

This project is licensed under the MIT License.