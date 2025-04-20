import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { config } from './config/wagmi';
import { setupAdminAccount } from './services/firebaseService';
import { ContractProvider } from './context/ContractContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Elections from './pages/Elections';
import CandidateDetails from './pages/CandidateDetails';
import VoteVerification from './pages/VoteVerification';
import AdminDashboard from './pages/AdminDashboard';
import PendingApproval from './pages/PendingApproval';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    setupAdminAccount().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ContractProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/pending-approval" element={<PendingApproval />} />

                  {/* Protected Voter Routes */}
                  <Route
                    path="/elections"
                    element={
                      <ProtectedRoute requiresVoter={true}>
                        <Elections />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/candidate/:id"
                    element={
                      <ProtectedRoute requiresVoter={true}>
                        <CandidateDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/verify-vote/:id"
                    element={
                      <ProtectedRoute requiresVoter={true}>
                        <VoteVerification />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute requiresAuth={true} requiresVoter={false}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
          <Toaster position="top-right" />
        </ContractProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default App;
