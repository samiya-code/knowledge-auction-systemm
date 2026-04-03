import { useContext } from 'react';
import { useApp } from '../context/AppContext';

export const useAuth = () => {
  const context = useApp();
  
  if (!context) {
    throw new Error('useAuth must be used within an AppProvider');
  }

  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    loading: context.loading,
    login: context.login,
    logout: context.logout,
    setLoading: context.setLoading,
    setError: context.setError,
    error: context.error
  };
};
