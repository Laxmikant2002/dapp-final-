import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useContract } from '../context/ContractContext';
import { registerUser } from '../services/firebaseService';
import Webcam from 'react-webcam';

const RegistrationForm = () => {
  const { account } = useContract();
  const webcamRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: '',
    aadhaarNumber: '',
    voterId: '',
    photoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFormData(prev => ({
      ...prev,
      photoUrl: imageSrc
    }));
    setShowCamera(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      // Validate Aadhaar number (12 digits)
      if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
        throw new Error('Invalid Aadhaar number format');
      }

      // Validate Voter ID (3 letters followed by 7 numbers)
      if (!/^[A-Z]{3}\d{7}$/.test(formData.voterId)) {
        throw new Error('Invalid Voter ID format');
      }

      // Register user with wallet address
      const userData = {
        ...formData,
        address: account
      };

      await registerUser(userData);
      toast.success('Registration successful! Please wait for verification.');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Voter Registration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
          <input
            type="text"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleInputChange}
            required
            pattern="\d{12}"
            title="Please enter a valid 12-digit Aadhaar number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Voter ID</label>
          <input
            type="text"
            name="voterId"
            value={formData.voterId}
            onChange={handleInputChange}
            required
            pattern="[A-Z]{3}\d{7}"
            title="Please enter a valid Voter ID (3 letters followed by 7 numbers)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Photo Capture</label>
          {!showCamera && !formData.photoUrl && (
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              className="mt-1 w-full bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-200"
            >
              Open Camera
            </button>
          )}
          
          {showCamera && (
            <div className="mt-1">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-md"
              />
              <button
                type="button"
                onClick={capturePhoto}
                className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Capture Photo
              </button>
            </div>
          )}

          {formData.photoUrl && (
            <div className="mt-1">
              <img
                src={formData.photoUrl}
                alt="Captured"
                className="w-full rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="mt-2 w-full bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-200"
              >
                Retake Photo
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !formData.photoUrl}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm; 