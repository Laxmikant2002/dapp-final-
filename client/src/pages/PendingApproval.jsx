import React from 'react';
import { useNavigate } from 'react-router-dom';

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registration Pending
          </h2>
          <div className="mt-4 text-center">
            <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600">
            Your registration is currently under review. Please wait while an administrator verifies your information.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            You will be notified once your registration has been approved.
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate('/')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval; 