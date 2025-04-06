import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContract } from '../hooks/useContract';
import { useMetaMask } from '../hooks/useMetaMask';
import RegisterForm from '../components/RegisterForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const { contract } = useContract();
  const { isConnected } = useMetaMask();
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Basic validations that don't need async operations
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      navigate('/');
      return;
    }

    if (!role || (role !== 'voter' && role !== 'admin')) {
      toast.error('Invalid role selected');
      navigate('/');
      return;
    }

    // Check contract and registration status
    const checkRegistration = async () => {
      if (!contract) {
        console.error('Contract not initialized. Contract state:', contract);
        toast.error('Contract not initialized. Please make sure you are connected to the Hardhat network');
        setIsCheckingRegistration(false);
        return;
      }

      try {
        console.log('Checking registration for role:', role);
        console.log('Contract methods:', contract.functions);
        
        let isRegistered;
        if (role === 'voter') {
          console.log('Checking voter registration...');
          isRegistered = await contract.checkVoterRegistered();
        } else {
          console.log('Checking candidate registration...');
          isRegistered = await contract.checkCandidateRegistered();
        }
        
        console.log('Registration status:', isRegistered);

        if (isRegistered) {
          toast.error(`You are already registered as a ${role}`);
          navigate(role === 'voter' ? '/elections' : '/admin');
          return;
        }
      } catch (error) {
        console.error('Registration check error details:', {
          message: error.message,
          code: error.code,
          role: role,
          contractAddress: contract.address
        });
        
        if (error.code === 'NETWORK_ERROR') {
          toast.error('Network error. Please make sure you are connected to the Hardhat network');
        } else if (error.code === 'CALL_EXCEPTION') {
          toast.error('Contract call failed. Please make sure the contract is properly deployed');
        } else {
          toast.error(`Failed to check registration status: ${error.message}`);
        }
      } finally {
        setIsCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [isConnected, role, navigate, contract]);

  const handleRegister = async (formData) => {
    if (!contract) {
      toast.error('Contract not initialized');
      return;
    }

    if (!formData.photo) {
      toast.error('Please capture your photo before submitting');
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading('Submitting registration...');

      // Create registration data object
      const registrationData = {
        fullName: formData.fullName,
        age: parseInt(formData.age),
        gender: formData.gender,
        photo: formData.photo, // Include the photo data
        location: formData.location // This will be party name for candidates
      };

      // Call the appropriate contract function based on role
      const tx = role === 'voter'
        ? await contract.voterRegister(
            registrationData.fullName,
            registrationData.age,
            registrationData.gender
          )
        : await contract.candidateRegister(
            registrationData.fullName,
            registrationData.location,
            registrationData.age,
            registrationData.gender
          );

      // Wait for transaction confirmation
      toast.loading('Waiting for blockchain confirmation...');
      await tx.wait();

      // Show success message and redirect
      toast.success(`Successfully registered as ${role}!`);
      
      // Redirect to appropriate page after successful registration
      if (role === 'voter') {
        navigate('/elections');
      } else {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
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
                  <p className="text-gray-600">Checking registration status...</p>
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
      <Footer />
    </div>
  );
};

export default Register; 