import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useContract } from '../context/ContractContext';
import { FaSearch, FaCalendarAlt, FaUsers, FaVoteYea, FaSpinner, FaArrowRight } from 'react-icons/fa';

const Elections = () => {
  const navigate = useNavigate();
  const { contract, account } = useContract();
  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [elections, setElections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchElections = async () => {
      if (!contract) return;
      setLoading(true);
      try {
        const count = await contract.electionCount();
        const electionList = [];
        for (let i = 0; i < count; i++) {
          const [id, name, description, endTime, isActive, totalVotes] = await contract.getElection(i);
          electionList.push({ id, name, description, endTime, isActive, totalVotes });
        }
        setElections(electionList);
      } catch (error) {
        console.error('Error fetching elections:', error);
        toast.error('Failed to load elections. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, [contract]);

  const handleVote = async (electionId, candidateId) => {
    if (!contract || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setTransactionLoading(true);
      const tx = await contract.castVote(electionId, candidateId);
      toast.promise(tx.wait(), {
        loading: 'Casting vote...',
        success: 'Vote cast successfully!',
        error: 'Failed to cast vote'
      });
      await tx.wait();
      // Refresh elections list
      const count = await contract.electionCount();
      const electionList = [];
      for (let i = 0; i < count; i++) {
        const [id, name, description, endTime, isActive, totalVotes] = await contract.getElection(i);
        electionList.push({ id, name, description, endTime, isActive, totalVotes });
      }
      setElections(electionList);
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error(error.message || 'Failed to cast vote');
    } finally {
      setTransactionLoading(false);
    }
  };

  const filteredElections = elections.filter(election =>
    election.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    election.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]" role="status" aria-label="Loading elections">
        <FaSpinner className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Active Elections</h1>
          <p className="mt-2 text-gray-600">
            Cast your vote in the ongoing elections
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search elections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search elections"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredElections.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No elections found</p>
            </div>
          ) : (
            filteredElections.map((election) => (
              <div key={election.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{election.name}</h3>
                  <p className="mt-2 text-gray-500">{election.description}</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-2" aria-hidden="true" />
                      End Time: {formatDate(election.endTime)}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FaUsers className="mr-2" aria-hidden="true" />
                      Total Votes: {election.totalVotes.toString()}
                    </p>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        election.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                      role="status"
                      aria-label={`Election is ${election.isActive ? 'active' : 'ended'}`}
                    >
                      {election.isActive ? 'Active' : 'Ended'}
                    </span>
                    <Link
                      to={`/elections/${election.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      aria-label={`View details for ${election.name}`}
                    >
                      View Details
                      <FaArrowRight className="ml-2" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Elections;