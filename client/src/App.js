import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ContractProvider } from './context/ContractContext';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Elections from './pages/Elections';
import Vote from './pages/Vote';
import Results from './pages/Results';
import VoteVerification from './pages/VoteVerification';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Header from './components/Header';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to use this application.');
      setIsLoading(false);
      return;
    }

    // Check if we're on the correct network (Sepolia testnet)
    const checkNetwork = async () => {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        // Sepolia testnet chainId is '0xaa36a7'
        if (chainId !== '0xaa36a7') {
          setError('Please switch to Sepolia testnet to use this application.');
        }
      } catch (error) {
        console.error('Error checking network:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkNetwork();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        {error.includes('MetaMask') && (
          <a 
            href="https://metamask.io/download.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="metamask-button"
          >
            Install MetaMask
          </a>
        )}
      </div>
    );
  }

  return (
    <ContractProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/elections" element={<Elections />} />
              <Route path="/vote/:id" element={<Vote />} />
              <Route path="/results" element={<Results />} />
              <Route path="/verify" element={<VoteVerification />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </ContractProvider>
  );
}

export default App;
