import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import RegisterForm from '../components/RegisterForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const { contract } = useContract();
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Mock registration check
    const checkRegistration = async () => {
      try {
        console.log('Mock checking registration for role:', role);
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsCheckingRegistration(false);
      } catch (error) {
        console.error('Mock registration check error:', error);
        toast.error('Mock registration check failed');
        setIsCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [role]);

  const handleRegister = async (formData) => {
    try {
      setIsSubmitting(true);
      toast.loading('Mock submitting registration...');

      // Simulate a delay for mock transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message and redirect
      toast.success(`Successfully registered as ${role}!`);
      
      // Redirect to appropriate page after successful registration
      if (role === 'voter') {
        navigate('/elections');
      } else {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Mock registration error:', error);
      toast.error('Mock registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-['Inter'] bg-gray-50 min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">
              Register as {role === 'voter' ? 'Voter' : 'Candidate'}
            </h1>
            <div className="bg-white rounded-lg shadow p-6">
              {isCheckingRegistration ? (
                <div className="text-center py-8">
                  <i className="fas fa-spinner fa-spin text-2xl text-custom mb-3"></i>
                  <p className="text-gray-600">Mock checking registration status...</p>
                </div>
              ) : (
                <RegisterForm
                  onSubmit={handleRegister}
                  role={role}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register; 