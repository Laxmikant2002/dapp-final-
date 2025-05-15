import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // In the demo flow, we don't need a separate register page
    // Just redirect to home and show a toast
    toast.info('Registration is handled through wallet connection');
    navigate('/', { replace: true });
  }, [navigate]);

  // This will briefly show while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
    </div>
  );
};

export default Register;