import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { registerUser, checkVoterStatus } from '../services/firebaseService';

const Register = () => {
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const [formData, setFormData] = useState({
    fullName: '',
    voterId: '',
    dateOfBirth: '',
    aadhaarNumber: '',
    livingAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (account) {
        try {
          const status = await checkVoterStatus(account);
          if (status.status === 'not_registered') {
            // Clear any existing error if user is not registered
            setError('');
          } else {
            // If user is already registered, show appropriate message based on status
            switch (status.status) {
              case 'pending':
                setRegistrationStatus({ status: 'pending' });
                break;
              case 'approved':
                setRegistrationStatus({ status: 'approved' });
                break;
              case 'rejected':
                setRegistrationStatus({ 
                  status: 'rejected',
                  rejectionReason: status.rejectionReason 
                });
                break;
              default:
                setError('This wallet address is already registered.');
            }
          }
        } catch (error) {
          console.error('Error checking registration status:', error);
          setError('Error checking registration status. Please try again.');
        }
      } else {
        setError('Please connect your wallet to register.');
      }
    };
    checkStatus();
  }, [account]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchAccount = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{
          eth_accounts: {}
        }]
      });
    } catch (error) {
      console.error('Error switching account:', error);
      setError('Failed to switch account. Please try manually switching accounts in MetaMask.');
    }
  };

  const validateForm = () => {
    if (!account) {
      setError('Please connect your wallet first');
      return false;
    }

    if (!formData.fullName || !formData.voterId || !formData.dateOfBirth || 
        !formData.aadhaarNumber || !formData.livingAddress) {
      setError('All fields are required');
      return false;
    }

    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(formData.aadhaarNumber)) {
      setError('Aadhaar number must be 12 digits');
      return false;
    }

    const voterIdRegex = /^[A-Z]{3}[0-9]{7}$/;
    if (!voterIdRegex.test(formData.voterId)) {
      setError('Voter ID must be in format ABC1234567');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData, account);
      setRegistrationStatus({ status: 'pending' });
      navigate('/pending-approval');
    } catch (error) {
      console.error('Error during registration:', error);
      if (error.message.includes('already registered')) {
        setError('This wallet address is already registered. Please use a different wallet or check your registration status.');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (registrationStatus?.status === 'approved') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Approved</h2>
          <p className="text-gray-600">Your voter registration has been approved. You can now participate in elections.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (registrationStatus?.status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-yellow-600 mb-4 text-center">Registration Pending</h2>
          <p className="text-gray-600 text-center mb-8">Your registration is under review. Please wait for admin approval.</p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/elections')}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
            >
              View Elections
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
            >
              Return to Home
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">
            You can view elections while your registration is being processed.
          </p>
        </div>
      </div>
    );
  }

  if (registrationStatus?.status === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Registration Rejected</h2>
          <p className="text-gray-600 mb-2">Your registration was rejected for the following reason:</p>
          <p className="text-gray-800 font-medium">{registrationStatus.rejectionReason}</p>
          <button
            onClick={() => setRegistrationStatus(null)}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (error && error.includes('already registered')) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Address Already Registered</h2>
          <p className="text-gray-600 mb-6">
            This wallet address is already registered. Please use a different wallet address to register as a new voter.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleSwitchAccount}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Switch MetaMask Account
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Voter Registration</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Voter ID</label>
              <input
                type="text"
                name="voterId"
                value={formData.voterId}
                onChange={handleInputChange}
                placeholder="ABC1234567"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhaar Card Number</label>
              <input
                type="text"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleInputChange}
                placeholder="12-digit number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Living Address</label>
            <textarea
              name="livingAddress"
              value={formData.livingAddress}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register; 