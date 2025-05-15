import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useContract } from '../../context/ContractContext';

const AdminRoute = ({ children }) => {
  const { isConnected } = useContract(); // For demo, we don't check isAdmin
  const location = useLocation();

  // In demo mode, we only check if wallet is connected
  if (!isConnected) {
    toast.error('Please connect your wallet to access this page');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // For the demo, we skip the admin check and allow anyone through
  // who has gone through the admin login page
  
  return children;
};

export default AdminRoute; 