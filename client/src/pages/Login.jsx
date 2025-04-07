import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContract();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const role = new URLSearchParams(location.search).get('role') || 'voter';

  useEffect(() => {
    if (role === 'admin') {
      // Pre-fill admin email for convenience
      setFormData(prev => ({ ...prev, email: 'admin@example.com' }));
    }
  }, [role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email is admin
      const isAdmin = ['admin@example.com', 'admin@votingapp.com'].includes(formData.email.toLowerCase());
      
      if (role === 'admin' && !isAdmin) {
        throw new Error('Invalid admin credentials');
      }
      
      // Store user data and login
      await login(formData.email, isAdmin ? 'admin' : 'voter');
      
      // Navigate based on role
      navigate(isAdmin ? '/admin' : '/elections');
      
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials and try again.');
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
              {role === 'admin' ? 'Admin Login' : 'Sign in to your account'}
            </h2>
            {role !== 'admin' && (
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="font-medium text-custom hover:text-custom/80"
                >
                  create a new account
                </button>
              </p>
            )}
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-custom focus:border-custom focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-custom focus:border-custom focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isSubmitting ? 'bg-gray-400' : 'bg-custom hover:bg-custom/90'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login; 