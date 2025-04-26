# Voting DApp

A decentralized voting application built with React, Firebase, and Web3 technologies.

## Features

- Secure user authentication
- Admin dashboard for election management
- Real-time election status updates
- Transparent voting process
- Blockchain-based vote verification
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase CLI
- MetaMask or other Web3 wallet
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

# Install functions dependencies
cd ../functions
npm install
```

3. Configure Firebase:
- Create a new Firebase project
- Enable Authentication, Firestore, and Hosting
- Update the Firebase configuration in `client/src/config/firebase.js`

4. Configure environment variables:
```bash
# Create .env file in client directory
cd client
cp .env.example .env
# Update the values in .env file
```

## Development

1. Start the development server:
```bash
cd client
npm start
```

2. Start Firebase emulators (optional):
```bash
firebase emulators:start
```

## Deployment

1. Build the client application:
```bash
cd client
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

## Security Considerations

- All Firestore rules are configured to ensure data security
- Admin access is strictly controlled
- Votes are immutable once cast
- User authentication is required for all operations

## Troubleshooting

### Common Issues

1. **Firebase Authentication Issues**
   - Ensure Firebase project is properly configured
   - Check if Authentication is enabled in Firebase Console
   - Verify API keys in configuration

2. **Web3 Connection Issues**
   - Ensure MetaMask is installed and connected
   - Check if the correct network is selected
   - Verify contract address is correct

3. **Build Issues**
   - Clear node_modules and reinstall dependencies
   - Check for version conflicts in package.json
   - Ensure all environment variables are set

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.