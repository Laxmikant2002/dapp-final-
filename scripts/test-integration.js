const { ethers } = require("hardhat");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

async function main() {
  console.log("Starting local blockchain...");
  
  // Start local blockchain
  const hardhatNode = exec("npx hardhat node");
  
  // Wait for blockchain to start
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log("Deploying contracts...");
  
  // Deploy contracts
  await execPromise("npx hardhat run scripts/deploy.js --network localhost");
  
  console.log("Running integration tests...");
  
  // Run frontend tests
  try {
    const { stdout, stderr } = await execPromise("npm test -- --testPathPattern=MetaMask.test.jsx");
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error("Test execution failed:", error);
  }
  
  // Cleanup
  hardhatNode.kill();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 