import { useState, useEffect } from 'react';
import { useContract } from '../../context/ContractContext';

export const useElection = (electionId) => {
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { contract } = useContract();

  useEffect(() => {
    const fetchElection = async () => {
      try {
        setLoading(true);
        if (!contract || !electionId) return;

        const electionData = await contract.getElection(electionId);
        
        setElection({
          id: electionId,
          name: electionData[1],
          description: electionData[2],
          endTime: new Date(electionData[3] * 1000),
          isActive: electionData[4],
          totalVotes: electionData[5].toString()
        });
      } catch (err) {
        setError(err);
        console.error('Error fetching election:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, [contract, electionId]);

  const refreshElection = async () => {
    setLoading(true);
    try {
      if (!contract || !electionId) {
        throw new Error("Contract or election ID not available");
      }
      
      const electionData = await contract.getElection(electionId);
      
      setElection({
        id: electionId,
        name: electionData[1],
        description: electionData[2],
        endTime: new Date(electionData[3] * 1000),
        isActive: electionData[4],
        totalVotes: electionData[5].toString()
      });
    } catch (err) {
      setError(err);
      console.error('Error refreshing election:', err);
    } finally {
      setLoading(false);
    }
  };

  return { election, loading, error, refreshElection };
}; 