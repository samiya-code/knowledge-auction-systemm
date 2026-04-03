const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Quiz ID is required']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  courseTitle: {
    type: String,
    required: [true, 'Course title is required']
  },
  quizTitle: {
    type: String,
    required: [true, 'Quiz title is required']
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    userAnswer: {
      type: Number,
      required: true
    },
    correctAnswer: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    options: [String],
    explanation: String,
    points: {
      type: Number,
      default: 1
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0
    }
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned', 'timed-out'],
    default: 'completed'
  },
  attempt: {
    type: Number,
    default: 1
  },
  passed: {
    type: Boolean,
    required: true
  },
  earnings: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: null
  },
  totalParticipants: {
    type: Number,
    default: 0
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    }
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceType: String,
    browser: String,
    location: {
      country: String,
      city: String
    },
    cheatingFlags: [{
      type: {
        type: String,
        enum: ['tab-switch', 'copy-paste', 'right-click', 'time-anomaly', 'multiple-attempts']
      },
      timestamp: Date,
      details: mongoose.Schema.Types.Mixed
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
quizResultSchema.virtual('accuracy').get(function() {
  if (this.totalQuestions === 0) return 0;
  return Math.round((this.correctAnswers / this.totalQuestions) * 100);
});

quizResultSchema.virtual('duration').get(function() {
  return this.endTime - this.startTime;
});

quizResultSchema.virtual('averageTimePerQuestion').get(function() {
  if (this.totalQuestions === 0) return 0;
  return Math.round(this.timeSpent / this.totalQuestions);
});

// Indexes for better performance
quizResultSchema.index({ user: 1, createdAt: -1 });
quizResultSchema.index({ quiz: 1, score: -1 });
quizResultSchema.index({ courseId: 1, score: -1 });
quizResultSchema.index({ score: -1 });
quizResultSchema.index({ status: 1 });
quizResultSchema.index({ createdAt: -1 });

// Compound indexes
quizResultSchema.index({ user: 1, quiz: 1 });
quizResultSchema.index({ user: 1, courseId: 1 });

// Pre-save middleware to calculate derived fields
quizResultSchema.pre('save', function(next) {
  // Calculate score if not provided
  if (this.score === undefined && this.correctAnswers !== undefined && this.totalQuestions !== undefined) {
    this.score = Math.round((this.correctAnswers / this.totalQuestions) * 100);
  }
  
  // Calculate passed status based on quiz passing score
  if (this.passed === undefined && this.score !== undefined) {
    // Default passing score is 70, but this could be fetched from the quiz
    this.passed = this.score >= 70;
  }
  
  // Calculate earnings based on score and performance
  if (this.earnings === 0 && this.score !== undefined) {
    // Base earnings calculation (can be customized)
    const baseEarning = 10;
    const scoreBonus = (this.score / 100) * 20;
    const timeBonus = this.timeSpent < 300 ? 5 : 0; // Bonus for completing quickly
    this.earnings = Math.round(baseEarning + scoreBonus + timeBonus);
  }
  
  next();
});

// Static method to get user's quiz results
quizResultSchema.statics.getUserResults = function(userId, options = {}) {
  const { limit = 10, skip = 0, sort = { createdAt: -1 } } = options;
  
  return this.find({ user: userId })
    .populate('quiz', 'title settings.timeLimit')
    .populate('courseId', 'title')
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

// Static method to get leaderboard for quiz
quizResultSchema.statics.getQuizLeaderboard = function(quizId, limit = 10) {
  return this.find({ 
    quiz: quizId, 
    status: 'completed' 
  })
  .populate('user', 'name email avatar')
  .sort({ score: -1, timeSpent: 1 }) // Higher score first, then less time
  .limit(limit);
};

// Static method to get overall leaderboard
quizResultSchema.statics.getOverallLeaderboard = function(limit = 10, timeFilter = 'all') => {
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
  
  return this.aggregate([
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
        user: '$userInfo',
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
    },
    {
      $limit: limit
    }
  ]);
};

// Static method to get quiz statistics
quizResultSchema.statics.getQuizStats = function(quizId) {
  return this.aggregate([
    {
      $match: { quiz: quizId, status: 'completed' }
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
        totalEarnings: { $sum: '$earnings' }
      }
    }
  ]);
};

// Instance method to add cheating flag
quizResultSchema.methods.addCheatingFlag = function(type, details = {}) {
  this.metadata.cheatingFlags.push({
    type,
    timestamp: new Date(),
    details
  });
  return this.save();
};

module.exports = mongoose.model('QuizResult', quizResultSchema);
