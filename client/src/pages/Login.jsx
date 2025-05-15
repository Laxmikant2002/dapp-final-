import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FaUserShield, 
  FaSpinner, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaArrowLeft, 
  FaArrowRight,
  FaSyncAlt,
  FaEnvelope,
  FaLock
} from 'react-icons/fa';

// Hardcoded admin credentials for demo
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setVerificationError('Please enter both email and password');
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsVerifying(true);
    setVerificationError(null);
    
    try {
      // Simulate verification delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check against hardcoded credentials
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        setIsVerified(true);
        toast.success('Login successful!');
        
        // Store login status in session storage (for demo only)
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        setVerificationError('Invalid email or password');
        toast.error('Invalid email or password');
      }
    } catch (error) {
      setVerificationError(error.message || 'Login failed');
      toast.error('Login failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRetry = () => {
    setVerificationError(null);
    setEmail('');
    setPassword('');
  };

  const handleProceedToDashboard = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
        
        {isVerifying ? (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your credentials...</p>
          </div>
        ) : isVerified ? (
          <div className="text-center py-6">
            <div className="bg-green-100 text-green-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Login Successful!</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You have been verified as an admin. You can now access the admin dashboard.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProceedToDashboard}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-indigo-700 transition-colors"
            >
              Proceed to Dashboard <FaArrowRight className="ml-2" />
            </motion.button>
          </div>
        ) : verificationError ? (
          <div className="text-center py-6">
            <div className="bg-red-100 text-red-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FaTimesCircle className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Access Denied</h2>
            <p className="text-red-600 mb-6 max-w-md mx-auto">
              {verificationError || "Invalid credentials. Please try again."}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center hover:bg-indigo-700 transition-colors"
                aria-label="Retry admin verification"
              >
                <FaSyncAlt className="mr-2" /> Try Again
              </motion.button>
              
              <Link 
                to="/" 
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <FaArrowLeft className="mr-2" /> Back to Home
              </Link>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-700">
                <strong>Demo Credentials:</strong> Use email "admin@example.com" and password "admin123"
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="bg-indigo-100 text-indigo-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaUserShield className="w-10 h-10" />
              </div>
              <p className="text-gray-600">
                Please enter your admin credentials to access the dashboard.
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex justify-center items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  aria-label="Login"
                >
                  Login <FaArrowRight className="ml-2" />
                </motion.button>
              </div>
            </form>
            
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <Link 
                to="/" 
                className="text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Home
              </Link>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-700 text-center">
                <strong>Demo Credentials:</strong> Use email "admin@example.com" and password "admin123"
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login; 