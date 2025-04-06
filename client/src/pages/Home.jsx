import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';

const Home = () => {
  const navigate = useNavigate();
  const { account, connectWallet } = useContract();
  const [showChoiceScreen, setShowChoiceScreen] = useState(false);

  // Add useEffect to show choice screen when account is connected
  useEffect(() => {
    if (account) {
      setShowChoiceScreen(true);
    } else {
      setShowChoiceScreen(false);
    }
  }, [account]);

  const handleConnect = async () => {
    try {
      const connectedAccount = await connectWallet();
      console.log("Connected Account:", connectedAccount); // Debugging log
      if (connectedAccount) {
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      toast.error(error.message);
      setShowChoiceScreen(false);
    }
  };

  const handleRoleSelection = (role) => {
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="font-['Inter'] bg-gray-50 min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Choice Screen Modal */}
        {showChoiceScreen && ( // Rely only on showChoiceScreen
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold text-center mb-6">Choose Your Role</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div 
                  className="p-6 border rounded-lg hover:shadow-lg cursor-pointer transition-all"
                  onClick={() => handleRoleSelection('voter')}
                >
                  <div className="text-4xl text-custom mb-4">
                    <i className="fas fa-user-check"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">I'm a Voter</h3>
                  <p className="text-gray-600">Participate in existing elections and make your voice heard securely.</p>
                </div>
                <div 
                  className="p-6 border rounded-lg hover:shadow-lg cursor-pointer transition-all"
                  onClick={() => handleRoleSelection('admin')}
                >
                  <div className="text-4xl text-custom mb-4">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Create Voting as Admin</h3>
                  <p className="text-gray-600">Set up and manage new elections for your organization.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl mb-8">
              Secure Voting on Blockchain
            </h1>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-12">
              Experience the future of democratic participation with our decentralized voting platform. Transparent, secure, and accessible.
            </p>
            <button
              onClick={handleConnect}
              className="!rounded-button bg-custom text-white px-6 py-3 text-lg font-medium hover:bg-custom/90"
            >
              <i className="fas fa-wallet mr-2"></i>
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect with MetaMask'}
            </button>
            <p className="mt-4 text-sm text-gray-500">Powered by Ethereum Blockchain</p>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-custom text-4xl mb-4">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Transparent</h3>
              <p className="text-gray-500">Every vote is cryptographically secured and verifiable on the blockchain.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-custom text-4xl mb-4">
                <i className="fas fa-bolt"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-500">Real-time vote counting with immediate result verification.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-custom text-4xl mb-4">
                <i className="fas fa-user-shield"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy Protected</h3>
              <p className="text-gray-500">Your identity remains secure while ensuring vote authenticity.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;