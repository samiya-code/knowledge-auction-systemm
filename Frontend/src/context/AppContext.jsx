import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  currentScore: 0,
  quizResults: [],
  notifications: [],
  loading: false,
  error: null
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_SCORE: 'SET_SCORE',
  ADD_QUIZ_RESULT: 'ADD_QUIZ_RESULT',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        currentScore: 0,
        quizResults: [],
        error: null
      };
    case ActionTypes.SET_SCORE:
      return { ...state, currentScore: action.payload };
    case ActionTypes.ADD_QUIZ_RESULT:
      return {
        ...state,
        quizResults: [...state.quizResults, action.payload]
      };
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case ActionTypes.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      authService.verifyToken(token)
        .then(user => {
          dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: user });
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    login: async (credentials) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const response = await authService.login(credentials);
        localStorage.setItem('token', response.token);
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: response.user });
        return response;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },
    logout: () => {
      localStorage.removeItem('token');
      dispatch({ type: ActionTypes.LOGOUT });
    },
    setScore: (score) => dispatch({ type: ActionTypes.SET_SCORE, payload: score }),
    addQuizResult: (result) => dispatch({ type: ActionTypes.ADD_QUIZ_RESULT, payload: result }),
    addNotification: (notification) => dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification }),
    clearNotifications: () => dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS })
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
