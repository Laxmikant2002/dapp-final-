import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ABI from '../contracts/Abi.json';
import { toast } from 'sonner';

const ContractContext = createContext();

export { ContractContext };

export const ContractProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [provider, setProvider] = useState(null);

  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

  const initializeContract = async (provider, signer) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      return contract;
    } catch (error) {
      console.error('Contract initialization error:', error);
      throw error;
    }
  };

  const initialize = async () => {
    try {
      setIsLoading(true);
      
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        
        const signer = provider.getSigner();
        const contract = await initializeContract(provider, signer);
        setContract(contract);
        
        // Check if user is already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // Check if user is admin
          const isAdminUser = await checkAdminStatus(accounts[0], contract);
          setIsAdmin(isAdminUser);
        }
      } else {
        toast.error('Please install MetaMask to use this application');
      }
    } catch (error) {
      console.error('Initialization error:', error);
      toast.error('Failed to initialize the application');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask');
        return null;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const account = accounts[0];
      setAccount(account);
      
      // Reinitialize contract with new account
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = await initializeContract(provider, signer);
      setContract(contract);
      
      // Check if user is admin
      const isAdminUser = await checkAdminStatus(account, contract);
      setIsAdmin(isAdminUser);
      
      toast.success('Wallet connected successfully!');
      return account;
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet');
      throw error;
    }
  };

  // Check if user is admin
  const checkAdminStatus = async (address, contractInstance) => {
    try {
      if (!contractInstance || !address) return false;
      const electionCommission = await contractInstance.electionCommission();
      return electionCommission.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Fetch all active elections
  const getElections = async () => {
    try {
      if (!contract) throw new Error('Contract not initialized');
      const electionCount = await contract.electionCount();
      const elections = [];

      for (let i = 1; i <= electionCount; i++) {
        const election = await contract.elections(i);
        if (election.isActive) {
          elections.push({
            id: i,
            title: election.title,
            description: election.description,
            candidates: election.candidates,
            isActive: election.isActive
          });
        }
      }

      return elections;
    } catch (error) {
      console.error('Error fetching elections:', error);
      throw error;
    }
  };

  // Cast a vote for a candidate in an election
  const castVote = async (electionId, candidateId) => {
    try {
      if (!contract) throw new Error('Contract not initialized');
      const tx = await contract.castVote(electionId, candidateId);
      await tx.wait();
      toast.success('Vote cast successfully!');
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error('Failed to cast vote. Please try again.');
      throw error;
    }
  };

  // Fetch election results
  const getElectionResults = async (electionId) => {
    try {
      if (!contract) throw new Error('Contract not initialized');
      const candidates = await contract.getCandidates(electionId);
      const totalVotes = candidates.reduce((sum, c) => sum + c.votes.toNumber(), 0);

      return candidates.map((c) => ({
        name: c.name,
        votes: c.votes.toNumber(),
        percentage: totalVotes > 0 ? (c.votes.toNumber() / totalVotes) * 100 : 0
      }));
    } catch (error) {
      console.error('Error fetching election results:', error);
      throw error;
    }
  };

  // Verify a vote by transaction hash or wallet address
  const verifyVote = async (input) => {
    try {
      if (!contract) throw new Error('Contract not initialized');
      const isTxHash = input.startsWith('0x') && input.length === 66;
      const isWalletAddress = input.startsWith('0x') && input.length === 42;

      if (isTxHash) {
        const receipt = await provider.getTransactionReceipt(input);
        if (!receipt) throw new Error('Transaction not found');
        return receipt;
      } else if (isWalletAddress) {
        const vote = await contract.getVoteByAddress(input);
        return vote;
      } else {
        throw new Error('Invalid input format');
      }
    } catch (error) {
      console.error('Error verifying vote:', error);
      throw error;
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        setAccount(accounts[0]);
        // Reinitialize contract with new account
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = await initializeContract(provider, signer);
        setContract(contract);
        
        // Check if user is admin
        const isAdminUser = await checkAdminStatus(accounts[0], contract);
        setIsAdmin(isAdminUser);
      });

      window.ethereum.on('chainChanged', () => {
        // Reload the page on chain change
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  // Add event listeners for contract events
  useEffect(() => {
    if (!contract) return;

    const handleElectionCreated = (electionId) => {
      toast.info(`New election created: ${electionId}`);
    };

    const handleVoteCast = (voter, electionId, candidateId) => {
      toast.success(`Vote cast in election ${electionId} for candidate ${candidateId}`);
    };

    const handleElectionEnded = (electionId) => {
      toast.info(`Election ${electionId} has ended`);
    };

    contract.on('ElectionCreated', handleElectionCreated);
    contract.on('VoteCast', handleVoteCast);
    contract.on('ElectionEnded', handleElectionEnded);

    return () => {
      contract.off('ElectionCreated', handleElectionCreated);
      contract.off('VoteCast', handleVoteCast);
      contract.off('ElectionEnded', handleElectionEnded);
    };
  }, [contract]);

  return (
    <ContractContext.Provider value={{ 
      account, 
      contract, 
      isLoading,
      connectWallet,
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