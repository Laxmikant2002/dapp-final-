import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContract } from '../hooks/useContract';

const Vote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contract, account, castVote } = useContract();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    fetchElectionDetails();
    checkVotingStatus();
  }, [id, contract, account]);

  const fetchElectionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!contract) {
        throw new Error('Contract not initialized');
      }
      
      // Fetch election details from the contract
      const electionData = await contract.getElection(id);
      
      // Format the election data
      const formattedElection = {
        id: id,
        title: electionData.title,
        description: electionData.description,
        status: electionData.status,
        startTime: electionData.startTime.toNumber(),
        endTime: electionData.endTime.toNumber(),
        candidates: electionData.candidates.map((candidate, index) => ({
          id: index,
          name: candidate.name,
          description: candidate.description,
          voteCount: candidate.voteCount.toNumber()
        }))
      };
      
      setElection(formattedElection);
    } catch (err) {
      console.error('Error fetching election details:', err);
      setError('Failed to load election details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const checkVotingStatus = async () => {
    if (!contract || !account) return;
    
    try {
      const hasVoted = await contract.hasVoted(id, account);
      setHasVoted(hasVoted);
    } catch (err) {
      console.error('Error checking voting status:', err);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate to vote for');
      return;
    }
    
    if (!account) {
      setError('Please connect your wallet to vote');
      return;
    }
    
    try {
      setVoting(true);
      setError(null);
      
      // Call the contract's castVote function
      const tx = await castVote(id, selectedCandidate);
      await tx.wait();
      
      // Navigate to results page
      navigate(`/results/${id}`);
    } catch (err) {
      console.error('Error casting vote:', err);
      setError('Failed to cast vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        <p>{error}</p>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Election Not Found</h2>
        <p className="text-gray-600">The election you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <p>You have already voted in this election.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Election Details</h2>
          <p className="text-gray-600 mb-4">{election.description}</p>
          
          <div className="mt-4 flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              election.status === 'active' ? 'bg-green-100 text-green-800' : 
              election.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {election.status}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(election.startTime * 1000).toLocaleDateString()} - {new Date(election.endTime * 1000).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Elections
          </button>
          
          <button
            onClick={() => navigate(`/results/${id}`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.title}</h1>
        <p className="text-gray-600">{election.description}</p>
        
        <div className="mt-4 flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            election.status === 'active' ? 'bg-green-100 text-green-800' : 
            election.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {election.status}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(election.startTime * 1000).toLocaleDateString()} - {new Date(election.endTime * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Candidate</h2>
        
        <div className="space-y-4">
          {election.candidates.map((candidate) => (
            <div 
              key={candidate.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedCandidate === candidate.id 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => setSelectedCandidate(candidate.id)}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  selectedCandidate === candidate.id 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-200'
                }`}>
                  {selectedCandidate === candidate.id && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                  <p className="text-sm text-gray-500">{candidate.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Elections
        </button>
        
        <button
          onClick={handleVote}
          disabled={!selectedCandidate || voting || election.status !== 'active'}
          className={`px-4 py-2 rounded-md text-white ${
            !selectedCandidate || voting || election.status !== 'active'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {voting ? 'Voting...' : 'Cast Vote'}
        </button>
      </div>
    </div>
  );
};

export default Vote; 