const { asyncHandler } = require('../middleware/errorHandler');
const openaiService = require('../services/openaiService');
const courseAwareAIService = require('../services/courseAwareAIService');

// In-memory storage for auction data (in production, use database)
const activeAuctions = new Map();
const auctionQuestions = new Map();

// Start auction and generate AI questions
const startAuction = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  
  try {
    // Check if auction already exists
    if (activeAuctions.has(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Auction is already active'
      });
    }

    // Get course data (in production, fetch from database)
    const courseData = {
      id: courseId,
      title: req.body.title || 'Course Title',
      category: req.body.category || 'computerscience',
      level: req.body.level || 'intermediate',
      topics: req.body.topics || []
    };

    // Generate AI questions for the auction
    let questions;
    try {
      // Try course-aware AI first
      questions = await courseAwareAIService.generateCourseQuestions({
        courseTitle: courseData.title,
        courseId,
        courseType: courseData.category.toLowerCase(),
        difficulty: courseData.level.toLowerCase(),
        topic: courseData.topics[0] || courseData.title,
        questionCount: 8
      });
    } catch (aiError) {
      console.log('Course-aware AI failed, using fallback:', aiError.message);
      // Fallback to basic OpenAI service
      questions = await openaiService.generateQuizQuestions({
        courseTitle: courseData.title,
        courseId,
        difficulty: courseData.level,
        topic: courseData.topics[0] || courseData.title,
        questionCount: 8
      });
    }

    // Create auction data
    const auctionData = {
      courseId,
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      status: 'active',
      participants: [],
      questions: questions,
      depositRate: 0.10,
      maxParticipants: 50
    };

    // Store auction data
    activeAuctions.set(courseId, auctionData);
    auctionQuestions.set(courseId, questions);

    res.status(200).json({
      success: true,
      message: 'Auction started successfully with AI-generated questions',
      data: {
        auction: auctionData,
        questions: questions,
        questionCount: questions.length,
        aiGenerated: true
      }
    });

  } catch (error) {
    console.error('Start auction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start auction'
    });
  }
});

// Join auction
const joinAuction = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { deposit } = req.body;
  const userId = req.user?.id || 'demo-user';

  try {
    // Check if auction exists and is active
    const auction = activeAuctions.get(courseId);
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found or not active'
      });
    }

    // Check if user already joined
    if (auction.participants.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User already joined this auction'
      });
    }

    // Check if auction is full
    if (auction.participants.length >= auction.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Auction is full'
      });
    }

    // Add participant to auction
    auction.participants.push(userId);

    res.status(200).json({
      success: true,
      message: 'Successfully joined auction',
      data: {
        auction: auction,
        deposit: deposit,
        participantCount: auction.participants.length,
        questions: auction.questions
      }
    });

  } catch (error) {
    console.error('Join auction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join auction'
    });
  }
});

// Get auction status
const getAuctionStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  try {
    const auction = activeAuctions.get(courseId);
    
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    // Check if auction has ended
    const now = new Date();
    const isExpired = now > auction.endTime;
    
    if (isExpired && auction.status === 'active') {
      auction.status = 'ended';
    }

    res.status(200).json({
      success: true,
      data: {
        auction: auction,
        status: auction.status,
        timeLeft: auction.endTime - now,
        participantCount: auction.participants.length,
        isExpired: isExpired
      }
    });

  } catch (error) {
    console.error('Get auction status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get auction status'
    });
  }
});

// Get auction participants
const getAuctionParticipants = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  try {
    const auction = activeAuctions.get(courseId);
    
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        participants: auction.participants,
        participantCount: auction.participants.length,
        maxParticipants: auction.maxParticipants
      }
    });

  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get participants'
    });
  }
});

// Complete auction
const completeAuction = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  try {
    const auction = activeAuctions.get(courseId);
    
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    // Mark auction as ended
    auction.status = 'ended';
    auction.endTime = new Date();

    res.status(200).json({
      success: true,
      message: 'Auction completed successfully',
      data: {
        auction: auction,
        finalParticipantCount: auction.participants.length
      }
    });

  } catch (error) {
    console.error('Complete auction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete auction'
    });
  }
});

// Get auction questions
const getAuctionQuestions = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  try {
    const questions = auctionQuestions.get(courseId);
    
    if (!questions) {
      return res.status(404).json({
        success: false,
        message: 'Questions not found for this auction'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        questions: questions,
        questionCount: questions.length
      }
    });

  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get questions'
    });
  }
});

module.exports = {
  startAuction,
  joinAuction,
  getAuctionStatus,
  getAuctionParticipants,
  completeAuction,
  getAuctionQuestions
};
