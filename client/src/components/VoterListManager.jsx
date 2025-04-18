import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const VoterListManager = ({ electionId }) => {
  const [loading, setLoading] = useState(false);
  const [voters, setVoters] = useState([]);
  const [newVoter, setNewVoter] = useState('');
  const [uploadMode, setUploadMode] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchVoters();
  }, [electionId]);

  const fetchVoters = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual contract call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVoters([
        { address: '0x1234...5678', registeredAt: new Date().toISOString() },
        { address: '0x9876...4321', registeredAt: new Date().toISOString() }
      ]);
    } catch (error) {
      console.error('Error fetching voters:', error);
      toast.error('Failed to fetch voters list');
    } finally {
      setLoading(false);
    }
  };

  const validateAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleAddVoter = async (e) => {
    e.preventDefault();
    
    if (!validateAddress(newVoter)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    try {
      setLoading(true);
      // TODO: Replace with actual contract call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVoters(prev => [...prev, {
        address: newVoter,
        registeredAt: new Date().toISOString()
      }]);
      
      setNewVoter('');
      toast.success('Voter added successfully');
    } catch (error) {
      console.error('Error adding voter:', error);
      toast.error('Failed to add voter');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    try {
      setLoading(true);
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const addresses = event.target.result
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && validateAddress(line));

          if (addresses.length === 0) {
            throw new Error('No valid addresses found in file');
          }

          // TODO: Replace with actual contract call
          await new Promise(resolve => setTimeout(resolve, 2000));

          const newVoters = addresses.map(address => ({
            address,
            registeredAt: new Date().toISOString()
          }));

          setVoters(prev => [...prev, ...newVoters]);
          setFile(null);
          toast.success(`Successfully added ${addresses.length} voters`);
        } catch (error) {
          console.error('Error processing file:', error);
          toast.error(error.message || 'Failed to process file');
        } finally {
          setLoading(false);
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      setLoading(false);
    }
  };

  const handleRemoveVoter = async (address) => {
    try {
      setLoading(true);
      // TODO: Replace with actual contract call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVoters(prev => prev.filter(voter => voter.address !== address));
      toast.success('Voter removed successfully');
    } catch (error) {
      console.error('Error removing voter:', error);
      toast.error('Failed to remove voter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Voter Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Manage Voters</h3>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setUploadMode(false)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                !uploadMode
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Add Single
            </button>
            <button
              type="button"
              onClick={() => setUploadMode(true)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                uploadMode
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bulk Upload
            </button>
          </div>
        </div>

        {uploadMode ? (
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Voter Addresses (One per line)
              </label>
              <input
                type="file"
                accept=".txt"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
              <p className="mt-2 text-sm text-gray-500">
                Upload a .txt file with one Ethereum address per line
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading || !file ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Upload Voters'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddVoter} className="space-y-4">
            <div>
              <label htmlFor="voter-address" className="block text-sm font-medium text-gray-700">
                Voter Address
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="voter-address"
                  value={newVoter}
                  onChange={(e) => setNewVoter(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Adding...' : 'Add Voter'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Voters List */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Registered Voters</h3>
          <p className="mt-1 text-sm text-gray-500">
            List of all registered voters for this election
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {voters.map((voter) => (
              <li key={voter.address} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">{voter.address}</p>
                    <p className="text-sm text-gray-500">
                      Registered on {new Date(voter.registeredAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVoter(voter.address)}
                    disabled={loading}
                    className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
            {voters.length === 0 && (
              <li className="px-4 py-8 sm:px-6 text-center text-gray-500">
                No voters registered yet
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoterListManager; 