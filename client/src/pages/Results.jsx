import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaChartBar, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { useContract } from '../context/ContractContext';
import { toast } from 'react-toastify';
import { Parser } from 'json2csv';

const Results = () => {
  const { id } = useParams();
  const { contract } = useContract();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch election details
        const election = await contract.getElection(id);
        
        // Fetch results for each candidate
        const candidates = await Promise.all(
          election.candidates.map(async (candidateId) => {
            const candidate = await contract.getCandidate(candidateId);
            const voteCount = await contract.getVoteCount(id, candidateId);
            return {
              id: candidateId,
              name: candidate.name,
              party: candidate.party,
              voteCount: voteCount.toNumber(),
            };
          })
        );

        // Calculate total votes and percentages
        const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
        const candidatesWithPercentages = candidates.map(c => ({
          ...c,
          percentage: totalVotes > 0 ? `${((c.voteCount / totalVotes) * 100).toFixed(1)}%` : '0%'
        }));

        // Calculate turnout (assuming we have total registered voters from contract)
        const totalVoters = await contract.getTotalVoters();
        const turnout = `${((totalVotes / totalVoters.toNumber()) * 100).toFixed(1)}%`;

        setResults({
          title: election.title,
          totalVotes,
          turnout,
          candidates: candidatesWithPercentages,
          timeline: [
            {
              date: election.startTime.toNumber() * 1000,
              description: 'Election Started'
            },
            {
              date: election.endTime.toNumber() * 1000,
              description: 'Election Ended'
            }
          ]
        });
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load election results');
        toast.error('Failed to load election results');
      } finally {
        setLoading(false);
      }
    };

    if (contract && id) {
      fetchResults();
    }
  }, [contract, id]);

  const getCandidateColor = (index) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500'];
    return colors[index % colors.length];
  };

  const handleExportCSV = () => {
    if (!results || !results.candidates) return;
    const fields = [
      { label: 'Candidate Name', value: 'name' },
      { label: 'Party', value: 'party' },
      { label: 'Vote Count', value: 'voteCount' },
      { label: 'Percentage', value: 'percentage' }
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(results.candidates);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${results.title || 'election-results'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading election results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No results found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Election Results
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {results.title}
          </p>
          <button
            onClick={handleExportCSV}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Export Results as CSV
          </button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <FaChartBar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Votes
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {results.totalVotes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <FaUsers className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Voter Turnout
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {results.turnout}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <FaCalendarAlt className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Election Status
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      Completed
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Chart */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Vote Distribution
            </h3>
            <div className="space-y-4">
              {results.candidates.map((candidate, index) => (
                <div key={candidate.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {candidate.name} ({candidate.party})
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {candidate.voteCount} votes ({candidate.percentage})
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getCandidateColor(index)}`}
                      style={{ width: candidate.percentage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Election Timeline
            </h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {results.timeline.map((event, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== results.timeline.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                            <FaCalendarAlt className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {event.description}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={event.date}>
                              {new Date(event.date).toLocaleDateString()}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;