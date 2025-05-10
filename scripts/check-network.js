async function main() {
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("Connected to network:", network.name);
    console.log("Chain ID:", network.chainId);
    console.log("Current block number:", blockNumber);
    console.log("Deployer address:", deployer.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });