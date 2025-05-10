const hre = require("hardhat");

async function main() {
  // Deploy the Voting contract
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.deployed();

  console.log("Voting contract deployed to:", voting.address);

  // Save the contract address and ABI
  const fs = require("fs");
  const contractsDir = __dirname + "/../client/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Save the contract address
  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Voting: voting.address }, undefined, 2)
  );

  // Save the contract artifacts
  const artifactPath = __dirname + "/../artifacts/contracts/Voting.sol/Voting.json";
  const contractArtifact = require(artifactPath);
  fs.writeFileSync(
    contractsDir + "/Voting.json",
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
