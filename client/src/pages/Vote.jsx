import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useContract } from '../context/ContractContext';
import { FaSpinner } from 'react-icons/fa';

const Vote = () => {
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [election, setElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { contract, isConnected } = useContract();

  useEffect(() => {
    const fetchElectionData = async () => {
      if (!isConnected) {
        toast.error('Please connect your wallet first');
        navigate('/');
        return;
      }

      try {
        // Add election data fetching logic here
        setElection({
          id: electionId,
          title: 'Sample Election',
          candidates: [
            { id: 1, name: 'Candidate 1' },
            { id: 2, name: 'Candidate 2' }
          ]
        });
      } catch (error) {
        console.error('Error fetching election:', error);
        toast.error('Failed to load election data');
      } finally {
        setLoading(false);
      }
    };

    fetchElectionData();
  }, [electionId, isConnected, navigate]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    setVoting(true);
    try {
      // Add voting logic here
      toast.success('Vote cast successfully');
      navigate('/elections');
    } catch (error) {
      console.error('Voting error:', error);
      toast.error('Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          {election?.title}
        </h2>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select your candidate
            </h3>

            <div className="space-y-4">
              {election?.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedCandidate === candidate.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => setSelectedCandidate(candidate.id)}
                >
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {candidate.name}
                      </p>
                    </div>
                    {selectedCandidate === candidate.id && (
                      <div className="ml-3">
                        <svg
                          className="h-5 w-5 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={handleVote}
                disabled={voting || !selectedCandidate}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {voting ? 'Casting vote...' : 'Cast Vote'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote; 