import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  connectFirestoreEmulator
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  connectAuthEmulator
} from 'firebase/auth';
import { db, auth } from '../config/firebase';

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8081);
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (error) {
    console.warn('Error connecting to emulators:', error);
  }
}

// Helper function to handle Firestore errors
const handleFirestoreError = (error) => {
  console.error('Firestore error:', error);
  
  switch (error.code) {
    case 'permission-denied':
      throw new Error('You do not have permission to perform this action');
    case 'unauthenticated':
      throw new Error('Please sign in to continue');
    case 'unavailable':
      throw new Error('Service temporarily unavailable. Please try again later');
    case 'failed-precondition':
      throw new Error('Operation failed. Please check your connection');
    default:
      throw new Error(error.message || 'An error occurred while accessing the database');
  }
};

// User Management
export const registerUser = async (email, password, userData, ethAddress) => {
  try {
    // Check if user already exists
    const userQuery = query(
      collection(db, 'users'),
      where('email', '==', email)
    );
    const querySnapshot = await getDocs(userQuery);
    
    if (!querySnapshot.empty) {
      throw new Error('User already registered with this email');
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      ...userData,
      email: email,
      ethAddress: ethAddress,
      createdAt: serverTimestamp(),
      isAdmin: userData.role === 'admin',
      isVerified: false
    });

    return {
      id: user.uid,
      email: user.email,
      ...userData
    };
  } catch (error) {
    handleFirestoreError(error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    return {
      ...userCredential.user,
      ...userDoc.data()
    };
  } catch (error) {
    if (error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password');
    }
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    throw error;
  }
};

// Election Management
export const createElection = async (electionData) => {
  try {
    const electionsRef = collection(db, 'elections');
    const newElection = {
      ...electionData,
      createdAt: Timestamp.now(),
      status: 'active',
      totalVotes: 0,
      registeredVoters: 0
    };
    const docRef = await addDoc(electionsRef, newElection);
    return { id: docRef.id, ...newElection };
  } catch (error) {
    console.error('Error creating election:', error);
    throw error;
  }
};

export const getElections = async () => {
  try {
    const electionsRef = collection(db, 'elections');
    const q = query(electionsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting elections:', error);
    throw error;
  }
};

export const getElectionById = async (electionId) => {
  try {
    const electionRef = doc(db, 'elections', electionId);
    const electionDoc = await getDoc(electionRef);
    if (electionDoc.exists()) {
      return { id: electionDoc.id, ...electionDoc.data() };
    }
    throw new Error('Election not found');
  } catch (error) {
    console.error('Error getting election:', error);
    throw error;
  }
};

// Candidate Management
export const addCandidateToElection = async (electionId, candidateData) => {
  try {
    const candidatesRef = collection(db, 'elections', electionId, 'candidates');
    const newCandidate = {
      ...candidateData,
      voteCount: 0,
      createdAt: Timestamp.now()
    };
    const docRef = await addDoc(candidatesRef, newCandidate);
    return { id: docRef.id, ...newCandidate };
  } catch (error) {
    console.error('Error adding candidate:', error);
    throw error;
  }
};

export const getCandidates = async (electionId) => {
  try {
    const candidatesRef = collection(db, 'elections', electionId, 'candidates');
    const querySnapshot = await getDocs(candidatesRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting candidates:', error);
    throw error;
  }
};

// Vote Management
export const castVote = async (electionId, candidateId, voterId, transactionHash) => {
  try {
    await addDoc(collection(db, 'votes'), {
      electionId,
      candidateId,
      voterId,
      transactionHash,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

export const checkIfUserVoted = async (electionId, voterId) => {
  try {
    const votesQuery = query(
      collection(db, 'votes'),
      where('electionId', '==', electionId),
      where('voterId', '==', voterId)
    );
    const querySnapshot = await getDocs(votesQuery);
    return !querySnapshot.empty;
  } catch (error) {
    throw error;
  }
};

// Feedback Management
export const submitFeedback = async (feedbackData) => {
  try {
    await addDoc(collection(db, 'feedback'), {
      ...feedbackData,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

export const getFeedbackByElection = async (electionId) => {
  try {
    const feedbackQuery = query(
      collection(db, 'feedback'),
      where('electionId', '==', electionId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(feedbackQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

// Voter Management
export const registerVoterForElection = async (electionId, ethAddress) => {
  try {
    const voterRef = doc(db, 'voters', ethAddress);
    const voterDoc = await getDoc(voterRef);
    
    if (!voterDoc.exists()) {
      throw new Error('Voter not found');
    }

    // Update voter's registered elections
    await setDoc(voterRef, {
      ...voterDoc.data(),
      registeredElections: [...voterDoc.data().registeredElections, electionId]
    }, { merge: true });

    // Update election's registered voters count
    const electionRef = doc(db, 'elections', electionId);
    const electionDoc = await getDoc(electionRef);
    
    if (electionDoc.exists()) {
      await setDoc(electionRef, {
        ...electionDoc.data(),
        registeredVoters: (electionDoc.data().registeredVoters || 0) + 1
      }, { merge: true });
    }

    return true;
  } catch (error) {
    console.error('Error registering voter for election:', error);
    throw error;
  }
};

export const getVoterByAddress = async (ethAddress) => {
  try {
    const voterDoc = await getDoc(doc(db, 'voters', ethAddress));
    return voterDoc.exists() ? { id: voterDoc.id, ...voterDoc.data() } : null;
  } catch (error) {
    console.error('Error getting voter:', error);
    throw error;
  }
};

export const getVoterElections = async (ethAddress) => {
  try {
    const voterDoc = await getDoc(doc(db, 'voters', ethAddress));
    if (!voterDoc.exists()) {
      return [];
    }

    const registeredElections = voterDoc.data().registeredElections || [];
    const elections = await Promise.all(
      registeredElections.map(electionId => getElectionById(electionId))
    );

    return elections.filter(Boolean); // Remove any null values
  } catch (error) {
    console.error('Error getting voter elections:', error);
    throw error;
  }
};

// Admin Management
export const verifyAdminCredentials = async (email, password) => {
  try {
    // Try to sign in with admin credentials
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if user exists in Firestore and is an admin
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists() || !userDoc.data().isAdmin) {
      throw new Error('User is not an admin');
    }
    
    return true;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      // Admin doesn't exist, create it
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create admin user document
        await setDoc(doc(db, 'users', user.uid), {
          email,
          isAdmin: true,
          createdAt: serverTimestamp()
        });
        
        return true;
      } catch (createError) {
        console.error('Error creating admin:', createError);
        return false;
      }
    }
    console.error('Error verifying admin:', error);
    return false;
  }
};

export const setupAdminAccount = async () => {
  try {
    if (!auth || !db) {
      throw new Error('Firebase services are not initialized');
    }

    console.log('Checking admin account setup');
    
    // Check if admin exists
    const adminQuery = query(
      collection(db, 'users'),
      where('isAdmin', '==', true)
    );
    const querySnapshot = await getDocs(adminQuery);
    
    if (querySnapshot.empty) {
      console.log('Creating default admin account');
      
      // Create default admin account
      const adminData = {
        email: 'admin@voting.com',
        password: 'Admin@123',
        fullName: 'System Admin',
        isAdmin: true,
        isVerified: true,
        createdAt: serverTimestamp()
      };

      try {
        // Create admin user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          adminData.email,
          adminData.password
        );
        console.log('Admin user created in Firebase Auth');

        // Create admin document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          ...adminData,
          uid: userCredential.user.uid
        });
        console.log('Admin document created in Firestore');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log('Admin user exists, signing in to create document');
          const userCredential = await signInWithEmailAndPassword(
            auth,
            adminData.email,
            adminData.password
          );
          
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            ...adminData,
            uid: userCredential.user.uid
          }, { merge: true });
        } else {
          throw error;
        }
      }
    } else {
      console.log('Admin account already exists');
    }
  } catch (error) {
    console.error('Error in admin setup:', error);
    throw error;
  }
};

const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'Invalid email address';
    case 'auth/wrong-password':
      return 'Invalid password';
    case 'auth/invalid-email':
      return 'Invalid email format';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection';
    case 'auth/internal-error':
      return 'Internal authentication error. Please try again';
    default:
      return error.message || 'Authentication failed';
  }
}; 