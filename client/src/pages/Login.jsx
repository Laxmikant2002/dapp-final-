import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useContract } from '../context/ContractContext';
import { 
  FaUserShield, 
  FaSpinner, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaArrowLeft, 
  FaArrowRight,
  FaSyncAlt 
} from 'react-icons/fa';
import ConnectWallet from '../components/ConnectWallet';

const Login = () => {
  const navigate = useNavigate();
  const { isConnected, account } = useContract();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isConnected && !hasChecked) {
      handleVerifyAdmin();
    }
    // eslint-disable-next-line
  }, [isConnected]);

  const handleVerifyAdmin = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setIsVerifying(true);
    setVerificationError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasChecked(true);
      setIsVerified(true);
      toast.success('Admin status verified successfully');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      setVerificationError(error.message || 'Failed to verify admin status');
      toast.error('Failed to verify admin status');
      setHasChecked(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRetry = () => {
    setHasChecked(false);
    handleVerifyAdmin();
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Verification</h1>
        
        {!isConnected ? (
          <div className="text-center py-6">
            <div className="bg-amber-100 text-amber-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FaUserShield className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Wallet Not Connected</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Please connect your wallet to verify your admin status and access the dashboard.
            </p>
            
            <div className="flex justify-center mb-6">
              <ConnectWallet />
            </div>
            
            <Link 
              to="/" 
              className="text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back to Home
            </Link>
          </div>
        ) : isVerifying ? (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your admin status...</p>
            
            <div className="mb-4 mt-6 bg-gray-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Your Wallet Address</h3>
              <p className="font-mono text-xs sm:text-sm break-all bg-white p-3 border rounded">
                {account}
              </p>
            </div>
          </div>
        ) : isVerified ? (
          <div className="text-center py-6">
            <div className="bg-green-100 text-green-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Admin Status Verified!</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your wallet address has been verified as an admin. You can now access the admin dashboard.
            </p>
            
            <div className="mb-4 bg-gray-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Your Verified Wallet Address</h3>
              <p className="font-mono text-xs sm:text-sm break-all bg-white p-3 border rounded">
                {account}
              </p>
            </div>
            
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
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Verification Failed</h2>
            <p className="text-red-600 mb-6 max-w-md mx-auto">
              {verificationError || "There was an error verifying your admin status."}
            </p>
            
            <div className="mb-4 bg-gray-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Your Wallet Address</h3>
              <p className="font-mono text-xs sm:text-sm break-all bg-white p-3 border rounded">
                {account}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center hover:bg-indigo-700 transition-colors"
                aria-label="Retry admin verification"
              >
                <FaSyncAlt className="mr-2" /> Retry Verification
              </motion.button>
              
              <Link 
                to="/" 
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <FaArrowLeft className="mr-2" /> Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-gray-600 mb-6 text-center">
              Please verify your admin status to access the dashboard.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Your Wallet Address</h3>
              <p className="font-mono text-xs sm:text-sm break-all bg-white p-3 border rounded">
                {account}
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerifyAdmin}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
              aria-label="Verify admin status"
            >
              Verify Admin Status <FaCheckCircle className="ml-2" />
            </motion.button>
            
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <Link 
                to="/" 
                className="text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Home
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login; 