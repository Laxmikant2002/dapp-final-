// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Structs
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    struct Election {
        uint id;
        string name;
        string description;
        uint endTime;
        bool isActive;
        Candidate[] candidates;
        mapping(address => bool) voters;
        mapping(address => bool) hasVoted;
        uint totalVotes;
    }

    // State Variables
    mapping(uint => Election) public elections;
    mapping(address => bool) public admins;
    mapping(address => bool) public registeredVoters;
    uint public electionCount;

    // Events (for optional frontend integration)
    event ElectionCreated(uint indexed electionId, string name, uint endTime);
    event CandidateAdded(uint indexed electionId, uint candidateId, string name);
    event VoterRegistered(address indexed voter);
    event VoteCast(uint indexed electionId, address indexed voter, uint candidateId);
    event ElectionEnded(uint indexed electionId);

    // Modifiers
    modifier onlyAdmin() {
        require(admins[msg.sender], "Not an admin");
        _;
    }

    modifier onlyRegisteredVoter() {
        require(registeredVoters[msg.sender], "Not a registered voter");
        _;
    }

    modifier electionExists(uint _electionId) {
        require(_electionId < electionCount, "Election does not exist");
        _;
    }

    modifier electionActive(uint _electionId) {
        require(elections[_electionId].isActive, "Election is not active");
        require(block.timestamp < elections[_electionId].endTime, "Election has ended");
        _;
    }

    // Constructor
    constructor() {
        admins[msg.sender] = true; // Deployer is the initial admin
    }

    // Admin Functions
    function createElection(string memory _name, string memory _description, uint _endTime) public onlyAdmin {
        require(_endTime > block.timestamp, "End time must be in the future");
        Election storage election = elections[electionCount];
        election.id = electionCount;
        election.name = _name;
        election.description = _description;
        election.endTime = _endTime;
        election.isActive = true;
        electionCount++;
        emit ElectionCreated(electionCount - 1, _name, _endTime);
    }

    function addCandidate(uint _electionId, string memory _name, string memory _party) public onlyAdmin electionExists(_electionId) {
        Election storage election = elections[_electionId];
        election.candidates.push(Candidate(
            election.candidates.length,
            _name,
            _party,
            0
        ));
        emit CandidateAdded(_electionId, election.candidates.length - 1, _name);
    }

    function endElection(uint _electionId) public onlyAdmin electionExists(_electionId) {
        Election storage election = elections[_electionId];
        require(election.isActive, "Election already ended");
        election.isActive = false;
        emit ElectionEnded(_electionId);
    }

    // Voter Functions
    function registerVoter(address _voter) public onlyAdmin {
        require(!registeredVoters[_voter], "Voter already registered");
        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
    }

    function castVote(uint _electionId, uint _candidateId) public onlyRegisteredVoter electionExists(_electionId) electionActive(_electionId) {
        Election storage election = elections[_electionId];
        require(!election.hasVoted[msg.sender], "Already voted");
        require(_candidateId < election.candidates.length, "Invalid candidate ID");
        
        election.hasVoted[msg.sender] = true;
        election.candidates[_candidateId].voteCount++;
        election.totalVotes++;
        emit VoteCast(_electionId, msg.sender, _candidateId);
    }

    function verifyVote(uint _electionId, address _voter) public view electionExists(_electionId) returns (bool) {
        return elections[_electionId].hasVoted[_voter];
    }

    // Data Fetching Functions
    function getElection(uint _electionId) public view electionExists(_electionId) returns (
        uint id,
        string memory name,
        string memory description,
        uint endTime,
        bool isActive,
        uint totalVotes
    ) {
        Election storage election = elections[_electionId];
        return (
            election.id,
            election.name,
            election.description,
            election.endTime,
            election.isActive,
            election.totalVotes
        );
    }

    function getElectionCandidates(uint _electionId) public view electionExists(_electionId) returns (Candidate[] memory) {
        return elections[_electionId].candidates;
    }

    function getElectionResults(uint _electionId) public view electionExists(_electionId) returns (Candidate[] memory, uint) {
        Election storage election = elections[_electionId];
        return (election.candidates, election.totalVotes);
    }

    // Access Control Functions
    function isAdmin(address _address) public view returns (bool) {
        return admins[_address];
    }

    function isVoter(address _address) public view returns (bool) {
        return registeredVoters[_address];
    }
} 