import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { account, isAdmin, contract } = useContract();
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!account) {
        toast.error('Please connect your wallet first');
        navigate('/');
        return;
      }

      if (!isAdmin) {
        toast.error('Access denied. Only election commission members can access this page.');
        navigate('/elections');
        return;
      }

      fetchElections();
    };

    checkAccess();
  }, [account, isAdmin, navigate]);

  const fetchElections = async () => {
    try {
      setIsLoading(true);
      const electionsData = await contract.getElections();
      const electionsWithStatus = await Promise.all(
        electionsData.map(async (election) => ({
          ...election,
          status: await contract.getElectionStatus(election.id)
        }))
      );
      setElections(electionsWithStatus);
    } catch (error) {
      console.error('Error fetching elections:', error);
      toast.error('Failed to fetch elections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const electionData = {
        name: formData.get('name'),
        candidates: formData.get('candidates').split(',').map(c => c.trim()),
        startDate: new Date(formData.get('startDate')),
        endDate: new Date(formData.get('endDate'))
      };

      const tx = await contract.createElection(
        electionData.name,
        electionData.candidates,
        Math.floor(electionData.startDate.getTime() / 1000),
        Math.floor(electionData.endDate.getTime() / 1000)
      );
      await tx.wait();
      toast.success('Election created successfully!');
      fetchElections();
      e.target.reset();
    } catch (error) {
      console.error('Error creating election:', error);
      toast.error('Failed to create election');
    }
  };

  const handleEndElection = async (electionId) => {
    try {
      const tx = await contract.endElection(electionId);
      await tx.wait();
      toast.success('Election ended successfully!');
      fetchElections();
    } catch (error) {
      console.error('Error ending election:', error);
      toast.error('Failed to end election');
    }
  };

  const handleDeleteElection = async (electionId) => {
    try {
      const tx = await contract.deleteElection(electionId);
      await tx.wait();
      toast.success('Election deleted successfully!');
      fetchElections();
    } catch (error) {
      console.error('Error deleting election:', error);
      toast.error('Failed to delete election');
    }
  };

  const handleElectionSelect = async (electionId) => {
    setSelectedElection(electionId);
    if (electionId) {
      try {
        const resultsData = await contract.getResults(electionId);
        setResults(resultsData);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to load results');
      }
    } else {
      setResults(null);
    }
  };

  const chartData = {
    labels: results?.candidates?.map(c => c.name) || [],
    datasets: [
      {
        data: results?.candidates?.map(c => c.percentage) || [],
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

  return (
    <div className="font-['Inter'] bg-gray-50 min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="admin-dashboard max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Create Election Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Election</h2>
            <form id="createElectionForm" onSubmit={handleCreateElection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Election Name</label>
                <input
                  type="text"
                  name="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Candidates (comma-separated)</label>
                <input
                  type="text"
                  name="candidates"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="John Doe, Jane Smith"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-custom text-white px-4 py-2 rounded-button hover:bg-custom/90"
              >
                Create Election
              </button>
            </form>
          </div>

          {/* Manage Elections Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Elections</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Election Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {elections.map((election) => (
                    <tr key={election.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{election.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          election.status === 'active' ? 'bg-green-100 text-green-800' :
                          election.status === 'ended' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {election.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(election.startDate * 1000).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(election.endDate * 1000).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {election.status === 'active' && (
                          <button
                            onClick={() => handleEndElection(election.id)}
                            className="text-red-600 hover:text-red-900 mr-2"
                          >
                            End
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteElection(election.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Election Results</h2>
            <div className="bg-white rounded-lg shadow p-4">
              <select
                id="electionSelect"
                value={selectedElection}
                onChange={(e) => handleElectionSelect(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Select an Election</option>
                {elections.map((election) => (
                  <option key={election.id} value={election.id}>
                    {election.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {results && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
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
          )}

          {results && (
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;