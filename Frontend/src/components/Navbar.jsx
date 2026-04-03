import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Notification from './Notification';

const Navbar = () => {
  const { user, isAuthenticated, logout, notifications, clearNotifications } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">BA</span>
              </div>
              <span className="font-bold text-xl">Bashedu Auction</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`hover:text-blue-200 transition-colors ${
                  isActive('/') ? 'text-blue-200' : ''
                }`}
              >
                Home
              </Link>
              <Link
                to="/leaderboard"
                className={`hover:text-blue-200 transition-colors ${
                  isActive('/leaderboard') ? 'text-blue-200' : ''
                }`}
              >
                Leaderboard
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center space-x-2 hover:text-blue-200 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span>{user?.name || 'User'}</span>
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {notifications.length}
                        </span>
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/results"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Results
                        </Link>
                        <button
                          onClick={() => {
                            clearNotifications();
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Clear Notifications
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="hover:text-blue-200 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-blue-200 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <Link
                to="/"
                className="block py-2 hover:text-blue-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/leaderboard"
                className="block py-2 hover:text-blue-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Leaderboard
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block py-2 hover:text-blue-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/results"
                    className="block py-2 hover:text-blue-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Results
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block py-2 hover:text-blue-200 transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 hover:text-blue-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block py-2 hover:text-blue-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <Notification
              key={index}
              notification={notification}
              onClose={() => {
                // Remove specific notification logic here if needed
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
