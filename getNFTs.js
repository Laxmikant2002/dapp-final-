import { Network, Alchemy } from 'alchemy-sdk';

// Configure Alchemy settings
const settings = {
  apiKey: "XkEY4OdJqhiZlqUwpyebLxlTH1v5JA1p", // Replace with your Alchemy API key
  network: Network.ETH_SEPOLIA, // Replace with your desired network
};

const alchemy = new Alchemy(settings);

// Function to get NFTs owned by a specific address
async function getNFTs(ownerAddress) {
  try {
    const nfts = await alchemy.nft.getNftsForOwner(ownerAddress);
    console.log(`NFTs owned by ${ownerAddress}:`, nfts);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
  }
}

// Replace 'vitalik.eth' with the desired address or ENS domain
getNFTs("vitalik.eth");
