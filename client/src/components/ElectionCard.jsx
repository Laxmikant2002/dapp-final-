import React from "react";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const ElectionCard = ({ election }) => {
  const date = new Date().toLocaleString();

  const [startTime, setStartTime] = useState(date);
  const [endTime, setEndTime] = useState(date);
  const [pollEnded, setPollEnded] = useState();
  const [endTimeInUnix, setUnixTime] = useState();
  const [status, setStatus] = useState();

  const getTime = async () => {
    try {
      const _startTime = Number(await election.contract.startTime());
      const _endTime = Number(await election.contract.endTime());
      setUnixTime(_endTime);

      let dateObj = new Date(_startTime * 1000);
      let start = dateObj.toLocaleString();
      setStartTime(start);

      let dateObj1 = new Date(_endTime * 1000);
      let end = dateObj1.toLocaleString();
      setEndTime(end);
    } catch (error) {
      console.log(error);
    }
  };

  const compare = () => {
    let dte = new Date().getTime();
    dte = Math.floor(dte / 1000);
    if (endTimeInUnix > dte) {
      setStatus("Voting in progress");
      setPollEnded(false);
    } else {
      setStatus("Voting has ended");
      setPollEnded(true);
    }
  };

  useEffect(() => {
    getTime();
  }, []);

  useEffect(() => {
    if (!endTime) return;
    const interval = setInterval(() => {
      compare();
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionButton = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <Link
            to={`/voting/${election.id}`}
            className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-custom/90"
          >
            Vote Now
          </Link>
        );
      case 'upcoming':
  return (
          <button
            disabled
            className="bg-gray-100 text-gray-500 px-4 py-2 rounded-button text-sm font-medium"
          >
            Coming Soon
          </button>
        );
      case 'ended':
        return (
          <Link
            to={`/results/${election.id}`}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-button text-sm font-medium hover:bg-gray-200"
          >
            View Results
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{election.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{election.endDate}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(election.status)}`}>
          {election.status}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{election.description}</p>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {election.status.toLowerCase() === 'ended' 
            ? `Final Votes: ${election.votesCast}`
            : election.status.toLowerCase() === 'upcoming'
            ? `Candidates: ${election.candidates}`
            : `Total Votes: ${election.votesCast}`}
        </div>
        {getActionButton(election.status)}
      </div>
    </div>
  );
};

export default ElectionCard;
