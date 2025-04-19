# Blockchain-Based Voting System

A decentralized voting application built with React, Solidity, and Firebase. This system allows users to create and participate in elections using blockchain technology for secure and transparent voting.

## Features

- User registration and authentication
- Admin dashboard for election management
- Secure voting using blockchain
- Real-time results tracking
- Firebase integration for user data management
- MetaMask wallet integration

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MetaMask browser extension
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/voting-dapp.git
cd voting-dapp
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
```

3. Set up environment variables:
Create a `.env` file in the client directory with the following variables:
```env
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_NETWORK_ID=31337
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Running the Project

1. Start the Hardhat network (in a new terminal):
```bash
npx hardhat node
```

2. Deploy the smart contract (in a new terminal):
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. Start the Firebase emulators (in a new terminal):
```bash
firebase emulators:start
```

4. Start the React development server (in a new terminal):
```bash
cd client
npm start
```

5. Configure MetaMask:
   - Open MetaMask
   - Add the Hardhat network:
     - Network Name: Hardhat
     - RPC URL: http://127.0.0.1:8545
     - Chain ID: 31337
     - Currency Symbol: ETH
   - Import the test account using the private key from the Hardhat node output

## Access Points

- React App: http://localhost:3000
- Firebase Emulator UI: http://127.0.0.1:4000
- Hardhat Network: http://127.0.0.1:8545

## Project Structure

```
voting-dapp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   ├── services/      # Firebase services
│   │   └── contracts/     # Contract ABIs
├── contracts/             # Solidity smart contracts
├── scripts/               # Deployment scripts
└── test/                  # Test files
```

## Features

### User Features
- Register with email and wallet
- Connect MetaMask wallet
- View available elections
- Cast votes
- View election results

### Admin Features
- Create new elections
- Add candidates
- Monitor voting progress
- View detailed results

## Testing

1. Run smart contract tests:
```bash
npx hardhat test
```

2. Run Firebase tests:
```bash
cd client
npm run test:firebase
```

## Troubleshooting

1. **MetaMask Connection Issues**
   - Ensure MetaMask is installed
   - Verify Hardhat network is added
   - Check if you're connected to the correct network

2. **Firebase Emulator Issues**
   - Check if emulators are running
   - Verify environment variables
   - Check Firebase console for errors

3. **Contract Deployment Issues**
   - Ensure Hardhat node is running
   - Check contract address in .env
   - Verify network configuration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
