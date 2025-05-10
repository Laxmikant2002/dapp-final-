import React, { useState } from 'react';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';

const ElectionForm = ({ onSuccess }) => {
  const { contract } = useContract();
  const [form, setForm] = useState({ name: '', description: '', startDate: '', startTime: '', endDate: '', endTime: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!contract) return toast.error('Contract not loaded');
    setLoading(true);
    try {
      const start = new Date(`${form.startDate} ${form.startTime}`).getTime();
      const end = new Date(`${form.endDate} ${form.endTime}`).getTime();
      const tx = await contract.createElection(form.name, form.description, start, end);
      await tx.wait();
      toast.success('Election created!');
      setForm({ name: '', description: '', startDate: '', startTime: '', endDate: '', endTime: '' });
      onSuccess && onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Election Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
          </div>
        </div>
      </div>
      <div>
        <button type="submit" disabled={loading} className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>{loading ? 'Creating...' : 'Create Election'}</button>
      </div>
    </form>
  );
};

export default ElectionForm; 