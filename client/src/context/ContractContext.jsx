import React, { createContext, useContext, useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import ABI from '../contracts/Abi.json';
import { toast } from 'sonner';

const ContractContext = createContext();

export { ContractContext };

export const ContractProvider = ({ children }) => {
  const [account, setAccount] = useState('0x1234...5678'); // Mock account
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock initializeContract function
  const initializeContract = async (provider, signer) => {
    return {
      // Mock contract methods
      voterRegister: async () => ({ wait: async () => {} }),
      candidateRegister: async () => ({ wait: async () => {} }),
      checkVoterRegistered: async () => false,
      checkCandidateRegistered: async () => false,
      electionCommission: async () => '0x0000000000000000000000000000000000000000',
    };
  };

  // Mock initialize function
  const initialize = async () => {
    try {
      // Mock contract initialization
      const mockContract = await initializeContract(null, null);
      setContract(mockContract);
      
      // Check if user is already logged in
      const storedRole = localStorage.getItem('userRole');
      const storedEmail = localStorage.getItem('userEmail');
      if (storedRole && storedEmail) {
        setUserRole(storedRole);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Mock initialization error:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initialize();
  }, []); // Remove initialize from dependency array as it's defined in the same scope

  // Mock connectWallet function
  const connectWallet = async () => {
    try {
      // Mock wallet connection
      const mockAccount = '0x1234...5678';
      setAccount(mockAccount);
      toast.success('Mock wallet connected successfully!');
      return mockAccount;
    } catch (error) {
      console.error('Mock connection error:', error);
      throw error;
    }
  };

  const login = async (email, role) => {
    try {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', role);
      setUserRole(role);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setUserRole(null);
    setIsAuthenticated(false);
  };

  return (
    <ContractContext.Provider value={{ 
      account, 
      contract, 
      isLoading,
      connectWallet,
      userRole,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};