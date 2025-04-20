import React from 'react';
import { testFirebaseConnection } from '../utils/firebaseTest';
import { toast } from 'react-hot-toast';

const FirebaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('idle');
  const [error, setError] = useState(null);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      setError(null);
      await testFirebaseConnection();
      setConnectionStatus('connected');
      toast.success('Firebase connection successful!');
    } catch (err) {
      setConnectionStatus('error');
      setError(err.message);
      toast.error('Firebase connection failed: ' + err.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Firebase Connection Test</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'testing' ? 'bg-yellow-500' :
            connectionStatus === 'error' ? 'bg-red-500' :
            'bg-gray-300'
          }`} />
          <span className="text-sm">
            {connectionStatus === 'connected' ? 'Connected' :
             connectionStatus === 'testing' ? 'Testing...' :
             connectionStatus === 'error' ? 'Error' :
             'Not tested'}
          </span>
        </div>
        
        {error && (
          <div className="text-sm text-red-600">
            Error: {error}
          </div>
        )}

        <button
          onClick={testConnection}
          disabled={connectionStatus === 'testing'}
          className={`px-4 py-2 rounded-md text-white ${
            connectionStatus === 'testing'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </div>
  );
};

export default FirebaseTest; 