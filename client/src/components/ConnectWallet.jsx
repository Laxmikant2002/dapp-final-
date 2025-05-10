import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { toast } from 'react-hot-toast';

const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { connect, isLoading: isConnecting } = useConnect({
    connector: new InjectedConnector(),
    onError: (error) => {
      toast.error(error.message || 'Failed to connect wallet');
    },
  });
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    try {
      await connect();
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  if (isConnected) {
    return (
      <button
        onClick={handleDisconnect}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Disconnect Wallet
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
        isConnecting
          ? 'bg-indigo-400 cursor-not-allowed'
          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      }`}
    >
      {isConnecting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Connecting...
        </>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
};

export default ConnectWallet; 