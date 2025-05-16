import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaUsers, 
  FaVoteYea, 
  FaSpinner, 
  FaTimes, 
  FaHome, 
  FaWallet, 
  FaCheckCircle,
  FaUser,
  FaNetworkWired,
  FaExclamationTriangle
} from 'react-icons/fa';

const Elections = () => {
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(null);
  const [elections, setElections] = useState([]);
  const [electionCandidates, setElectionCandidates] = useState({});
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true); // Mock wallet connection
  const [account] = useState('0x1234567890abcdef1234567890abcdef12345678'); // Mock account
  const [networkName] = useState('Mock Network');
  const [isCorrectNetwork] = useState(true);
  const navigate = useNavigate();

  const loadMockData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockElections = [
        {
          id: 0,
          name: "Student Council Election 2025",
          description: "Vote for your student council representatives",
          endTime: Math.floor(new Date('2025-05-19T17:58:00+05:30').getTime() / 1000),
          isActive: true,
          totalVotes: 50
        }
      ];
      setElections(mockElections);

      const mockCandidates = {
        0: [
          { id: 0, name: "Alice Johnson", party: "Independent", voteCount: 20 },
          { id: 1, name: "Bob Smith", party: "Democratic Party", voteCount: 15 },
          { id: 2, name: "Clara Lee", party: "Republican Party", voteCount: 15 }
        ]
      };
      setElectionCandidates(mockCandidates);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isConnected) {
      loadMockData();
    } else {
      setLoading(false);
    }
  }, [isConnected, loadMockData]);

  const handleCandidateSelect = (electionId, candidateId) => {
    setSelectedCandidates(prev => ({
      ...prev,
      [electionId]: candidateId
    }));
  };

  const handleVote = (electionId) => {
    navigate(`/vote/${electionId}`);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredElections = elections.filter(election =>
    election.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    election.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getExpiryStatus = (endTime) => {
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = endTime - now;
    if (timeRemaining <= 0) {
      return { text: 'Expired', color: 'yellow' };
    } else if (timeRemaining < 86400) {
      return { text: 'Ending Soon', color: 'orange' };
    } else {
      return { text: 'Active', color: 'green' };
    }
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-96" role="status" aria-label="Loading elections">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <FaSpinner className="h-16 w-16 text-indigo-600" />
      </motion.div>
      <p className="mt-4 text-gray-600">Loading elections...</p>
    </div>
  );

  const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-96 text-center px-4">
      <FaExclamationTriangle className="h-16 w-16 text-red-500 mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <button 
        onClick={loadMockData}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 pb-12">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                <FaHome className="h-6 w-6" />
              </Link>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Active Elections</h1>
            </div>
            {isConnected && (
              <div className="flex items-center">
                <div className="mr-4 text-right hidden sm:block">
                  <p className="text-xs text-gray-500">Connected as:</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${isCorrectNetwork ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {networkName || 'Unknown Network'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search elections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search elections"
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <FaTimes className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </motion.div>
        
        <div className="mb-8">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorDisplay message={error} />
          ) : (
            <>
              {filteredElections.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg p-12 text-center"
                >
                  <p className="text-gray-500 text-lg">No elections found</p>
                  {searchTerm && (
                    <p className="text-gray-400 mt-2">
                      Try adjusting your search term or check back later for new elections
                    </p>
                  )}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredElections.map((election) => {
                    const status = getExpiryStatus(election.endTime);
                    return (
                      <motion.div
                        key={election.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{election.name}</h3>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full bg-${status.color}-100 text-${status.color}-800`}
                            >
                              {status.text}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">{election.description}</p>
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center text-sm text-gray-500">
                              <FaCalendarAlt className="mr-2 text-indigo-500" />
                              <span>Ends: {formatDate(election.endTime)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <FaUsers className="mr-2 text-indigo-500" />
                              <span>Total Votes: {election.totalVotes.toString()}</span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleVote(election.id)}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          >
                            <FaVoteYea className="mr-2 h-5 w-5" />
                            Cast Vote
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Elections;