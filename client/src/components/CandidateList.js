import React from 'react';

const CandidateList = ({ candidates, selectedCandidate, onSelectCandidate }) => {
  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <div
          key={candidate.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedCandidate === candidate.id
              ? 'border-custom bg-custom/10'
              : 'border-gray-200 hover:border-custom'
          }`}
          onClick={() => onSelectCandidate(candidate.id)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{candidate.name}</h3>
              <p className="text-gray-600">{candidate.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Votes: {candidate.votes}</span>
              {selectedCandidate === candidate.id && (
                <span className="text-custom">
                  <i className="fas fa-check"></i>
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateList; 