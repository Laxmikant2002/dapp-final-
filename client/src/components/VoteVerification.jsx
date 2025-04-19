import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useContract } from '../context/ContractContext';
import { checkIfUserVoted } from '../services/firebaseService';

const VoteVerification = ({ electionId }) => {
  const { contract, account } = useContract();
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifyVote = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      // Check Firebase vote status
      const firebaseVoteExists = await checkIfUserVoted(electionId, account);
      
      // Check blockchain vote status
      const blockchainVoteExists = await contract.checkVoting(electionId, account);
      
      const result = {
        walletAddress: account,
        firebaseStatus: firebaseVoteExists ? 'Vote found' : 'No vote found',
        blockchainStatus: blockchainVoteExists ? 'Vote found' : 'No vote found',
        timestamp: new Date().toLocaleString(),
        match: firebaseVoteExists === blockchainVoteExists
      };

      setVerificationResult(result);
      
      if (!result.match) {
        toast.error('Vote status mismatch between Firebase and blockchain!');
      } else {
        toast.success('Vote verification completed');
      }
    } catch (error) {
      console.error('Error verifying vote:', error);
      toast.error('Failed to verify vote: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4">Vote Verification</h2>
      
      <button
        onClick={verifyVote}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Verifying...' : 'Verify My Vote'}
      </button>

      {verificationResult && (
        <div className="mt-4 space-y-2">
          <div className="border-t pt-4">
            <h3 className="font-semibold">Verification Results:</h3>
            <p className="text-sm text-gray-600">
              <strong>Wallet:</strong> {verificationResult.walletAddress}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Firebase:</strong>{' '}
              <span className={verificationResult.firebaseStatus === 'Vote found' ? 'text-green-600' : 'text-red-600'}>
                {verificationResult.firebaseStatus}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <strong>Blockchain:</strong>{' '}
              <span className={verificationResult.blockchainStatus === 'Vote found' ? 'text-green-600' : 'text-red-600'}>
                {verificationResult.blockchainStatus}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <strong>Timestamp:</strong> {verificationResult.timestamp}
            </p>
            <p className="text-sm mt-2">
              <strong>Status:</strong>{' '}
              <span className={verificationResult.match ? 'text-green-600' : 'text-red-600'}>
                {verificationResult.match ? 'Records match ✓' : 'Records mismatch ⚠️'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoteVerification; 