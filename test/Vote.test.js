const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Vote Contract", function () {
  let Vote;
  let vote;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let startTime;
  let endTime;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    Vote = await ethers.getContractFactory("Vote");
    vote = await Vote.deploy();
    await vote.deployed();
    
    // Start voting in 60 seconds with 1 hour duration
    startTime = (await time.latest()) + 60;
    endTime = startTime + 3600;
    await vote.voteTime(60, 3600);
  });

  describe("Deployment", function () {
    it("Should have correct initial voting status", async function () {
      expect(await vote.votingStatus()).to.equal("Voting in progress");
    });
  });

  describe("Candidate Registration", function () {
    it("Should allow candidate registration", async function () {
      await vote.connect(addr1).candidateRegister("Candidate1", "Party1", 25, "Male");
      const candidates = await vote.candidateList();
      expect(candidates[0].name).to.equal("Candidate1");
    });

    it("Should not allow underage candidates", async function () {
      await expect(
        vote.connect(addr1).candidateRegister("Candidate1", "Party1", 17, "Male")
      ).to.be.revertedWith("You are not eligible to be a candidate");
    });

    it("Should not allow duplicate candidate registration", async function () {
      await vote.connect(addr1).candidateRegister("Candidate1", "Party1", 25, "Male");
      await expect(
        vote.connect(addr1).candidateRegister("Candidate2", "Party2", 26, "Female")
      ).to.be.revertedWith("You have already registered");
    });
  });

  describe("Voter Registration", function () {
    it("Should allow voter registration", async function () {
      await vote.connect(addr1).voterRegister("Voter1", 25, "Male");
      const isRegistered = await vote.connect(addr1).checkVoterRegistered();
      expect(isRegistered).to.equal(true);
    });

    it("Should not allow underage voters", async function () {
      await expect(
        vote.connect(addr1).voterRegister("Voter1", 17, "Male")
      ).to.be.revertedWith("You are not eligible to vote");
    });

    it("Should not allow duplicate voter registration", async function () {
      await vote.connect(addr1).voterRegister("Voter1", 25, "Male");
      await expect(
        vote.connect(addr1).voterRegister("Voter2", 26, "Female")
      ).to.be.revertedWith("You have already registered");
    });
  });

  describe("Voting Process", function () {
    beforeEach(async function () {
      // Setup: Register one voter and multiple candidates
      await vote.connect(addr1).voterRegister("Voter1", 25, "Male");
      await vote.connect(addr2).candidateRegister("Candidate1", "Party1", 25, "Male");
      await vote.connect(addr3).candidateRegister("Candidate2", "Party2", 30, "Female");
      
      // Move time forward to when voting is active
      await time.increaseTo(startTime);
    });

    it("Should not allow voting before registration", async function () {
      await expect(
        vote.connect(owner).vote(1, 1)
      ).to.be.revertedWith("You are not a voter");
    });

    it("Should not allow double voting", async function () {
      await vote.connect(addr1).vote(1, 1);
      await expect(
        vote.connect(addr1).vote(1, 1)
      ).to.be.revertedWith("You have already voted");
    });

    it("Should allow a registered voter to vote", async function () {
      await vote.connect(addr1).vote(1, 1);
      const hasVoted = await vote.connect(addr1).checkVotedOrNot();
      expect(hasVoted).to.equal(true);
    });
  });
}); 