import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaSpinner, FaSignOutAlt, FaPoll, FaUser, FaClock, FaCheckCircle, FaPlus } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateCandidateModal, setShowCreateCandidateModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    party: '',
    age: '',
    gender: ''
  });
  const [selectedElectionId, setSelectedElectionId] = useState(null);

  const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
  const adminEmail = location.state?.email || sessionStorage.getItem('adminEmail') || 'admin@example.com';

  useEffect(() => {
    if (!isAdminLoggedIn) {
      toast.error('Please log in to access the admin dashboard');
      navigate('/login');
      return;
    }
    loadMockElections();
  }, [isAdminLoggedIn, navigate]);

  const loadMockElections = () => {
    setLoading(true);
    setTimeout(() => {
      const mockElections = [
        {
          id: 0,
          name: "Student Council Election 2025",
          description: "Vote for your student council representatives",
          startTime: Math.floor(new Date('2025-05-15T17:15:00+05:30').getTime() / 1000),
          endTime: Math.floor(new Date('2025-05-19T17:15:00+05:30').getTime() / 1000),
          isActive: true,
          totalVotes: 50
        }
      ];
      setElections(mockElections);
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    sessionStorage.removeItem('adminEmail');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleCreateCandidate = (electionId) => {
    setSelectedElectionId(electionId);
    setShowCreateCandidateModal(true);
  };

  const handleCandidateSubmit = (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.party || !newCandidate.age || !newCandidate.gender) {
      toast.error('Please fill in all candidate details');
      return;
    }

    const storedCandidates = JSON.parse(localStorage.getItem(`candidates_${selectedElectionId}`)) || [
      { id: 0, name: "Alice Johnson", party: "Independent", age: "21", gender: "Female", voteCount: "20" },
      { id: 1, name: "Bob Smith", party: "Democratic Party", age: "22", gender: "Male", voteCount: "15" },
      { id: 2, name: "Clara Lee", party: "Republican Party", age: "20", gender: "Female", voteCount: "15" }
    ];

    const newCandidateData = {
      id: storedCandidates.length,
      name: newCandidate.name,
      party: newCandidate.party,
      age: newCandidate.age,
      gender: newCandidate.gender,
      voteCount: "0"
    };

    storedCandidates.push(newCandidateData);
    localStorage.setItem(`candidates_${selectedElectionId}`, JSON.stringify(storedCandidates));
    toast.success('Candidate created successfully!');
    setShowCreateCandidateModal(false);
    setNewCandidate({ name: '', party: '', age: '', gender: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center" role="status" aria-label="Loading elections">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-indigo-600 mb-4"
          >
            <FaSpinner className="h-12 w-12" />
          </motion.div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <motion.button 
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </motion.button>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center">
            <div className="bg-indigo-100 text-indigo-600 rounded-full p-3 mr-4">
              <FaUser className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Welcome, Admin!</h2>
              <p className="text-gray-600">Logged in as: <span className="font-medium">{adminEmail}</span></p>
              <p className="text-sm text-gray-500 mt-1">View and manage elections below.</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center mb-6">
            <FaPoll className="text-indigo-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Manage Elections</h2>
          </div>

          {elections.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 font-medium">No elections found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {elections.map((election) => {
                const now = Math.floor(Date.now() / 1000);
                const timeRemaining = election.endTime - now;
                const isExpired = timeRemaining <= 0;
                const statusColor = election.isActive && !isExpired ? 'green' : 'red';
                const statusText = election.isActive && !isExpired ? 'Active' : 'Ended';

                return (
                  <div key={election.id}>
                    <Link to={`/election/${election.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="border border-gray-200 rounded-lg p-6 transition-shadow hover:shadow-md cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-xl font-medium text-gray-900">{election.name}</h3>
                              <span
                                className={`px-2 py-0.5 text-xs font-semibold rounded-full bg-${statusColor}-100 text-${statusColor}-800`}
                                role="status"
                                aria-label={`Election status: ${statusText}`}
                              >
                                {statusText}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-2">{election.description}</p>
                            <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-500">
                              <div className="flex items-center">
                                <FaClock className="mr-1 text-gray-400" />
                                <span>Ends: {new Date(election.endTime * 1000).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center">
                                <FaCheckCircle className="mr-1 text-gray-400" />
                                <span>Votes: {election.totalVotes.toString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => { e.stopPropagation(); handleCreateCandidate(election.id); }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center"
                            >
                              <FaPlus className="mr-2" />
                              Create Candidate
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {showCreateCandidateModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Candidate</h3>
            <form onSubmit={handleCandidateSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCandidate.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Party</label>
                <input
                  type="text"
                  name="party"
                  value={newCandidate.party}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={newCandidate.age}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={newCandidate.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <motion.button
                  type="button"
                  onClick={() => setShowCreateCandidateModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Candidate
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;