import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

const VoterListManager = () => {
  const [voterList, setVoterList] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationData, setVerificationData] = useState({
    name: '',
    voterId: ''
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Maximum size is 5MB');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        // Validate the Excel structure
        if (!jsonData[0] || !jsonData[0].name || !jsonData[0].voterId) {
          toast.error('Invalid Excel format. Please ensure columns "name" and "voterId" exist.');
          setIsProcessing(false);
          return;
        }

        // Validate data format
        const invalidRows = jsonData.filter(row => !row.name || !row.voterId);
        if (invalidRows.length > 0) {
          toast.error(`Found ${invalidRows.length} invalid rows. Please check your data.`);
          setIsProcessing(false);
          return;
        }

        setVoterList(jsonData);
        toast.success('Voter list uploaded successfully!');
        setShowUploadModal(false);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        toast.error('Error processing Excel file. Please try again.');
      } finally {
        setIsProcessing(false);
        // Reset file input
        e.target.value = '';
      }
    };

    reader.onerror = () => {
      toast.error('Error reading file. Please try again.');
      setIsProcessing(false);
      // Reset file input
      e.target.value = '';
    };

    reader.readAsArrayBuffer(file);
  };

  const verifyVoter = () => {
    const { name, voterId } = verificationData;
    if (!name.trim() || !voterId.trim()) {
      toast.error('Please enter both name and voter ID');
      return;
    }

    const voter = voterList.find(
      v => v.name.toLowerCase() === name.toLowerCase() && 
           v.voterId.toLowerCase() === voterId.toLowerCase()
    );

    if (voter) {
      toast.success('Voter verified successfully!');
      // Store verification status in localStorage
      localStorage.setItem('voterVerified', 'true');
      localStorage.setItem('voterName', name);
      localStorage.setItem('voterId', voterId);
    } else {
      toast.error('Voter not found in the list');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Voter List Management</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
        >
          <i className="fas fa-upload mr-2"></i>
          Upload Voter List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Voter Verification</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={verificationData.name}
              onChange={(e) => setVerificationData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Voter ID
            </label>
            <input
              type="text"
              value={verificationData.voterId}
              onChange={(e) => setVerificationData(prev => ({ ...prev, voterId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
              placeholder="Enter voter ID"
            />
          </div>
          <button
            onClick={verifyVoter}
            className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90 w-full"
          >
            Verify Voter
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Upload Voter List</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="voterListUpload"
                />
                <label
                  htmlFor="voterListUpload"
                  className="cursor-pointer bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
                >
                  <i className="fas fa-file-excel mr-2"></i>
                  Select Excel File
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  Supported formats: .xlsx, .xls (max 5MB)
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Required columns: name, voterId
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom mx-auto mb-4"></div>
            <p className="text-gray-600">Processing Excel file...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoterListManager; 