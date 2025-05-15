import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useContract } from '../context/ContractContext';
import { FaCaretDown, FaPowerOff, FaExchangeAlt } from 'react-icons/fa';

const ConnectWallet = () => {
  const { 
    account, 
    isConnected, 
    isLoading, 
    connectWallet, 
    disconnectWallet,
    isCorrectNetwork,
    switchNetwork
  } = useContract();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleSwitchNetwork = async () => {
    try {
      // Try to switch to Hardhat Local network first
      const success = await switchNetwork(1337);
      if (!success) {
        // If that fails, try Sepolia
        await switchNetwork(11155111);
      }
      setShowDropdown(false);
    } catch (error) {
      toast.error('Failed to switch network. Please switch manually in MetaMask.');
    }
  };
  
  const handleDisconnect = () => {
    disconnectWallet();
    setShowDropdown(false);
  };

  // If connected but on wrong network, show switch network button
  if (isConnected && !isCorrectNetwork) {
    return (
      <button
        onClick={handleSwitchNetwork}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
        <FaExchangeAlt className="mr-2" /> Switch Network
      </button>
    );
  }

  // Connected state with dropdown
  if (isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {account.slice(0, 6)}...{account.slice(-4)}
          <FaCaretDown className="ml-2" />
        </button>
        
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                onClick={handleDisconnect}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                role="menuitem"
              >
                <FaPowerOff className="mr-2 text-red-500" /> Disconnect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not connected state
  return (
    <button
      onClick={connectWallet}
      disabled={isLoading}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
        isLoading
          ? 'bg-indigo-400 cursor-not-allowed'
          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      }`}
    >
      {isLoading ? (
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