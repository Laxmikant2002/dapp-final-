import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaLock, 
  FaDatabase, 
  FaCheckCircle, 
  FaGlobe, 
  FaMoneyBillWave 
} from 'react-icons/fa';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <FaSearch className="h-8 w-8" />,
      title: "Transparency",
      description: "All votes are publicly recorded on the blockchain, ensuring complete transparency."
    },
    {
      icon: <FaLock className="h-8 w-8" />,
      title: "Security",
      description: "Cryptographic security ensures votes cannot be tampered with or altered."
    },
    {
      icon: <FaDatabase className="h-8 w-8" />,
      title: "Immutability",
      description: "Once cast, votes are permanently recorded and cannot be modified or deleted."
    },
    {
      icon: <FaCheckCircle className="h-8 w-8" />,
      title: "Verifiability",
      description: "Voters can independently verify that their vote was counted correctly."
    },
    {
      icon: <FaGlobe className="h-8 w-8" />,
      title: "Accessibility",
      description: "Vote from anywhere with an internet connection and Ethereum wallet."
    },
    {
      icon: <FaMoneyBillWave className="h-8 w-8" />,
      title: "Cost Efficiency",
      description: "Reduces the cost and complexity of conducting secure elections."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Benefits of Blockchain Voting</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all"
            >
              <div className="mb-4 text-indigo-600">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-indigo-700">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection; 