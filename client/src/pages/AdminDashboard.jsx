import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';
import VoterListManager from '../components/VoterListManager';
import { checkAdminStatus } from '../services/adminService';
import web3Service from '../services/web3Service';
import ConnectWallet from '../components/ConnectWallet';
import { 
  startElection, 
  registerCandidate, 
  getCandidates, 
  registerVoter, 
  endElection, 
  emergencyEndElection,
  getElectionStatus
} from '../utils/blockchain';
import ElectionForm from '../components/ElectionForm';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { contract, account, isAdmin } = useContract();
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [stats, setStats] = useState({
    totalElections: 0,
    activeElections: 0,
    totalVoters: 0,
    totalVotes: 0
  });
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    candidates: [{ name: '', party: '' }]
  });
  const [activeTab, setActiveTab] = useState('elections');
  const [voterAddress, setVoterAddress] = useState('');

  useEffect(() => {
    const checkAccess = async () => {
      if (!account) {
        toast.error('Please connect your wallet');
        navigate('/');
        return;
      }

      // Check admin status
      const isAdminUser = await checkAdminStatus(localStorage.getItem('userEmail'));
      if (!isAdminUser) {
        toast.error('Access denied. Admin privileges required');
        navigate('/elections');
        return;
      }

      fetchElections();
      updateStats();
    };

    checkAccess();
  }, [contract, account, navigate]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const admin = await web3Service.contract.methods.isAdmin().call({ from: web3Service.account });
      if (!admin) {
        setError('Access denied. Admin privileges required.');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setError('Failed to verify admin access.');
    }
  };

  const updateStats = async () => {
    try {
      const [totalElections, activeElections, totalVoters, totalVotes] = await Promise.all([
        contract.electionCount(),
        contract.getActiveElections(),
        contract.voterCount(),
        contract.totalVotes()
      ]);

      setStats({
        totalElections: totalElections.toNumber(),
        activeElections: activeElections.length,
        totalVoters: totalVoters.toNumber(),
        totalVotes: totalVotes.toNumber()
      });
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const fetchElections = async () => {
    try {
      setIsLoading(true);
      const status = await getElectionStatus();
      if (status) {
        setElections([{
          id: 1,
          title: 'Current Election',
          status: status.status,
          startTime: status.startTime,
          endTime: status.endTime
        }]);
      }
    } catch (error) {
      console.error('Error fetching elections:', error);
      toast.error('Failed to load elections.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateElection = async (electionData) => {
    try {
      setIsLoading(true);
      const tx = await contract.createElection(
        electionData.title,
        electionData.description,
        electionData.startTime,
        electionData.endTime,
        electionData.candidates.map(c => ({ name: c.name, description: c.description }))
      );
      await tx.wait();
      toast.success('Election created successfully!');
      updateStats();
    } catch (err) {
      console.error('Error creating election:', err);
      toast.error('Failed to create election');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndElection = async () => {
    try {
      setIsLoading(true);
      await endElection();
      toast.success('Election ended successfully!');
      fetchElections();
    } catch (error) {
      console.error('Error ending election:', error);
      setError('Failed to end election.');
      toast.error('Failed to end election.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyEndElection = async () => {
    try {
      setIsLoading(true);
      await emergencyEndElection();
      toast.success('Election ended in emergency mode.');
      fetchElections();
    } catch (error) {
      console.error('Error ending election:', error);
      setError('Failed to end election.');
      toast.error('Failed to end election.');
    } finally {
      setIsLoading(false);
    }
  };

  const addCandidate = () => {
    setNewElection({
      ...newElection,
      candidates: [...newElection.candidates, { name: '', party: '' }]
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

  const handleRegisterVoter = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // Register voter with default values
      await registerVoter('Voter', 25, 'Not specified');
      
      toast.success('Voter registered successfully!');
      setVoterAddress('');
    } catch (error) {
      console.error('Error registering voter:', error);
      setError('Failed to register voter.');
      toast.error('Failed to register voter.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-['Inter'] bg-gray-50 min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <ConnectWallet />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {['elections', 'voters', 'results'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="bg-white shadow rounded-lg p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
              </div>
            ) : (
              <>
                {/* Elections Tab */}
                {activeTab === 'elections' && (
                  <div className="space-y-6">
                    <ElectionForm onSubmit={handleCreateElection} />
                  </div>
                )}

                {/* Voters Tab */}
                {activeTab === 'voters' && (
                  <div className="space-y-6">
                    <form onSubmit={handleRegisterVoter} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Voter Address</label>
                        <input
                          type="text"
                          value={voterAddress}
                          onChange={(e) => setVoterAddress(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="0x..."
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Register Voter
                      </button>
                    </form>
                  </div>
                )}

                {/* Results Tab */}
                {activeTab === 'results' && (
                  <div className="space-y-6">
                    {elections.map((election) => (
                      <div key={election.id} className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900">{election.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">Status: {election.status}</p>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700">Candidates</h4>
                          <div className="mt-2 space-y-2">
                            {/* This would be populated with actual candidate data */}
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-900">Loading candidates...</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={handleEndElection}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            End Election
                          </button>
                          <button
                            onClick={handleEmergencyEndElection}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Emergency End
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Create Election Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Create New Election</h2>
            <ElectionForm onSubmit={handleCreateElection} />
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Confirm Action</h2>
            <p className="text-gray-600 mb-6">
              {currentAction?.type === 'end' 
                ? 'Are you sure you want to end this election? This action cannot be undone.'
                : 'Are you sure you want to delete this election? This action cannot be undone.'}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowActionModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <i className="fas fa-check text-green-600 text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold mb-2">Success!</h2>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fas fa-exclamation text-red-600 text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;