import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'sonner';

const RegisterForm = ({ onSubmit, role, isSubmitting }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    idNumber: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    location: '',
    photo: null,
    document: null
  });
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return false;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }

    if (!formData.idNumber.trim()) {
      setErrorMessage('Please enter your ID number');
      return false;
    }

    if (!formData.age || formData.age < 18) {
      setErrorMessage('You must be at least 18 years old to register');
      return false;
    }

    if (!formData.gender) {
      setErrorMessage('Please select your gender');
      return false;
    }

    if (!formData.location.trim()) {
      setErrorMessage(`Please enter your ${role === 'admin' ? 'address' : 'location'}`);
      return false;
    }

    if (!photo) {
      setErrorMessage('Please capture your photo');
      return false;
    }

    if (!formData.document) {
      setErrorMessage('Please upload your ID document');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowErrorModal(true);
      return;
    }

    try {
      // Include photo and document in form data
      const submitData = {
        ...formData,
        photo: photo,
        document: formData.document
      };

      await onSubmit(submitData);
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed. Please try again.');
      setShowErrorModal(true);
    }
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
    setFormData(prev => ({ ...prev, photo: imageSrc }));
    setShowCamera(false);
    toast.success('Photo captured successfully');
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, document: file }));
        toast.success('Document uploaded successfully');
        setShowDocumentModal(false);
      } else {
        toast.error('Please upload a valid image or PDF file');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-custom text-white flex items-center justify-center">1</div>
          <div className="ml-2 text-sm font-medium">Personal Info</div>
        </div>
        <div className="w-16 h-1 bg-gray-200"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">2</div>
          <div className="ml-2 text-sm font-medium">Verification</div>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              placeholder="Enter your ID number"
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
              {role === 'admin' ? 'Address' : 'Location'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              placeholder={role === 'admin' ? "Enter your address" : "Enter your location"}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              placeholder="Enter your password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              placeholder="Confirm your password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="space-y-4">
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
              ID Document Upload <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowDocumentModal(true)}
              disabled={isSubmitting}
              className="w-full !rounded-button bg-custom text-white px-4 py-2 text-sm font-medium hover:bg-custom/90 disabled:bg-gray-400 mt-1"
            >
              <i className="fas fa-upload mr-2"></i>
              {formData.document ? 'Change Document' : 'Upload ID Document'}
            </button>
            {formData.document && (
              <p className="mt-2 text-sm text-gray-500">
                Document uploaded: {formData.document.name}
              </p>
            )}
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

      {/* Document Upload Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Upload ID Document</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleDocumentUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
                >
                  <i className="fas fa-upload mr-2"></i>
                  Select File
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Supported formats: JPG, PNG, PDF
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDocumentModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <i className="fas fa-check text-green-600 text-xl"></i>
              </div>
              <h2 className="mt-4 text-2xl font-bold">Registration Successful!</h2>
              <p className="mt-2 text-gray-600">
                Your registration has been completed successfully. You can now participate in elections.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <i className="fas fa-exclamation text-red-600 text-xl"></i>
              </div>
              <h2 className="mt-4 text-2xl font-bold">Registration Error</h2>
              <p className="mt-2 text-gray-600">{errorMessage}</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowErrorModal(false)}
                  className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm; 