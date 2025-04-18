import React, { useState, useEffect, useContext } from 'react';
import { ContractContext } from '../context/ContractContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ConnectWallet from '../components/ConnectWallet';
import ElectionCard from '../components/ElectionCard';
import { motion, AnimatePresence } from 'framer-motion';

const Elections = () => {
  const { account, contract, getElections, castVote } = useContext(ContractContext);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [isVoting, setIsVoting] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);

  useEffect(() => {
    if (contract) {
      fetchElections();
    }
  }, [contract]);

  const fetchElections = async () => {
    try {
      setLoading(true);
      setError(null);
      const activeElections = await getElections();
      setElections(activeElections);
    } catch (error) {
      console.error('Error fetching elections:', error);
      setError('Failed to load elections. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteClick = (election) => {
    if (!account) {
      setError('Please connect your wallet to vote.');
      return;
    }
    setSelectedElection(election);
    setSelectedCandidate('');
    setShowVoteModal(true);
  };

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) {
      setError('Please select a candidate.');
      return;
    }

    try {
      setIsVoting(true);
      setError(null);
      await castVote(selectedElection.id, selectedCandidate);
      setShowVoteModal(false);
      fetchElections(); // Refresh elections after voting
    } catch (error) {
      setError(error.message || 'Failed to cast vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const VoteModal = () => (
    <AnimatePresence>
      {showVoteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="vote-modal" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowVoteModal(false)}></div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  onClick={() => setShowVoteModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Close vote modal"
                >
                  <span className="sr-only">Close</span>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Cast Your Vote
                  </h3>
                  <form onSubmit={handleVoteSubmit}>
                    <div className="mb-4">
                      <label htmlFor="candidate" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Candidate
                      </label>
                      <select
                        id="candidate"
                        value={selectedCandidate}
                        onChange={(e) => setSelectedCandidate(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      >
                        <option value="">Choose a candidate...</option>
                        {selectedElection?.candidates.map((candidate, index) => (
                          <option key={index} value={candidate.id}>
                            {candidate.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        disabled={isVoting}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                      >
                        {isVoting ? 'Casting Vote...' : 'Confirm Vote'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowVoteModal(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Active Elections</h1>
          {!account && <ConnectWallet />}
        </div>

        {error && !showVoteModal && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {elections.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-box-ballot text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Elections</h3>
            <p className="text-gray-500">There are no elections available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                onVoteClick={() => handleVoteClick(election)}
              />
            ))}
          </div>
        )}

        <VoteModal />
      </main>
      <Footer />
    </div>
  );
};

export default Elections;