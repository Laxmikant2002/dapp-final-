const hre = require("hardhat");

async function main() {
  // Get the contract instance
  const Vote = await hre.ethers.getContractFactory("Vote");
  const vote = await Vote.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  // Get signers
  const [owner, addr1, addr2] = await hre.ethers.getSigners();

  console.log("Starting voting period...");
  await vote.voteTime(60, 3600); // Start in 60 seconds, end in 1 hour
  console.log("Voting period started");

  console.log("\nRegistering candidates...");
  await vote.connect(addr1).candidateRegister("John Doe", "Party A", 35, "Male");
  await vote.connect(addr2).candidateRegister("Jane Smith", "Party B", 42, "Female");
  
  const candidates = await vote.candidateList();
  console.log("\nRegistered Candidates:");
  candidates.forEach((candidate, index) => {
    console.log(`${index + 1}. ${candidate.name} (${candidate.party})`);
  });

  console.log("\nCurrent voting status:", await vote.votingStatus());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 