import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

const ProtectedRoute = ({ children, requiresAuth = true, requiresVoter = true }) => {
  const location = useLocation();
  const { address: account, isConnected } = useAccount();

  if (!requiresAuth) {
    return children;
  }

  if (!isConnected || !account) {
    toast.error('Please connect your MetaMask wallet to continue');
    return <Navigate to="/" state={{ message: 'Please connect your wallet to access this page' }} />;
  }

  // For now, we'll assume all connected wallets are approved voters
  // In a real application, you would check the voter status on the blockchain
  if (requiresVoter) {
    return children;
  }

  return children;
};

export default ProtectedRoute; 