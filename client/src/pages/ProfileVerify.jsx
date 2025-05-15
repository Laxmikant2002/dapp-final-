import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaIdCard, FaUser, FaVenusMars, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useContract } from '../context/ContractContext';
import { toast } from 'react-hot-toast';

const ProfileVerify = () => {
  const navigate = useNavigate();
  const { account } = useContract();
  const [loading, setLoading] = useState(true);
  const [profileVerified, setProfileVerified] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    email: '',
    phone: '',
    voterId: ''
  });

  useEffect(() => {
    // Simulate loading profile data
    const loadProfileData = async () => {
      if (!account) return;
      
      setLoading(true);
      try {
        // In a real app, we would fetch this data from a database or blockchain
        // For demo, we'll simulate a delay and provide sample data
        setTimeout(() => {
          setFormData({
            name: 'John Doe', // Pre-filled for demo
            gender: 'Male',
            email: 'john.doe@example.com',
            phone: '(555) 123-4567',
            voterId: 'VT' + account.substring(2, 10).toUpperCase()
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading profile data:', error);
        setLoading(false);
        toast.error('Failed to load profile data');
      }
    };

    loadProfileData();
  }, [account]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerifyProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate profile verification process
    setTimeout(() => {
      setProfileVerified(true);
      setLoading(false);
      toast.success('Profile verified successfully!');
    }, 1500);
  };

  const handleProceedToElections = () => {
    navigate('/elections');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Voter Profile Verification</h1>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile information...</p>
          </div>
        ) : profileVerified ? (
          <div className="text-center py-6">
            <div className="bg-green-100 text-green-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Profile Verified!</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your voter profile has been verified successfully. You can now participate in all active elections.
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
              onClick={handleProceedToElections}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-indigo-700 transition-colors"
            >
              Proceed to Elections <FaArrowRight className="ml-2" />
            </motion.button>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-gray-600 mb-6">
              Please verify your profile information before proceeding to elections.
            </p>
            
            <form onSubmit={handleVerifyProfile} className="space-y-6">
              {/* Wallet Address Display */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Your Wallet Address</h3>
                <p className="font-mono text-xs sm:text-sm break-all bg-white p-3 border rounded">
                  {account}
                </p>
              </div>
              
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaUser className="mr-2 text-indigo-500" /> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              {/* Gender Input */}
              <div>
                <label htmlFor="gender" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaVenusMars className="mr-2 text-indigo-500" /> Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaEnvelope className="mr-2 text-indigo-500" /> Email ID
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaPhone className="mr-2 text-indigo-500" /> Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              {/* Voter ID Input */}
              <div>
                <label htmlFor="voterId" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaIdCard className="mr-2 text-indigo-500" /> Voter ID
                </label>
                <input
                  type="text"
                  id="voterId"
                  name="voterId"
                  value={formData.voterId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  Verify Profile <FaCheckCircle className="ml-2" />
                </motion.button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileVerify; 