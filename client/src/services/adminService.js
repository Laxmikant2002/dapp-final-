// Mock admin email list - in a real application, this would be stored in a database
const ADMIN_EMAILS = [
  'admin@example.com',
  'admin@votingapp.com'
];

export const checkAdminStatus = async (email) => {
  try {
    // In a real application, this would make an API call to verify admin status
    return ADMIN_EMAILS.includes(email.toLowerCase());
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}; 