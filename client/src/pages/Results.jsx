import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contract, account } = useContract();
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestricted, setIsRestricted] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!account) {
        toast.error('Please connect your wallet to view results');
        navigate('/');
        return;
      }

      if (!contract) return;
      fetchResults();
    };

    checkAccess();
  }, [contract, id, account, navigate]);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      // Check if results are restricted
      const election = await contract.getElection(id);
      const isRestricted = election.isRestricted;
      setIsRestricted(isRestricted);

      if (isRestricted) {
        const hasVoted = await contract.hasVoted(id, account);
        if (!hasVoted) {
          toast.error('You must vote to view these results');
          navigate('/voting/' + id);
          return;
        }
      }

      // Fetch results from contract
      const resultsData = await contract.getResults(id);
      setResults({
        candidates: resultsData.candidates.map((candidate, index) => ({
          name: candidate.name,
          votes: candidate.votes.toNumber(),
          percentage: (candidate.votes.toNumber() / resultsData.totalVotes.toNumber() * 100).toFixed(2)
        })),
        totalVotes: resultsData.totalVotes.toNumber()
      });
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load results');
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: results?.candidates.map(c => c.name) || [],
    datasets: [
      {
        data: results?.candidates.map(c => c.percentage) || [],
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
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="font-['Inter'] bg-gray-50 min-h-screen">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">Results not found</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Vote Distribution</h3>
              <div className="h-64 w-full" id="resultsChart">
                <Pie data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Detailed Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
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
                    {results.candidates.map((candidate) => (
                      <tr key={candidate.name}>
                        <td className="px-6 py-4 whitespace-nowrap">{candidate.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{candidate.votes}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{candidate.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Blockchain Verification</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-4">Verify these results on the blockchain:</p>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 font-mono text-sm">
                  Contract: {process.env.REACT_APP_CONTRACT_ADDRESS}
                </span>
                <a
                  href={`https://etherscan.io/address/${process.env.REACT_APP_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-custom hover:text-custom/80"
                >
                  <i className="fas fa-external-link-alt"></i> View on Explorer
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;