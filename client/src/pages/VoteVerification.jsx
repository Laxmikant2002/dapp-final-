import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

const VoteVerification = () => {
  const navigate = useNavigate();
  const { contract, account } = useContract();
  const [verificationId, setVerificationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [qrData, setQrData] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!verificationId.trim()) {
      setErrorMessage('Please enter a transaction ID or voter ID');
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    try {
      // Mock verification process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock verification result
      const mockResult = {
        candidate: 'John Doe',
        timestamp: new Date().toISOString(),
        election: 'Student Council Election 2024',
        transactionId: verificationId,
        voterId: 'VOTER-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        blockNumber: Math.floor(Math.random() * 1000000),
        verificationHash: '0x' + Math.random().toString(16).substr(2, 64)
      };
      
      setVerificationResult(mockResult);
      setQrData(JSON.stringify(mockResult));
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Mock verification error:', error);
      setErrorMessage('Failed to verify vote. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-['Inter'] bg-gray-50 min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Vote Verification</h1>
                <p className="mt-2 text-gray-600">
                  Enter your transaction ID or voter ID to verify your vote on the blockchain.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label htmlFor="verificationId" className="block text-sm font-medium text-gray-700">
                    Transaction ID / Voter ID
                  </label>
                  <input
                    type="text"
                    id="verificationId"
                    value={verificationId}
                    onChange={(e) => setVerificationId(e.target.value)}
                    placeholder="Enter transaction ID or voter ID"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`!rounded-button ${
                      isLoading ? 'bg-gray-400' : 'bg-custom hover:bg-custom/90'
                    } text-white px-6 py-2 text-sm font-medium`}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle mr-2"></i>
                        Verify Vote
                      </>
                    )}
                  </button>
                </div>
              </form>

              {verificationResult && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold mb-4">Verification Result</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Election</p>
                        <p className="font-medium">{verificationResult.election}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Candidate</p>
                        <p className="font-medium">{verificationResult.candidate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Timestamp</p>
                        <p className="font-medium">
                          {new Date(verificationResult.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Voter ID</p>
                        <p className="font-medium">{verificationResult.voterId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Block Number</p>
                        <p className="font-medium">{verificationResult.blockNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Verification Hash</p>
                        <p className="font-mono text-sm break-all">
                          {verificationResult.verificationHash}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <div className="bg-white p-4 rounded-lg">
                        <QRCodeSVG value={qrData} size={200} />
                        <p className="text-sm text-gray-500 mt-2 text-center">Scan to verify</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <i className="fas fa-check text-green-600 text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold mb-2">Vote Verified Successfully!</h2>
              <p className="text-gray-600 mb-4">
                Your vote has been verified on the blockchain.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fas fa-exclamation text-red-600 text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default VoteVerification; 