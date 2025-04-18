const hre = require("hardhat");

async function main() {
  // Deploy the Vote contract
  const Vote = await hre.ethers.getContractFactory("Vote");
  const vote = await Vote.deploy();
  await vote.deployed();

  console.log("Vote contract deployed to:", vote.address);

  // Save the contract address and ABI
  const fs = require("fs");
  const contractsDir = __dirname + "/../client/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Save the contract address
  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Vote: vote.address }, undefined, 2)
  );

  // Save the contract artifacts
  const artifactPath = __dirname + "/../artifacts/contracts/Vote.sol/Vote.json";
  const contractArtifact = require(artifactPath);
  fs.writeFileSync(
    contractsDir + "/Vote.json",
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
