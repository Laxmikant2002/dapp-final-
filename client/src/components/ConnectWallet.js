import React, { useState } from 'react';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';

const ConnectWallet = () => {
  const { account, connectWallet } = useContract();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      const connectedAccount = await connectWallet();
      if (connectedAccount) {
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`!rounded-button ${
        isConnecting 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-custom hover:bg-custom/90'
      } text-white px-4 py-2 text-sm font-medium transition-colors`}
    >
      <i className={`fas ${isConnecting ? 'fa-spinner fa-spin' : 'fa-wallet'} mr-2`}></i>
      {isConnecting 
        ? 'Connecting...' 
        : account 
          ? `${account.slice(0, 6)}...${account.slice(-4)}` 
          : 'Connect Wallet'
      }
    </button>
  );
};

export default ConnectWallet; 