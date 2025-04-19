import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import { useContract } from '../context/ContractContext';
import { createElection, addCandidateToElection } from '../services/firebaseService';

const ElectionForm = ({ onSuccess }) => {
  const { contract } = useContract();
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
    description: '',
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

    if (!newCandidate.fullName) {
      errors.push('Full name is required');
    }

    if (!newCandidate.description) {
      errors.push('Description is required');
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
      description: '',
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
    
    // Validate required fields
    if (!formData.name || !formData.description || !formData.startDate || 
        !formData.startTime || !formData.endDate || !formData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate at least two candidates
    if (formData.candidates.length < 2) {
      toast.error('At least two candidates are required');
      return;
    }

    // Validate dates
    const startDateTime = new Date(`${formData.startDate} ${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate} ${formData.endTime}`);
    const now = new Date();

    if (startDateTime < now) {
      toast.error('Start date must be in the future');
      return;
    }

    if (endDateTime <= startDateTime) {
      toast.error('End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      // Format the data for the contract
      const startTime = Math.floor(startDateTime.getTime() / 1000);
      const endTime = Math.floor(endDateTime.getTime() / 1000);

      // Create election using contract
      const tx = await contract.createElection(
        formData.name,
        formData.description,
        startTime,
        endTime,
        formData.candidates.map(candidate => ({
          name: candidate.fullName,
          party: candidate.partyName,
          description: candidate.description
        }))
      );

      // Wait for transaction to be mined
      await tx.wait();

      // Save to Firebase
      const electionData = {
        name: formData.name,
        description: formData.description,
        startTime: startDateTime,
        endTime: endDateTime,
        status: 'active'
      };

      // Create election in Firebase
      const savedElection = await createElection(electionData);

      // Add candidates to Firebase
      await Promise.all(formData.candidates.map(candidate => 
        addCandidateToElection(savedElection.id, {
          name: candidate.fullName,
          party: candidate.partyName,
          description: candidate.description,
          imageUrl: candidate.candidateImagePreview,
          partySymbol: candidate.partyImagePreview
        })
      ));
      
      toast.success('Election created successfully');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        candidates: []
      });
      
      // Notify parent component
      onSuccess?.();
    } catch (error) {
      console.error('Error creating election:', error);
      toast.error(error.message || 'Failed to create election. Please make sure you are connected to the correct network and have sufficient funds.');
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
                    <p className="text-sm font-medium text-gray-700">Description:</p>
                    <p className="text-sm text-gray-900">{candidate.description}</p>
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
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={newCandidate.fullName}
                  onChange={handleCandidateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newCandidate.description}
                  onChange={handleCandidateChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter candidate's background, experience, and key points..."
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