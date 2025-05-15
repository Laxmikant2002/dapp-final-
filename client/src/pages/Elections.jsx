import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useContract } from '../context/ContractContext';
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
  const { 
    contract, 
    account, 
    isConnected, 
    connectWallet, 
    isLoading: isWalletLoading,
    networkName,
    isCorrectNetwork,
    networkError
  } = useContract();
  
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(null); // Holds election ID that's being voted on
  const [elections, setElections] = useState([]);
  const [electionCandidates, setElectionCandidates] = useState({}); // Map election ID to candidates
  const [selectedCandidates, setSelectedCandidates] = useState({}); // Map election ID to selected candidate ID
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchCandidatesForElection = useCallback(async (electionId) => {
    try {
      const candidateCount = await contract.getCandidateCount(electionId);
      const candidates = [];
      
      for (let i = 0; i < candidateCount; i++) {
        const [id, name, party, voteCount] = await contract.getCandidate(electionId, i);
        candidates.push({ 
          id: Number(id), 
          name, 
          party, 
          voteCount: Number(voteCount) 
        });
      }
      
      setElectionCandidates(prev => ({
        ...prev,
        [electionId]: candidates
      }));
      
    } catch (error) {
      console.error(`Error fetching candidates for election ${electionId}:`, error);
    }
  }, [contract]);

  const fetchElections = useCallback(async () => {
    if (!contract) return;
    
    setLoading(true);
    setError(null);
    try {
      const count = await contract.electionCount();
      const electionList = [];
      
      for (let i = 0; i < count; i++) {
        try {
          const [id, name, description, endTime, isActive, totalVotes] = await contract.getElection(i);
          
          if (isActive) { // Only show active elections
            electionList.push({ 
              id, 
              name, 
              description, 
              endTime: Number(endTime), 
              isActive, 
              totalVotes: Number(totalVotes) 
            });
            
            // Fetch candidates for this election
            await fetchCandidatesForElection(id);
          }
        } catch (err) {
          console.error(`Error fetching election ${i}:`, err);
        }
      }
      
      setElections(electionList);
    } catch (error) {
      console.error('Error fetching elections:', error);
      setError('Failed to load elections. Please try again.');
      toast.error('Failed to load elections. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [contract, fetchCandidatesForElection]);

  useEffect(() => {
    if (isConnected) {
      fetchElections();
    } else {
      setLoading(false);
    }
  }, [isConnected, contract, fetchElections]);

  const handleCandidateSelect = (electionId, candidateId) => {
    setSelectedCandidates(prev => ({
      ...prev,
      [electionId]: candidateId
    }));
  };

  const handleVote = async (electionId) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    const candidateId = selectedCandidates[electionId];
    if (candidateId === undefined) {
      toast.error('Please select a candidate first');
      return;
    }

    setVotingLoading(electionId);
    try {
      const tx = await contract.castVote(electionId, candidateId);
      
      toast.promise(tx.wait(), {
        loading: 'Casting your vote...',
        success: 'Vote cast successfully!',
        error: 'Failed to cast vote'
      });
      
      await tx.wait();
      
      // Refresh election data
      await fetchElections();
      
      // Clear selection
      setSelectedCandidates(prev => {
        const updated = {...prev};
        delete updated[electionId];
        return updated;
      });
      
    } catch (error) {
      console.error('Error casting vote:', error);
      
      let errorMessage = 'Failed to cast vote';
      if (error.message.includes('already voted')) {
        errorMessage = 'You have already voted in this election';
      } else if (error.message.includes('not registered')) {
        errorMessage = 'You are not registered as a voter';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      }
      
      toast.error(errorMessage);
    } finally {
      setVotingLoading(null);
    }
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
    } else if (timeRemaining < 86400) { // Less than 1 day
      return { text: 'Ending Soon', color: 'orange' };
    } else {
      return { text: 'Active', color: 'green' };
    }
  };

  // Loading spinner component
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

  // Error display component
  const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-96 text-center px-4">
      <FaExclamationTriangle className="h-16 w-16 text-red-500 mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <button 
        onClick={fetchElections}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Wallet connection prompt
  const WalletConnectionPrompt = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto my-12 text-center"
    >
      <FaWallet className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
      <p className="text-gray-600 mb-6">
        Please connect your MetaMask wallet to view active elections and cast your vote.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={connectWallet}
        disabled={isWalletLoading}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
      >
        {isWalletLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Connecting...
          </>
        ) : (
          <>
            <FaWallet className="mr-2" />
            Connect Wallet
          </>
        )}
      </motion.button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 pb-12">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                <FaHome className="h-6 w-6" />
              </Link>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Active Elections</h1>
            </div>
            
            {isConnected ? (
              <div className="flex items-center">
                <div className="mr-4 text-right hidden sm:block">
                  <p className="text-xs text-gray-500">Connected as:</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isCorrectNetwork 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {networkName || 'Unknown Network'}
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                disabled={isWalletLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center"
              >
                {isWalletLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <FaWallet className="mr-2" />
                    Connect Wallet
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Network Error Banner */}
        {isConnected && networkError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {networkError}
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Search Bar */}
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
        
        {/* Main Content */}
        <div className="mb-8">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorDisplay message={error} />
          ) : !isConnected ? (
            <WalletConnectionPrompt />
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
                    const candidates = electionCandidates[election.id] || [];
                    const selectedCandidate = selectedCandidates[election.id];
                    const isVoting = votingLoading === election.id;
                    
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
                          
                          {/* Candidates Selection */}
                          {candidates.length > 0 ? (
                            <div className="mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select a candidate to vote:
                              </label>
                              <div className="space-y-2">
                                {candidates.map((candidate) => (
                                  <div
                                    key={candidate.id}
                                    onClick={() => !isVoting && handleCandidateSelect(election.id, candidate.id)}
                                    className={`p-3 border rounded-lg cursor-pointer flex items-center ${
                                      selectedCandidate === candidate.id
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-indigo-300'
                                    } ${isVoting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                  >
                                    <div className="flex-1">
                                      <p className="font-medium">{candidate.name}</p>
                                      <p className="text-sm text-gray-500">{candidate.party}</p>
                                    </div>
                                    {selectedCandidate === candidate.id && (
                                      <FaCheckCircle className="text-indigo-600 h-5 w-5" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                              <p className="text-gray-500">No candidates available</p>
                            </div>
                          )}
                          
                          {/* Vote Button */}
                          {candidates.length > 0 && (
                            <motion.button
                              whileHover={{ scale: isVoting ? 1 : 1.02 }}
                              whileTap={{ scale: isVoting ? 1 : 0.98 }}
                              onClick={() => handleVote(election.id)}
                              disabled={isVoting || !selectedCandidate}
                              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                                (isVoting || !selectedCandidate) ? 'opacity-70 cursor-not-allowed' : ''
                              }`}
                            >
                              {isVoting ? (
                                <>
                                  <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                                  Casting Vote...
                                </>
                              ) : (
                                <>
                                  <FaVoteYea className="mr-2 h-5 w-5" />
                                  Cast Vote
                                </>
                              )}
                            </motion.button>
                          )}
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