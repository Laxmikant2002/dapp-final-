import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useContract } from '../context/ContractContext';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiCalendar, 
  FiInfo, 
  FiShield, 
  FiCheckCircle,
  FiArrowLeft,
  FiHome,
  FiUser
} from 'react-icons/fi';
import { FaSpinner, FaWallet } from 'react-icons/fa';
import VoteFeedback from '../components/VoteFeedback';
import { ethers } from 'ethers';

const CandidateDetails = () => {
  const { electionId } = useParams();
  const { isConnected, connectWallet, contract, account } = useContract();
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAccount, setWalletAccount] = useState('');
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const navigate = useNavigate();

  // Check if MetaMask is connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        try {
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setIsWalletConnected(true);
            setWalletAccount(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if ((isConnected || isWalletConnected) && contract && electionId) {
      fetchElectionDetails();
    }
  }, [electionId, isConnected, isWalletConnected, contract]);

  const fetchElectionDetails = async () => {
    setLoading(true);
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      // Get election details using the contract's getElection function
      const [id, name, description, startTime, endTime, isActive, totalVotes] = await contract.getElection(electionId);
      
      setElection({
        id: id.toString(),
        name,
        description,
        startTime: Number(startTime) * 1000,
        endTime: Number(endTime) * 1000,
        isActive,
        totalVotes: totalVotes.toString()
      });

      // Get candidates using the contract's getElectionCandidates function
      const candidatesData = await contract.getElectionCandidates(electionId);
      
      setCandidates(candidatesData.map((candidate, index) => ({
        id: index,
        name: candidate.name,
        party: candidate.party,
        age: candidate.age.toString(),
        gender: candidate.gender,
        voteCount: candidate.voteCount.toString()
      })));
    } catch (error) {
      console.error('Error fetching election details:', error);
      toast.error('Failed to load election details');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    setIsWalletLoading(true);
    try {
      if (!window.ethereum) {
        toast.error('MetaMask is not installed. Please install MetaMask to use this dApp.');
        return;
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setIsWalletConnected(true);
        setWalletAccount(accounts[0]);
        toast.success('Wallet connected successfully!');
        
        // After connecting, fetch election details
        fetchElectionDetails();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      
      let errorMessage = 'Failed to connect wallet';
      if (error.code === 4001) {
        errorMessage = 'Wallet connection rejected by user';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsWalletLoading(false);
    }
  };

  const getPartyBadgeColor = (partyType) => {
    switch (partyType) {
      case 'Democratic Party':
        return 'bg-blue-100 text-blue-800';
      case 'Republican Party':
        return 'bg-red-100 text-red-800';
      case 'Independent':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-indigo-100 text-indigo-800';
    }
  };

  const handleVote = async (candidateId) => {
    const currentAccount = isConnected ? account : walletAccount;
    
    if (!currentAccount) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!election.isActive) {
      toast.error('This election has ended');
      return;
    }

    try {
      setVoting(true);
      
      // Check if user is a registered voter
      const isRegisteredVoter = await contract.isVoter(currentAccount);
      if (!isRegisteredVoter) {
        toast.error('You are not a registered voter. Please contact an admin to register you.');
        return;
      }

      // Check if user has already voted
      const hasVoted = await contract.verifyVote(electionId, currentAccount);
      if (hasVoted) {
        toast.error('You have already voted in this election');
        return;
      }

      const tx = await contract.castVote(electionId, candidateId);
      
      toast.promise(tx.wait(), {
        loading: 'Casting your vote...',
        success: 'Vote cast successfully!',
        error: 'Failed to cast vote'
      });
      
      await tx.wait();
      
      // Show feedback component
      setShowFeedback(true);
    } catch (error) {
      console.error('Error casting vote:', error);
      let errorMessage = 'Failed to cast vote';
      
      if (error.message.includes('already voted')) {
        errorMessage = 'You have already voted in this election';
      } else if (error.message.includes('not registered')) {
        errorMessage = 'You are not registered as a voter';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message.includes('not active')) {
        errorMessage = 'This election is not active';
      }
      
      toast.error(errorMessage);
    } finally {
      setVoting(false);
    }
  };

  // Wallet connection prompt component
  const WalletConnectionPrompt = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto my-12 text-center"
    >
      <FaWallet className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
      <p className="text-gray-600 mb-6">
        Please connect your MetaMask wallet to view election details and cast your vote.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleConnectWallet}
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

  if (showFeedback) {
    return <VoteFeedback onClose={() => {
      setShowFeedback(false);
      fetchElectionDetails();
    }} />;
  }

  if (!isConnected && !isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <WalletConnectionPrompt />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-center h-screen" role="status" aria-label="Loading election">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <FaSpinner className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Loading election details...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Election Not Found</h1>
            <p className="mt-2 text-gray-600">The election you're looking for doesn't exist or has ended.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/elections')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Return to elections list"
            >
              <FiArrowLeft className="mr-2" />
              Back to Elections
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate time remaining or check if ended
  const now = new Date();
  const endDate = new Date(election.endTime);
  const isEnded = !election.isActive || now > endDate;
  const timeRemaining = isEnded ? 0 : Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
  
  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayAccount = isConnected ? account : walletAccount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/elections" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <FiArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Elections</span>
          </Link>
          
          {(isConnected || isWalletConnected) && (
            <div className="flex items-center">
              <div className="mr-4 text-right hidden sm:block">
                <p className="text-xs text-gray-500">Connected as:</p>
                <p className="text-sm font-medium text-gray-900 font-mono">
                  {displayAccount.substring(0, 6)}...{displayAccount.substring(displayAccount.length - 4)}
                </p>
              </div>
              <Link 
                to="/"
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <FiHome className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>

        {/* Election Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.name}</h1>
              <p className="text-gray-600 mb-2">{election.description}</p>
              <p className="text-sm text-gray-500">
                Total Votes: <span className="font-semibold">{election.totalVotes}</span>
              </p>
            </div>
            <div className="flex flex-col items-end mt-4 md:mt-0">
              <div className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                election.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {election.isActive ? 'Active' : 'Ended'}
              </div>
              <div className="flex items-center text-indigo-600 text-sm">
                <FiClock className="w-4 h-4 mr-1" />
                {isEnded 
                  ? <span>Election has ended</span>
                  : <span>Ends in: {timeRemaining} day{timeRemaining !== 1 ? 's' : ''}</span>
                }
              </div>
              <p className="text-xs text-gray-500 mt-1">
                End date: {formatDate(election.endTime)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Candidates Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Candidates</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPartyBadgeColor(candidate.party)}`}>
                      {candidate.party}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiUser className="mr-2 text-indigo-500" />
                      <span>Age: {candidate.age}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiUser className="mr-2 text-indigo-500" />
                      <span>Gender: {candidate.gender}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiCheckCircle className="mr-2 text-indigo-500" />
                      <span>Votes: {candidate.voteCount}</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: election.isActive ? 1.05 : 1 }}
                    whileTap={{ scale: election.isActive ? 0.95 : 1 }}
                    onClick={() => election.isActive && handleVote(candidate.id)}
                    disabled={voting || !election.isActive}
                    className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                      election.isActive
                        ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        : 'bg-gray-400 cursor-not-allowed'
                    } ${voting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {voting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                        Casting Vote...
                      </>
                    ) : (
                      election.isActive ? `Vote for ${candidate.name}` : 'Election Ended'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Information Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Important Information</h3>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start">
              <FiInfo className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <p>You can only vote once in this election. Your choice cannot be changed after submission.</p>
            </div>
            <div className="flex items-start">
              <FiShield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <p>Your vote is secured by blockchain technology and remains anonymous.</p>
            </div>
            <div className="flex items-start">
              <FiCalendar className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
              <p>The voting period ends on {formatDate(election.endTime)}.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CandidateDetails;