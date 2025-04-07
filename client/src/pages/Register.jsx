import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContract();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const role = new URLSearchParams(location.search).get('role') || 'voter';

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      // Mock registration process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data and login
      await login(formData.email, role);
      
      toast.success('Registration successful! Please sign in to continue.');
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Register as {role === 'admin' ? 'Admin' : 'Voter'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-medium text-custom hover:text-custom/80"
              >
                sign in to your account
              </button>
            </p>
          </div>

          <RegisterForm
            onSubmit={handleSubmit}
            role={role}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>
    </div>
  );
};

export default Register; 