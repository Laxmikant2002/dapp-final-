import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaUsers, FaVoteYea } from 'react-icons/fa';
import { toast } from 'sonner';

// Demo elections data (this will be replaced with actual data from your state management)
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
    status: 'active',
    totalVotes: 350,
    registeredVoters: 500
  }
];

const Elections = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [elections, setElections] = useState(demoElections);
  const [loading, setLoading] = useState(false);

  const filteredElections = elections.filter(election =>
    election.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    election.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateProgress = (votes, total) => {
    if (!total) return 0;
    return (votes / total) * 100;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getElectionStatus = (election) => {
    const now = Date.now();
    if (now < election.startTime) return 'upcoming';
    if (now > election.endTime) return 'ended';
    return 'active';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading elections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Active Elections
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Cast your vote in ongoing elections or view upcoming ones
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search elections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Elections Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredElections.map((election) => {
            const status = getElectionStatus(election);
            return (
              <div
                key={election.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {election.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      status === 'active' ? 'bg-green-100 text-green-800' :
                      status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    {election.description}
                  </p>

                  {/* Candidates */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Candidates:</h4>
                    <div className="space-y-2">
                      {election.candidates.map((candidate) => (
                        <div key={candidate.id} className="flex items-center justify-between text-sm">
                          <span>{candidate.name}</span>
                          <span className="text-gray-500">{candidate.votes} votes</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(calculateProgress(election.totalVotes, election.registeredVoters))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${calculateProgress(election.totalVotes, election.registeredVoters)}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaUsers className="mr-2 h-4 w-4" />
                      <span>{election.registeredVoters} registered</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaVoteYea className="mr-2 h-4 w-4" />
                      <span>{election.totalVotes} votes cast</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-2 h-4 w-4" />
                      <span>Starts: {formatDate(election.startTime)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-2 h-4 w-4" />
                      <span>Ends: {formatDate(election.endTime)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/vote/${election.id}`}
                    className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                      status === 'active'
                        ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                        : 'text-gray-700 bg-gray-100 cursor-not-allowed'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    onClick={(e) => {
                      if (status !== 'active') {
                        e.preventDefault();
                        toast.error('This election is not currently active');
                      }
                    }}
                  >
                    {status === 'upcoming' ? 'Coming Soon' : 
                     status === 'ended' ? 'Election Ended' : 
                     'Cast Vote'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredElections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No elections found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Elections;