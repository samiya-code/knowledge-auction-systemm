const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const resultController = require('../controllers/resultController');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// All result routes require authentication
router.use(authenticateToken);

// Leaderboard and public results
router.get('/leaderboard', asyncHandler(resultController.getLeaderboard));

// User-specific results
router.get('/user', asyncHandler(resultController.getUserResults));
router.get('/analytics', asyncHandler(resultController.getUserAnalytics));
router.get('/achievements', asyncHandler(resultController.getUserAchievements));

// Specific result operations
router.get('/:resultId', asyncHandler(resultController.getResultById));
router.post('/:resultId/share', asyncHandler(resultController.shareResult));

// Course-specific statistics
router.get('/stats/:courseId', asyncHandler(resultController.getCourseStats));

module.exports = router;
