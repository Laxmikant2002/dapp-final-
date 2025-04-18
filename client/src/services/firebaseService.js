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
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../config/firebase';

// User Management
export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      email,
      createdAt: serverTimestamp(),
      isVerified: false
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
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
    const election = await addDoc(collection(db, 'elections'), {
      ...electionData,
      createdAt: serverTimestamp(),
      status: 'upcoming'
    });
    return election.id;
  } catch (error) {
    throw error;
  }
};

export const getElections = async () => {
  try {
    const electionsQuery = query(
      collection(db, 'elections'),
      orderBy('startDate', 'desc')
    );
    const querySnapshot = await getDocs(electionsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const getElectionById = async (electionId) => {
  try {
    const electionDoc = await getDoc(doc(db, 'elections', electionId));
    return electionDoc.exists() ? { id: electionDoc.id, ...electionDoc.data() } : null;
  } catch (error) {
    throw error;
  }
};

// Candidate Management
export const addCandidate = async (electionId, candidateData) => {
  try {
    // Upload candidate image
    const imageRef = ref(storage, `candidates/${electionId}/${Date.now()}_photo.jpg`);
    await uploadBytes(imageRef, candidateData.image);
    const imageUrl = await getDownloadURL(imageRef);

    // Upload party symbol
    const symbolRef = ref(storage, `parties/${electionId}/${Date.now()}_symbol.jpg`);
    await uploadBytes(symbolRef, candidateData.partySymbol);
    const partySymbolUrl = await getDownloadURL(symbolRef);

    const candidateRef = await addDoc(
      collection(db, 'elections', electionId, 'candidates'),
      {
        ...candidateData,
        imageUrl,
        partySymbolUrl,
        createdAt: serverTimestamp()
      }
    );
    return candidateRef.id;
  } catch (error) {
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