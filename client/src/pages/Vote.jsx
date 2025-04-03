import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import { toast } from "sonner";

const Vote = ({ state }) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidateCount = await state.contract.getCandidateCount();
        const candidateList = [];
        for (let i = 0; i < candidateCount; i++) {
          const candidate = await state.contract.getCandidateDetails(i);
          candidateList.push({
            id: i,
            name: candidate.name,
            party: candidate.party,
            image: candidate.image,
          });
        }
        setCandidates(candidateList);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast.error("Failed to fetch candidates.");
      }
    };

    if (state.contract) {
      fetchCandidates();
    }
  }, [state.contract]);

  const handleVote = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) {
      toast.warning("Please select a candidate!");
      return;
    }

    try {
      await state.contract.vote(selectedCandidate);
      toast.success("Vote submitted successfully!");
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Failed to submit vote.");
    }
  };

  return (
    <div className="flex h-[100%] space-x-32">
      <Navigation />
      <div className="w-[60%] h-[70%]">
        <div className="flex flex-col justify-center items-center mt-[10%]">
          <h1 className="mb-10 tracking-wide text-gray-600 dark:text-gray-400 text-2xl">
            Cast Your Vote
          </h1>

          {/* Voter Information */}
          <div className="w-full max-w-xl bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-600 mb-4">
              Voter Information
            </h2>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-500">
                  Voter ID
                </label>
                <input
                  type="text"
                  value={state.signer || "Not Connected"}
                  disabled
                  className="w-full mt-1 p-2 border rounded bg-gray-100"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-500">
                  Election ID
                </label>
                <input
                  type="text"
                  value="ELECTION_2024"
                  disabled
                  className="w-full mt-1 p-2 border rounded bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Candidate Selection */}
          <div className="w-full max-w-xl bg-white p-5 mt-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-600 mb-4">
              Select Your Candidate
            </h2>
            <form onSubmit={handleVote}>
              {candidates.map((candidate) => (
                <label
                  key={candidate.id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer mb-3 ${
                    selectedCandidate === candidate.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="candidate"
                      value={candidate.id}
                      checked={selectedCandidate === candidate.id}
                      onChange={() => setSelectedCandidate(candidate.id)}
                      className="mr-3"
                    />
                    <div>
                      <p className="text-lg font-medium">{candidate.name}</p>
                      <p className="text-sm text-gray-500">{candidate.party}</p>
                    </div>
                  </div>
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full"
                  />
                </label>
              ))}

              {/* Submit Button */}
              <button
    className="relative inline-flex ml-60 items-center justify-center p-0.5 rounded-full mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-200 shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)]"
    type="submit"
  >
    <span className="relative px-5 py-2 transition-all rounded-calc(1.5rem- 1px)] ease-in-out duration-700 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0">
      Submit Vote
    </span>
  </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;
