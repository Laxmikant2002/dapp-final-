import React from 'react';
import ConnectWallet from './ConnectWallet';

const HeroSection = ({ isWalletConnected, isLoading, error, connectWallet, userRole }) => {
  return (
    <section className="relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Abstract%20digital%20blockchain%20technology%20background%20with%20blue%20glowing%20nodes%20connected%20in%20a%20network%20pattern%2C%20modern%20futuristic%20technology%20concept%20with%20soft%20gradient%20lighting%20and%20a%20clean%20minimalist%20design&width=1440&height=600&seq=hero-bg-1&orientation=landscape')`
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent z-0"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Secure Blockchain-Based Voting System
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Experience transparent, secure, and tamper-proof elections with our cutting-edge blockchain technology. Your vote matters, and we ensure it counts.
            </p>
            
            {!isWalletConnected && (
              <ConnectWallet 
                isLoading={isLoading} 
                connectWallet={connectWallet}
                className="!rounded-button bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition-colors shadow-lg whitespace-nowrap cursor-pointer"
                buttonText="Connect Wallet to Start"
              />
            )}
            
            {error && (
              <div className="mt-4 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}
            
            {isWalletConnected && (
              <div className="mt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 text-green-800 rounded-full px-4 py-1 flex items-center">
                    <i className="fas fa-check-circle mr-2"></i>
                    Wallet Connected
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Your Role</div>
                  <div className="flex items-center">
                    <i className={`fas ${userRole === 'admin' ? 'fa-user-shield text-purple-500' : 'fa-user text-blue-500'} mr-2`}></i>
                    <span className="font-medium text-gray-800">
                      {userRole === 'admin' ? 'Administrator' : 'Voter'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://readdy.ai/api/search-image?query=3D%20illustration%20of%20a%20secure%20digital%20voting%20concept%20with%20a%20ballot%20box%2C%20blockchain%20nodes%2C%20and%20a%20shield%20symbol%2C%20showing%20the%20security%20of%20digital%20voting%20with%20clean%20modern%20design%20on%20a%20gradient%20blue%20background&width=600&height=500&seq=voting-concept&orientation=portrait" 
              alt="Blockchain Voting Concept" 
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 