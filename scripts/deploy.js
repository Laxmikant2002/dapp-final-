const hre = require("hardhat");

async function main() {
  const Vote = await hre.ethers.getContractFactory("Vote");
  const vote = await Vote.deploy();

  await vote.deployed();

  console.log("Vote contract deployed to:", vote.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
