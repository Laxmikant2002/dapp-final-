import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ABI from '../contracts/Abi.json';
import { toast } from 'sonner';

const ContractContext = createContext();

export { ContractContext };

export const ContractProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = async (contractInstance, address) => {
    try {
      if (!contractInstance || !address) return false;
      const electionCommission = await contractInstance.electionCommission();
      return address.toLowerCase() === electionCommission.toLowerCase();
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  const initializeContract = async (provider, signer) => {
    try {
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      console.log('Initializing contract with address:', contractAddress);
      console.log('Network details:', await provider.getNetwork());

      if (!contractAddress) {
        throw new Error('Contract address not found in environment variables');
      }

      // Create contract instance
      console.log('Creating contract instance...');
      const contractInstance = new ethers.Contract(contractAddress, ABI, signer);
      
      // Verify contract connection
      try {
        console.log('Verifying contract connection...');
        const electionCommission = await contractInstance.electionCommission();
        console.log('Contract connected successfully. Election Commission:', electionCommission);
        
        // Check admin status
        const signerAddress = await signer.getAddress();
        const adminStatus = await checkAdminStatus(contractInstance, signerAddress);
        setIsAdmin(adminStatus);
        
        return contractInstance;
      } catch (error) {
        console.error('Contract verification failed:', {
          error: error.message,
          code: error.code,
          contractAddress: contractAddress,
          network: await provider.getNetwork()
        });
        throw new Error('Failed to verify contract. Please ensure you are connected to Hardhat network and the contract is deployed.');
      }
    } catch (error) {
      console.error('Contract initialization error:', {
        error: error.message,
        code: error.code,
        contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS
      });
      throw error;
    }
  };

  const initialize = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        const expectedNetworkId = parseInt(process.env.REACT_APP_NETWORK_ID);

        console.log('Current network:', network.chainId);
        console.log('Expected network:', expectedNetworkId);

        if (network.chainId !== expectedNetworkId) {
          console.log('Wrong network detected. Attempting to switch...');
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${expectedNetworkId.toString(16)}` }],
            });
            console.log('Network switch successful');
          } catch (switchError) {
            console.error('Network switch error:', switchError);
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: `0x${expectedNetworkId.toString(16)}`,
                      chainName: 'Hardhat Network',
                      nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18
                      },
                      rpcUrls: ['http://127.0.0.1:8545']
                    }
                  ]
                });
                console.log('Network added successfully');
              } catch (addError) {
                console.error('Network add error:', addError);
                throw addError;
              }
            } else {
              throw switchError;
            }
          }
          provider = new ethers.providers.Web3Provider(window.ethereum);
        }

        const accounts = await provider.listAccounts();
        console.log('Connected accounts:', accounts);

        if (accounts.length > 0) {
          const signer = provider.getSigner();
          const address = accounts[0];
          setAccount(address);
          
          console.log('Initializing contract...');
          const contractInstance = await initializeContract(provider, signer);
          console.log('Contract initialized successfully');
          setContract(contractInstance);
          
          // Update admin status
          const adminStatus = await checkAdminStatus(contractInstance, address);
          setIsAdmin(adminStatus);
          console.log('Admin status:', adminStatus);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        toast.error(error.message || 'Failed to initialize. Please make sure your MetaMask is connected to the Hardhat network.');
      }
    } else {
      toast.error('Please install MetaMask to use this application');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initialize();

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setIsAdmin(false);
        setContract(null);
      } else {
        const address = accounts[0];
        setAccount(address);
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = await initializeContract(provider, signer);
          setContract(contractInstance);
          
          // Update admin status when account changes
          const adminStatus = await checkAdminStatus(contractInstance, address);
          setIsAdmin(adminStatus);
          console.log('Admin status updated:', adminStatus);
        } catch (error) {
          console.error('Account change error:', error);
          toast.error('Failed to update account. Please make sure you are on the Hardhat network.');
        }
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask!');
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const signer = provider.getSigner();
      const address = accounts[0];
      setAccount(address);
      console.log("Account set in context:", address);

      const contractInstance = await initializeContract(provider, signer);
      if (contractInstance) {
        setContract(contractInstance);
        // Update admin status after wallet connection
        const adminStatus = await checkAdminStatus(contractInstance, address);
        setIsAdmin(adminStatus);
        console.log('Admin status after connection:', adminStatus);
      }

      return address;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  };

  return (
    <ContractContext.Provider value={{ 
      account, 
      isAdmin, 
      contract, 
      isLoading,
      connectWallet 
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