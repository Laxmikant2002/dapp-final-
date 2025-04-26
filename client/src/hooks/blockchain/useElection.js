import { useState, useEffect } from 'react';
import { useContract } from '../useContract';

export const useElection = (electionId) => {
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contract = useContract();

  useEffect(() => {
    const fetchElection = async () => {
      try {
        setLoading(true);
        if (!contract || !electionId) return;

        const electionData = await contract.methods.getElectionDetails(electionId).call();
        setElection({
          id: electionId,
          name: electionData.name,
          description: electionData.description,
          startTime: new Date(electionData.startTime * 1000),
          endTime: new Date(electionData.endTime * 1000),
          status: electionData.status,
          candidates: electionData.candidates,
          totalVotes: electionData.totalVotes
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
      const electionData = await contract.methods.getElectionDetails(electionId).call();
      setElection({
        id: electionId,
        name: electionData.name,
        description: electionData.description,
        startTime: new Date(electionData.startTime * 1000),
        endTime: new Date(electionData.endTime * 1000),
        status: electionData.status,
        candidates: electionData.candidates,
        totalVotes: electionData.totalVotes
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