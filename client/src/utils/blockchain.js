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

export const startElection = async (startTime, endTime) => {
  try {
    const contract = await getContractWithSigner();
    if (!contract) throw new Error('No contract found');
    
    const tx = await contract.voteTime(startTime, endTime);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error starting election:', error);
    throw error;
  }
};

export const registerCandidate = async (name, party, age, gender) => {
  try {
    const contract = await getContractWithSigner();
    if (!contract) throw new Error('No contract found');
    
    const tx = await contract.candidateRegister(name, party, age, gender);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error registering candidate:', error);
    throw error;
  }
};

export const getCandidates = async () => {
  try {
    const contract = getContract();
    if (!contract) return [];
    
    const candidates = await contract.candidateList();
    return candidates;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
};

export const registerVoter = async (name, age, gender) => {
  try {
    const contract = await getContractWithSigner();
    if (!contract) throw new Error('No contract found');
    
    const tx = await contract.voterRegister(name, age, gender);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error registering voter:', error);
    throw error;
  }
};

export const vote = async (voterId, candidateId) => {
  try {
    const contract = await getContractWithSigner();
    if (!contract) throw new Error('No contract found');
    
    const tx = await contract.vote(voterId, candidateId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error voting:', error);
    throw error;
  }
};

export const getResults = async () => {
  try {
    const contract = getContract();
    if (!contract) return null;
    
    const pollInfo = await contract.EcPollInfo();
    return {
      pollId: pollInfo[0].toString(),
      winnerName: pollInfo[1],
      partyName: pollInfo[2],
      winnerAddress: pollInfo[3]
    };
  } catch (error) {
    console.error('Error fetching results:', error);
    return null;
  }
};

export const endElection = async () => {
  try {
    const contract = await getContractWithSigner();
    if (!contract) throw new Error('No contract found');
    
    const tx = await contract.result();
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error ending election:', error);
    throw error;
  }
};

export const emergencyEndElection = async () => {
  try {
    const contract = await getContractWithSigner();
    if (!contract) throw new Error('No contract found');
    
    const tx = await contract.emergency();
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error ending election:', error);
    throw error;
  }
};

export const hasVoted = async () => {
  try {
    const contract = getContract();
    if (!contract) return false;
    
    return await contract.checkVotedOrNot();
  } catch (error) {
    console.error('Error checking vote status:', error);
    return false;
  }
};

export const isVoterRegistered = async () => {
  try {
    const contract = getContract();
    if (!contract) return false;
    
    return await contract.checkVoterRegistered();
  } catch (error) {
    console.error('Error checking voter registration:', error);
    return false;
  }
};

export const getVoterId = async () => {
  try {
    const contract = getContract();
    if (!contract) return 0;
    
    return await contract.checkVoterID();
  } catch (error) {
    console.error('Error getting voter ID:', error);
    return 0;
  }
};

export const getElectionStatus = async () => {
  try {
    const contract = getContract();
    if (!contract) return null;
    
    const status = await contract.votingStatus();
    const startTime = await contract.startTime();
    const endTime = await contract.endTime();
    
    return {
      status,
      startTime: startTime.toNumber(),
      endTime: endTime.toNumber()
    };
  } catch (error) {
    console.error('Error getting election status:', error);
    return null;
  }
};

export const submitFeedback = async (feedback) => {
  try {
    const contract = await getContractWithSigner();
    if (!contract) throw new Error('No contract found');
    
    const tx = await contract.submitFeedback(feedback);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

export const verifyVoteByTxHash = async (txHash) => {
  try {
    const provider = getProvider();
    if (!provider) throw new Error('No provider found');
    
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) throw new Error('Transaction not found');
    
    // Get the transaction
    const tx = await provider.getTransaction(txHash);
    if (!tx) throw new Error('Transaction not found');
    
    // Get the block
    const block = await provider.getBlock(receipt.blockNumber);
    if (!block) throw new Error('Block not found');
    
    // Get the contract
    const contract = getContract();
    if (!contract) throw new Error('No contract found');
    
    // Check if the transaction was to our contract
    if (tx.to.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase()) {
      throw new Error('Transaction was not to the voting contract');
    }
    
    // Check if the transaction was a vote
    const voteEvent = receipt.logs.find(log => {
      try {
        const parsedLog = contract.interface.parseLog(log);
        return parsedLog.name === 'voter';
      } catch (e) {
        return false;
      }
    });
    
    if (!voteEvent) {
      throw new Error('Transaction was not a vote');
    }
    
    // Parse the vote event
    const parsedLog = contract.interface.parseLog(voteEvent);
    const voterName = parsedLog.args[0];
    const candidateId = parsedLog.args[1].toString();
    const voterAddress = parsedLog.args[2];
    const electionCommission = parsedLog.args[3];
    const pollId = parsedLog.args[4].toString();
    
    // Get candidate details
    const candidates = await contract.candidateList();
    const candidate = candidates.find(c => c.candidateId.toString() === candidateId);
    
    return {
      voterName,
      candidateName: candidate ? candidate.name : 'Unknown',
      candidateParty: candidate ? candidate.party : 'Unknown',
      voterAddress,
      electionCommission,
      pollId,
      timestamp: block.timestamp
    };
  } catch (error) {
    console.error('Error verifying vote:', error);
    throw error;
  }
};

export const verifyVoteByAddress = async (address) => {
  try {
    const contract = getContract();
    if (!contract) throw new Error('No contract found');
    
    // Check if the address has voted
    const hasVoted = await contract.checkVotedOrNot();
    if (!hasVoted) {
      throw new Error('Address has not voted');
    }
    
    // Get the voter ID
    const voterId = await contract.checkVoterID();
    if (voterId === 0) {
      throw new Error('Voter ID not found');
    }
    
    // Get the election status
    const status = await contract.votingStatus();
    
    // Get the candidates
    const candidates = await contract.candidateList();
    
    // Find the candidate the voter voted for
    let votedCandidate = null;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      if (candidate.votes > 0) {
        votedCandidate = candidate;
        break;
      }
    }
    
    if (!votedCandidate) {
      throw new Error('No vote found for this address');
    }
    
    return {
      voterAddress: address,
      candidateName: votedCandidate.name,
      candidateParty: votedCandidate.party,
      electionTitle: `Election ${await contract.nextPollId()}`,
      timestamp: Math.floor(Date.now() / 1000) // Approximate timestamp
    };
  } catch (error) {
    console.error('Error verifying vote:', error);
    throw error;
  }
};