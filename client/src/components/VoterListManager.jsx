import React, { useState, useEffect } from 'react';
import { useContract } from '../context/ContractContext';

const VoterListManager = () => {
  const { contract } = useContract();
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newVoter, setNewVoter] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual contract call to get voters
      const mockVoters = [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '0x123...', registered: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', address: '0x456...', registered: true }
      ];
      setVoters(mockVoters);
    } catch (err) {
      setError('Failed to fetch voters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVoter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterVoter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual contract call to register voter
      console.log('Registering voter:', newVoter);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      
      // Add the new voter to the list
      setVoters(prev => [...prev, { ...newVoter, id: prev.length + 1, registered: true }]);
      
      // Reset form
      setNewVoter({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
    } catch (err) {
      setError('Failed to register voter');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVoter = async (voterId) => {
    try {
      setLoading(true);
      // TODO: Replace with actual contract call to remove voter
      console.log('Removing voter:', voterId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      
      setVoters(prev => prev.filter(voter => voter.id !== voterId));
    } catch (err) {
      setError('Failed to remove voter');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVoters = voters.filter(voter =>
    voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.phone.includes(searchTerm) ||
    voter.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Register New Voter</h3>
          <form onSubmit={handleRegisterVoter} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newVoter.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newVoter.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newVoter.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Wallet Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newVoter.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register Voter'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Registered Voters</h3>
            <div className="flex-1 max-w-sm ml-4">
              <input
                type="text"
                placeholder="Search voters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVoters.map((voter) => (
                  <tr key={voter.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{voter.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voter.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voter.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voter.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        voter.registered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {voter.registered ? 'Registered' : 'Unregistered'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveVoter(voter.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterListManager; 