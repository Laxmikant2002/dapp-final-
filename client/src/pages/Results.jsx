import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useContract } from '../context/ContractContext';
import { ethers } from 'ethers';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FaSpinner, FaArrowLeft, FaHome, FaWallet } from 'react-icons/fa';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { contract, isConnected, connectWallet, account } = useContract();
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [results, setResults] = useState([]);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAccount, setWalletAccount] = useState('');

  useEffect(() => {
    // Check if MetaMask is connected on mount
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
      fetchResults();
    }
  }, [contract, electionId, isConnected, isWalletConnected]);

  const fetchResults = async () => {
    if (!contract || !electionId) return;
    setLoading(true);
    try {
      // Fetch election details
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

      // Use getElectionCandidates function from the contract (correct function name)
      const candidates = await contract.getElectionCandidates(electionId);
      
      // Map candidates with their indexes as IDs
      setResults(candidates.map((candidate, index) => ({
        id: index.toString(),
        name: candidate.name,
        party: candidate.party,
        age: candidate.age.toString(),
        gender: candidate.gender,
        voteCount: candidate.voteCount.toString()
      })));
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load election results. Please try again.');
      // Redirect to elections page on error after a short delay
      setTimeout(() => {
        navigate('/elections');
      }, 3000);
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
        
        // After connecting, fetch results
        fetchResults();
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

  const chartData = {
    labels: results.map(candidate => candidate.name),
    datasets: [
      {
        data: results.map(candidate => parseInt(candidate.voteCount)),
        backgroundColor: [
          '#4F46E5', // Indigo-600
          '#EF4444', // Red-500
          '#F59E0B', // Amber-500 
          '#10B981', // Emerald-500
          '#8B5CF6', // Violet-500
          '#EC4899', // Pink-500
          '#06B6D4', // Cyan-500
          '#84CC16'  // Lime-500
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} votes (${percentage}%)`;
          }
        },
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937', // Gray-800
        bodyColor: '#4B5563', // Gray-600
        borderColor: '#E5E7EB', // Gray-200
        borderWidth: 1,
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
        boxPadding: 4
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    cutout: '40%'
  };

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
        Please connect your MetaMask wallet to view election results.
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
        <div className="flex items-center justify-center h-screen" role="status" aria-label="Loading results">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <FaSpinner className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Loading election results...</p>
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
            <p className="mt-2 text-gray-600">The requested election could not be found.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/elections')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Return to elections list"
            >
              <FaArrowLeft className="mr-2" />
              Back to Elections
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Format the end date
  const endDate = new Date(Number(election.endTime));
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const displayAccount = isConnected ? account : walletAccount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Link to="/elections" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
              <FaArrowLeft className="h-5 w-5 mr-2" />
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
                  <FaHome className="h-5 w-5" />
                </Link>
              </div>
            )}
          </div>
          
          {/* Election Header */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.name}</h1>
                <p className="text-gray-600 mb-4">{election.description}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                  election.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {election.isActive ? 'Active' : 'Ended'}
                </div>
                <p className="text-sm text-gray-500">
                  End date: {formatDate(endDate)}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Total Votes: <span className="font-semibold">{election.totalVotes}</span>
              </p>
            </div>
          </div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-lg rounded-xl p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Election Results</h2>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-80 flex items-center justify-center">
                  <Pie data={chartData} options={chartOptions} />
                </div>
                <div className="space-y-4">
                  {results.map((candidate) => {
                    const totalVotes = parseInt(election.totalVotes);
                    const candidateVotes = parseInt(candidate.voteCount);
                    const percentage = totalVotes === 0 ? 0 : ((candidateVotes / totalVotes) * 100).toFixed(1);
                    
                    return (
                      <motion.div 
                        key={candidate.id} 
                        whileHover={{ scale: 1.02 }}
                        className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition-all"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">{candidate.name}</h3>
                            <p className="text-sm text-gray-500">
                              Party: {candidate.party}
                            </p>
                            <p className="text-sm text-gray-500">
                              Votes: <span className="font-medium">{candidate.voteCount}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-semibold text-indigo-600">
                              {percentage}%
                            </div>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No candidates found for this election.</p>
              </div>
            )}
          </motion.div>

          <div className="mt-8 text-center">
            <Link
              to="/elections"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              aria-label="Return to elections list"
            >
              <FaArrowLeft className="mr-2" />
              Back to Elections
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;