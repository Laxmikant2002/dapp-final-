import React, { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { toast } from 'sonner';

const ConnectWallet = () => {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast.error('Please install MetaMask to use this application');
        return;
      }

      // Get the injected connector
      const injectedConnector = connectors.find(c => c.id === 'injected');
      if (!injectedConnector) {
        toast.error('MetaMask connector not found');
        return;
      }

      // Connect to MetaMask
      await connect({ connector: injectedConnector });
      
      // Request account access
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{
          eth_accounts: {}
        }]
      });

      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Connection error:', error);
      if (error.code === 4001) {
        toast.error('Please connect your wallet to continue');
      } else {
        toast.error('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Connect MetaMask
          </>
        )}
      </button>
      {!window.ethereum && (
        <p className="text-sm text-gray-500">
          Please install{' '}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-500"
          >
            MetaMask
          </a>{' '}
          to use this application
        </p>
      )}
    </div>
  );
};

export default ConnectWallet; 