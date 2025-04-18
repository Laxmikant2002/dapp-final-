import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../components/Header';
import ElectionForm from '../components/ElectionForm';
import VoterListManager from '../components/VoterListManager';
import { verifyAdminToken } from '../services/adminServices';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('elections');
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check admin access on mount
  useEffect(() => {
    if (!verifyAdminToken()) {
      navigate('/login');
      return;
    }
    fetchElections();
  }, [navigate]);

  const fetchElections = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual contract call
      const mockElections = [
        {
          id: 1,
          name: "Student Council Election 2024",
          candidates: ["0x123...", "0x456..."],
          startTime: new Date("2024-04-20").getTime(),
          endTime: new Date("2024-04-22").getTime(),
          isActive: true,
          totalVotes: 30,
          registeredVoters: 50
        }
      ];
      setElections(mockElections);
    } catch (error) {
      console.error('Error fetching elections:', error);
      toast.error('Failed to fetch elections');
    } finally {
      setLoading(false);
    }
  };

  const handleEndElection = async (electionId) => {
    try {
      setLoading(true);
      // TODO: Replace with actual contract call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Election ended successfully');
      fetchElections();
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
      // TODO: Replace with actual contract call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Emergency stop executed successfully');
      fetchElections();
    } catch (error) {
      console.error('Error executing emergency stop:', error);
      toast.error('Failed to execute emergency stop');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage elections, voters, and monitor voting progress
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['elections', 'voters', 'monitoring'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {/* Elections Tab */}
            {activeTab === 'elections' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Create New Election</h2>
                  <ElectionForm onSuccess={fetchElections} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Elections</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {elections.map((election) => (
                      <div
                        key={election.id}
                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                      >
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{election.name}</h3>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p>Start: {new Date(election.startTime).toLocaleDateString()}</p>
                          <p>End: {new Date(election.endTime).toLocaleDateString()}</p>
                          <p>Status: {election.isActive ? 'Active' : 'Ended'}</p>
                          <p>Participation: {election.totalVotes}/{election.registeredVoters} votes</p>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEndElection(election.id)}
                            disabled={!election.isActive || loading}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            End Election
                          </button>
                          <button
                            onClick={() => handleEmergencyStop(election.id)}
                            disabled={!election.isActive || loading}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            Emergency Stop
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Voters Tab */}
            {activeTab === 'voters' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Voters</h2>
                <VoterListManager />
              </div>
            )}

            {/* Monitoring Tab */}
            {activeTab === 'monitoring' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Election Monitoring</h2>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {elections.map((election) => (
                      <div key={election.id} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{election.name}</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            Participation Rate: {((election.totalVotes / election.registeredVoters) * 100).toFixed(1)}%
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full"
                              style={{ width: `${(election.totalVotes / election.registeredVoters) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Total Votes: {election.totalVotes}
                          </p>
                          <p className="text-sm text-gray-600">
                            Registered Voters: {election.registeredVoters}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;