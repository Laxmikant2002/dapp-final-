# Blockchain-based Voting DApp

A decentralized voting application built with Ethereum smart contracts and React.

## Features

- Secure and transparent voting system
- Admin dashboard for election management
- Real-time election results
- Voter registration and verification
- MetaMask integration
- Responsive design

## Tech Stack

- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React, TailwindCSS
- **Web3**: Ethers.js, MetaMask
- **Testing**: Hardhat Network

## Prerequisites

- Node.js (v14+)
- MetaMask Browser Extension
- Git

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/voting-dapp.git
cd voting-dapp
```

2. Install dependencies:
```bash
npm run install:all
```

3. Start local blockchain:
```bash
npx hardhat node
```

4. Deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

5. Start frontend:
```bash
npm run client
```

## Project Structure

```
voting-dapp/
├── contracts/           # Smart contracts
├── client/             # Frontend application
├── scripts/            # Deployment scripts
├── test/              # Contract tests
└── docs/              # Documentation
```

## Smart Contracts

### Vote.sol
Main voting contract with features:
- Election creation and management
- Voter registration
- Vote casting
- Results calculation

## Frontend Components

- **AdminDashboard**: Election management
- **Elections**: List active elections
- **CandidateDetails**: Candidate information and voting
- **Results**: Election results display

## Testing

### Local Development Testing

1. Start Hardhat Network:
```bash
npx hardhat node
```

2. Configure MetaMask:
- Network Name: Hardhat Local
- RPC URL: http://127.0.0.1:8545/
- Chain ID: 31337
- Currency Symbol: ETH

3. Import Test Accounts:
- Admin: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- Voter: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

4. Run Contract Tests:
```bash
npx hardhat test
```

5. Test Frontend:
```bash
cd client
npm test
```

### End-to-End Testing

1. Admin Flow:
- Connect admin account
- Create election
- Add candidates
- Monitor results
- End election

2. Voter Flow:
- Connect voter account
- Register as voter
- View elections
- Cast vote
- Verify vote

3. Edge Cases:
- Unregistered account voting
- Voting after election end
- Double voting attempt
- Network disconnection
- Invalid candidate selection

## Deployment

### Local Deployment
1. Start Hardhat node
2. Deploy contracts
3. Update frontend configuration
4. Test all functionalities

### Testnet Deployment
1. Configure environment variables
2. Deploy to testnet
3. Verify contract
4. Update frontend

See [deployment guide](docs/deployment-details.md) for detailed instructions.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@votingdapp.com or open an issue.

## Acknowledgments

- Hardhat team
- Ethereum community
- React team