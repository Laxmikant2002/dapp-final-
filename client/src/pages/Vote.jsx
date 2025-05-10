import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUserCircle, FaCheckCircle } from 'react-icons/fa';
import { useContract } from '../context/ContractContext';

const Vote = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { contract } = useContract();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!contract) return;
      const e = await contract.getElection(electionId);
      setElection(e);
      const count = await contract.getCandidateCount(electionId);
      const arr = [];
      for (let i = 0; i < count; i++) arr.push(await contract.getCandidate(electionId, i));
      setCandidates(arr.map((c, i) => ({ ...c, id: i })));
    };
    fetchData();
  }, [contract, electionId]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    if (!contract) {
      toast.error('Please connect your wallet');
      return;
    }

    setVoting(true);
    try {
      // Mock voting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful vote
      toast.success('Vote cast successfully!');
      navigate(`/results/${electionId}`);
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error(error.message || 'Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading election details...</p>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Election not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {election.name}
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {election.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              className={`relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden ${
                selectedCandidate?.id === candidate.id ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <div className="p-6">
                {/* Candidate Image */}
                <div className="mb-4">
                  {candidate.imageUrl ? (
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      className="w-32 h-32 mx-auto rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-32 h-32 mx-auto text-gray-300" />
                  )}
                </div>

                {/* Candidate Info */}
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {candidate.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{candidate.party}</p>
                </div>

                {/* Party Symbol */}
                {candidate.partySymbol && (
                  <div className="mt-4">
                    <img
                      src={candidate.partySymbol}
                      alt={`${candidate.party} symbol`}
                      className="h-12 w-12 mx-auto object-contain"
                    />
                  </div>
                )}

                {/* Description */}
                <p className="mt-4 text-sm text-gray-600">
                  {candidate.description}
                </p>

                {/* Selection Indicator */}
                {selectedCandidate?.id === candidate.id && (
                  <div className="absolute top-2 right-2">
                    <FaCheckCircle className="w-6 h-6 text-indigo-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Vote Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleVote}
            disabled={!selectedCandidate || voting}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              (!selectedCandidate || voting) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {voting ? 'Casting Vote...' : 'Cast Vote'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vote; 