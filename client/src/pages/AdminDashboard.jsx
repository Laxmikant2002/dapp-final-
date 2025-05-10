import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ElectionForm from '../components/ElectionForm';
import AddCandidate from '../components/AddCandidate';
import { verifyAdminToken } from '../services/adminServices';
import { useContract } from '../context/ContractContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { contract } = useContract();
  const [tab, setTab] = useState('election');
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch elections on mount
  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const elections = await contract.getElections();
        setElections(elections);
      } catch (error) {
        console.error('Error fetching elections:', error);
        toast.error('Failed to fetch elections');
      } finally {
        setLoading(false);
      }
    };

    if (!verifyAdminToken()) {
      navigate('/login');
      return;
    }

    fetchElections();
  }, [contract, navigate]);

  const handleEndElection = async (electionId) => {
    try {
      setLoading(true);
      await contract.endElection(electionId);
      setElections((prevElections) =>
        prevElections.map((election) =>
          election.id === electionId ? { ...election, isActive: false } : election
        )
      );
      toast.success('Election ended successfully');
    } catch (error) {
      console.error('Error ending election:', error);
      toast.error('Failed to end election');
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyStop = async (electionId) => {
    try {
      setLoading(true);
      await contract.emergencyStop(electionId);
      setElections((prevElections) =>
        prevElections.map((election) =>
          election.id === electionId ? { ...election, isActive: false } : election
        )
      );
      toast.success('Emergency stop executed successfully');
    } catch (error) {
      console.error('Error executing emergency stop:', error);
      toast.error('Failed to execute emergency stop');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElection = async (formData) => {
    try {
      setLoading(true);
      await contract.createElection(
        formData.name,
        formData.description,
        new Date(formData.startDate).getTime(),
        new Date(formData.endDate).getTime(),
        formData.candidates.map((candidate) => candidate.name)
      );
      toast.success('Election created successfully!');
      navigate('/elections');
    } catch (error) {
      console.error('Error creating election:', error);
      toast.error('Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (tab === 'election') {
      return <ElectionForm onSuccess={handleCreateElection} loading={loading} />;
    }

    return <AddCandidate />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200 flex">
            <button
              onClick={() => setTab('election')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                tab === 'election'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Election
            </button>
            <button
              onClick={() => setTab('candidate')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                tab === 'candidate'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add Candidate
            </button>
          </div>

          <div className="p-4 sm:p-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;