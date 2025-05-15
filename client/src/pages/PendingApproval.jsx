import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const PendingApproval = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Registration Pending
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your registration is being reviewed by the administrator.
          </p>
          <div className="mt-6 flex justify-center">
            <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Please wait while we process your registration. You will be notified once approved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval; 