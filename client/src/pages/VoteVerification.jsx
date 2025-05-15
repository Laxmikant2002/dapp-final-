import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useContract } from '../context/ContractContext';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const VoteVerification = () => {
  const { isConnected } = useContract();
  const [voteId, setVoteId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet to verify votes');
      return;
    }

    if (!voteId.trim()) {
      toast.error('Please enter a valid vote ID');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Simulate blockchain verification (would be replaced by actual contract call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll just check if the vote ID is valid format
      // In a real implementation, you would call contract.verifyVote(voteId)
      const isValidFormat = /^0x[a-fA-F0-9]{64}$/.test(voteId);
      
      if (isValidFormat) {
        setVerificationResult({
          success: true,
          electionId: '1',
          electionName: 'Board Election 2023',
          candidateId: '3',
          candidateName: 'Jane Smith',
          timestamp: Date.now(),
        });
        toast.success('Vote verified successfully');
      } else {
        setVerificationResult({
          success: false,
          message: 'Invalid vote ID format or vote not found',
        });
        toast.error('Vote verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        success: false,
        message: error.message || 'An error occurred during verification',
      });
      toast.error('Vote verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verify Your Vote</h1>
        <p className="mt-2 text-gray-600">
          Enter your vote ID or transaction hash to verify your vote on the blockchain
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleVerify}>
            <div className="mb-4">
              <label htmlFor="voteId" className="block text-sm font-medium text-gray-700">
                Vote ID / Transaction Hash
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="voteId"
                  name="voteId"
                  placeholder="0x..."
                  value={voteId}
                  onChange={(e) => setVoteId(e.target.value)}
                  className="input-field"
                  disabled={isVerifying}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                This is the unique identifier or transaction hash you received after casting your vote
              </p>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isVerifying || !isConnected}
                className={`w-full px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isVerifying || !isConnected
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Verifying Vote...
                  </span>
                ) : (
                  'Verify Vote'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className={`mt-8 rounded-lg shadow overflow-hidden ${
          verificationResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              {verificationResult.success ? (
                <FaCheckCircle className="h-8 w-8 text-green-500 mr-3" />
              ) : (
                <FaTimesCircle className="h-8 w-8 text-red-500 mr-3" />
              )}
              <h3 className={`text-lg font-medium ${
                verificationResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {verificationResult.success ? 'Vote Verified Successfully' : 'Vote Verification Failed'}
              </h3>
            </div>
            
            {verificationResult.success ? (
              <div className="mt-4 border-t border-green-200 pt-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Election</dt>
                    <dd className="mt-1 text-sm text-gray-900">{verificationResult.electionName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Candidate</dt>
                    <dd className="mt-1 text-sm text-gray-900">{verificationResult.candidateName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(verificationResult.timestamp).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-green-600">Verified</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="mt-2 text-sm text-red-700">
                {verificationResult.message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-10 bg-gray-50 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">How to Verify Your Vote</h3>
        <ol className="list-decimal pl-5 space-y-3 text-gray-600">
          <li>Connect your wallet using the button in the header</li>
          <li>Enter the Vote ID or transaction hash you received after voting</li>
          <li>Click "Verify Vote" to check your vote on the blockchain</li>
          <li>View the verification result showing your vote details</li>
        </ol>
        <p className="mt-4 text-sm text-gray-500">
          If you're having trouble, please contact support for assistance. Verification ensures
          your vote was properly recorded on the blockchain.
        </p>
      </div>
    </div>
  );
};

export default VoteVerification; 