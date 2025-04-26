# Setup Guide

This guide will walk you through setting up the development environment for the Voting DApp.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git
- Firebase CLI
- MetaMask browser extension

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/voting-dapp.git
cd voting-dapp
```

## Step 2: Install Dependencies

### Root Dependencies
```bash
npm install
```

### Client Dependencies
```bash
cd client
npm install
```

### Functions Dependencies
```bash
cd ../functions
npm install
```

## Step 3: Firebase Setup

1. Create a new Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup wizard

2. Enable required services:
   - Authentication
   - Firestore Database
   - Hosting

3. Initialize Firebase in your project:
```bash
firebase login
firebase init
```

During initialization, select:
- Authentication
- Firestore
- Hosting
- Functions (if needed)

## Step 4: Environment Configuration

1. Create `.env` file in the client directory:
```bash
cd client
cp .env.example .env
```

2. Update the following variables in `.env`:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 5: Development Setup

1. Start the development server:
```bash
cd client
npm start
```

2. Start Firebase emulators (optional):
```bash
firebase emulators:start
```

## Step 6: Testing the Setup

1. Open the application in your browser (http://localhost:3000)
2. Try to sign up with a new account
3. Verify that the Firebase emulator shows the new user
4. Check the browser console for any errors

## Common Setup Issues

1. **Firebase Authentication Not Working**
   - Verify API keys in `.env`
   - Check if Authentication is enabled in Firebase Console
   - Ensure Firebase emulator is running (if using)

2. **Dependency Installation Issues**
   - Clear node_modules and package-lock.json
   - Run `npm install` again
   - If issues persist, try `npm install --legacy-peer-deps`

3. **Environment Variables Not Loading**
   - Ensure `.env` file is in the correct directory
   - Check if variable names match the expected format
   - Restart the development server

## Next Steps

After completing the setup:
1. Review the [Developer Guide](developer-guide.md)
2. Check the [Security](security.md) documentation
3. Explore the [API Reference](api.md) 