import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import VoteFeedback from '../components/VoteFeedback';
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
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(state?.selectedCandidate || null);
  const [isConnected] = useState(true);
  const [account] = useState('0x1234567890abcdef1234567890abcdef12345678');
  const [showFeedback, setShowFeedback] = useState(false);

  const loadMockData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setElection({
        id: Number(electionId),
        name: "Student Council Election 2025",
        description: "Vote for your student council representatives",
        endTime: Math.floor(new Date('2025-05-19T18:11:00+05:30').getTime() / 1000),
        isActive: true,
        totalVotes: 50
      });
      setCandidates([
        { id: 0, name: "Alice Johnson", party: "Independent", voteCount: 20 },
        { id: 1, name: "Bob Smith", party: "Democratic Party", voteCount: 15 },
        { id: 2, name: "Clara Lee", party: "Republican Party", voteCount: 15 }
      ]);
      setLoading(false);
    }, 1000);
  }, [electionId]);

  useEffect(() => {
    if (isConnected) {
      loadMockData();
    }
  }, [isConnected, loadMockData]);

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
      setTimeout(() => {
        toast.success('Vote cast successfully!');
        setVotingLoading(false);
        setShowFeedback(true);
      }, 1000);
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error('Failed to cast vote');
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
    } else if (timeRemaining < 86400) {
      return { text: "Ending Soon", color: 'orange' };
    } else {
      return { text: 'Active', color: 'green' };
    }
  };

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

  const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-96 text-center px-4">
      <FaExclamationTriangle className="h-16 w-16 text-red-500 mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadMockData}
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
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
      >
        <FaWallet className="mr-2" />
        Connect Wallet
      </motion.button>
    </motion.div>
  );

  const status = getElectionStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 pb-12">
      {showFeedback && <VoteFeedback onClose={() => setShowFeedback(false)} />}
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
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${!election.isActive ? 'opacity-75 cursor-not-allowed border-gray-200' : selectedCandidate === candidate.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-200 hover:border-indigo-300 hover:shadow'}`}
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
              {election.isActive && (
                <motion.button
                  onClick={handleVote}
                  disabled={votingLoading || !selectedCandidate}
                  whileHover={{ scale: votingLoading || !selectedCandidate ? 1 : 1.02 }}
                  whileTap={{ scale: votingLoading || !selectedCandidate ? 1 : 0.98 }}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${(votingLoading || !selectedCandidate) ? 'opacity-70 cursor-not-allowed' : ''}`}
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