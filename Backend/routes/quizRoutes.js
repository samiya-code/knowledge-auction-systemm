const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const quizController = require('../controllers/quizController');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// All quiz routes require authentication
router.use(authenticateToken);

// Quiz question and submission routes
router.get('/questions/:courseId', asyncHandler(quizController.getQuizQuestions));
router.post('/submit', asyncHandler(quizController.submitQuiz));

// Quiz history and results
router.get('/history', asyncHandler(quizController.getQuizHistory));
router.get('/result/:quizId', asyncHandler(quizController.getQuizResult));

// Quiz statistics
router.get('/stats/:courseId', asyncHandler(quizController.getQuizStats));
router.get('/leaderboard/:courseId', asyncHandler(quizController.getQuizLeaderboard));

module.exports = router;
