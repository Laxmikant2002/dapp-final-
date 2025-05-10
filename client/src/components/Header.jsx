import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import ConnectWallet from './ConnectWallet';

const Header = () => {
  const location = useLocation();
  const { isConnected, address: account } = useAccount();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                Blockchain Voting
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') ? 'border-indigo-500 text-gray-900' : ''
                }`}
              >
                Home
              </Link>
              <Link
                to="/elections"
                className={`border-transparent text-gray-500 px-1 pt-1 border-b-2 text-sm font-medium ${
                  !isConnected ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300 hover:text-gray-700'
                } ${isActive('/elections') ? 'border-indigo-500 text-gray-900' : ''}`}
                onClick={(e) => !isConnected && e.preventDefault()}
              >
                Elections
              </Link>
              <Link
                to="/results"
                className={`border-transparent text-gray-500 px-1 pt-1 border-b-2 text-sm font-medium ${
                  !isConnected ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300 hover:text-gray-700'
                } ${isActive('/results') ? 'border-indigo-500 text-gray-900' : ''}`}
                onClick={(e) => !isConnected && e.preventDefault()}
              >
                Results
              </Link>
              <Link
                to="/verify"
                className={`border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/verify') ? 'border-indigo-500 text-gray-900' : ''
                }`}
              >
                Verify Vote
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected && account && (
              <span className="text-sm text-gray-500">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            )}
            <ConnectWallet />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;