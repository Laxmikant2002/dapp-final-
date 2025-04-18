import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import web3Service from '../services/web3Service';
import ConnectWallet from '../components/ConnectWallet';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Results = () => {
  const navigate = useNavigate();
  const { id: urlId } = useParams();
  const { contract, provider } = useContract();
  const [electionId, setElectionId] = useState(urlId || '');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [election, setElection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (urlId) {
      fetchResults(urlId);
    }
  }, [urlId, contract]);

  useEffect(() => {
    fetchElectionResults();
  }, [urlId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!electionId) {
      setError('Please enter an election ID');
      return;
    }
    navigate(`/results/${electionId}`);
  };

  const fetchResults = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      // Get election details
      const election = await contract.elections(id);
      
      if (!election) {
        throw new Error('Election not found');
      }

      const now = Math.floor(Date.now() / 1000);
      if (now < election.endTime) {
        throw new Error('Election has not ended yet');
      }

      // Get candidates and calculate results
      const candidates = await contract.getCandidates(id);
      const totalVotes = candidates.reduce((sum, c) => sum + c.votes.toNumber(), 0);

      const resultsData = {
        title: election.title,
        description: election.description,
        endTime: new Date(election.endTime * 1000).toLocaleString(),
        totalVotes,
        candidates: candidates.map(c => ({
          name: c.name,
          votes: c.votes.toNumber(),
          percentage: totalVotes > 0 ? ((c.votes.toNumber() / totalVotes) * 100).toFixed(2) : 0
        }))
      };

      setResults(resultsData);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError(error.message || 'Failed to load election results');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchElectionResults = async () => {
    try {
      const electionData = await web3Service.getCurrentElection();
      if (electionData) {
        setElection(electionData);
      }
    } catch (error) {
      console.error('Error fetching election results:', error);
      setError('Failed to load election results. Please try again later.');
    }
  };

  const chartData = {
    labels: results?.candidates.map(c => c.name) || [],
    datasets: [{
      label: 'Votes',
      data: results?.candidates.map(c => c.votes) || [],
      backgroundColor: [
        'rgba(79, 70, 229, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const candidate = results.candidates[context.dataIndex];
            return `Votes: ${candidate.votes} (${candidate.percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="font-['Inter'] bg-gray-50 min-h-screen">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">Loading results...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">No election found</h3>
          <p className="mt-1 text-sm text-gray-500">The election you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-['Inter'] bg-gray-50 min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Election Results</h1>
              
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="electionId" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter Election ID
                    </label>
                    <input
                      type="text"
                      id="electionId"
                      value={electionId}
                      onChange={(e) => setElectionId(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter election ID"
                      aria-label="Election ID"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'View Results'}
                    </button>
                  </div>
                </div>
              </form>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{results.title}</h2>
                    <p className="text-gray-600 mt-1">{results.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Election ended: {results.endTime}
                    </p>
                    <p className="text-sm font-medium text-indigo-600 mt-1">
                      Total votes: {results.totalVotes.toLocaleString()}
                    </p>
                  </div>

                  <div className="h-80 mb-8">
                    <Bar data={chartData} options={chartOptions} />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Candidate
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Votes
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Percentage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.candidates.map((candidate, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {candidate.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {candidate.votes.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {candidate.percentage}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;