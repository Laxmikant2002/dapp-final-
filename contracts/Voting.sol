// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Voting is ReentrancyGuard, Pausable {
    // Simple reentrancy lock
    bool private locked;
    modifier noReentrancy() {
        require(!locked, "No reentrancy allowed");
        locked = true;
        _;
        locked = false;
    }

    // Structs
    struct Candidate {
        uint id;
        string name;
        string party;
        uint age;
        string gender;
        address candidateAddress;
        uint voteCount;
    }

    struct Election {
        uint id;
        string name;
        string description;
        uint startTime;
        uint endTime;
        bool isActive;
        Candidate[] candidates;
        mapping(address => bool) voters;
        mapping(address => bool) hasVoted;
        uint totalVotes;
        uint winningCandidateId;
        uint maxVotes;
    }

    struct PollInfo {
        uint pollId;
        string winnerName;
        string partyName;
        address winnerAdd;
    }

    // State Variables
    address public owner;
    address public electionCommission;
    mapping(uint => Election) public elections;
    mapping(address => bool) public admins;
    mapping(address => bool) public registeredVoters;
    mapping(uint => PollInfo[]) public pollResults;
    uint public electionCount;
    uint public maxCandidates = 10;
    uint public maxVotingDuration = 7 days;
    string public votingStatus = "Voting has not started";

    // Events
    event ElectionCreated(uint indexed electionId, string name, uint endTime);
    event CandidateAdded(uint indexed electionId, uint candidateId, string name, string party);
    event VoterRegistered(address indexed voter);
    event VoteCast(uint indexed electionId, address indexed voter, uint candidateId);
    event ElectionEnded(uint indexed electionId);
    event FeedbackSubmitted(address voter, string feedback, uint pollId);
    event VotingStarted(uint256 startTime, uint256 endTime);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

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

    modifier votingNotStarted(uint _electionId) {
        require(block.timestamp < elections[_electionId].startTime, "Voting already started");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    // Owner pause/unpause
    function pause() public onlyOwner {
        _pause();
    }
    function unpause() public onlyOwner {
        _unpause();
    }

    // Admin Functions
    function createElection(string memory _name, string memory _description, uint _endTime) public onlyAdmin whenNotPaused {
        require(_endTime > block.timestamp, "End time must be in the future");
        require(_endTime - block.timestamp <= maxVotingDuration, "Voting duration exceeds maximum allowed");
        Election storage election = elections[electionCount];
        election.id = electionCount;
        election.name = _name;
        election.description = _description;
        election.startTime = block.timestamp;
        election.endTime = _endTime;
        election.isActive = true;
        election.winningCandidateId = 0;
        election.maxVotes = 0;
        votingStatus = "Voting in progress";
        emit ElectionCreated(electionCount, _name, _endTime);
        emit VotingStarted(block.timestamp, _endTime);
        electionCount++;
    }

    function addCandidate(uint _electionId, string memory _name, string memory _party, uint _age, string memory _gender) 
        public 
        onlyAdmin 
        electionExists(_electionId) 
        votingNotStarted(_electionId)
        whenNotPaused
    {
        require(_age >= 18, "Candidate must be at least 18 years old");
        require(elections[_electionId].candidates.length < maxCandidates, "Maximum candidates reached");
        Election storage election = elections[_electionId];
        uint candidateId = election.candidates.length;
        election.candidates.push(Candidate({
            id: candidateId,
            name: _name,
            party: _party,
            age: _age,
            gender: _gender,
            candidateAddress: msg.sender,
            voteCount: 0
        }));
        emit CandidateAdded(_electionId, candidateId, _name, _party);
    }

    function registerVoter(address _voter) public onlyAdmin whenNotPaused {
        require(!registeredVoters[_voter], "Voter already registered");
        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
    }

    function endElection(uint _electionId) public onlyAdmin electionExists(_electionId) whenNotPaused noReentrancy {
        Election storage election = elections[_electionId];
        require(election.isActive, "Election already ended");
        election.isActive = false;
        votingStatus = "Voting has ended";
        // Use tracked winner
        if (election.maxVotes > 0) {
            Candidate memory winner = election.candidates[election.winningCandidateId];
            pollResults[_electionId].push(PollInfo({
                pollId: _electionId,
                winnerName: winner.name,
                partyName: winner.party,
                winnerAdd: winner.candidateAddress
            }));
        }
        emit ElectionEnded(_electionId);
    }

    // Voter Functions
    function voterRegister(uint _age) public whenNotPaused {
        require(!registeredVoters[msg.sender], "Already registered as voter");
        require(_age >= 18, "Must be at least 18 years old");
        registeredVoters[msg.sender] = true;
        emit VoterRegistered(msg.sender);
    }

    function castVote(uint _electionId, uint _candidateId) 
        public 
        onlyRegisteredVoter 
        electionExists(_electionId) 
        electionActive(_electionId) 
        whenNotPaused
        noReentrancy
    {
        Election storage election = elections[_electionId];
        require(!election.hasVoted[msg.sender], "Already voted");
        require(_candidateId < election.candidates.length, "Invalid candidate ID");
        election.hasVoted[msg.sender] = true;
        election.candidates[_candidateId].voteCount++;
        election.totalVotes++;
        // Track winner as votes come in
        if (election.candidates[_candidateId].voteCount > election.maxVotes) {
            election.maxVotes = election.candidates[_candidateId].voteCount;
            election.winningCandidateId = _candidateId;
        }
        emit VoteCast(_electionId, msg.sender, _candidateId);
    }

    function verifyVote(uint _electionId, address _voter) public view electionExists(_electionId) returns (bool) {
        return elections[_electionId].hasVoted[_voter];
    }

    function submitFeedback(string calldata _feedback) public onlyRegisteredVoter {
        emit FeedbackSubmitted(msg.sender, _feedback, electionCount - 1);
    }

    // Data Retrieval Functions
    function getElection(uint _electionId) public view electionExists(_electionId) returns (
        uint id,
        string memory name,
        string memory description,
        uint startTime,
        uint endTime,
        bool isActive,
        uint totalVotes
    ) {
        Election storage election = elections[_electionId];
        return (
            election.id,
            election.name,
            election.description,
            election.startTime,
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

    function getPollResults(uint _electionId) public view electionExists(_electionId) returns (PollInfo[] memory) {
        return pollResults[_electionId];
    }

    function getVotingStatus() public view returns (string memory) {
        return votingStatus;
    }

    function isElectionActive(uint _electionId) public view electionExists(_electionId) returns (bool) {
        Election storage election = elections[_electionId];
        return election.isActive && block.timestamp < election.endTime;
    }

    function getTotalRegisteredVoters() public view returns (uint) {
        uint count = 0;
        for(uint i = 0; i < electionCount; i++) {
            count += elections[i].totalVotes;
        }
        return count;
    }

    // Access Control Functions
    function isAdmin(address _address) public view returns (bool) {
        return admins[_address];
    }

    function isVoter(address _address) public view returns (bool) {
        return registeredVoters[_address];
    }

    // Emergency Functions
    function emergencyStop(uint _electionId) public onlyAdmin electionExists(_electionId) whenNotPaused noReentrancy {
        Election storage election = elections[_electionId];
        require(election.isActive, "Election already ended");
        election.isActive = false;
        votingStatus = "Voting stopped by admin";
        emit ElectionEnded(_electionId);
    }

    function addAdmin(address _admin) public onlyOwner whenNotPaused {
        require(!admins[_admin], "Address is already an admin");
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) public onlyOwner whenNotPaused {
        require(_admin != owner, "Cannot remove owner as admin");
        require(admins[_admin], "Address is not an admin");
        admins[_admin] = false;
    }

    function updateMaxCandidates(uint _maxCandidates) public onlyOwner whenNotPaused {
        require(_maxCandidates > 0, "Max candidates must be greater than 0");
        maxCandidates = _maxCandidates;
    }

    function updateMaxVotingDuration(uint _maxDuration) public onlyOwner whenNotPaused {
        require(_maxDuration > 0, "Max duration must be greater than 0");
        maxVotingDuration = _maxDuration;
    }
}