import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { isConnected } = useAccount();
  const location = useLocation();

  if (!isConnected) {
    toast.error('Please connect your wallet to access this page');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 