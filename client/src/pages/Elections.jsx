import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { FiSearch } from 'react-icons/fi';

const Elections = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Demo elections data
  const elections = [
    {
      id: 1,
      title: 'Presidential Election 2024',
      description: 'National level presidential election for selecting the next president',
      endDate: '2024-05-15',
      registeredVoters: 150000,
      totalVotes: 95000,
      status: 'active'
    },
    {
      id: 2,
      title: 'State Assembly Election',
      description: 'State level assembly election for selecting state representatives',
      endDate: '2024-04-30',
      registeredVoters: 75000,
      totalVotes: 45000,
      status: 'active'
    },
    {
      id: 3,
      title: 'Local Council Election',
      description: 'Local council election for selecting council members',
      endDate: '2024-04-20',
      registeredVoters: 25000,
      totalVotes: 15000,
      status: 'active'
    }
  ];

  const filteredElections = elections.filter(election =>
    election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    election.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressPercentage = (total, registered) => {
    return Math.round((total / registered) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
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
        </div>

        {/* Elections Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredElections.map(election => (
            <div
              key={election.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {election.title}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Active
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  {election.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{getProgressPercentage(election.totalVotes, election.registeredVoters)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${getProgressPercentage(election.totalVotes, election.registeredVoters)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Registered Voters: {election.registeredVoters.toLocaleString()}</span>
                    <span>Total Votes: {election.totalVotes.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Ends on {new Date(election.endDate).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => navigate(`/vote/${election.id}`)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cast Vote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Elections;