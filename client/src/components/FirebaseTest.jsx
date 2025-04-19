import React, { useState } from 'react';
import { testFirebaseConnection } from '../utils/firebaseTest';

const FirebaseTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    try {
      const results = await testFirebaseConnection();
      setTestResults(results);
    } catch (error) {
      setTestResults({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Firebase Connection Test</h2>
      
      <button
        onClick={runTest}
        disabled={isLoading}
        className={`px-4 py-2 rounded ${
          isLoading 
            ? 'bg-gray-400' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white font-semibold`}
      >
        {isLoading ? 'Testing...' : 'Run Connection Test'}
      </button>

      {testResults && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Results:</h3>
          <div className={`p-3 rounded ${
            testResults.success ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <p className="font-medium">
              Status: {testResults.success ? '✅ Success' : '❌ Failed'}
            </p>
            {testResults.results && (
              <ul className="mt-2 space-y-1">
                <li>Firestore: {testResults.results.firestore ? '✅' : '❌'}</li>
                <li>Authentication: {testResults.results.auth ? '✅' : '❌'}</li>
                <li>Document Operations: {testResults.results.testDoc ? '✅' : '❌'}</li>
                <li>Cleanup: {testResults.results.cleanup ? '✅' : '❌'}</li>
              </ul>
            )}
            {testResults.error && (
              <p className="mt-2 text-red-600">
                Error: {testResults.error}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseTest; 