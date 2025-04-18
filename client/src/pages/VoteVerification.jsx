import React, { useState, useContext, useEffect } from 'react';
import { ContractContext } from '../context/ContractContext';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ConnectWallet from '../components/ConnectWallet';

const VoteVerification = () => {
  const { contract, account, isConnected, loading: contractLoading } = useContext(ContractContext);
  const [txHash, setTxHash] = useState('');
  const [result, setResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [loadingTx, setLoadingTx] = useState(false);

  useEffect(() => {
    if (isConnected && account) {
      getLatestVoteTransaction();
    }
  }, [isConnected, account]);

  const getLatestVoteTransaction = async () => {
    try {
      setLoadingTx(true);
      // Get the latest transactions for the connected account
      const transactions = await window.ethereum.request({
        method: 'eth_getTransactionsByAddress',
        params: [account]
      });

      // Find the most recent vote transaction
      const voteTransaction = transactions?.find(tx => 
        tx.to?.toLowerCase() === contract?.address?.toLowerCase() && 
        tx.input?.includes('castVote')
      );

      if (voteTransaction) {
        setTxHash(voteTransaction.hash);
        // Automatically verify the vote
        verifyVote(null, voteTransaction.hash);
      }
    } catch (err) {
      console.error('Error fetching transaction:', err);
    } finally {
      setLoadingTx(false);
    }
  };

  const verifyVote = async (e, hash = null) => {
    if (e) e.preventDefault();
    if (!contract || (!txHash && !hash)) return;

    try {
      setVerifying(true);
      setError('');
      setResult(null);

      const hashToVerify = hash || txHash;

      // Validate transaction hash format
      if (!hashToVerify.match(/^0x([A-Fa-f0-9]{64})$/)) {
        throw new Error('Invalid transaction hash format');
      }

      const voteData = await contract.verifyVote(hashToVerify);
      
      if (!voteData) {
        throw new Error('No vote found for this transaction');
      }

      setResult({
        electionTitle: voteData.electionTitle,
        timestamp: new Date(voteData.timestamp * 1000).toLocaleString(),
        blockNumber: voteData.blockNumber,
        verified: true
      });
    } catch (err) {
      setError(err.message || 'Failed to verify vote. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8" role="main">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Vote</h1>
            <p className="text-gray-600">Connect your wallet or enter your transaction hash to verify your vote on the blockchain</p>
          </div>

          {!isConnected && (
            <div className="mb-8">
              <ConnectWallet />
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Privacy Notice</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Your vote is anonymous and secure on the blockchain. The verification process only confirms that your vote was recorded correctly without revealing your choice. This ensures both transparency and privacy in the voting process.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={verifyVote} className="space-y-4">
              <div>
                <label htmlFor="txHash" className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Hash
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="txHash"
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder={loadingTx ? "Loading transaction..." : "0x..."}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    aria-label="Enter transaction hash"
                    aria-describedby="txHash-description"
                    required
                    pattern="^0x[a-fA-F0-9]{64}$"
                    disabled={loadingTx}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500" id="txHash-description">
                  {isConnected 
                    ? "Transaction hash will be automatically filled when you connect your wallet" 
                    : "Enter the transaction hash you received after casting your vote"}
                </p>
              </div>

              <button
                type="submit"
                disabled={verifying || !txHash || !isConnected || contractLoading || loadingTx}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200
                  ${verifying || !txHash || !isConnected || contractLoading || loadingTx
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                aria-label="Verify vote"
              >
                {verifying || loadingTx ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loadingTx ? 'Loading Transaction...' : 'Verifying...'}
                  </>
                ) : (
                  'Verify Vote'
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 bg-red-50 border border-red-200 rounded-md p-4"
                role="alert"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Verification Failed</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 bg-green-50 border border-green-200 rounded-md p-4"
                role="alert"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Vote Successfully Verified</h3>
                    <div className="mt-2 text-sm text-green-700 space-y-1">
                      <p>Your vote was successfully recorded in the following election:</p>
                      <p><strong>Election:</strong> {result.electionTitle}</p>
                      <p><strong>Timestamp:</strong> {result.timestamp}</p>
                      <p><strong>Block Number:</strong> {result.blockNumber}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                <strong>Where to find your transaction hash:</strong> After casting your vote, you received a transaction hash. You can find this in:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your MetaMask transaction history</li>
                <li>The email confirmation sent to your registered email address</li>
                <li>Your voting receipt if you downloaded one</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default VoteVerification; 