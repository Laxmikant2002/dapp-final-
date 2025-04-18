import React from "react";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const ElectionCard = ({ election }) => {
  const date = new Date().toLocaleString();

  const [startTime, setStartTime] = useState(date);
  const [endTime, setEndTime] = useState(date);
  const [pollEnded, setPollEnded] = useState(false);
  const [endTimeInUnix, setUnixTime] = useState(0);
  const [status, setStatus] = useState('Loading');

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
  }, [getTime]);

  useEffect(() => {
    if (!endTime) return;
    const interval = setInterval(() => {
      compare();
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, compare]);

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{election.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{election.description}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Start Time</p>
            <p className="font-medium">{startTime}</p>
          </div>
          <div>
            <p className="text-gray-500">End Time</p>
            <p className="font-medium">{endTime}</p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          {getActionButton(status)}
        </div>
      </div>
    </div>
  );
};

export default ElectionCard;
