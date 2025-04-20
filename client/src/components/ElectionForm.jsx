import React, { useState } from 'react';
import { toast } from 'sonner';
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

    toast.success('Candidate added successfully');
  };

  const removeCandidate = (index) => {
    setFormData(prev => ({
      ...prev,
      candidates: prev.candidates.filter((_, i) => i !== index)
    }));
    toast.success('Candidate removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log('Form submission started');
    
    // Log the current form data
    console.log('Current form data:', formData);
    
    // Validate required fields
    if (!formData.name || !formData.description || !formData.startDate || 
        !formData.startTime || !formData.endDate || !formData.endTime) {
      console.log('Missing required fields:', {
        name: !formData.name,
        description: !formData.description,
        startDate: !formData.startDate,
        startTime: !formData.startTime,
        endDate: !formData.endDate,
        endTime: !formData.endTime
      });
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate at least two candidates
    if (formData.candidates.length < 2) {
      console.log('Not enough candidates. Current count:', formData.candidates.length);
      toast.error('At least two candidates are required');
      return;
    }

    // Validate dates
    const startDateTime = new Date(`${formData.startDate} ${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate} ${formData.endTime}`);
    const now = new Date();

    console.log('Date validation:', {
      startDateTime,
      endDateTime,
      now,
      isStartValid: startDateTime > now,
      isEndValid: endDateTime > startDateTime
    });

    if (startDateTime < now) {
      toast.error('Start date must be in the future');
      return;
    }

    if (endDateTime <= startDateTime) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      console.log('Creating election...');

      // Create election object with all the necessary data
      const newElection = {
        name: formData.name,
        description: formData.description,
        startTime: startDateTime.getTime(),
        endTime: endDateTime.getTime(),
        candidates: formData.candidates.map(candidate => ({
          ...candidate,
          votes: 0
        })),
        registeredVoters: 0,
        isActive: true
      };

      console.log('New election object created:', newElection);

      // Call the onSuccess callback with the new election
      if (typeof onSuccess === 'function') {
        console.log('Calling onSuccess callback...');
        await onSuccess(newElection);
        console.log('onSuccess callback completed');
        
        // Reset form after successful submission
        setFormData({
          name: '',
          description: '',
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: '',
          candidates: []
        });
        
        toast.success('Election created successfully');
      } else {
        console.error('onSuccess is not a function:', onSuccess);
        throw new Error('Invalid callback function');
      }

    } catch (error) {
      console.error('Error creating election:', error);
      toast.error('Failed to create election: ' + (error.message || 'Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Election Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Candidates Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Candidates</h3>
        
        {/* Candidate List */}
        <div className="space-y-4">
          {formData.candidates.map((candidate, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{candidate.fullName}</p>
                <p className="text-sm text-gray-500">{candidate.partyName}</p>
              </div>
              <button
                type="button"
                onClick={() => removeCandidate(index)}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Candidate Form */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h4 className="font-medium">Add New Candidate</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={newCandidate.fullName}
                onChange={handleCandidateChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Party Name</label>
              <input
                type="text"
                name="partyName"
                value={newCandidate.partyName}
                onChange={handleCandidateChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={newCandidate.description}
              onChange={handleCandidateChange}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Candidate Photo</label>
              <div className="mt-1 flex items-center space-x-4">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <FiUpload className="w-5 h-5 mr-2" />
                  Upload
                  <input
                    type="file"
                    name="candidateImage"
                    onChange={handleCandidateChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {newCandidate.candidateImagePreview && (
                  <img
                    src={newCandidate.candidateImagePreview}
                    alt="Candidate preview"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Party Symbol</label>
              <div className="mt-1 flex items-center space-x-4">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <FiUpload className="w-5 h-5 mr-2" />
                  Upload
                  <input
                    type="file"
                    name="partyImage"
                    onChange={handleCandidateChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {newCandidate.partyImagePreview && (
                  <img
                    src={newCandidate.partyImagePreview}
                    alt="Party symbol preview"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={addCandidate}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add Candidate
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Election...
            </>
          ) : (
            'Create Election'
          )}
        </button>
      </div>
    </form>
  );
};

export default ElectionForm; 