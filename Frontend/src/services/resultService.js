import api from './api';

// Result service for managing quiz results and rankings
export const resultService = {
  // Get leaderboard data
  getLeaderboard: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/results/leaderboard?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  },

  // Get user's personal results
  getUserResults: async () => {
    try {
      const response = await api.get('/results/user');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user results');
    }
  },

  // Get detailed result by ID
  getResultById: async (resultId) => {
    try {
      const response = await api.get(`/results/${resultId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch result');
    }
  },

  // Get course statistics
  getCourseStats: async (courseId) => {
    try {
      const response = await api.get(`/results/stats/${courseId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course statistics');
    }
  },

  // Share result
  shareResult: async (resultId, platform) => {
    try {
      const response = await api.post(`/results/${resultId}/share`, { platform });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to share result');
    }
  }
};
