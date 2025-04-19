import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import Vote from '../contracts/Vote.json';
import contractAddress from '../contracts/contract-address.json';

const ContractContext = createContext();

export { ContractContext };

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};

export const ContractProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  // Initialize provider
  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);

          // Listen for network changes
          window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
          });

          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
              disconnectWallet();
            } else {
              setAccount(accounts[0]);
            }
          });

          // Check if already connected
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const signer = provider.getSigner();
            setSigner(signer);
            setIsConnected(true);
          }
        } else {
          setNetworkError('Please install MetaMask to use this application');
        }
      } catch (error) {
        console.error('Provider initialization error:', error);
        setNetworkError('Failed to initialize Web3 provider');
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setNetworkError(null);

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application');
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const account = accounts[0];
      setAccount(account);

      // Get signer
      const signer = provider.getSigner();
      setSigner(signer);

      // Initialize contract
      const contract = new ethers.Contract(
        contractAddress.Vote,
        Vote.abi,
        signer
      );
      setContract(contract);

      // Verify network
      const network = await provider.getNetwork();
      if (network.chainId !== 31337) { // Hardhat network
        throw new Error('Please connect to the Hardhat network');
      }

      setIsConnected(true);
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Connection error:', error);
      setNetworkError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    setAccount('');
    setSigner(null);
    setContract(null);
    setIsConnected(false);
    setNetworkError(null);
    toast.success('Wallet disconnected');
  };

  return (
    <ContractContext.Provider
      value={{
        provider,
        signer,
        contract,
        account,
        isConnected,
        isLoading,
        networkError,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContext;