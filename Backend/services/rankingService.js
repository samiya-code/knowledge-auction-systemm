const QuizResult = require('../models/QuizResult');
const User = require('../models/User');

// Calculate user rankings
const calculateUserRankings = async (timeFilter = 'all') => {
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

  const rankings = await QuizResult.aggregate([
    {
      $match: {
        status: 'completed',
        ...dateFilter
      }
    },
    {
      $group: {
        _id: '$user',
        totalScore: { $sum: '$score' },
        totalQuizzes: { $sum: 1 },
        averageScore: { $avg: '$score' },
        totalEarnings: { $sum: '$earnings' },
        correctAnswers: { $sum: '$correctAnswers' },
        totalQuestions: { $sum: '$totalQuestions' },
        bestScore: { $max: '$score' },
        totalTimeSpent: { $sum: '$timeSpent' },
        lastActivity: { $max: '$createdAt' }
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
        userId: '$_id',
        user: {
          id: '$userInfo._id',
          name: '$userInfo.name',
          email: '$userInfo.email',
          avatar: '$userInfo.avatar',
          loginStreak: '$userInfo.loginStreak'
        },
        totalScore: 1,
        totalQuizzes: 1,
        averageScore: { $round: ['$averageScore', 1] },
        totalEarnings: 1,
        accuracy: {
          $round: [
            { $multiply: [{ $divide: ['$correctAnswers', '$totalQuestions'] }, 100] },
            1
          ]
        },
        bestScore: 1,
        lastActivity: 1
      }
    },
    {
      $sort: { totalScore: -1, averageScore: -1 }
    }
  ]);

  // Add rank numbers
  return rankings.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
};

// Get user's current rank
const getUserRank = async (userId, timeFilter = 'all') => {
  const rankings = await calculateUserRankings(timeFilter);
  const userRanking = rankings.find(r => r.userId.toString() === userId.toString());
  
  return userRanking || null;
};

// Update rankings for all users
const updateAllRankings = async () => {
  try {
    const rankings = await calculateUserRankings('all');
    
    // Update user documents with rank information
    for (const ranking of rankings) {
      await User.findByIdAndUpdate(ranking.userId, {
        $set: {
          'stats.currentRank': ranking.rank,
          'stats.totalParticipants': rankings.length
        }
      });
    }
    
    console.log(`Updated rankings for ${rankings.length} users`);
    return rankings;
  } catch (error) {
    console.error('Error updating rankings:', error);
    throw error;
  }
};

// Get top performers by category
const getTopPerformersByCategory = async (categoryId, limit = 10) => {
  const results = await QuizResult.aggregate([
    {
      $match: {
        status: 'completed'
      }
    },
    {
      $lookup: {
        from: 'quizzes',
        localField: 'quiz',
        foreignField: '_id',
        as: 'quizInfo'
      }
    },
    {
      $unwind: '$quizInfo'
    },
    {
      $match: {
        'quizInfo.category': categoryId
      }
    },
    {
      $group: {
        _id: '$user',
        totalScore: { $sum: '$score' },
        averageScore: { $avg: '$score' },
        quizCount: { $sum: 1 }
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
        totalScore: 1,
        averageScore: { $round: ['$averageScore', 1] },
        quizCount: 1
      }
    },
    {
      $sort: { totalScore: -1, averageScore: -1 }
    },
    {
      $limit: limit
    }
  ]);

  return results.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
};

// Calculate leaderboard movement
const calculateLeaderboardMovement = async (userId, timeFilter = 'week') => {
  const currentRankings = await calculateUserRankings(timeFilter);
  const previousRankings = await calculateUserRankings(timeFilter === 'week' ? 'month' : 'all');
  
  const currentRank = currentRankings.find(r => r.userId.toString() === userId.toString());
  const previousRank = previousRankings.find(r => r.userId.toString() === userId.toString());
  
  if (!currentRank) return null;
  
  const movement = previousRank 
    ? previousRank.rank - currentRank.rank
    : 0;
  
  return {
    currentRank: currentRank.rank,
    previousRank: previousRank?.rank || null,
    movement,
    movementType: movement > 0 ? 'up' : movement < 0 ? 'down' : 'same'
  };
};

// Get ranking statistics
const getRankingStatistics = async () => {
  const stats = await QuizResult.aggregate([
    {
      $match: {
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalParticipants: { $addToSet: '$user' },
        totalQuizzes: { $sum: 1 },
        averageScore: { $avg: '$score' },
        totalEarnings: { $sum: '$earnings' },
        perfectScores: {
          $sum: { $cond: [{ $eq: ['$score', 100] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        totalParticipants: { $size: '$totalParticipants' },
        totalQuizzes: 1,
        averageScore: { $round: ['$averageScore', 1] },
        totalEarnings: 1,
        perfectScores: 1,
        perfectScorePercentage: {
          $round: [
            { $multiply: [{ $divide: ['$perfectScores', '$totalQuizzes'] }, 100] },
            2
          ]
        }
      }
    }
  ]);

  return stats[0] || {
    totalParticipants: 0,
    totalQuizzes: 0,
    averageScore: 0,
    totalEarnings: 0,
    perfectScores: 0,
    perfectScorePercentage: 0
  };
};

// Award badges based on rankings
const awardRankingBadges = async () => {
  const rankings = await calculateUserRankings('all');
  const User = require('../models/User');
  
  // Award badges to top performers
  for (let i = 0; i < Math.min(rankings.length, 10); i++) {
    const ranking = rankings[i];
    let badgeType = null;
    
    if (i === 0) badgeType = 'top_1';
    else if (i === 1) badgeType = 'top_3';
    else if (i === 2) badgeType = 'top_3';
    else if (i < 10) badgeType = 'top_10';
    
    if (badgeType) {
      const user = await User.findById(ranking.userId);
      await user.addAchievement(badgeType, {
        rank: i + 1,
        totalParticipants: rankings.length,
        score: ranking.totalScore
      });
    }
  }
};

module.exports = {
  calculateUserRankings,
  getUserRank,
  updateAllRankings,
  getTopPerformersByCategory,
  calculateLeaderboardMovement,
  getRankingStatistics,
  awardRankingBadges
};
