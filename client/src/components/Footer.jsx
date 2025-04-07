import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img className="h-8" src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png" alt="Company logo" />
            <p className="mt-4 text-gray-400 text-sm">
              Making voting secure, transparent, and accessible through blockchain technology.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-base text-gray-300 hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-300 hover:text-white">Terms of Service</Link>
              </li>
              <li>
                <Link to="/faq" className="text-base text-gray-300 hover:text-white">FAQ</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex">
                <i className="fas fa-envelope text-gray-400 mt-1 mr-2"></i>
                <a href="mailto:support@blockvote.com" className="text-base text-gray-300 hover:text-white">support@blockvote.com</a>
              </li>
              <li className="flex">
                <i className="fas fa-phone text-gray-400 mt-1 mr-2"></i>
                <span className="text-base text-gray-300">+1 (555) 123-4567</span>
              </li>
            </ul>
            <div className="mt-8 flex space-x-6">
              <button
                onClick={() => window.open('https://twitter.com', '_blank')}
                className="text-gray-400 hover:text-gray-300 bg-transparent border-none p-0 cursor-pointer"
              >
                <i className="fab fa-twitter text-xl"></i>
              </button>
              <button
                onClick={() => window.open('https://linkedin.com', '_blank')}
                className="text-gray-400 hover:text-gray-300 bg-transparent border-none p-0 cursor-pointer"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </button>
              <button
                onClick={() => window.open('https://github.com', '_blank')}
                className="text-gray-400 hover:text-gray-300 bg-transparent border-none p-0 cursor-pointer"
              >
                <i className="fab fa-github text-xl"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            © 2024 BlockVote. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;