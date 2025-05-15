import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useContract } from '../context/ContractContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { contract } = useContract();
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!contract || !electionId) return;
      setLoading(true);
      try {
        // Fetch election details
        const [id, name, description, endTime, isActive, totalVotes] = await contract.getElection(electionId);
        setElection({ id, name, description, endTime, isActive, totalVotes });

        // Fetch candidates and their votes
        const candidates = await contract.getElectionCandidates(electionId);
        setResults(candidates);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to load election results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [contract, electionId]);

  const chartData = {
    labels: results.map(candidate => candidate.name),
    datasets: [
      {
        data: results.map(candidate => candidate.voteCount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14
          }
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
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]" role="status" aria-label="Loading results">
        <FaSpinner className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Election Not Found</h1>
          <p className="mt-2 text-gray-600">The requested election could not be found.</p>
          <button
            onClick={() => navigate('/elections')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Return to elections list"
          >
            <FaArrowLeft className="mr-2" />
            Back to Elections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">{election.name}</h1>
          <p className="mt-2 text-gray-600">{election.description}</p>
          <div className="mt-4 flex justify-center space-x-4">
            <p className="text-sm text-gray-500">
              Total Votes: {election.totalVotes.toString()}
            </p>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                election.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
              role="status"
              aria-label={`Election is ${election.isActive ? 'active' : 'ended'}`}
            >
              {election.isActive ? 'Active' : 'Ended'}
            </span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64">
              <Pie data={chartData} options={chartOptions} />
            </div>
            <div className="space-y-4">
              {results.map((candidate) => (
                <div key={candidate.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{candidate.name}</h3>
                      <p className="text-sm text-gray-500">
                        Party: {candidate.party}
                      </p>
                      <p className="text-sm text-gray-500">
                        Votes: {candidate.voteCount.toString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {election.totalVotes.toString() === '0' ? '0' : 
                          ((parseInt(candidate.voteCount.toString()) / parseInt(election.totalVotes.toString())) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/elections')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Return to elections list"
          >
            <FaArrowLeft className="mr-2" />
            Back to Elections
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;