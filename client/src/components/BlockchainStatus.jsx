import React, { useEffect, useState } from 'react';
import { useContract } from '../context/ContractContext';
import { toast } from 'react-hot-toast';

const BlockchainStatus = () => {
  const { contract, account, isConnected, provider } = useContract();
  const [networkInfo, setNetworkInfo] = useState(null);

  useEffect(() => {
    const getNetworkInfo = async () => {
      if (provider && isConnected) {
        try {
          const network = await provider.getNetwork();
          const blockNumber = await provider.getBlockNumber();
          setNetworkInfo({
            chainId: network.chainId,
            name: network.name,
            blockNumber
          });
        } catch (error) {
          console.error('Error getting network info:', error);
          toast.error('Failed to get network information');
        }
      }
    };

    getNetworkInfo();
  }, [provider, isConnected]);

  if (!isConnected || !account) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700">Please connect your wallet to interact with the blockchain.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Blockchain Connection Status</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Connected Account:</span> {account}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Contract Address:</span> {contract?.address || 'Not connected'}
        </p>
        {networkInfo && (
          <>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Network:</span> {networkInfo.name} (Chain ID: {networkInfo.chainId})
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Current Block:</span> {networkInfo.blockNumber}
            </p>
          </>
        )}
        <div className="mt-4">
          <div className="flex items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-green-700">Connected to blockchain</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainStatus; 