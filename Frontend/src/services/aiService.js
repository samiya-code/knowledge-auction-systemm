import api from './api';

// Generate course-specific quiz questions
export const generateCourseQuestions = async (params) => {
  const response = await api.post('/ai/generate-course-questions', params);
  return response.data;
};

// Generate course-specific feedback
export const generateCourseFeedback = async (params) => {
  const response = await api.post('/ai/generate-course-feedback', params);
  return response.data;
};

// Add knowledge to course base
export const addCourseKnowledge = async (params) => {
  const response = await api.post('/ai/add-course-knowledge', params);
  return response.data;
};

// Test AI connection
export const testAIConnection = async () => {
  const response = await api.get('/ai/test-connection');
  return response.data;
};

// Generate regular quiz questions (original)
export const generateQuestions = async (params) => {
  const response = await api.post('/ai/generate-questions', params);
  return response.data;
};

// Generate feedback (original)
export const generateFeedback = async (params) => {
  const response = await api.post('/ai/generate-feedback', params);
  return response.data;
};

// Generate recommendations
export const generateRecommendations = async (params) => {
  const response = await api.post('/ai/generate-recommendations', params);
  return response.data;
};
