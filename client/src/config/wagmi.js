import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Define Hardhat network
const hardhat = {
  id: 31337,
  name: 'Hardhat',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
};

export const config = createConfig({
  chains: [hardhat, sepolia, mainnet],
  connectors: [
    injected()
  ],
  transports: {
    [hardhat.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
}); 