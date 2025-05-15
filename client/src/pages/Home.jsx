import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import { useContract } from '../context/ContractContext';

// Import components
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorksSection';
import BenefitsSection from '../components/BenefitsSection';
import RoleSelectionModal from '../components/RoleSelectionModal';

// Feature Card Component
const FeatureCard = React.memo(({ feature, isActive }) => (
  <motion.div
    key={feature.title}
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: isActive ? 1 : 0,
      scale: isActive ? 1 : 0.9
    }}
    transition={{ duration: 0.5 }}
    className="absolute text-center"
  >
    <div className="flex justify-center mb-6">
      {feature.icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
    <p className="text-gray-600 max-w-md mx-auto">{feature.description}</p>
  </motion.div>
));

// Home Component
const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleCheckLoading, setRoleCheckLoading] = useState(false);
  const [hasCheckedRole, setHasCheckedRole] = useState(false);
  const [showVoterMessage, setShowVoterMessage] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { contract, isAdmin, isVoter, isConnected, loading: contractLoading } = useContract();

  // Features data
  const features = useMemo(() => [
    {
      title: 'Secure Voting',
      description: 'Every vote is recorded on the blockchain, ensuring complete transparency and preventing tampering.',
      icon: (
        <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Voter Verification',
      description: 'Verify your vote on the blockchain for complete transparency and trust in the voting process.',
      icon: (
        <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Real-time Results',
      description: 'View election results in real-time as votes are cast and recorded on the blockchain.',
      icon: (
        <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ], []);

  // Modified auto-advance features with pause functionality
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [features.length, isPaused]);

  // Handle location state messages
  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      toast.error(message);
      // Clear the state to prevent re-showing on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Clear localStorage when wallet disconnects
  useEffect(() => {
    if (!isConnected && hasCheckedRole) {
      setHasCheckedRole(false);
      setShowRoleModal(false);
      setShowVoterMessage(false);
    }
  }, [isConnected, hasCheckedRole]);

  // Role checking logic - modified for demo flow
  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      // Don't check if wallet not connected or contract not loaded
      if (!isConnected || !contract) {
        return;
      }

      // Don't recheck if already processed for this wallet connection
      if (hasCheckedRole) {
        return;
      }

      setRoleCheckLoading(true);

      try {
        // For the demo flow, we always show the role selection
        // regardless of on-chain roles to let users choose their demo path
        setHasCheckedRole(true);
        setShowRoleModal(true);
        
        // Note: In a production environment, we would check roles and auto-redirect:
        /*
        if (isAdmin) {
          setHasCheckedRole(true);
          navigate('/admin/login');
          return;
        }

        if (isVoter) {
          setHasCheckedRole(true);
          navigate('/elections');
          return;
        }
        */
      } catch (error) {
        console.error('Error checking role:', error);
        toast.error('Error checking user role');
        setHasCheckedRole(true);
        setShowRoleModal(true);
      } finally {
        setRoleCheckLoading(false);
      }
    };

    checkRoleAndRedirect();
  }, [isAdmin, isVoter, isConnected, contract, contractLoading, hasCheckedRole, navigate]);

  // Handle role selection
  const handleRoleSelection = useCallback((role) => {
    setShowRoleModal(false);
    
    if (role === 'admin') {
      navigate('/admin/login');
    } else if (role === 'voter') {
      // For the demo flow, direct to voter profile verification screen
      navigate('/voter/verify');
    }
  }, [navigate]);

  // Add network change listener
  useEffect(() => {
    // Reset role check when chain changes
    const handleChainChanged = () => {
      setHasCheckedRole(false);
      setShowRoleModal(false);
      setShowVoterMessage(false);
    };

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Show loading spinner only on Home page
  if ((contractLoading || roleCheckLoading) && location.pathname === '/') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <FaSpinner className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection 
          isConnected={isConnected}
          isVoter={isVoter}
          isAdmin={isAdmin}
          showVoterMessage={showVoterMessage}
          showRoleModal={showRoleModal}
          setShowRoleModal={setShowRoleModal}
          features={features}
          activeFeature={activeFeature}
          setActiveFeature={setActiveFeature}
          setIsPaused={setIsPaused}
        />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Role Selection Modal */}
        <AnimatePresence>
          <RoleSelectionModal
            isOpen={showRoleModal}
            onClose={() => setShowRoleModal(false)}
            onSelect={handleRoleSelection}
          />
        </AnimatePresence>
      </main>

      {/* Footer Section */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Project</h3>
              <p className="text-gray-600">
                Blockchain Voting is an open-source project that leverages Ethereum smart contracts to
                create a secure, transparent voting system.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://ethereum.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Learn about Ethereum
                  </a>
                </li>
                <li>
                  <a 
                    href="https://metamask.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Get MetaMask Wallet
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    GitHub Repository
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-600 mb-2">
                Have questions about the platform or need help?
              </p>
              <a 
                href="mailto:support@blockvoting.example"
                className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Blockchain Voting. All rights reserved.
          </div>
        </div>
      </section>
    </div>
  );
};

FeatureCard.displayName = 'FeatureCard';

export default Home;