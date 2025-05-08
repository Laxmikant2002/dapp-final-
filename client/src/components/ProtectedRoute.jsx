import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { checkVoterStatus } from '../services/firebaseService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'sonner';

const ProtectedRoute = ({ children, requiresAuth = true, requiresVoter = true, requiresAdmin = false }) => {
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
          toast.error('Please connect your MetaMask wallet to continue');
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        if (requiresAdmin) {
          // Check if user is an admin
          const adminQuery = query(
            collection(db, 'users'),
            where('ethAddress', '==', account),
            where('isAdmin', '==', true)
          );
          const adminSnapshot = await getDocs(adminQuery);
          
          if (adminSnapshot.empty) {
            toast.error('Access denied. Admin privileges required.');
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
          }
        } else if (requiresVoter) {
          // Check voter status
          const voterStatus = await checkVoterStatus(account);
          
          if (voterStatus.status !== 'approved') {
            toast.error('Please complete voter registration to access this page');
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
          }
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Error checking authorization:', error);
        toast.error('Error checking authorization. Please try again.');
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [account, isConnected, requiresAuth, requiresVoter, requiresAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    // Store the attempted path for redirect after authentication
    sessionStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/" state={{ message: 'Please connect your wallet and complete registration to access this page' }} />;
  }

  return children;
};

export default ProtectedRoute; 