const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Start auction and generate AI questions
router.post('/courses/:courseId/start-auction', authenticateToken, auctionController.startAuction);

// Join auction
router.post('/courses/:courseId/join-auction', authenticateToken, auctionController.joinAuction);

// Get auction status
router.get('/courses/:courseId/auction-status', auctionController.getAuctionStatus);

// Get auction participants
router.get('/courses/:courseId/participants', auctionController.getAuctionParticipants);

// Complete auction
router.post('/courses/:courseId/complete-auction', authenticateToken, auctionController.completeAuction);

// Get auction questions
router.get('/courses/:courseId/questions', authenticateToken, auctionController.getAuctionQuestions);

module.exports = router;
