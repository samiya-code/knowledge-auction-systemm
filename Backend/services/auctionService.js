const QuizResult = require('../models/QuizResult');
const User = require('../models/User');

// Calculate auction earnings based on performance
const calculateAuctionEarnings = async (quizResult) => {
  const { score, timeSpent, totalQuestions, courseId } = quizResult;
  
  // Base earnings calculation
  let baseEarnings = 10; // Base amount for completing quiz
  
  // Performance bonus
  const performanceBonus = (score / 100) * 20; // Up to $20 bonus for perfect score
  
  // Speed bonus (completing quickly)
  const averageTimePerQuestion = timeSpent / totalQuestions;
  const speedBonus = averageTimePerQuestion < 30 ? 10 : 0; // $10 bonus if avg time < 30s
  
  // Difficulty bonus (based on course difficulty)
  const difficultyBonus = await getCourseDifficultyBonus(courseId);
  
  // Streak bonus
  const streakBonus = await getStreakBonus(quizResult.user);
  
  const totalEarnings = Math.round(baseEarnings + performanceBonus + speedBonus + difficultyBonus + streakBonus);
  
  return {
    baseEarnings,
    performanceBonus,
    speedBonus,
    difficultyBonus,
    streakBonus,
    totalEarnings
  };
};

// Get course difficulty bonus
const getCourseDifficultyBonus = async (courseId) => {
  // This would typically fetch from a Course model
  // For now, return a fixed bonus based on course ID
  const difficultyMap = {
    1: 5,  // Beginner course
    2: 10, // Intermediate course
    3: 15, // Advanced course
    4: 20, // Expert course
    5: 25  // Master course
  };
  
  return difficultyMap[courseId] || 5;
};

// Get streak bonus for user
const getStreakBonus = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) return 0;
  
  // Streak bonus calculation
  if (user.loginStreak >= 30) return 15;  // 30+ day streak
  if (user.loginStreak >= 14) return 10;  // 14+ day streak
  if (user.loginStreak >= 7) return 5;   // 7+ day streak
  if (user.loginStreak >= 3) return 2;   // 3+ day streak
  
  return 0;
};

// Process auction payout
const processAuctionPayout = async (quizResult) => {
  try {
    const earnings = await calculateAuctionEarnings(quizResult);
    
    // Update quiz result with earnings
    quizResult.earnings = earnings.totalEarnings;
    await quizResult.save();
    
    // Update user's total earnings
    const user = await User.findById(quizResult.user);
    if (user) {
      user.stats.totalEarnings += earnings.totalEarnings;
      await user.save();
    }
    
    // Create transaction record
    const transaction = await createTransaction({
      userId: quizResult.user,
      type: 'quiz_completion',
      amount: earnings.totalEarnings,
      description: `Quiz completion: ${quizResult.quizTitle}`,
      metadata: {
        quizResultId: quizResult._id,
        score: quizResult.score,
        breakdown: earnings
      }
    });
    
    return {
      success: true,
      earnings,
      transaction
    };
    
  } catch (error) {
    console.error('Error processing auction payout:', error);
    throw new Error('Failed to process auction payout');
  }
};

// Create transaction record
const createTransaction = async (transactionData) => {
  // This would typically use a Transaction model
  // For now, return a mock transaction object
  return {
    id: `txn_${Date.now()}`,
    ...transactionData,
    createdAt: new Date(),
    status: 'completed'
  };
};

// Get user's auction history
const getUserAuctionHistory = async (userId, options = {}) => {
  const { limit = 10, skip = 0 } = options;
  
  const results = await QuizResult.find({
    user: userId,
    earnings: { $gt: 0 }
  })
  .select('quizTitle score earnings createdAt')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);
  
  const total = await QuizResult.countDocuments({
    user: userId,
    earnings: { $gt: 0 }
  });
  
  return {
    results,
    pagination: {
      limit,
      skip,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Get auction leaderboard (highest earners)
const getAuctionLeaderboard = async (timeFilter = 'all', limit = 10) => {
  let dateFilter = {};
  
  if (timeFilter === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateFilter = { createdAt: { $gte: today } };
  } else if (timeFilter === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    dateFilter = { createdAt: { $gte: weekAgo } };
  } else if (timeFilter === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    dateFilter = { createdAt: { $gte: monthAgo } };
  }
  
  const leaderboard = await QuizResult.aggregate([
    {
      $match: {
        earnings: { $gt: 0 },
        ...dateFilter
      }
    },
    {
      $group: {
        _id: '$user',
        totalEarnings: { $sum: '$earnings' },
        quizCount: { $sum: 1 },
        averageEarnings: { $avg: '$earnings' },
        highestEarning: { $max: '$earnings' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        user: {
          id: '$userInfo._id',
          name: '$userInfo.name',
          avatar: '$userInfo.avatar'
        },
        totalEarnings: 1,
        quizCount: 1,
        averageEarnings: { $round: ['$averageEarnings', 2] },
        highestEarning: 1
      }
    },
    {
      $sort: { totalEarnings: -1 }
    },
    {
      $limit: limit
    }
  ]);
  
  return leaderboard.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
};

// Get auction statistics
const getAuctionStatistics = async () => {
  const stats = await QuizResult.aggregate([
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$earnings' },
        totalPayouts: { $sum: { $cond: [{ $gt: ['$earnings', 0] }, 1, 0] } },
        averageEarning: { $avg: '$earnings' },
        highestEarning: { $max: '$earnings' },
        totalParticipants: { $addToSet: '$user' }
      }
    },
    {
      $project: {
        totalEarnings: { $round: ['$totalEarnings', 2] },
        totalPayouts: 1,
        averageEarning: { $round: ['$averageEarning', 2] },
        highestEarning: 1,
        totalParticipants: { $size: '$totalParticipants' }
      }
    }
  ]);
  
  return stats[0] || {
    totalEarnings: 0,
    totalPayouts: 0,
    averageEarning: 0,
    highestEarning: 0,
    totalParticipants: 0
  };
};

// Process refund (if needed)
const processRefund = async (quizResultId, reason) => {
  try {
    const quizResult = await QuizResult.findById(quizResultId);
    
    if (!quizResult || quizResult.earnings <= 0) {
      throw new Error('No refund available for this quiz result');
    }
    
    // Create refund transaction
    const refundTransaction = await createTransaction({
      userId: quizResult.user,
      type: 'refund',
      amount: -quizResult.earnings,
      description: `Refund for quiz: ${quizResult.quizTitle}`,
      metadata: {
        quizResultId,
        reason
      }
    });
    
    // Update user's total earnings
    const user = await User.findById(quizResult.user);
    if (user) {
      user.stats.totalEarnings -= quizResult.earnings;
      await user.save();
    }
    
    // Reset quiz result earnings
    quizResult.earnings = 0;
    await quizResult.save();
    
    return {
      success: true,
      refundAmount: quizResult.earnings,
      transaction: refundTransaction
    };
    
  } catch (error) {
    console.error('Error processing refund:', error);
    throw new Error('Failed to process refund');
  }
};

// Calculate auction pool distribution
const calculateAuctionPool = async () => {
  const stats = await getAuctionStatistics();
  
  // Calculate pool distribution (this could be more complex in a real system)
  const poolDistribution = {
    totalPool: stats.totalEarnings,
    userPayouts: stats.totalEarnings * 0.8, // 80% to users
    platformFee: stats.totalEarnings * 0.15, // 15% platform fee
    reserveFund: stats.totalEarnings * 0.05 // 5% reserve fund
  };
  
  return poolDistribution;
};

module.exports = {
  calculateAuctionEarnings,
  processAuctionPayout,
  getUserAuctionHistory,
  getAuctionLeaderboard,
  getAuctionStatistics,
  processRefund,
  calculateAuctionPool
};
