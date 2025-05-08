import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';

const { chains, provider } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
);

const connectors = [
  new InjectedConnector({
    chains,
    options: {
      name: 'Injected',
      shimDisconnect: true,
    },
  }),
];

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { WagmiConfig, client, chains }; 