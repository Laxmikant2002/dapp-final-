import React from 'react';
import { ContractProvider } from './context/ContractContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Elections from './pages/Elections';
import Voting from './pages/Voting';
import Results from './pages/Results';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from "sonner";
import "./App.css";

const App = () => {
  return (
    <ContractProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/elections" element={<Elections />} />
              <Route path="/voting/:id" element={<Voting />} />
              <Route path="/results/:id" element={<Results />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <Toaster richColors position="top-center" closeButton />
    </ContractProvider>
  );
};

export default App;



