import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FaSpinner, FaPlus, FaEdit, FaTrash, FaArrowLeft, FaClock } from 'react-icons/fa';

const CandidateDetails = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCandidateId, setCurrentCandidateId] = useState(null);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    party: '',
    age: '',
    gender: '',
    voteCount: '0'
  });

  useEffect(() => {
    loadMockData();
  }, [electionId]);

  const loadMockData = () => {
    setLoading(true);
    setTimeout(() => {
      setElection({
        id: electionId,
        name: "Student Council Election 2025",
        description: "Vote for your student council representatives",
        startTime: new Date('2025-05-15T17:15:00+05:30').getTime(),
        endTime: new Date('2025-05-19T17:15:00+05:30').getTime(),
        isActive: true,
        totalVotes: "50"
      });
      const storedCandidates = JSON.parse(localStorage.getItem(`candidates_${electionId}`)) || [
        { id: 0, name: "Alice Johnson", party: "Independent", age: "21", gender: "Female", voteCount: "20" },
        { id: 1, name: "Bob Smith", party: "Democratic Party", age: "22", gender: "Male", voteCount: "15" },
        { id: 2, name: "Clara Lee", party: "Republican Party", age: "20", gender: "Female", voteCount: "15" }
      ];
      setCandidates(storedCandidates);
      setLoading(false);
    }, 1000);
  };

  const handleAddCandidate = () => {
    setIsEditing(false);
    setNewCandidate({ name: '', party: '', age: '', gender: '', voteCount: '0' });
    setShowModal(true);
  };

  const handleEditCandidate = (candidate) => {
    setIsEditing(true);
    setCurrentCandidateId(candidate.id);
    setNewCandidate({ ...candidate });
    setShowModal(true);
  };

  const handleDeleteCandidate = (candidateId) => {
    const updatedCandidates = candidates.filter((candidate) => candidate.id !== candidateId);
    setCandidates(updatedCandidates);
    localStorage.setItem(`candidates_${electionId}`, JSON.stringify(updatedCandidates));
    toast.success('Candidate deleted successfully!');
  };

  const handleCandidateSubmit = (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.party || !newCandidate.age || !newCandidate.gender) {
      toast.error('Please fill in all candidate details');
      return;
    }

    let updatedCandidates;
    if (isEditing) {
      updatedCandidates = candidates.map((candidate) =>
        candidate.id === currentCandidateId ? { ...newCandidate, id: currentCandidateId } : candidate
      );
      toast.success('Candidate updated successfully!');
    } else {
      updatedCandidates = [
        ...candidates,
        { ...newCandidate, id: candidates.length, voteCount: "0" }
      ];
      toast.success('Candidate added successfully!');
    }

    setCandidates(updatedCandidates);
    localStorage.setItem(`candidates_${electionId}`, JSON.stringify(updatedCandidates));
    setShowModal(false);
    setNewCandidate({ name: '', party: '', age: '', gender: '', voteCount: '0' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate((prev) => ({ ...prev, [name]: value }));
  };

  const getPartyBadgeColor = (partyType) => {
    switch (partyType) {
      case 'Democratic Party':
        return 'bg-blue-100 text-blue-800';
      case 'Republican Party':
        return 'bg-red-100 text-red-800';
      case 'Independent':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-indigo-100 text-indigo-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-center h-screen" role="status" aria-label="Loading election">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <FaSpinner className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Loading election details...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Election Not Found</h1>
            <p className="mt-2 text-gray-600">The election you're looking for doesn't exist or has ended.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin-dashboard')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Return to admin dashboard"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const now = new Date();
  const endDate = new Date(election.endTime);
  const isEnded = !election.isActive || now > endDate;
  const timeRemaining = isEnded ? 0 : Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/admin-dashboard" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <FaArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.name}</h1>
              <p className="text-gray-600 mb-2">{election.description}</p>
              <p className="text-sm text-gray-500">
                Total Votes: <span className="font-semibold">{election.totalVotes}</span>
              </p>
            </div>
            <div className="flex flex-col items-end mt-4 md:mt-0">
              <div className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${election.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {election.isActive ? 'Active' : 'Ended'}
              </div>
              <div className="flex items-center text-indigo-600 text-sm">
                <FaClock className="w-4 h-4 mr-1" />
                {isEnded ? <span>Election has ended</span> : <span>Ends in: {timeRemaining} day{timeRemaining !== 1 ? 's' : ''}</span>}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                End date: {formatDate(election.endTime)}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Candidates</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddCandidate}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" />
              Add New Candidate
            </motion.button>
          </div>
          {candidates.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 font-medium">No candidates found for this election.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate) => (
                <motion.div
                  key={candidate.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPartyBadgeColor(candidate.party)}`}>
                        {candidate.party}
                      </span>
                    </div>
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-600">Age: {candidate.age}</p>
                      <p className="text-sm text-gray-600">Gender: {candidate.gender}</p>
                      <p className="text-sm text-gray-600">Votes: {candidate.voteCount}</p>
                    </div>
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditCandidate(candidate)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
                      >
                        <FaEdit className="mr-2" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center"
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Election Information</h3>
          <div className="space-y-4 text-sm text-gray-600">
            <p>The voting period started on {formatDate(election.startTime)}.</p>
            <p>The voting period ends on {formatDate(election.endTime)}.</p>
          </div>
        </motion.div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">{isEditing ? 'Edit Candidate' : 'Add New Candidate'}</h3>
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
                  onClick={() => setShowModal(false)}
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
                  {isEditing ? 'Update Candidate' : 'Add Candidate'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetails;