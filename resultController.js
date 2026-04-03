const QuizResult = require('../models/QuizResult');
const { asyncHandler } = require('../middleware/errorHandler');

// Get leaderboard data
const getLeaderboard = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, timeFilter = 'all' } = req.query;

  const leaderboard = await QuizResult.getOverallLeaderboard(
    parseInt(limit),
    timeFilter
  );

  // Add rank to each entry
  const rankedLeaderboard = leaderboard.map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));

  res.status(200).json({
    success: true,
    data: {
      leaderboard: rankedLeaderboard,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: rankedLeaderboard.length,
        pages: Math.ceil(rankedLeaderboard.length / parseInt(limit))
      }
    }
  });
});

// Get user's personal results
const getUserResults = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const results = await QuizResult.getUserResults(userId, {
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit)
  });

  const total = await QuizResult.countDocuments({ user: userId });

  res.status(200).json({
    success: true,
    data: {
      results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Get detailed result by ID
const getResultById = asyncHandler(async (req, res) => {
  const { resultId } = req.params;
  const userId = req.user._id;

  const result = await QuizResult.findOne({
    _id: resultId,
    user: userId
  })
  .populate('quiz', 'title settings')
  .populate('courseId', 'title description')
  .populate('user', 'name email avatar');

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Result not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      result
    }
  });
});

// Get course statistics
const getCourseStats = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const stats = await QuizResult.aggregate([
    {
      $match: { courseId: courseId, status: 'completed' }
    },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$score' },
        highestScore: { $max: '$score' },
        lowestScore: { $min: '$score' },
        averageTimeSpent: { $avg: '$timeSpent' },
        passRate: {
          $avg: { $cond: ['$passed', 1, 0] }
        },
        totalEarnings: { $sum: '$earnings' },
        uniqueParticipants: { $addToSet: '$user' }
      }
    },
    {
      $addFields: {
        uniqueParticipantCount: { $size: '$uniqueParticipants' }
      }
    },
    {
      $project: {
        uniqueParticipants: 0
      }
    }
  ]);

  const result = stats[0] || {
    totalAttempts: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    averageTimeSpent: 0,
    passRate: 0,
    totalEarnings: 0,
    uniqueParticipantCount: 0
  };

  res.status(200).json({
    success: true,
    data: {
      courseId,
      stats: {
        ...result,
        averageScore: Math.round(result.averageScore),
        passRate: Math.round(result.passRate * 100)
      }
    }
  });
});

// Share result
const shareResult = asyncHandler(async (req, res) => {
  const { resultId } = req.params;
  const { platform } = req.body;
  const userId = req.user._id;

  const result = await QuizResult.findOne({
    _id: resultId,
    user: userId
  }).populate('courseId', 'title');

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Result not found'
    });
  }

  // Generate shareable content
  const shareContent = {
    title: `I scored ${result.score}% in ${result.courseTitle}!`,
    description: `Test your knowledge and compete with others on Bashedu Auction Platform.`,
    url: `${process.env.FRONTEND_URL}/result?quiz=${resultId}`,
    score: result.score,
    courseTitle: result.courseTitle,
    rank: result.rank
  };

  // Platform-specific sharing URLs
  let shareUrl = '';
  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.title)}&url=${encodeURIComponent(shareContent.url)}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent.url)}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareContent.url)}`;
      break;
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareContent.title} ${shareContent.url}`)}`;
      break;
    default:
      return res.status(400).json({
        success: false,
        message: 'Unsupported platform'
      });
  }

  res.status(200).json({
    success: true,
    data: {
      shareUrl,
      content: shareContent
    }
  });
});

// Get user performance analytics
const getUserAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { timeframe = '30d' } = req.query;

  // Calculate date range
  const now = new Date();
  let startDate;
  
  switch (timeframe) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const analytics = await QuizResult.aggregate([
    {
      $match: {
        user: userId,
        status: 'completed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        totalQuizzes: { $sum: 1 },
        averageScore: { $avg: '$score' },
        totalEarnings: { $sum: '$earnings' },
        totalTimeSpent: { $avg: '$timeSpent' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    },
    {
      $project: {
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day'
          }
        },
        totalQuizzes: 1,
        averageScore: { $round: ['$averageScore', 1] },
        totalEarnings: 1,
        averageTimeSpent: { $round: ['$averageTimeSpent', 0] }
      }
    }
  ]);

  // Get overall stats for the period
  const overallStats = await QuizResult.aggregate([
    {
      $match: {
        user: userId,
        status: 'completed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalQuizzes: { $sum: 1 },
        averageScore: { $avg: '$score' },
        highestScore: { $max: '$score' },
        totalEarnings: { $sum: '$earnings' },
        totalTimeSpent: { $sum: '$timeSpent' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      timeframe,
      analytics,
      overallStats: overallStats[0] || {
        totalQuizzes: 0,
        averageScore: 0,
        highestScore: 0,
        totalEarnings: 0,
        totalTimeSpent: 0
      }
    }
  });
});

// Get achievements and badges
const getUserAchievements = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const User = require('../models/User');
  const user = await User.findById(userId).select('achievements stats');

  // Define achievement types and their criteria
  const achievementDefinitions = {
    first_quiz: {
      name: 'First Steps',
      description: 'Completed your first quiz',
      icon: '🎯',
      category: 'milestone'
    },
    perfect_score: {
      name: 'Perfect Score',
      description: 'Achieved 100% in a quiz',
      icon: '💯',
      category: 'performance'
    },
    streak_7: {
      name: 'Week Warrior',
      description: '7-day login streak',
      icon: '🔥',
      category: 'engagement'
    },
    streak_30: {
      name: 'Monthly Champion',
      description: '30-day login streak',
      icon: '🏆',
      category: 'engagement'
    },
    top_10: {
      name: 'Elite Performer',
      description: 'Ranked in top 10',
      icon: '⭐',
      category: 'leaderboard'
    },
    quick_learner: {
      name: 'Quick Learner',
      description: 'Completed quiz in under 5 minutes',
      icon: '⚡',
      category: 'speed'
    }
  };

  // Check for new achievements based on user stats
  const newAchievements = [];
  const userAchievementTypes = user.achievements.map(a => a.type);

  // Check various achievement conditions
  if (user.stats.totalQuizzesTaken >= 1 && !userAchievementTypes.includes('first_quiz')) {
    newAchievements.push({
      type: 'first_quiz',
      ...achievementDefinitions.first_quiz,
      earnedAt: new Date()
    });
  }

  if (user.stats.highestScore === 100 && !userAchievementTypes.includes('perfect_score')) {
    newAchievements.push({
      type: 'perfect_score',
      ...achievementDefinitions.perfect_score,
      earnedAt: new Date()
    });
  }

  // Add new achievements to user profile
  if (newAchievements.length > 0) {
    user.achievements.push(...newAchievements);
    await user.save();
  }

  // Format achievements with definitions
  const formattedAchievements = user.achievements.map(achievement => ({
    ...achievement,
    ...(achievementDefinitions[achievement.type] || {
      name: achievement.type,
      description: 'Achievement unlocked',
      icon: '🏅',
      category: 'general'
    })
  }));

  res.status(200).json({
    success: true,
    data: {
      achievements: formattedAchievements,
      totalAchievements: formattedAchievements.length,
      categories: ['milestone', 'performance', 'engagement', 'leaderboard', 'speed']
    }
  });
});

module.exports = {
  getLeaderboard,
  getUserResults,
  getResultById,
  getCourseStats,
  shareResult,
  getUserAnalytics,
  getUserAchievements
};
