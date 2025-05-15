const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Deploy the Voting contract
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.deployed();

  console.log("Voting contract deployed to:", voting.address);

  // Save the contract address and ABI
  const contractsDir = path.join(__dirname, "..", "client", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save the contract address
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Voting: voting.address }, undefined, 2)
  );

  // Get the contract artifact
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "Voting.sol", "Voting.json");
  
  if (!fs.existsSync(artifactPath)) {
    console.error("Contract artifact not found at:", artifactPath);
    process.exit(1);
  }

  const contractArtifact = require(artifactPath);
  fs.writeFileSync(
    path.join(contractsDir, "Voting.json"),
    JSON.stringify(contractArtifact, null, 2)
  );

  console.log("Contract artifacts saved successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
