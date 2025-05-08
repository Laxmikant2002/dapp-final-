# Blockchain-based Voting System

A decentralized voting application built with React, Hardhat, and Firebase.

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

3. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

4. Login to Firebase:
```bash
firebase login
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

3. Start Firebase emulators (in a new terminal):
```bash
firebase emulators:start
```
The emulators will run on the following ports:
- Firebase UI: http://localhost:4000
- Authentication: http://localhost:9099
- Firestore: http://localhost:8082
- Functions: http://localhost:5001
- Hosting: http://localhost:5000

4. Start the React client (in a new terminal):
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

## Project Structure

```
Voting-Dapp-master/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── contracts/    # Deployed contract artifacts
│   │   └── services/     # Firebase and contract services
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

## Firebase Integration

The application uses Firebase for:
- User authentication
- Admin management
- Voter registration approval
- Data persistence

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

3. If Firebase emulators fail to start:
   - Ensure Firebase CLI is installed globally
   - Check if you're logged in to Firebase
   - If ports are in use, modify the ports in firebase.json:
     ```json
     "emulators": {
       "auth": { "port": 9099 },
       "firestore": { "port": 8082 },
       "functions": { "port": 5001 },
       "hosting": { "port": 5000 },
       "ui": { "port": 4000 }
     }
     ```
   - Check if any other services are using these ports
   - Try running `netstat -ano | findstr :<port>` to check port usage
   - Restart your computer if ports remain blocked

## License

This project is licensed under the MIT License.