import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ContractProvider } from './context/ContractContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Elections from './pages/Elections';
import CandidateDetails from './pages/CandidateDetails';
import VoteVerification from './pages/VoteVerification';
import AdminDashboard from './pages/AdminDashboard';
import PendingApproval from './pages/PendingApproval';
import Login from './pages/Login';
import Results from './pages/Results';
import Vote from './pages/Vote';
import ProfileVerify from './pages/ProfileVerify';

function App() {
  useEffect(() => {
    // setupAdminAccount().catch(console.error);
  }, []);

  return (
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
              <Route path="/login" element={<Login />} />
              <Route path="/verify-vote" element={<VoteVerification />} />
              <Route path="/voter/verify" element={<ProfileVerify />} />

              {/* Protected Voter Routes */}
              <Route path="/elections" element={<Elections />} />
              <Route path="/results" element={<Results />} />
              <Route path="/vote/:electionId" element={<Vote />} />
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
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      <Toaster position="top-right" />
    </ContractProvider>
  );
}

export default App;