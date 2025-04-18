import React, { useState } from 'react';
import { toast } from 'sonner';
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';

const ElectionForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    candidates: []
  });

  const [newCandidate, setNewCandidate] = useState({
    fullName: '',
    age: '',
    citizenshipStatus: 'indian',
    voterIdNumber: '',
    aadhaarNumber: '',
    partyName: '',
    candidateImage: null,
    partyImage: null,
    candidateImagePreview: '',
    partyImagePreview: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCandidateChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewCandidate(prev => ({
            ...prev,
            [name]: file,
            [`${name}Preview`]: reader.result
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setNewCandidate(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateCandidate = () => {
    const errors = [];
    const today = new Date();
    const age = parseInt(newCandidate.age);

    if (!newCandidate.fullName) {
      errors.push('Full name is required');
    }

    if (!newCandidate.age || isNaN(age)) {
      errors.push('Valid age is required');
    } else {
      // Age validation based on election type (assuming Lok Sabha by default)
      if (age < 25) {
        errors.push('Minimum age requirement is 25 years for Lok Sabha elections');
      }
    }

    if (!newCandidate.voterIdNumber || !/^[A-Z]{3}\d{7}$/.test(newCandidate.voterIdNumber)) {
      errors.push('Valid Voter ID number is required (Format: ABC1234567)');
    }

    if (!newCandidate.aadhaarNumber || !/^\d{12}$/.test(newCandidate.aadhaarNumber)) {
      errors.push('Valid 12-digit Aadhaar number is required');
    }

    if (!newCandidate.partyName) {
      errors.push('Party name is required');
    }

    if (!newCandidate.candidateImage) {
      errors.push('Candidate photo is required');
    }

    if (!newCandidate.partyImage) {
      errors.push('Party symbol is required');
    }

    return errors;
  };

  const addCandidate = () => {
    const errors = validateCandidate();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    setFormData(prev => ({
      ...prev,
      candidates: [...prev.candidates, { ...newCandidate }]
    }));

    // Reset candidate form
    setNewCandidate({
      fullName: '',
      age: '',
      citizenshipStatus: 'indian',
      voterIdNumber: '',
      aadhaarNumber: '',
      partyName: '',
      candidateImage: null,
      partyImage: null,
      candidateImagePreview: '',
      partyImagePreview: ''
    });
  };

  const removeCandidate = (index) => {
    setFormData(prev => ({
      ...prev,
      candidates: prev.candidates.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.candidates.length < 2) {
      toast.error('At least two candidates are required');
      return;
    }

    setLoading(true);
    try {
      // TODO: Add API call to create election
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Election created successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error creating election:', error);
      toast.error('Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Election Details */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Election Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Candidate List */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Candidates</h3>
          <div className="grid grid-cols-1 gap-6 mb-6">
            {formData.candidates.map((candidate, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                <button
                  type="button"
                  onClick={() => removeCandidate(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Full Name:</p>
                    <p className="text-sm text-gray-900">{candidate.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Age:</p>
                    <p className="text-sm text-gray-900">{candidate.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Voter ID:</p>
                    <p className="text-sm text-gray-900">{candidate.voterIdNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Party:</p>
                    <p className="text-sm text-gray-900">{candidate.partyName}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {candidate.candidateImagePreview && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Candidate Photo:</p>
                      <img
                        src={candidate.candidateImagePreview}
                        alt="Candidate"
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {candidate.partyImagePreview && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Party Symbol:</p>
                      <img
                        src={candidate.partyImagePreview}
                        alt="Party Symbol"
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Candidate Form */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4">Add New Candidate</h4>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name (as per Aadhaar/Voter ID)</label>
                <input
                  type="text"
                  name="fullName"
                  value={newCandidate.fullName}
                  onChange={handleCandidateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  min="25"
                  value={newCandidate.age}
                  onChange={handleCandidateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Minimum age: 25 years for Lok Sabha</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Citizenship Status</label>
                <select
                  name="citizenshipStatus"
                  value={newCandidate.citizenshipStatus}
                  onChange={handleCandidateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="indian">Indian Citizen</option>
                  <option value="other" disabled>Non-Indian Citizen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Voter ID Number</label>
                <input
                  type="text"
                  name="voterIdNumber"
                  value={newCandidate.voterIdNumber}
                  onChange={handleCandidateChange}
                  pattern="[A-Z]{3}[0-9]{7}"
                  placeholder="ABC1234567"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={newCandidate.aadhaarNumber}
                  onChange={handleCandidateChange}
                  pattern="\d{12}"
                  placeholder="123456789012"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Party Name</label>
                <input
                  type="text"
                  name="partyName"
                  value={newCandidate.partyName}
                  onChange={handleCandidateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Candidate Photo</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    name="candidateImage"
                    accept="image/*"
                    onChange={handleCandidateChange}
                    className="hidden"
                    id="candidateImage"
                  />
                  <label
                    htmlFor="candidateImage"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiUpload className="mr-2 h-5 w-5" />
                    Upload Photo
                  </label>
                  {newCandidate.candidateImagePreview && (
                    <img
                      src={newCandidate.candidateImagePreview}
                      alt="Candidate Preview"
                      className="ml-4 h-12 w-12 object-cover rounded-full"
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Party Symbol</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    name="partyImage"
                    accept="image/*"
                    onChange={handleCandidateChange}
                    className="hidden"
                    id="partyImage"
                  />
                  <label
                    htmlFor="partyImage"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiUpload className="mr-2 h-5 w-5" />
                    Upload Symbol
                  </label>
                  {newCandidate.partyImagePreview && (
                    <img
                      src={newCandidate.partyImagePreview}
                      alt="Party Symbol Preview"
                      className="ml-4 h-12 w-12 object-cover rounded-full"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={addCandidate}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiPlus className="mr-2 h-5 w-5" />
                Add Candidate
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading || formData.candidates.length < 2}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading || formData.candidates.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating Election...' : 'Create Election'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ElectionForm; 