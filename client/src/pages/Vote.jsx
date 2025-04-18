import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContract } from '../hooks/useContract';
import { toast } from 'sonner';

const Vote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contract, account } = useContract();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        if (!contract || !id) return;

        const electionDetails = await contract.getElection(id);
        const candidates = await contract.getCandidates(id);
        const hasUserVoted = await contract.hasVoted(id, account);

        setElection({
          id,
          title: electionDetails.title,
          description: electionDetails.description,
          startTime: new Date(electionDetails.startTime * 1000),
          endTime: new Date(electionDetails.endTime * 1000),
          candidates: candidates.map((c, index) => ({
            id: index,
            name: c.name,
            description: c.description
          }))
        });
        setHasVoted(hasUserVoted);
      } catch (err) {
        console.error('Error fetching election details:', err);
        setError('Failed to load election details');
      } finally {
        setLoading(false);
      }
    };

    fetchElectionDetails();
  }, [contract, id, account]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.vote(id, selectedCandidate);
      await tx.wait();
      toast.success('Vote cast successfully!');
      navigate('/results');
    } catch (err) {
      console.error('Error casting vote:', err);
      toast.error('Failed to cast vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <h2 className="text-2xl font-bold mb-4">Election Not Found</h2>
          <p>The election you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Already Voted</h2>
          <p className="mb-4">You have already cast your vote in this election.</p>
          <button
            onClick={() => navigate('/results')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  const now = new Date();
  if (now < election.startTime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Election Not Started</h2>
          <p className="mb-4">This election will start on {election.startTime.toLocaleString()}</p>
          <button
            onClick={() => navigate('/elections')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Elections
          </button>
        </div>
      </div>
    );
  }

  if (now > election.endTime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Election Ended</h2>
          <p className="mb-4">This election has ended. You can view the results.</p>
          <button
            onClick={() => navigate('/results')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{election.title}</h1>
          <p className="text-gray-600 mb-8">{election.description}</p>

          <div className="space-y-4">
            {election.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedCandidate === candidate.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                <p className="text-gray-600">{candidate.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleVote}
              disabled={!selectedCandidate || loading}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                !selectedCandidate || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Casting Vote...' : 'Cast Vote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote; 