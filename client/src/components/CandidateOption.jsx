import React from 'react';

const CandidateOption = ({ candidate, isSelected, onSelect }) => {
  return (
    <div 
      className={`border rounded-lg p-4 hover:border-custom cursor-pointer transition-colors ${
        isSelected ? 'border-custom bg-custom/5' : ''
      }`}
      onClick={() => onSelect(candidate.id)}
    >
      <label className="flex items-start cursor-pointer">
        <input
          type="radio"
          name="candidate"
          value={candidate.id}
          checked={isSelected}
          onChange={() => onSelect(candidate.id)}
          className="mt-1 text-custom focus:ring-custom"
        />
        <div className="ml-3">
          <h3 className="font-medium">{candidate.name}</h3>
          <p className="text-sm text-gray-500">{candidate.description}</p>
        </div>
      </label>
    </div>
  );
};

export default CandidateOption; 