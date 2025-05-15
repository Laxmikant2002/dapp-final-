import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useContract } from '../context/ContractContext';
import { 
  FaSpinner, 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaVoteYea, 
  FaHome,
  FaWallet,
  FaExclamationTriangle,
  FaUser,
  FaUsers
} from 'react-icons/fa';

const Vote = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { 
    contract, 
    account, 
    isConnected, 
    connectWallet, 
    isLoading: isWalletLoading 
  } = useContract();
  
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const fetchElectionData = useCallback(async () => {
    if (!contract) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get election details
      const [id, name, description, endTime, isActive, totalVotes] = await contract.getElection(electionId);
      
      setElection({
        id: Number(id),
        name,
        description,
        endTime: Number(endTime),
        isActive,
        totalVotes: Number(totalVotes)
      });
      
      // Get candidates
      await fetchCandidates();
    } catch (error) {
      console.error('Error fetching election data:', error);
      setError('Failed to load election data. Please try again.');
      toast.error('Failed to load election data');
    } finally {
      setLoading(false);
    }
  }, [contract, electionId]);
  
  const fetchCandidates = async () => {
    try {
      const candidateCount = await contract.getCandidateCount(electionId);
      const candidatesList = [];
      
      for (let i = 0; i < candidateCount; i++) {
        const [id, name, party, voteCount] = await contract.getCandidate(electionId, i);
        candidatesList.push({
          id: Number(id),
          name,
          party,
          voteCount: Number(voteCount)
        });
      }
      
      setCandidates(candidatesList);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to load candidates');
    }
  };

  useEffect(() => {
    if (isConnected && contract) {
      fetchElectionData();
    }
  }, [isConnected, contract, fetchElectionData]);

  const handleVote = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }
    
    if (!election || !election.isActive) {
      toast.error('This election is not active');
      return;
    }
    
    setVotingLoading(true);
    try {
      const tx = await contract.castVote(electionId, selectedCandidate);
      
      toast.promise(tx.wait(), {
        loading: 'Casting your vote...',
        success: 'Vote cast successfully!',
        error: 'Failed to cast vote'
      });
      
      await tx.wait();
      
      // Show success message and navigate back to elections page
      setTimeout(() => {
        navigate('/elections');
      }, 2000);
      
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
      setVotingLoading(false);
    }
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

  const getElectionStatus = () => {
    if (!election) return { text: 'Unknown', color: 'gray' };
    
    if (!election.isActive) {
      return { text: 'Ended', color: 'red' };
    }
    
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = election.endTime - now;
    
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
    <div className="flex flex-col items-center justify-center h-96" role="status" aria-label="Loading election">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <FaSpinner className="h-16 w-16 text-indigo-600" />
      </motion.div>
      <p className="mt-4 text-gray-600">Loading election details...</p>
    </div>
  );

  // Error display component
  const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-96 text-center px-4">
      <FaExclamationTriangle className="h-16 w-16 text-red-500 mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchElectionData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/elections')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back to Elections
        </motion.button>
      </div>
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
        Please connect your MetaMask wallet to view this election and cast your vote.
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

  const status = getElectionStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/elections" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <FaArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Elections</span>
          </Link>
          
          {isConnected && (
            <div className="flex items-center">
              <div className="mr-4 text-right hidden sm:block">
                <p className="text-xs text-gray-500">Connected as:</p>
                <p className="text-sm font-medium text-gray-900 font-mono">
                  {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </p>
              </div>
              <Link 
                to="/"
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <FaHome className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorDisplay message={error} />
        ) : !isConnected ? (
          <WalletConnectionPrompt />
        ) : election ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Election details section */}
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{election.name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold bg-${status.color}-100 text-${status.color}-800`}
                >
                  {status.text}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{election.description}</p>
              
              <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-8">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1 text-indigo-500" />
                  <span>Ends: {formatDate(election.endTime)}</span>
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-1 text-indigo-500" />
                  <span>Total Votes: {election.totalVotes}</span>
                </div>
              </div>
              
              {/* Candidates section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Select your candidate
                </h3>
                
                {candidates.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No candidates available for this election</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {candidates.map((candidate) => (
                      <motion.div
                        key={candidate.id}
                        whileHover={{ scale: !election.isActive ? 1 : 1.01 }}
                        onClick={() => election.isActive && setSelectedCandidate(candidate.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          !election.isActive 
                            ? 'opacity-75 cursor-not-allowed border-gray-200' 
                            : selectedCandidate === candidate.id
                              ? 'border-indigo-500 bg-indigo-50 shadow-md'
                              : 'border-gray-200 hover:border-indigo-300 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                            <p className="text-sm text-gray-500">{candidate.party}</p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <FaUser className="mr-1" />
                              <span>Votes: {candidate.voteCount}</span>
                            </div>
                          </div>
                          {selectedCandidate === candidate.id && (
                            <FaCheckCircle className="h-5 w-5 text-indigo-600" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Vote button */}
              {election.isActive && (
                <motion.button
                  onClick={handleVote}
                  disabled={votingLoading || !selectedCandidate}
                  whileHover={{ scale: votingLoading || !selectedCandidate ? 1 : 1.02 }}
                  whileTap={{ scale: votingLoading || !selectedCandidate ? 1 : 0.98 }}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    (votingLoading || !selectedCandidate) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {votingLoading ? (
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
              
              {!election.isActive && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
                  <p className="text-red-600">
                    This election has ended. Voting is no longer possible.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500">No election data found</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/elections')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
            >
              Back to Elections
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vote; 