import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ContractContext } from '../context/ContractContext';
import Header from '../components/Header';
import { FiClock } from 'react-icons/fi';
import VoteFeedback from '../components/VoteFeedback';

const CandidateDetails = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { isConnected, contract } = useContext(ContractContext);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [election, setElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Mock data for demonstration - replace with actual contract calls
  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        // TODO: Replace with actual contract call
        const mockElection = {
          id: electionId,
          name: "2025 Presidential Election",
          description: "Cast your vote for the next president",
          endDate: new Date(Date.now() + 199 * 24 * 60 * 60 * 1000),
          candidates: [
            {
              id: 1,
              fullName: "John Anderson",
              partyName: "Democratic Party",
              partyType: "Democratic Party",
              description: "Former State Governor with 20 years of public service experience.",
              image: "https://example.com/john-anderson.jpg",
              partySymbol: "https://example.com/democratic-party.png"
            },
            {
              id: 2,
              fullName: "Sarah Mitchell",
              partyName: "Republican Party",
              partyType: "Republican Party",
              description: "Current Senator with extensive economic policy background.",
              image: "https://example.com/sarah-mitchell.jpg",
              partySymbol: "https://example.com/republican-party.png"
            },
            {
              id: 3,
              fullName: "Michael Roberts",
              partyName: "Independent",
              partyType: "Independent",
              description: "Successful business leader and philanthropist.",
              image: "https://example.com/michael-roberts.jpg",
              partySymbol: "https://example.com/independent-party.png"
            }
          ]
        };
        setElection(mockElection);
      } catch (error) {
        console.error('Error fetching election details:', error);
        toast.error('Failed to load election details');
      } finally {
        setLoading(false);
      }
    };

    if (isConnected) {
      fetchElectionDetails();
    }
  }, [electionId, isConnected]);

  const getPartyBadgeColor = (partyType) => {
    switch (partyType) {
      case 'Democratic Party':
        return 'bg-blue-100 text-blue-800';
      case 'Republican Party':
        return 'bg-red-100 text-red-800';
      case 'Independent':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVote = async (candidateId) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setVoting(true);
    try {
      // TODO: Replace with actual contract call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowFeedback(true);
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error('Failed to cast vote');
      setVoting(false);
    }
  };

  if (showFeedback) {
    return <VoteFeedback onClose={() => setShowFeedback(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Election not found</h2>
            <p className="mt-4 text-gray-600">The election you're looking for doesn't exist or has ended.</p>
          </div>
        </div>
      </div>
    );
  }

  const daysRemaining = Math.ceil((election.endDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{election.name}</h1>
              <p className="mt-2 text-gray-600">{election.description}</p>
            </div>
            <div className="flex items-center text-indigo-600">
              <FiClock className="w-5 h-5 mr-2" />
              <span>Ends in: {daysRemaining} days</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {election.candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden border-2 transition-colors ${
                selectedCandidate === candidate.id
                  ? 'border-indigo-500'
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <div className="relative">
                <img
                  src={candidate.image}
                  alt={candidate.fullName}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Candidate+Photo';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPartyBadgeColor(candidate.partyType)}`}>
                    {candidate.partyType}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{candidate.fullName}</h3>
                <div className="flex items-center mt-2">
                  <img
                    src={candidate.partySymbol}
                    alt={`${candidate.partyName} symbol`}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/24?text=Party+Symbol';
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-600">{candidate.partyName}</span>
                </div>
                <p className="mt-4 text-gray-600">{candidate.description}</p>
                <button
                  onClick={() => handleVote(candidate.id)}
                  disabled={voting}
                  className={`mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    voting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {voting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Casting Vote...
                    </>
                  ) : (
                    `Vote for ${candidate.fullName}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Important Information</h3>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>You can only vote once in this election. Your choice cannot be changed after submission.</p>
            </div>
            <div className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p>Your vote is secured by blockchain technology and remains anonymous.</p>
            </div>
            <div className="flex items-start">
              <svg className="h-5 w-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>The voting period ends on {election.endDate.toLocaleDateString()} at 23:59 EST.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateDetails; 