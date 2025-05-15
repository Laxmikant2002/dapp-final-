import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUserTie, FaUsers } from 'react-icons/fa';

const RoleSelectionModal = React.memo(({ onClose, onSelect, isOpen }) => {
  const modalRef = useRef(null);
  const voterButtonRef = useRef(null);
  const adminButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  
  // Handle keyboard navigation and trap focus
  useEffect(() => {
    if (!isOpen) return;
    
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;
      
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // If shift+tab and on first element, go to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // If tab and on last element, go to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Set focus to the first button when modal opens
    voterButtonRef.current?.focus();
    
    window.addEventListener('keydown', handleTabKey);
    window.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      window.removeEventListener('keydown', handleTabKey);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-selection-title"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-md m-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="role-selection-title" className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Choose Your Role
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Select how you want to participate in the voting system
        </p>
        
        <div className="space-y-4">
          <motion.button
            ref={voterButtonRef}
            onClick={() => onSelect('voter')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-4 border rounded-lg border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Select Voter Role"
          >
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 5 }}
                className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors"
              >
                <FaUsers className="w-6 h-6 text-indigo-600 transition-transform group-hover:scale-110" aria-hidden="true" />
              </motion.div>
              <div className="ml-4 text-left">
                <h3 className="text-lg font-medium text-gray-900">Voter</h3>
                <p className="text-sm text-gray-500">Register and cast your vote in elections</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          <motion.button
            ref={adminButtonRef}
            onClick={() => onSelect('admin')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-4 border rounded-lg border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Select Admin Role"
          >
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 5 }}
                className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors"
              >
                <FaUserTie className="w-6 h-6 text-purple-600 transition-transform group-hover:scale-110" aria-hidden="true" />
              </motion.div>
              <div className="ml-4 text-left">
                <h3 className="text-lg font-medium text-gray-900">Admin</h3>
                <p className="text-sm text-gray-500">Login to manage elections and voters</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        <motion.button
          ref={cancelButtonRef}
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded border border-gray-200 hover:bg-gray-50"
          aria-label="Cancel role selection"
        >
          Cancel
        </motion.button>
      </motion.div>
    </motion.div>
  );
});

RoleSelectionModal.displayName = 'RoleSelectionModal';

export default RoleSelectionModal; 