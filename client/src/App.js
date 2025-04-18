import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ContractProvider } from './context/ContractContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Elections from './pages/Elections';
import Vote from './pages/Vote';
import Results from './pages/Results';
import VoteVerification from './pages/VoteVerification';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDetails from './pages/CandidateDetails';
import { verifyAdminToken } from './services/adminServices';

// Protected Route component for admin routes
const AdminRoute = ({ children }) => {
  if (!verifyAdminToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ContractProvider>
      <Router>
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
      </Router>
    </ContractProvider>
  );
}

export default App;
