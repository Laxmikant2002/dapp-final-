import React, { useState, useEffect } from 'react';
import { useContract } from '../../context/ContractContext';

const AdminDashboard = () => {
  const { contract } = useContract();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        if (!contract) return;
        // Get elections from blockchain
        const electionCount = await contract.getElectionCount();
        const electionPromises = [];
        
        for (let i = 0; i < electionCount; i++) {
          electionPromises.push(contract.getElection(i));
        }
        
        const electionsData = await Promise.all(electionPromises);
        const formattedElections = electionsData.map((election, index) => ({
          id: index,
          name: election.name,
          description: election.description,
          isActive: election.isActive
        }));
        
        setElections(formattedElections);
      } catch (error) {
        console.error('Error fetching elections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, [contract]);

  const handleToggleElection = async (electionId, currentStatus) => {
    try {
      if (!contract) return;
      
      const tx = await contract.toggleElection(electionId);
      await tx.wait();
      
      setElections(prevElections => 
        prevElections.map(election => 
          election.id === electionId 
            ? { ...election, isActive: !currentStatus }
            : election
        )
      );
    } catch (error) {
      console.error('Error toggling election status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Elections</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Election Name</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {elections.map(election => (
                <tr key={election.id}>
                  <td className="py-2 px-4 border-b">{election.name}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      election.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {election.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleToggleElection(election.id, election.isActive)}
                      className={`px-4 py-2 rounded ${
                        election.isActive 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white`}
                    >
                      {election.isActive ? 'End Election' : 'Start Election'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 