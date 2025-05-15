import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useContract } from '../context/ContractContext';

const ProtectedRoute = ({ children, requiresVoter = false }) => {
  const { isConnected } = useContract();
  const location = useLocation();

  // For demo, we only check if wallet is connected
  if (!isConnected) {
    toast.error('Please connect your wallet to access this page');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // For the demo, we skip the voter check
  // In a production environment, we would check if the user is a registered voter
  
  return children;
};

export default ProtectedRoute; 