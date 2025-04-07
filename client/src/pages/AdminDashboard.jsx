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
  const { contract, account, isAdmin } = useContract();
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [{ name: '', description: '' }]
  });

  useEffect(() => {
    const checkAccess = async () => {
      if (!account) {
        toast.error('Please connect your wallet');
        navigate('/');
        return;
      }

      if (!isAdmin) {
        toast.error('Access denied. Admin privileges required');
        navigate('/elections');
        return;
      }

      fetchElections();
    };

    checkAccess();
  }, [contract, account, isAdmin, navigate]);

  const fetchElections = async () => {
    try {
      setIsLoading(true);
      // Mock elections data
      const mockElections = [
        {
          id: '1',
          title: 'Student Council Election',
          description: 'Vote for your student council representatives',
          startDate: '2024-03-01',
          endDate: '2024-03-15',
          status: 'active',
          totalVotes: 150
        },
        {
          id: '2',
          title: 'Class President Election',
          description: 'Choose your class president for the academic year',
          startDate: '2024-04-01',
          endDate: '2024-04-15',
          status: 'upcoming',
          totalVotes: 0
        }
      ];
      
      setElections(mockElections);
    } catch (error) {
      console.error('Mock error fetching elections:', error);
      toast.error('Failed to fetch elections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      // Simulate creating election
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Mock election created successfully!');
      setShowCreateModal(false);
      setNewElection({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        candidates: [{ name: '', description: '' }]
      });
      fetchElections();
    } catch (error) {
      console.error('Mock error creating election:', error);
      toast.error('Failed to create election');
    }
  };

  const handleEndElection = async (electionId) => {
    try {
      // Simulate ending election
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Mock election ended successfully!');
      fetchElections();
    } catch (error) {
      console.error('Mock error ending election:', error);
      toast.error('Failed to end election');
    }
  };

  const handleDeleteElection = async (electionId) => {
    try {
      // Simulate deleting election
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Mock election deleted successfully!');
      fetchElections();
    } catch (error) {
      console.error('Mock error deleting election:', error);
      toast.error('Failed to delete election');
    }
  };

  const addCandidate = () => {
    setNewElection({
      ...newElection,
      candidates: [...newElection.candidates, { name: '', description: '' }]
    });
  };

  const removeCandidate = (index) => {
    const updatedCandidates = newElection.candidates.filter((_, i) => i !== index);
    setNewElection({
      ...newElection,
      candidates: updatedCandidates
    });
  };

  const updateCandidate = (index, field, value) => {
    const updatedCandidates = [...newElection.candidates];
    updatedCandidates[index] = {
      ...updatedCandidates[index],
      [field]: value
    };
    setNewElection({
      ...newElection,
      candidates: updatedCandidates
    });
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
            >
              Create New Election
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <div key={election.id} className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{election.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{election.description}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    election.status === 'active' ? 'bg-green-100 text-green-800' :
                    election.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {election.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  <p>Start Date: {election.startDate}</p>
                  <p>End Date: {election.endDate}</p>
                  <p>Total Votes: {election.totalVotes}</p>
                </div>
                <div className="flex space-x-2">
                  {election.status === 'active' && (
                    <button
                      onClick={() => handleEndElection(election.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-red-600"
                    >
                      End Election
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteElection(election.id)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-gray-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Create Election Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Create New Election</h2>
            <form onSubmit={handleCreateElection}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newElection.title}
                    onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={newElection.description}
                    onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newElection.startDate}
                      onChange={(e) => setNewElection({ ...newElection, startDate: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newElection.endDate}
                      onChange={(e) => setNewElection({ ...newElection, endDate: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Candidates
                  </label>
                  {newElection.candidates.map((candidate, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        placeholder="Candidate Name"
                        value={candidate.name}
                        onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={candidate.description}
                        onChange={(e) => updateCandidate(index, 'description', e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
                        required
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeCandidate(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCandidate}
                    className="mt-2 text-custom hover:text-custom/80"
                  >
                    <i className="fas fa-plus mr-1"></i> Add Candidate
                  </button>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
                >
                  Create Election
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;