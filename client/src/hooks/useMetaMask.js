import { useContract } from './useContract';

export const useMetaMask = () => {
  const { account } = useContract();
  
  return {
    isConnected: !!account,
    account
  };
}; 