import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

export const testFirebaseConnection = async () => {
  try {
    // Initialize Firebase if not already initialized
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Try to access a collection to test the connection
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    throw new Error('Failed to connect to Firebase: ' + error.message);
  }
};

export const testFirebaseAuth = async () => {
  console.log('🔍 Starting Firebase connection test...\n');

  try {
    // Test Auth connection
    console.log('\nTesting Authentication...');
    const testEmail = 'test@example.com';
    const testPassword = 'test123456';
    
    try {
      // Try to create a test user
      const app = initializeApp(firebaseConfig);
      const auth = app.auth();
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('✅ Auth connection successful');

      // Sign out the test user
      await signOut(auth);
      console.log('✅ Auth sign out successful');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // If user exists, try to sign in
        const auth = initializeApp(firebaseConfig).auth();
        await signInWithEmailAndPassword(auth, testEmail, testPassword);
        console.log('✅ Auth connection successful (existing user)');
        
        // Sign out
        await signOut(auth);
        console.log('✅ Auth sign out successful');
      } else {
        throw error;
      }
    }

    console.log('\n✨ All Firebase connections tested successfully!');
    return true;

  } catch (error) {
    console.error('\n❌ Firebase connection test failed:', error.message);
    return false;
  }
}; 