import api from './api';
import { aiService } from './aiService';

// Auction service for managing auction operations
export const auctionService = {
  // Start auction and generate AI questions
  startAuction: async (courseId, courseData) => {
    try {
      // Start the auction
      const response = await api.post(`/courses/${courseId}/start-auction`);
      
      // Generate AI questions for the auction
      const questionsResponse = await aiService.generateCourseQuestions({
        courseId,
        title: courseData.title,
        courseType: courseData.category?.toLowerCase() || 'computerscience',
        difficulty: courseData.level?.toLowerCase() || 'intermediate',
        topic: courseData.topics?.[0] || courseData.title,
        questionCount: 8
      });
      
      return {
        success: true,
        auction: response.data.auction,
        questions: questionsResponse.data.questions,
        message: 'Auction started with AI-generated questions!'
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to start auction');
    }
  },

  // Join an existing auction
  joinAuction: async (courseId, depositAmount) => {
    try {
      const response = await api.post(`/courses/${courseId}/join-auction`, {
        deposit: depositAmount
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to join auction');
    }
  },

  // Get auction status
  getAuctionStatus: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/auction-status`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get auction status');
    }
  },

  // Get auction participants
  getAuctionParticipants: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/participants`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get participants');
    }
  },

  // Complete auction and calculate results
  completeAuction: async (courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/complete-auction`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to complete auction');
    }
  }
};
