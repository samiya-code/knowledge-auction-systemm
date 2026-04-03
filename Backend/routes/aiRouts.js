const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const aiController = require('../controllers/aiController');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// All AI routes require authentication
router.use(authenticateToken);

// Generate quiz questions
router.post('/generate-questions', asyncHandler(aiController.generateQuestions));

// Generate explanations for questions
router.post('/generate-explanations', asyncHandler(aiController.generateExplanations));

// Generate personalized recommendations
router.post('/generate-recommendations', asyncHandler(aiController.generateRecommendations));

// Generate study plan
router.post('/generate-study-plan', asyncHandler(aiController.generateStudyPlan));

module.exports = router;
