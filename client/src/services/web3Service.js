import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

// Import contract ABI and address
// You'll need to replace these with your actual contract ABI and address
import VoteABI from '../contracts/Vote.json';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
    this.contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  }

  async init() {
    try {
      // Check if MetaMask is installed
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        console.error('Please install MetaMask!');
        return false;
      }

      // Create ethers provider
      this.provider = new ethers.providers.Web3Provider(provider);
      
      // Request account access
      await provider.request({ method: 'eth_requestAccounts' });
      
      // Get the signer
      this.signer = this.provider.getSigner();
      
      // Get the account
      this.account = await this.signer.getAddress();
      
      // Create contract instance
      this.contract = new ethers.Contract(
        this.contractAddress,
        VoteABI.abi,
        this.signer
      );
      
      console.log('Web3 initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Web3:', error);
      return false;
    }
  }

  // Get the current account
  async getAccount() {
    if (!this.account) {
      const accounts = await this.provider.listAccounts();
      this.account = accounts[0];
    }
    return this.account;
  }

  // Get the contract instance
  getContract() {
    return this.contract;
  }

  // Get the provider
  getProvider() {
    return this.provider;
  }

  // Get the signer
  getSigner() {
    return this.signer;
  }

  // Verify vote by transaction hash
  async verifyVoteByTxHash(txHash) {
    try {
      // Get transaction receipt
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        throw new Error('Transaction not found');
      }
      
      // Get transaction
      const tx = await this.provider.getTransaction(txHash);
      
      // Get block
      const block = await this.provider.getBlock(receipt.blockNumber);
      
      // Mock verification result
      // In a real implementation, you would verify the vote on the blockchain
      return {
        candidateName: 'John Doe',
        electionTitle: 'Student Council Election 2024',
        timestamp: block.timestamp,
        transactionHash: txHash
      };
    } catch (error) {
      console.error('Error verifying vote by transaction hash:', error);
      throw error;
    }
  }

  // Verify vote by address
  async verifyVoteByAddress(address) {
    try {
      // Mock verification result
      // In a real implementation, you would verify the vote on the blockchain
      return {
        candidateName: 'Jane Smith',
        electionTitle: 'Student Council Election 2024',
        timestamp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        voterAddress: address
      };
    } catch (error) {
      console.error('Error verifying vote by address:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const web3Service = new Web3Service();
export default web3Service; 