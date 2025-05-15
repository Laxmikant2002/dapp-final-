import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
  const location = useLocation();

  // Check if admin is logged in using session storage
  if (!isAdminLoggedIn) {
    toast.error('Please log in as admin to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default AdminRoute; 