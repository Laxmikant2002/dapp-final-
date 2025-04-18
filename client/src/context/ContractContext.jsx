import React, { createContext, useContext, useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import ABI from '../contracts/Abi.json';
import { toast } from 'sonner';

const ContractContext = createContext();

export { ContractContext };

export const ContractProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Mock data for testing
  const mockElections = [
    {
      id: 1,
      title: "Student Council Election 2024",
      description: "Vote for your student council representatives",
      startTime: Date.now() / 1000,
      endTime: (Date.now() / 1000) + 86400,
      isActive: true,
      candidates: [
        { name: "John Doe", description: "Computer Science", voteCount: 150 },
        { name: "Jane Smith", description: "Business Administration", voteCount: 120 },
        { name: "Mike Johnson", description: "Engineering", voteCount: 90 }
      ]
    },
    {
      id: 2,
      title: "Department Head Election",
      description: "Select your department head",
      startTime: Date.now() / 1000,
      endTime: (Date.now() / 1000) + 172800,
      isActive: true,
      candidates: [
        { name: "Dr. Sarah Wilson", description: "Computer Science", voteCount: 200 },
        { name: "Dr. Robert Brown", description: "Engineering", voteCount: 180 }
      ]
    }
  ];

  const mockVoters = [
    {
      name: "Alice Cooper",
      email: "alice@example.com",
      phone: "1234567890",
      voterAddress: "0x456...",
      isRegistered: true
    },
    {
      name: "Bob Wilson",
      email: "bob@example.com",
      phone: "0987654321",
      voterAddress: "0x789...",
      isRegistered: true
    }
  ];

  // Mock functions
  const getElections = async () => {
    return mockElections;
  };

  const castVote = async (electionId, candidateId) => {
    toast.success('Vote cast successfully!');
    return true;
  };

  const getElectionResults = async (electionId) => {
    const election = mockElections.find(e => e.id === electionId);
    if (!election) return [];
    
    const totalVotes = election.candidates.reduce((sum, c) => sum + c.voteCount, 0);
    return election.candidates.map(c => ({
      name: c.name,
      votes: c.voteCount,
      percentage: totalVotes > 0 ? (c.voteCount / totalVotes) * 100 : 0
    }));
  };

  const verifyVote = async (input) => {
    return {
      electionTitle: "Student Council Election 2024",
      timestamp: Date.now() / 1000,
      blockNumber: 12345,
      verified: true
    };
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      // Simulate MetaMask connection
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      const mockAccount = '0x123...';
      setAccount(mockAccount);
      setIsConnected(true);
      toast.success('Wallet connected successfully!');
      return mockAccount;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setIsAdmin(false);
    toast.success('Wallet disconnected');
  };

  return (
    <ContractContext.Provider value={{ 
      account, 
      contract, 
      isLoading,
      isConnected,
      connectWallet,
      disconnectWallet,
      isAdmin,
      provider,
      getElections,
      castVote,
      getElectionResults,
      verifyVote
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