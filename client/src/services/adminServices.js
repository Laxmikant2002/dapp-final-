import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// List of authorized admin emails
const AUTHORIZED_ADMINS = [
  'admin@voting.com',
  'supervisor@voting.com'
];

export const isAuthorizedAdmin = (email) => {
  return AUTHORIZED_ADMINS.includes(email.toLowerCase());
};

export const adminLogin = async (email, password) => {
  // In a real application, this would make an API call to verify credentials
  // For demo purposes, we're just checking against the authorized list
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  if (!isAuthorizedAdmin(email)) {
    throw new Error('Unauthorized access. This email is not registered as an admin.');
  }

  // For demo purposes, we're using a simple password check
  // In production, you would verify against hashed passwords in a secure database
  if (password !== 'admin123') { // This is just for demonstration
    throw new Error('Invalid credentials');
  }

  // Return admin data
  return {
    email,
    role: 'admin',
    token: 'demo-token' // In production, this would be a real JWT token
  };
};

export const verifyAdminToken = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const currentUser = auth.currentUser;

    if (!token || !currentUser) {
      return false;
    }

    // Verify token format
    const [prefix, uid] = token.split('-');
    if (prefix !== 'admin' || uid !== currentUser.uid) {
      return false;
    }

    // Verify admin status in Firestore
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    return userDoc.exists() && userDoc.data().isAdmin === true;
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
}; 