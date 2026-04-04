import api from './api';

// Course service
export const courseService = {
  // Get all courses
  getCourses: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/courses?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses');
    }
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course');
    }
  },

  // Enroll in course
  enrollCourse: async (courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to enroll in course');
    }
  },

  // Join auction for course
  joinAuction: async (courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/join-auction`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to join auction');
    }
  },

  // Get auction details
  getAuctionDetails: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/auction`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get auction details');
    }
  },

  // Get course statistics
  getCourseStats: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/stats`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get course statistics');
    }
  },

  // Search courses
  searchCourses: async (query) => {
    try {
      const response = await api.get(`/courses/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search courses');
    }
  }
};
