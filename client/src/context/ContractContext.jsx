import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import Voting from '../contracts/Voting.json';
import contractAddress from '../contracts/contract-address.json';

// Define supported network IDs
const SUPPORTED_NETWORKS = {
  1337: 'Hardhat Local',
  31337: 'Hardhat',
  11155111: 'Sepolia Testnet'
};

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
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVoter, setIsVoter] = useState(false);

  // Helper to check if network is supported
  const checkNetwork = (networkId) => {
    const isSupported = Object.keys(SUPPORTED_NETWORKS).includes(networkId.toString());
    setIsCorrectNetwork(isSupported);
    setNetworkName(isSupported ? SUPPORTED_NETWORKS[networkId] : `Unsupported Network (${networkId})`);
    return isSupported;
  };

  // Helper to initialize contract
  const initContract = async (provider, account) => {
    if (!provider || !account) {
      setContract(null);
      return;
    }

    try {
      // Get network information
      const network = await provider.getNetwork();
      setChainId(network.chainId);
      
      // Check if on supported network
      const isSupported = checkNetwork(network.chainId);
      if (!isSupported) {
        setNetworkError(`Please switch to a supported network (Hardhat Local or Sepolia Testnet)`);
        return;
      }

      const signer = provider.getSigner();
      setSigner(signer);
      const votingContract = new ethers.Contract(
        contractAddress.Voting,
        Voting.abi,
        signer
      );
      setContract(votingContract);
      setIsConnected(true);
      setNetworkError(null);
      
      // Check roles here
      checkRoles(votingContract, account);
    } catch (err) {
      setContract(null);
      setNetworkError('Failed to initialize contract');
      setIsConnected(false);
    }
  };

  // Listen for wallet/network changes and re-init contract
  useEffect(() => {
    let eth = window.ethereum;
    if (!eth) {
      setNetworkError('Please install MetaMask to use this application');
      return;
    }
    const provider = new ethers.providers.Web3Provider(eth);
    setProvider(provider);

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount('');
        setIsConnected(false);
        setContract(null);
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
        initContract(provider, accounts[0]);
      }
    };

    const handleChainChanged = (_chainId) => {
      const chainIdNum = parseInt(_chainId, 16);
      setChainId(chainIdNum);
      checkNetwork(chainIdNum);
      
      // Re-init contract on network change
      provider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          initContract(provider, accounts[0]);
        } else {
          setAccount('');
          setIsConnected(false);
          setContract(null);
        }
      });
    };

    eth.on('accountsChanged', handleAccountsChanged);
    eth.on('chainChanged', handleChainChanged);

    // Initial connect
    provider.listAccounts().then(accounts => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        initContract(provider, accounts[0]);
      }
    });

    provider.getNetwork().then(net => {
      setChainId(net.chainId);
      checkNetwork(net.chainId);
    });

    return () => {
      if (eth.removeListener) {
        eth.removeListener('accountsChanged', handleAccountsChanged);
        eth.removeListener('chainChanged', handleChainChanged);
      }
    };
    // eslint-disable-next-line
  }, []);

  // Check roles helper
  const checkRoles = async (contractInstance, address) => {
    if (!contractInstance || !address) return;
    try {
      const [adminStatus, voterStatus] = await Promise.all([
        contractInstance.isAdmin(address),
        contractInstance.isVoter(address)
      ]);
      setIsAdmin(adminStatus);
      setIsVoter(voterStatus);
    } catch (error) {
      setIsAdmin(false);
      setIsVoter(false);
    }
  };

  // Helper to switch networks
  const switchNetwork = async (chainId) => {
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      
      return true;
    } catch (error) {
      console.error('Error switching network:', error);
      return false;
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setNetworkError(null);
    try {
      if (!window.ethereum) throw new Error('Please install MetaMask to use this application');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsConnected(true);
      
      if (provider) {
        // Get current network
        const network = await provider.getNetwork();
        const isSupported = checkNetwork(network.chainId);
        
        if (!isSupported) {
          // Try to switch to Hardhat local network
          const switched = await switchNetwork(1337);
          if (!switched) {
            toast.error('Please switch to a supported network in MetaMask');
          }
        }
        
        await initContract(provider, accounts[0]);
      }
      
      toast.success('Wallet connected successfully');
    } catch (error) {
      setNetworkError(error.message);
      toast.error(`Connection error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setSigner(null);
    setContract(null);
    setIsConnected(false);
    setNetworkError(null);
    setIsAdmin(false);
    setIsVoter(false);
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
        chainId,
        networkName,
        isCorrectNetwork,
        isAdmin,
        isVoter,
        connectWallet,
        disconnectWallet,
        switchNetwork
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContext;