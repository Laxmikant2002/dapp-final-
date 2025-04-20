import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ElectionForm from '../components/ElectionForm';
import { verifyAdminToken } from '../services/adminServices';

// Demo data for testing
const demoElections = [
  {
    id: 1,
    name: "Student Council Election 2024",
    description: "Annual election for student council positions",
    candidates: [
      { id: 1, name: "John Smith", votes: 150 },
      { id: 2, name: "Sarah Johnson", votes: 120 },
      { id: 3, name: "Michael Brown", votes: 80 }
    ],
    startTime: new Date("2024-03-01").getTime(),
    endTime: new Date("2024-03-15").getTime(),
    isActive: true,
    totalVotes: 350,
    registeredVoters: 500
  },
  {
    id: 2,
    name: "Department Head Election",
    description: "Election for new department head",
    candidates: [
      { id: 1, name: "Dr. Emily Wilson", votes: 45 },
      { id: 2, name: "Prof. James Davis", votes: 38 }
    ],
    startTime: new Date("2024-02-15").getTime(),
    endTime: new Date("2024-02-28").getTime(),
    isActive: false,
    totalVotes: 83,
    registeredVoters: 100
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check admin access on mount
  useEffect(() => {
    if (!verifyAdminToken()) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleEndElection = async (electionId) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setElections(prevElections => 
        prevElections.map(election => 
          election.id === electionId 
            ? { ...election, isActive: false }
            : election
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setElections(prevElections => 
        prevElections.map(election => 
          election.id === electionId 
            ? { ...election, isActive: false }
            : election
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
      console.log('Creating election with data:', formData);

      // Format candidates data
      const candidates = formData.candidates.map((candidate, index) => ({
        id: Date.now() + index,
        name: candidate.name,
        votes: 0
      }));

      // Create new election object
      const newElection = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        startTime: new Date(formData.startDate).getTime(),
        endTime: new Date(formData.endDate).getTime(),
        candidates,
        status: 'upcoming',
        totalVotes: 0,
        registeredVoters: 0
      };

      console.log('Formatted election object:', newElection);

      // Update elections state
      setElections(prevElections => {
        console.log('Previous elections:', prevElections);
        const updatedElections = [...prevElections, newElection];
        console.log('Updated elections:', updatedElections);
        return updatedElections;
      });

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

    if (activeTab === 'create') {
      return <ElectionForm onSuccess={handleCreateElection} loading={loading} />;
    }

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">
          Manage Elections
        </h2>
        {elections.length === 0 ? (
          <p className="text-gray-500">No elections created yet.</p>
        ) : (
          <div className="space-y-4">
            {elections.map((election) => (
              <div
                key={election.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {election.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {election.description}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Start: {new Date(election.startTime).toLocaleString()}</p>
                  <p>End: {new Date(election.endTime).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Admin Dashboard
          </h1>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('create')}
                className={`${
                  activeTab === 'create'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                Create Election
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`${
                  activeTab === 'manage'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                Manage Elections
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;