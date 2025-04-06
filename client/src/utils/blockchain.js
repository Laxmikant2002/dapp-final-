import { ethers } from 'ethers';
import ABI from '../contracts/Abi.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

export const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

export const getContract = () => {
  const provider = getProvider();
  if (!provider) return null;
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
};

export const getContractWithSigner = async () => {
  const provider = getProvider();
  if (!provider) return null;
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};

export const connectWallet = async () => {
  try {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      return address;
    } else {
      throw new Error('Please install MetaMask!');
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const isAdmin = async (address) => {
  try {
    const contract = getContract();
    if (!contract) return false;
    return await contract.electionCommission() === address;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const createElection = async (name, candidates, startDate, endDate) => {
  try {
    const contract = await getContractWithSigner();
    if (!contract) throw new Error('No contract found');
    
    const tx = await contract.createElection(
      name,
      candidates,
      Math.floor(startDate.getTime() / 1000),
      Math.floor(endDate.getTime() / 1000)
    );
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error creating election:', error);
    throw error;
  }
};

export const getElections = async () => {
  try {
    const contract = getContract();
    if (!contract) return [];
    
    const elections = await contract.getElections();
    return elections.map(election => ({
      id: election.id.toString(),
      name: election.name,
      status: election.status,
      startDate: election.startDate.toNumber(),
      endDate: election.endDate.toNumber(),
      candidates: election.candidates
    }));
  } catch (error) {
    console.error('Error fetching elections:', error);
    return [];
  }
};

export const vote = async (electionId, candidateId) => {
  try {
    const contract = await getContractWithSigner();
    if (!contract) throw new Error('No contract found');
    
    const tx = await contract.vote(electionId, candidateId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error voting:', error);
    throw error;
  }
};

export const getResults = async (electionId) => {
  try {
    const contract = getContract();
    if (!contract) return null;
    
    const results = await contract.getResults(electionId);
    return {
      candidates: results.candidates.map(candidate => ({
        name: candidate.name,
        votes: candidate.votes.toNumber(),
        percentage: (candidate.votes.toNumber() / results.totalVotes.toNumber() * 100).toFixed(2)
      })),
      totalVotes: results.totalVotes.toNumber()
    };
  } catch (error) {
    console.error('Error fetching results:', error);
    return null;
  }
};

export const endElection = async (electionId) => {
  try {
    const contract = await getContractWithSigner();
    if (!contract) throw new Error('No contract found');
    
    const tx = await contract.endElection(electionId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error ending election:', error);
    throw error;
  }
};

export const deleteElection = async (electionId) => {
  try {
    const contract = await getContractWithSigner();
    if (!contract) throw new Error('No contract found');
    
    const tx = await contract.deleteElection(electionId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error deleting election:', error);
    throw error;
  }
};

export const hasVoted = async (electionId) => {
  try {
    const contract = getContract();
    if (!contract) return false;
    
    const address = await connectWallet();
    return await contract.hasVoted(electionId, address);
  } catch (error) {
    console.error('Error checking vote status:', error);
    return false;
  }
};

export const getElectionStatus = async (electionId) => {
  try {
    const contract = getContract();
    if (!contract) return null;
    
    const election = await contract.getElection(electionId);
    const now = Math.floor(Date.now() / 1000);
    
    if (now < election.startDate.toNumber()) return 'upcoming';
    if (now > election.endDate.toNumber()) return 'ended';
    return 'active';
  } catch (error) {
    console.error('Error getting election status:', error);
    return null;
  }
};

export const isAdminUser = async (address, contract) => {
  try {
    if (!contract || !address) return false;
    const electionCommission = await contract.electionCommission();
    return electionCommission.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};