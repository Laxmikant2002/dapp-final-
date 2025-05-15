import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ConnectWallet from './ConnectWallet';
import { FaCheckCircle } from 'react-icons/fa';

// VoterRegistrationMessage Component
const VoterRegistrationMessage = React.memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto mt-8"
  >
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <FaCheckCircle className="h-6 w-6 text-blue-600" />
      </div>
      <div className="ml-3">
        <h3 className="text-lg font-medium text-blue-800">Registration Required</h3>
        <div className="mt-2 text-sm text-blue-700">
          <p>
            Your wallet is connected, but you need to be registered as a voter by an administrator to participate in elections.
          </p>
          <p className="mt-2">
            Please contact an admin to register your wallet address:
          </p>
          <p className="mt-1 font-mono text-xs break-all bg-white p-2 rounded border border-blue-200">
            {window.ethereum?.selectedAddress || 'Connect your wallet to view address'}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
));

const HeroSection = ({ 
  isConnected, 
  isVoter, 
  isAdmin, 
  showVoterMessage, 
  showRoleModal, 
  setShowRoleModal,
  features,
  activeFeature,
  setActiveFeature,
  setIsPaused
}) => {
  return (
    <section className="relative overflow-hidden py-12 sm:py-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/20 backdrop-blur-sm"></div>
      </div>
      
      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <span className="text-indigo-600 font-semibold text-lg sm:text-xl mb-2 block tracking-wide">
              The Future of Secure Elections
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight font-sans leading-tight">
              <span className="block mb-2">Welcome to</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Blockchain Voting
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Conduct secure and transparent elections using Ethereum blockchain technology. 
              Vote with confidence knowing your ballot is immutable and verifiable.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-5">
              {!isConnected && (
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="shadow-lg"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-0.5">
                    <ConnectWallet />
                  </div>
                </motion.div>
              )}
              {isConnected && !isVoter && !isAdmin && !showVoterMessage && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 font-medium"
                  onClick={() => setShowRoleModal(true)}
                >
                  Select Your Role
                </motion.button>
              )}
              <div className="relative group">
                <Link 
                  to="/elections" 
                  className={`px-8 py-3.5 rounded-lg shadow-md transition-all duration-300 text-center font-medium inline-block ${
                    isConnected && isVoter 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-500/30 hover:shadow-lg' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={(e) => (!isConnected || !isVoter) && e.preventDefault()}
                  aria-disabled={!isConnected || !isVoter}
                  aria-label={!isConnected 
                    ? "Connect your wallet to view elections" 
                    : !isVoter 
                      ? "You must be registered as a voter to view elections" 
                      : "View all active elections"}
                >
                  View Elections
                </Link>
                {/* Enhanced tooltip for disabled button */}
                {(!isConnected || !isVoter) && (
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-xs rounded-md py-2 px-3 -bottom-12 left-1/2 transform -translate-x-1/2 w-48 text-center pointer-events-none shadow-lg z-10">
                    {!isConnected 
                      ? "Connect your wallet first to access elections" 
                      : "You need to be registered as a voter by an admin"}
                    <svg className="absolute text-gray-900 h-2 w-full left-0 top-0 -mt-2" x="0px" y="0px" viewBox="0 0 255 255">
                      <polygon className="fill-current" points="0,255 127.5,0 255,255"></polygon>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            {showVoterMessage && <VoterRegistrationMessage />}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:ml-auto hidden sm:block"
          >
            {/* Modern Blockchain Voting Illustration */}
            <div className="relative">
              <svg viewBox="0 0 400 400" className="w-full max-w-lg mx-auto drop-shadow-xl">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#4F46E5" floodOpacity="0.3" />
                  </filter>
                </defs>
                
                {/* Background Hexagon Grid Pattern */}
                <g opacity="0.2">
                  {[...Array(8)].map((_, row) => (
                    [...Array(8)].map((_, col) => (
                      <path 
                        key={`${row}-${col}`}
                        d="M25 0 L50 15 L50 45 L25 60 L0 45 L0 15 Z"
                        fill="#4F46E5"
                        opacity={(row + col) % 2 === 0 ? "0.2" : "0.05"}
                        transform={`translate(${col * 45 + (row % 2) * 22.5}, ${row * 35})`}
                      />
                    ))
                  ))}
                </g>
                
                {/* Ballot Box with Blockchain */}
                <g transform="translate(100, 60)" filter="url(#shadow)">
                  {/* Ballot Box */}
                  <rect x="60" y="120" width="180" height="150" rx="15" fill="url(#grad1)" />
                  <rect x="75" y="150" width="150" height="30" rx="5" fill="white" fillOpacity="0.3" />
                  
                  {/* Blockchain Elements */}
                  <g transform="translate(105, 60)">
                    {[...Array(5)].map((_, i) => (
                      <g key={i} transform={`translate(${i * 20}, ${i * -15})`}>
                        <rect x="0" y="0" width="50" height="50" rx="8" fill="url(#grad2)" />
                        <rect x="10" y="15" width="30" height="5" rx="2" fill="white" fillOpacity="0.5" />
                        <rect x="10" y="25" width="20" height="5" rx="2" fill="white" fillOpacity="0.5" />
                        <rect x="10" y="35" width="25" height="5" rx="2" fill="white" fillOpacity="0.5" />
                      </g>
                    ))}
                  </g>
                  
                  {/* Vote Checkmark */}
                  <g transform="translate(135, 195)">
                    <circle cx="15" cy="15" r="15" fill="white" />
                    <path d="M8 15 L13 20 L22 10" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </g>
                  
                  {/* Connection Lines */}
                  <g stroke="#60A5FA" strokeWidth="2" strokeDasharray="4 2">
                    {[...Array(4)].map((_, i) => (
                      <line key={i} x1={125 + i * 20} y1={90 + i * -15} x2={125 + (i+1) * 20} y2={90 + (i+1) * -15} />
                    ))}
                  </g>
                </g>
              </svg>
              
              {/* Feature highlights with responsive sizing */}
              <div className="absolute bottom-0 left-0 right-0">
                <div className="grid grid-cols-3 gap-2 mt-4 px-4">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={feature.title}
                      whileHover={{ scale: 1.05 }}
                      className={`bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md transition-all duration-300 cursor-pointer
                        ${activeFeature === index ? 'ring-2 ring-indigo-500 scale-105' : ''}
                      `}
                      onClick={() => {
                        setActiveFeature(index);
                        setIsPaused(true);
                        setTimeout(() => setIsPaused(false), 10000); // Resume auto-rotation after 10s
                      }}
                    >
                      <div className="flex items-center justify-center sm:justify-start">
                        <div className="text-indigo-600 mr-2 transition-transform duration-300 group-hover:scale-110">
                          {feature.icon}
                        </div>
                        <span className="text-xs sm:text-sm font-medium truncate">{feature.title}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 