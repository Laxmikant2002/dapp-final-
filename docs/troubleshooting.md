# Troubleshooting Guide

## Common Issues and Solutions

### 1. Wallet Connection Fails
- **Issue**: MetaMask is not detected.
- **Solution**: Ensure MetaMask is installed and the browser is refreshed.

### 2. Wrong Network
- **Issue**: The application shows a "Wrong Network" error.
- **Solution**: Switch to the correct network (e.g., Sepolia) in MetaMask.

### 3. Transaction Errors
- **Issue**: Transactions fail or are stuck.
- **Solution**: Ensure your wallet has sufficient funds for gas fees.

### 4. Contract Not Initialized
- **Issue**: The application cannot interact with the smart contract.
- **Solution**: Verify the contract address in `ContractContext.jsx` and redeploy if necessary.

### 5. Missing Election Data
- **Issue**: Elections or results are not displayed.
- **Solution**: Check the smart contract events and ensure the backend is functioning correctly.