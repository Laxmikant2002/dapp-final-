import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import ConnectWallet from './ConnectWallet';
import { toast } from 'react-hot-toast';
import { FaBars, FaTimes, FaUserShield } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  const { isConnected, account, networkName, isCorrectNetwork, chainId, isAdmin, isVoter } = useContract();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  // Show network warning as toast notification
  useEffect(() => {
    if (isConnected && !isCorrectNetwork) {
      toast.error(
        'Please switch to a supported network (Hardhat Local or Sepolia Testnet) to use all features',
        { duration: 6000, id: 'network-warning' }
      );
    }
  }, [isConnected, isCorrectNetwork]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-sm relative z-10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600 flex-shrink-0">
              Blockchain Voting
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
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
              to="/verify-vote"
              className={`border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/verify-vote') ? 'border-indigo-500 text-gray-900' : ''
              }`}
            >
              Verify Vote
            </Link>
            
            {/* Admin Link - only shown for admin users */}
            {isConnected && isAdmin && (
              <Link
                to="/admin"
                className={`border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 px-1 pt-1 border-b-2 text-sm font-medium flex items-center ${
                  location.pathname.startsWith('/admin') ? 'border-indigo-500 text-gray-900' : ''
                }`}
              >
                <FaUserShield className="mr-1" /> Admin
              </Link>
            )}
          </div>

          {/* Connection Status & Wallet */}
          <div className="flex items-center space-x-4">
            {isConnected && (
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm text-gray-500">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <span className={`text-xs ${isCorrectNetwork ? 'text-green-600' : 'text-red-600'}`}>
                  {networkName || `Chain ID: ${chainId}`}
                  {!isCorrectNetwork && " (Wrong Network)"}
                </span>
              </div>
            )}
            <ConnectWallet />
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg absolute w-full z-10`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/elections"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              !isConnected ? 'opacity-50 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            } ${isActive('/elections') ? 'bg-indigo-50 text-indigo-700' : ''}`}
            onClick={(e) => {
              if (!isConnected) {
                e.preventDefault();
              } else {
                setIsOpen(false);
              }
            }}
          >
            Elections
          </Link>
          <Link
            to="/results"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              !isConnected ? 'opacity-50 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            } ${isActive('/results') ? 'bg-indigo-50 text-indigo-700' : ''}`}
            onClick={(e) => {
              if (!isConnected) {
                e.preventDefault();
              } else {
                setIsOpen(false);
              }
            }}
          >
            Results
          </Link>
          <Link
            to="/verify-vote"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/verify-vote') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Verify Vote
          </Link>
          
          {/* Admin Link in Mobile Menu */}
          {isConnected && isAdmin && (
            <Link
              to="/admin"
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                location.pathname.startsWith('/admin') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaUserShield className="mr-1" /> Admin
            </Link>
          )}
          
          {/* Mobile wallet display */}
          {isConnected && (
            <div className="px-3 py-2 text-sm text-gray-500 border-t border-gray-200 mt-2 pt-2">
              <p>
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
              <p className={`${isCorrectNetwork ? 'text-green-600' : 'text-red-600'}`}>
                {networkName || `Chain ID: ${chainId}`}
                {!isCorrectNetwork && " (Wrong Network)"}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;