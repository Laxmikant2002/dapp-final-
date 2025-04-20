import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { checkVoterStatus } from '../services/firebaseService';

const ProtectedRoute = ({ children, requiresAuth = true, requiresVoter = true }) => {
  const location = useLocation();
  const { address: account, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        if (!requiresAuth) {
          setIsAuthorized(true);
          setLoading(false);
          return;
        }

        if (!isConnected || !account) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        if (requiresVoter) {
          const voterStatus = await checkVoterStatus(account);
          setIsAuthorized(voterStatus.status === 'approved');
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Error checking authorization:', error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [account, isConnected, requiresAuth, requiresVoter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    // Store the attempted path in sessionStorage
    sessionStorage.setItem('redirectPath', location.pathname);
    
    return (
      <Navigate
        to="/"
        replace={true}
        state={{ 
          from: location,
          message: !isConnected 
            ? "Please connect your wallet to access this page"
            : "You need to be a registered voter to access this page"
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute; 