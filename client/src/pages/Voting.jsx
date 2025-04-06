import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';

const Voting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contract, account } = useContract();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!account) {
        toast.error('Please connect your wallet to vote');
        navigate('/');
        return;
      }

      if (!contract) return;
      fetchElectionData();
    };

    checkAccess();
  }, [contract, id, account, navigate]);

  const fetchElectionData = async () => {
    try {
      setIsLoading(true);
      // Check if user has already voted
      const voted = await contract.hasVoted(id, account);
      setHasVoted(voted);

      if (voted) {
        toast.error('You have already voted in this election');
        navigate('/results/' + id);
        return;
      }

      // Fetch election details from contract
      const electionData = await contract.getElection(id);
      const candidatesData = await contract.getCandidates(id);

      setElection({
        id: electionData.id.toString(),
        title: electionData.title,
        description: electionData.description,
        timeRemaining: calculateTimeRemaining(electionData.endTime),
        status: electionData.status
      });

      setCandidates(candidatesData.map((candidate, index) => ({
        id: index + 1,
        name: candidate.name,
        description: candidate.description
      })));
    } catch (error) {
      console.error('Error fetching election data:', error);
      toast.error('Failed to load election data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTimeRemaining = (endTime) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Election ended';
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    
    return `${days} days ${hours} hours`;
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    try {
      const tx = await contract.vote(id, selectedCandidate);
      await tx.wait();
      
      toast.success('Vote submitted successfully!');
      navigate('/results/' + id);
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error('Failed to submit vote');
    }
  };

  if (isLoading) {
    return (
      <div className="font-['Inter'] bg-gray-50 min-h-screen">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="font-['Inter'] bg-gray-50 min-h-screen">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">Election not found</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-['Inter'] bg-gray-50 min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.title}</h1>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <i className="far fa-clock mr-2"></i>
                  Time remaining: {election.timeRemaining}
                </div>
                <p className="text-gray-600">{election.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-4">Select Your Candidate</h2>
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={`border rounded-lg p-4 hover:border-custom cursor-pointer transition-colors ${
                        selectedCandidate === candidate.id ? 'border-custom bg-custom/5' : ''
                      }`}
                      onClick={() => setSelectedCandidate(candidate.id)}
                    >
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="radio"
                          name="candidate"
                          value={candidate.id}
                          checked={selectedCandidate === candidate.id}
                          onChange={() => setSelectedCandidate(candidate.id)}
                          className="mt-1 text-custom focus:ring-custom"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium">{candidate.name}</h3>
                          <p className="text-sm text-gray-500">{candidate.description}</p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Your vote will be recorded on the blockchain and cannot be changed.
                  </p>
                  <button
                    onClick={handleVote}
                    className="bg-custom text-white px-6 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
                  >
                    Submit Vote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Voting;