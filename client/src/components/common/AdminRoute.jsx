import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  // For now, we'll use a simple localStorage check
  const isAdmin = localStorage.getItem('adminToken') === 'dev-token';

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute; 