// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoj80Wj8QgrvySEQP61lC_kagdTu9Q16Q",
  authDomain: "voting-system-3230f.firebaseapp.com",
  projectId: "voting-system-3230f",
  storageBucket: "voting-system-3230f.firebasestorage.app",
  messagingSenderId: "741171944370",
  appId: "1:741171944370:web:c001d5ac4ba10f2c4422ab",
  measurementId: "G-L8478YB51L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, analytics };

/*
SETUP INSTRUCTIONS:

1. Go to https://console.firebase.google.com/
2. Create a new project (e.g., "voting-dapp-college")
3. In Project Settings > General, scroll down to "Your apps"
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "voting-dapp-web")
6. Copy the firebaseConfig object and replace the above configuration
7. Enable Authentication:
   - Go to Authentication > Get Started
   - Enable Email/Password provider
8. Enable Firestore Database:
   - Go to Firestore Database > Create Database
   - Start in test mode
9. Enable Storage:
   - Go to Storage > Get Started
   - Start in test mode

DATABASE STRUCTURE:

users/
  ├── [userId]/
  │     ├── fullName: string
  │     ├── email: string
  │     ├── role: "admin" | "voter"
  │     ├── voterIdNumber: string
  │     ├── aadhaarNumber: string
  │     ├── isVerified: boolean
  │     └── createdAt: timestamp
  │
elections/
  ├── [electionId]/
  │     ├── name: string
  │     ├── description: string
  │     ├── startDate: timestamp
  │     ├── endDate: timestamp
  │     ├── status: "upcoming" | "active" | "ended"
  │     ├── createdBy: userId
  │     └── candidates/
  │           ├── [candidateId]/
  │           │     ├── fullName: string
  │           │     ├── partyName: string
  │           │     ├── description: string
  │           │     ├── voterIdNumber: string
  │           │     ├── aadhaarNumber: string
  │           │     ├── imageUrl: string
  │           │     └── partySymbolUrl: string
  │
votes/
  ├── [voteId]/
  │     ├── electionId: string
  │     ├── candidateId: string
  │     ├── voterId: string (hashed)
  │     ├── timestamp: timestamp
  │     └── transactionHash: string
  │
feedback/
  ├── [feedbackId]/
        ├── userId: string
        ├── electionId: string
        ├── rating: number
        ├── comment: string
        └── timestamp: timestamp

Security Rules:

// Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Elections
    match /elections/{electionId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Votes
    match /votes/{voteId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
    
    // Feedback
    match /feedback/{feedbackId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
  }
}

// Storage rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
*/ 