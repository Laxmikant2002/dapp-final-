import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { toast } from 'react-hot-toast';
import VoteABI from '../contracts/Vote.json';
import contractAddress from '../contracts/contract-address.json';

const ContractContext = createContext();

export { ContractContext };

export const ContractProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const provider = await detectEthereumProvider();
      
      if (provider) {
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          setupEventListeners();
          initializeContract();
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
      initializeContract();
    } else {
      setAccount(null);
      setIsConnected(false);
      setContract(null);
    }
  };

  const initializeContract = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const voteContract = new ethers.Contract(
        contractAddress.Vote,
        VoteABI.abi,
        signer
      );
      setContract(voteContract);
      setProvider(provider);

      // Check if connected account is admin
      const owner = await voteContract.owner();
      setIsAdmin(owner.toLowerCase() === account.toLowerCase());
    } catch (error) {
      console.error('Error initializing contract:', error);
      toast.error('Failed to initialize contract');
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        toast.error('Please install MetaMask!');
        return;
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setupEventListeners();
        await initializeContract();
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setIsAdmin(false);
    setContract(null);
    toast.success('Wallet disconnected');
  };

  // Contract interaction functions
  const getElections = async () => {
    try {
      if (!contract) throw new Error('Contract not initialized');
      const elections = await contract.candidateList();
      return elections;
    } catch (error) {
      console.error('Error getting elections:', error);
      toast.error('Failed to fetch elections');
      return [];
    }
  };

  const castVote = async (voterId, candidateId) => {
    try {
      if (!contract) throw new Error('Contract not initialized');
      const tx = await contract.vote(voterId, candidateId);
      await tx.wait();
      toast.success('Vote cast successfully!');
      return true;
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error(error.message || 'Failed to cast vote');
      return false;
    }
  };

  const getElectionResults = async () => {
    try {
      if (!contract) throw new Error('Contract not initialized');
      const results = await contract.result();
      return results;
    } catch (error) {
      console.error('Error getting election results:', error);
      toast.error('Failed to fetch election results');
      return [];
    }
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
      getElectionResults
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