import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { verifyAdminCredentials, setupAdminAccount } from '../services/firebaseService';
import { auth } from '../config/firebase';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: 'admin@voting.com', // Default admin email
    password: 'Admin@123'      // Default admin password
  });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        if (!auth) {
          throw new Error('Firebase Auth is not initialized');
        }

        // Wait for Firebase Auth initialization
        await new Promise((resolve) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve();
          });
        });

        // Ensure admin account exists
        await setupAdminAccount();
        console.log('Admin account setup checked');
        setInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
        toast.error('Error initializing application: ' + error.message);
      }
    };

    initializeFirebase();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!initialized) {
      toast.error('Application is still initializing. Please wait.');
      return;
    }
    
    setLoading(true);

    try {
      console.log('Attempting login with:', formData.email);
      const adminUser = await verifyAdminCredentials(formData.email, formData.password);
      console.log('Login successful:', adminUser);
      
      if (adminUser && adminUser.isAdmin) {
        // Store admin token
        localStorage.setItem('adminToken', `admin-${adminUser.uid}`);
        navigate('/admin/dashboard');
        toast.success('Welcome back, Admin!');
      } else {
        throw new Error('Not an admin account');
      }
    } catch (error) {
      console.error('Login error details:', error);
      toast.error(error.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Default credentials:
            <br />
            Email: admin@voting.com
            <br />
            Password: Admin@123
          </p>
          {!initialized && (
            <p className="mt-2 text-center text-sm text-yellow-600">
              Initializing application...
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                disabled={!initialized || loading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                disabled={!initialized || loading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!initialized || loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {!initialized ? 'Initializing...' : loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 