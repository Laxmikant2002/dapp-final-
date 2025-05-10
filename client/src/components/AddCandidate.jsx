import React, { useState, useEffect } from 'react';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';

const AddCandidate = () => {
  const { contract } = useContract();
  const [elections, setElections] = useState([]);
  const [form, setForm] = useState({ electionId: '', name: '', party: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchElections = async () => {
      if (!contract) return;
      const count = await contract.getElectionCount();
      const arr = [];
      for (let i = 0; i < count; i++) arr.push(await contract.getElection(i));
      setElections(arr.map((e, i) => ({ ...e, id: i }))); 
    };
    fetchElections();
  }, [contract]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!contract) return toast.error('Contract not loaded');
    setLoading(true);
    try {
      const tx = await contract.addCandidate(form.electionId, form.name, form.party, form.description);
      await tx.wait();
      toast.success('Candidate added!');
      setForm({ ...form, name: '', party: '', description: '' });
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
          <label className="block text-sm font-medium text-gray-700">Election</label>
          <select name="electionId" value={form.electionId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option value="">Select Election</option>
            {elections.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Candidate Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Party</label>
          <input type="text" name="party" value={form.party} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>
      </div>
      <div>
        <button type="submit" disabled={loading} className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>{loading ? 'Adding...' : 'Add Candidate'}</button>
      </div>
    </form>
  );
};

export default AddCandidate; 