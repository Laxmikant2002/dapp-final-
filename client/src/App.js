import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ContractProvider } from './context/ContractContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Elections from './pages/Elections';
import Results from './pages/Results';
import VoteVerification from './pages/VoteVerification';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDetails from './pages/CandidateDetails';
import { verifyAdminToken } from './services/adminServices';
import { setupAdminAccount } from './services/firebaseService';

// Protected Route component for admin routes
const AdminRoute = ({ children }) => {
  if (!verifyAdminToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  useEffect(() => {
    // Initialize admin account
    setupAdminAccount().catch(console.error);
  }, []);

  return (
    <ContractProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              
              {/* Voter Routes */}
              <Route path="/elections" element={<Elections />} />
              <Route path="/vote/:electionId" element={<CandidateDetails />} />
              <Route path="/results/:electionId" element={<Results />} />
              <Route path="/verify" element={<VoteVerification />} />
              
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </ContractProvider>
  );
}

export default App;
