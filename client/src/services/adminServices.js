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

export const verifyAdminToken = () => {
  // In a real application, this would verify the JWT token
  // For demo purposes, we're just checking if the token exists
  const token = localStorage.getItem('adminToken');
  const adminEmail = localStorage.getItem('adminEmail');
  
  if (!token || !adminEmail) {
    return false;
  }

  return isAuthorizedAdmin(adminEmail);
}; 