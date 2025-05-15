import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import { useContract } from '../context/ContractContext';
import { 
  FaSpinner, 
  FaPlus, 
  FaStopCircle, 
  FaUserPlus, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaClock,
  FaPoll,
  FaSignOutAlt,
  FaEnvelope,
  FaUser,
  FaWallet,
  FaNetworkWired
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contract } = useContract();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // MetaMask connection states
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAccount, setWalletAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  
  // Individual loading states for different actions
  const [isCreatingElection, setIsCreatingElection] = useState(false);
  const [endingElectionId, setEndingElectionId] = useState(null);
  const [isRegisteringVoter, setIsRegisteringVoter] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endTime: ''
  });
  
  const [voterAddress, setVoterAddress] = useState('');
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [electionToEnd, setElectionToEnd] = useState(null);
  
  // Check if admin is logged in using session storage
  const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
  
  // Get admin email from location state or session storage
  const adminEmail = location.state?.email || sessionStorage.getItem('adminEmail') || 'admin@example.com';
  
  // Validate end time is in the future
  const [endTimeError, setEndTimeError] = useState('');
  
  // Validate ethereum address
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    // If not logged in, redirect to login page
    if (!isAdminLoggedIn) {
      toast.error('Please log in to access the admin dashboard');
      navigate('/login');
      return;
    }
    
    // Check if MetaMask is installed
    if (window.ethereum) {
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethersProvider);
      
      // Check if already connected
      ethersProvider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setWalletAccount(accounts[0]);
          fetchElections();
        } else {
          setIsWalletConnected(false);
          setLoading(false);
        }
      });
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setWalletAccount(accounts[0]);
          fetchElections();
        } else {
          setIsWalletConnected(false);
          setWalletAccount(null);
        }
      });
    } else {
      toast.error('MetaMask is not installed. Please install MetaMask to use this dApp.');
      setLoading(false);
    }
    
    return () => {
      // Clean up listeners
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminLoggedIn, navigate]);
  
  // Connect wallet function
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask is not installed. Please install MetaMask to use this dApp.');
      return;
    }
    
    try {
      setIsConnectingWallet(true);
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setIsWalletConnected(true);
        setWalletAccount(accounts[0]);
        toast.success('Wallet connected successfully!');
        
        // After connecting, fetch elections
        fetchElections();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      
      let errorMessage = 'Failed to connect wallet';
      if (error.code === 4001) {
        errorMessage = 'Wallet connection rejected by user';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Load mock elections for demo mode
  const loadMockElections = () => {
    setLoading(true);
    setTimeout(() => {
      const mockElections = [
        {
          id: 0,
          name: "Presidential Election 2023",
          description: "Vote for the next president of the country",
          startTime: Math.floor(Date.now() / 1000) - 86400,
          endTime: Math.floor(Date.now() / 1000) + 86400 * 3,
          isActive: true,
          totalVotes: 245
        },
        {
          id: 1,
          name: "Local Council Election",
          description: "Choose your local council representatives",
          startTime: Math.floor(Date.now() / 1000) - 86400 * 2,
          endTime: Math.floor(Date.now() / 1000) + 86400 * 5,
          isActive: true,
          totalVotes: 132
        },
        {
          id: 2,
          name: "School Board Election",
          description: "Select members for the district school board",
          startTime: Math.floor(Date.now() / 1000) - 86400 * 5,
          endTime: Math.floor(Date.now() / 1000) - 86400 * 1,
          isActive: false,
          totalVotes: 89
        }
      ];
      setElections(mockElections);
      setLoading(false);
    }, 1000); // Simulate network delay
  };

  // Refactored to be reusable
  const fetchElections = async () => {
    if (!contract || !isWalletConnected) return;
    
    setLoading(true);
    try {
      const count = await contract.electionCount();
      const electionList = [];
      
      for (let i = 0; i < count; i++) {
        try {
          const [id, name, description, startTime, endTime, isActive, totalVotes] = await contract.getElection(i);
          electionList.push({
            id,
            name,
            description,
            startTime: Number(startTime),
            endTime: Number(endTime),
            isActive,
            totalVotes: Number(totalVotes)
          });
        } catch (error) {
          console.error(`Error fetching election ${i}:`, error);
          // Continue with other elections even if one fails
        }
      }
      
      // Sort elections by active status and end time
      electionList.sort((a, b) => {
        // Active elections first
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        // Then sort by end time (most recent first)
        return b.endTime - a.endTime;
      });
      
      setElections(electionList);
    } catch (error) {
      console.error('Error fetching elections:', error);
      toast.error('Failed to load elections. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const validateEndTime = (dateTimeString) => {
    if (!dateTimeString) return 'End time is required';
    
    const endTimeDate = new Date(dateTimeString);
    const now = new Date();
    
    if (endTimeDate <= now) {
      return 'End time must be in the future';
    }
    
    return '';
  };
  
  const validateEthAddress = (address) => {
    if (!address) return 'Ethereum address is required';
    
    // Simple regex to validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return 'Invalid Ethereum address format';
    }
    
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for end time when editing
    if (name === 'endTime') {
      setEndTimeError('');
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    
    // Validate form
    const endTimeError = validateEndTime(formData.endTime);
    setEndTimeError(endTimeError);
    
    if (endTimeError) {
      toast.error(endTimeError);
      return;
    }
    
    if (!isWalletConnected) {
      toast.error('Please connect your wallet first to create an election');
      return;
    }
    
    if (!contract) {
      toast.error('Contract not available. Please check your connection.');
      return;
    }
    try {
      setIsCreatingElection(true);
      const endTime = Math.floor(new Date(formData.endTime).getTime() / 1000);
      const tx = await contract.createElection(formData.name, formData.description, endTime);
      
      toast.promise(tx.wait(), {
        loading: 'Creating election...',
        success: 'Election created successfully!',
        error: 'Failed to create election'
      });
      
      await tx.wait();
      setFormData({ name: '', description: '', endTime: '' });
      
      // Refresh elections list
      await fetchElections();
      
    } catch (error) {
      console.error('Error creating election:', error);
      let errorMessage = 'Failed to create election';
      
      // Extract more specific error messages
      if (error.message.includes('user rejected transaction')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsCreatingElection(false);
    }
  };
  
  const confirmEndElection = (election) => {
    setElectionToEnd(election);
    setShowEndConfirmation(true);
  };
  
  const cancelEndElection = () => {
    setShowEndConfirmation(false);
    setElectionToEnd(null);
  };
  
  const handleEndElection = async () => {
    if (!electionToEnd || !contract) {
      setShowEndConfirmation(false);
      return;
    }
    
    setEndingElectionId(electionToEnd.id);
    setShowEndConfirmation(false);
    
    try {
      const tx = await contract.endElection(electionToEnd.id);
      
      toast.promise(tx.wait(), {
        loading: 'Ending election...',
        success: 'Election ended successfully!',
        error: 'Failed to end election'
      });
      
      await tx.wait();
      
      // Refresh elections list after ending an election
      await fetchElections();
    } catch (error) {
      console.error('Error ending election:', error);
      let errorMessage = 'Failed to end election';
      
      // Extract more specific error messages
      if (error.message.includes('user rejected transaction')) {
        errorMessage = 'Transaction rejected by user';
      }
      
      toast.error(errorMessage);
    } finally {
      setEndingElectionId(null);
      setElectionToEnd(null);
    }
  };
  
  const handleRegisterVoter = async (e) => {
    e.preventDefault();
    
    // Validate address
    const error = validateEthAddress(voterAddress);
    setAddressError(error);
    
    if (error) {
      toast.error(error);
      return;
    }
    
    if (!isWalletConnected) {
      toast.error('Please connect your wallet first to register a voter');
      return;
    }
    
    if (!contract) {
      toast.error('Contract not available. Please check your connection.');
      return;
    }
    
    try {
      setIsRegisteringVoter(true);
      const tx = await contract.registerVoter(voterAddress);
      
      toast.promise(tx.wait(), {
        loading: 'Registering voter...',
        success: 'Voter registered successfully!',
        error: 'Failed to register voter'
      });
      
      await tx.wait();
      setVoterAddress('');
    } catch (error) {
      console.error('Error registering voter:', error);
      let errorMessage = 'Failed to register voter';
      
      // Extract more specific error messages
      if (error.message.includes('user rejected transaction')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message.includes('already registered')) {
        errorMessage = 'This address is already registered as a voter';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsRegisteringVoter(false);
    }
  };
  
  const handleLogout = () => {
    // Clear admin session data
    sessionStorage.removeItem('isAdminLoggedIn');
    sessionStorage.removeItem('adminEmail');
    
    // Redirect to login page
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center" role="status" aria-label="Loading elections">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-indigo-600 mb-4"
          >
            <FaSpinner className="h-12 w-12" />
          </motion.div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4">
      {/* Admin Header with Logout */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <motion.button 
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </motion.button>
      </div>
      
      {/* Welcome Card */}
      <div className="max-w-4xl mx-auto mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center">
            <div className="bg-indigo-100 text-indigo-600 rounded-full p-3 mr-4">
              <FaUser className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Welcome, Admin!</h2>
              <p className="text-gray-600">Logged in as: <span className="font-medium">{adminEmail}</span></p>
              <p className="text-sm text-gray-500 mt-1">From this dashboard, you can create elections, manage existing ones, and register voters.</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Create Election Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center mb-4">
            <FaPlus className="text-indigo-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Create New Election</h2>
          </div>
          
          <form onSubmit={handleCreateElection} className="space-y-4" aria-label="Create election form">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Election Name</label>
              <div className="relative rounded-md">
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  aria-required="true"
                  placeholder="Enter election name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
                aria-required="true"
                placeholder="Enter election description"
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                id="endTime"
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className={`block w-full px-4 py-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                  endTimeError ? 'border-red-300' : 'border-gray-200'
                }`}
                required
                aria-required="true"
                aria-invalid={endTimeError ? "true" : "false"}
                aria-describedby={endTimeError ? "endTime-error" : undefined}
              />
              {endTimeError && (
                <p id="endTime-error" className="mt-1 text-sm text-red-600">{endTimeError}</p>
              )}
            </div>
            
            <motion.button
              type="submit"
              disabled={isCreatingElection}
              whileHover={{ scale: isCreatingElection ? 1 : 1.02 }}
              whileTap={{ scale: isCreatingElection ? 1 : 0.98 }}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                isCreatingElection ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              aria-label={isCreatingElection ? 'Creating election...' : 'Create election'}
            >
              {isCreatingElection ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                  Create Election
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Voter Registration Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center mb-4">
            <FaUserPlus className="text-indigo-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Register New Voter</h2>
          </div>
          
          <form onSubmit={handleRegisterVoter} className="space-y-4">
            <div>
              <label htmlFor="voterAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Voter Wallet Address
              </label>
              <input
                type="text"
                id="voterAddress"
                value={voterAddress}
                onChange={(e) => {
                  setVoterAddress(e.target.value);
                  setAddressError('');
                }}
                className={`block w-full px-4 py-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                  addressError ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="0x..."
                required
                aria-invalid={addressError ? "true" : "false"}
                aria-describedby={addressError ? "address-error" : undefined}
              />
              {addressError && (
                <p id="address-error" className="mt-1 text-sm text-red-600">{addressError}</p>
              )}
            </div>
            
            <motion.button
              type="submit"
              disabled={isRegisteringVoter}
              whileHover={{ scale: isRegisteringVoter ? 1 : 1.02 }}
              whileTap={{ scale: isRegisteringVoter ? 1 : 0.98 }}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                isRegisteringVoter ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              aria-label={isRegisteringVoter ? 'Registering voter...' : 'Register voter'}
            >
              {isRegisteringVoter ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Registering...
                </>
              ) : (
                <>
                  <FaUserPlus className="-ml-1 mr-2 h-5 w-5" />
                  Register Voter
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Elections List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center mb-6">
            <FaPoll className="text-indigo-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Manage Elections</h2>
          </div>
          
          {elections.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 font-medium">No elections found</p>
              <p className="text-sm text-gray-400 mt-2">Create your first election using the form above</p>
            </div>
          ) : (
            <div className="space-y-6">
              {elections.map((election) => {
                const now = Math.floor(Date.now() / 1000);
                const isEnding = endingElectionId === election.id;
                const timeRemaining = election.endTime - now;
                const isExpired = timeRemaining <= 0;
                
                // Status determination with colors
                let statusColor = 'green';
                let statusText = 'Active';
                
                if (!election.isActive) {
                  statusColor = 'red';
                  statusText = 'Ended';
                } else if (isExpired) {
                  statusColor = 'orange';
                  statusText = 'Time Expired';
                }
                
                return (
                  <motion.div 
                    key={election.id} 
                    whileHover={{ scale: 1.01 }}
                    className="border border-gray-200 rounded-lg p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-medium text-gray-900">{election.name}</h3>
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full bg-${statusColor}-100 text-${statusColor}-800`}
                            role="status"
                            aria-label={`Election status: ${statusText}`}
                          >
                            {statusText}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mt-2">{election.description}</p>
                        
                        <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaClock className="mr-1 text-gray-400" />
                            <span>
                              Ends: {new Date(election.endTime * 1000).toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <FaCheckCircle className="mr-1 text-gray-400" />
                            <span>
                              Votes: {election.totalVotes.toString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {election.isActive && (
                      <div className="mt-5">
                        <motion.button
                          onClick={() => confirmEndElection(election)}
                          disabled={isEnding}
                          whileHover={{ scale: isEnding ? 1 : 1.02 }}
                          whileTap={{ scale: isEnding ? 1 : 0.98 }}
                          className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${
                            isEnding ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                          aria-label={`End election: ${election.name}`}
                        >
                          {isEnding ? (
                            <>
                              <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                              Ending Election...
                            </>
                          ) : (
                            <>
                              <FaStopCircle className="-ml-1 mr-2 h-5 w-5" />
                              End Election
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Confirmation Modal for Ending Election */}
      {showEndConfirmation && electionToEnd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">End Election?</h3>
            <p className="text-gray-600 mb-3">
              Are you sure you want to end the election:
            </p>
            <p className="font-medium text-gray-900 p-4 bg-gray-100 rounded-lg mb-4">
              "{electionToEnd.name}"
            </p>
            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone. Once ended, voting will no longer be possible.
            </p>
            
            <div className="flex space-x-4 justify-end">
              <motion.button
                onClick={cancelEndElection}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleEndElection}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                End Election
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;