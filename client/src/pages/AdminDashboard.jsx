import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useContract } from '../context/ContractContext';
import { FaSpinner, FaPlus, FaStopCircle, FaUserPlus } from 'react-icons/fa';
import Header from '../components/Header';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { contract, account, isAdmin } = useContract();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endTime: ''
  });
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    age: '',
    gender: '',
    address: ''
  });
  const [selectedElection, setSelectedElection] = useState(null);
  const [voterAddress, setVoterAddress] = useState('');

  useEffect(() => {
    const fetchElections = async () => {
      if (!contract) return;
      setLoading(true);
      try {
        const count = await contract.electionCount();
        const electionList = [];
        for (let i = 0; i < count; i++) {
          const [id, name, description, endTime, isActive, totalVotes] = await contract.getElection(i);
          electionList.push({ id, name, description, endTime, isActive, totalVotes });
        }
        setElections(electionList);
      } catch (error) {
        console.error('Error fetching elections:', error);
        toast.error('Failed to load elections. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, [contract]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    if (!contract) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setTransactionLoading(true);
      const endTime = Math.floor(new Date(formData.endTime).getTime() / 1000);
      const tx = await contract.createElection(formData.name, formData.description, endTime);
      toast.promise(tx.wait(), {
        loading: 'Creating election...',
        success: 'Election created successfully!',
        error: 'Failed to create election'
      });
      await tx.wait();
      setFormData({ name: '', description: '', endTime: '' });
      // Refresh elections list
      const count = await contract.electionCount();
      const electionList = [];
      for (let i = 0; i < count; i++) {
        const [id, name, description, endTime, isActive, totalVotes] = await contract.getElection(i);
        electionList.push({ id, name, description, endTime, isActive, totalVotes });
      }
      setElections(electionList);
    } catch (error) {
      console.error('Error creating election:', error);
      toast.error(error.message || 'Failed to create election');
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleEndElection = async (electionId) => {
    if (!contract) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setTransactionLoading(true);
      const tx = await contract.endElection(electionId);
      toast.promise(tx.wait(), {
        loading: 'Ending election...',
        success: 'Election ended successfully',
        error: 'Failed to end election'
      });
      await tx.wait();
      // Refresh elections list
      const count = await contract.electionCount();
      const electionList = [];
      for (let i = 0; i < count; i++) {
        const [id, name, description, endTime, isActive, totalVotes] = await contract.getElection(i);
        electionList.push({ id, name, description, endTime, isActive, totalVotes });
      }
      setElections(electionList);
    } catch (error) {
      console.error('Error ending election:', error);
      toast.error(error.message || 'Failed to end election');
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleRegisterVoter = async (e) => {
    e.preventDefault();
    if (!voterAddress) {
      toast.error('Please enter a voter address');
      return;
    }

    try {
      setTransactionLoading(true);
      const tx = await contract.registerVoter(voterAddress);
      await tx.wait();
      toast.success('Voter registered successfully!');
      setVoterAddress('');
    } catch (error) {
      console.error('Error registering voter:', error);
      toast.error(error.message || 'Failed to register voter');
    } finally {
      setTransactionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]" role="status" aria-label="Loading elections">
        <FaSpinner className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!isAdmin ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
            <p className="mt-2">You must be an admin to access this page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Existing election management section */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">Manage elections and monitor results</p>
              </div>

              {/* Create Election Form */}
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Create New Election</h2>
                <form onSubmit={handleCreateElection} className="space-y-4" aria-label="Create election form">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Election Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                      id="endTime"
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      aria-required="true"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={transactionLoading}
                    className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      transactionLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label={transactionLoading ? 'Creating election...' : 'Create election'}
                  >
                    {transactionLoading ? (
                      <>
                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                        Create Election
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Elections List */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-xl font-semibold mb-4">Active Elections</h2>
                  <div className="space-y-4">
                    {elections.length === 0 ? (
                      <p className="text-center text-gray-500">No elections found</p>
                    ) : (
                      elections.map((election) => (
                        <div key={election.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium">{election.name}</h3>
                              <p className="text-gray-500">{election.description}</p>
                              <p className="text-sm text-gray-500">
                                End Time: {new Date(election.endTime * 1000).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Total Votes: {election.totalVotes.toString()}
                              </p>
                            </div>
                            <div>
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
                          {election.isActive && (
                            <button
                              onClick={() => handleEndElection(election.id)}
                              disabled={transactionLoading}
                              className={`mt-4 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                transactionLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              aria-label={`End election: ${election.name}`}
                            >
                              {transactionLoading ? (
                                <>
                                  <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                  Ending...
                                </>
                              ) : (
                                <>
                                  <FaStopCircle className="-ml-1 mr-2 h-4 w-4" />
                                  End Election
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Voter Registration Section */}
              <div className="bg-white shadow rounded-lg p-6 mt-8">
                <h2 className="text-xl font-semibold mb-4">Register New Voter</h2>
                <form onSubmit={handleRegisterVoter} className="space-y-4">
                  <div>
                    <label htmlFor="voterAddress" className="block text-sm font-medium text-gray-700">
                      Voter Wallet Address
                    </label>
                    <input
                      type="text"
                      id="voterAddress"
                      value={voterAddress}
                      onChange={(e) => setVoterAddress(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="0x..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={transactionLoading}
                    className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      transactionLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {transactionLoading ? (
                      <>
                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="-ml-1 mr-2 h-4 w-4" />
                        Register Voter
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;