import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useApp();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" message="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return path
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute;
