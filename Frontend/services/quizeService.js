import api from './api';

// Quiz service for managing quiz-related operations
export const quizService = {
  // Get quiz questions for a course
  getQuizQuestions: async (courseId) => {
    try {
      const response = await api.get(`/quiz/questions/${courseId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz questions');
    }
  },

  // Generate quiz questions using AI
  generateQuestions: async (courseData) => {
    try {
      const response = await api.post('/ai/generate-questions', courseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate questions');
    }
  },

  // Submit quiz answers
  submitQuiz: async (quizData) => {
    try {
      const response = await api.post('/quiz/submit', quizData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit quiz');
    }
  },

  // Get quiz history for user
  getQuizHistory: async () => {
    try {
      const response = await api.get('/quiz/history');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz history');
    }
  },

  // Get specific quiz result
  getQuizResult: async (quizId) => {
    try {
      const response = await api.get(`/quiz/result/${quizId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz result');
    }
  }
};
