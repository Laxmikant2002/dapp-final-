import { db, auth } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const testFirebaseConnection = async () => {
  console.log('🔍 Starting Firebase connection test...\n');

  try {
    // Test Firestore connection
    console.log('Testing Firestore connection...');
    const testCollection = collection(db, 'test');
    const testDoc = await addDoc(testCollection, {
      test: 'connection',
      timestamp: new Date()
    });
    console.log('✅ Firestore connection successful');

    // Test document retrieval
    console.log('\nTesting document operations...');
    const querySnapshot = await getDocs(testCollection);
    const docs = querySnapshot.docs.map(doc => doc.data());
    console.log('✅ Document operations successful');

    // Clean up test document
    console.log('\nCleaning up test data...');
    await deleteDoc(doc(db, 'test', testDoc.id));
    console.log('✅ Cleanup successful');

    // Test Auth connection
    console.log('\nTesting Authentication...');
    const testEmail = 'test@example.com';
    const testPassword = 'test123456';
    
    try {
      // Try to create a test user
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('✅ Auth connection successful');

      // Sign out the test user
      await signOut(auth);
      console.log('✅ Auth sign out successful');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // If user exists, try to sign in
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