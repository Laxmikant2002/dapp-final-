import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'sonner';

const RegisterForm = ({ onSubmit, role, isSubmitting }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    location: '',
    photo: null
  });
  const webcamRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format Aadhar ID as user types
    if (name === 'aadharId') {
      const cleaned = value.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
      if (match) {
        const formatted = match
          .slice(1)
          .filter(Boolean)
          .join('-');
        setFormData({ ...formData, [name]: formatted });
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }

    if (!formData.age || formData.age < 18) {
      toast.error('You must be at least 18 years old to register');
      return false;
    }

    if (!formData.gender) {
      toast.error('Please select your gender');
      return false;
    }

    if (!formData.location.trim()) {
      toast.error(`Please enter your ${role === 'admin' ? 'party name' : 'location'}`);
      return false;
    }

    if (!photo) {
      toast.error('Please capture your photo');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Include photo in form data
    const submitData = {
      ...formData,
      photo: photo
    };

    onSubmit(submitData);
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
    setFormData(prev => ({ ...prev, photo: imageSrc }));
    setShowCamera(false);
    toast.success('Photo captured successfully');
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            placeholder="Enter your full name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            min="18"
            placeholder="Enter your age"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom disabled:bg-gray-100"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Live Image Capture <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            {showCamera ? (
              <div className="space-y-2">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-md"
                  videoConstraints={{
                    width: 720,
                    height: 480,
                    facingMode: "user"
                  }}
                />
                <button
                  type="button"
                  onClick={capturePhoto}
                  disabled={isSubmitting}
                  className="w-full !rounded-button bg-custom text-white px-4 py-2 text-sm font-medium hover:bg-custom/90 disabled:bg-gray-400"
                >
                  <i className="fas fa-camera mr-2"></i>
                  Capture Photo
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {photo ? (
                  <div className="space-y-2 w-full">
                    <img
                      src={photo}
                      alt="Captured"
                      className="w-full rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCamera(true)}
                      disabled={isSubmitting}
                      className="w-full !rounded-button bg-gray-500 text-white px-4 py-2 text-sm font-medium hover:bg-gray-600 disabled:bg-gray-400"
                    >
                      Retake Photo
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    disabled={isSubmitting}
                    className="w-full !rounded-button bg-custom text-white px-4 py-2 text-sm font-medium hover:bg-custom/90 disabled:bg-gray-400"
                  >
                    <i className="fas fa-camera mr-2"></i>
                    Take Photo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {role === 'admin' ? 'Party Name' : 'Location'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            placeholder={role === 'admin' ? "Enter your party name" : "Enter your location"}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom disabled:bg-gray-100"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full !rounded-button ${
          isSubmitting ? 'bg-gray-400' : 'bg-custom hover:bg-custom/90'
        } text-white px-4 py-2 text-sm font-medium transition-colors duration-200`}
      >
        {isSubmitting ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Submitting...
          </>
        ) : (
          <>
            <i className="fas fa-user-plus mr-2"></i>
            Submit Registration
          </>
        )}
      </button>

      <p className="text-sm text-gray-500 text-center mt-4">
        By registering, you agree to participate in the voting process and confirm that all provided information is accurate.
      </p>
    </form>
  );
};

export default RegisterForm; 