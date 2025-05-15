import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaVoteYea, FaChartPie } from 'react-icons/fa';

const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-all"
          >
            <div className="bg-indigo-600 w-10 h-10 mx-auto mb-6 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div className="bg-indigo-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
              <FaShieldAlt className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Connect Wallet</h3>
            <p className="text-gray-600">Connect your Ethereum wallet to access the voting platform securely.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-all"
          >
            <div className="bg-indigo-600 w-10 h-10 mx-auto mb-6 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div className="bg-indigo-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
              <FaVoteYea className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Cast Your Vote</h3>
            <p className="text-gray-600">Browse active elections, review candidates, and cast your vote securely on the blockchain.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-all"
          >
            <div className="bg-indigo-600 w-10 h-10 mx-auto mb-6 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div className="bg-indigo-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
              <FaChartPie className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">View Results</h3>
            <p className="text-gray-600">See real-time election results and verify that your vote was recorded correctly.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 