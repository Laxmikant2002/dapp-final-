import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Results = () => {
  const { id } = useParams();
  const { contract } = useContract();
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinal, setIsFinal] = useState(false);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [id, contract]);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      // Mock results data
      const mockResults = {
        title: 'Student Council Election 2024',
        totalVotes: 1500,
        candidates: [
          { name: 'John Doe', votes: 750, percentage: 50, party: 'Independent' },
          { name: 'Jane Smith', votes: 450, percentage: 30, party: 'Progressive' },
          { name: 'Mike Johnson', votes: 300, percentage: 20, party: 'Conservative' }
        ],
        lastUpdated: new Date().toISOString(),
        blockchainHash: '0x1234...5678',
        isFinal: true
      };
      
      setResults(mockResults);
      setIsFinal(mockResults.isFinal);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load election results');
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: results?.candidates.map(c => c.name) || [],
    datasets: [
      {
        data: results?.candidates.map(c => c.votes) || [],
        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B'],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
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
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{results?.title}</h1>
                <p className="text-gray-500 mt-1">
                  Last updated: {new Date(results?.lastUpdated).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={fetchResults}
                  className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
                >
                  <i className="fas fa-sync-alt mr-2"></i>
                  Refresh Results
                </button>
                <a
                  href={`https://etherscan.io/tx/${results?.blockchainHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-button text-sm font-medium hover:bg-gray-200"
                >
                  <i className="fas fa-link mr-2"></i>
                  Verify on Blockchain
                </a>
              </div>
            </div>

            {/* Results Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Vote Distribution</h2>
                {isFinal && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    Final Results
                  </span>
                )}
              </div>
              <div className="h-96">
                <Pie data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Detailed Results Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Detailed Results</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Party
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Votes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results?.candidates.map((candidate) => (
                      <tr key={candidate.name}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{candidate.party}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{candidate.votes.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{candidate.percentage}%</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Blockchain Verification</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-4">
                  These results are recorded on the blockchain for transparency and verification.
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500 font-mono text-sm">
                    Transaction Hash: {results?.blockchainHash}
                  </span>
                  <a
                    href={`https://etherscan.io/tx/${results?.blockchainHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-custom hover:text-custom/80"
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    View on Explorer
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;