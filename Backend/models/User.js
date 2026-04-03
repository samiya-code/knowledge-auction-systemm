const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginStreak: {
    type: Number,
    default: 0
  },
  stats: {
    totalQuizzesTaken: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    highestScore: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    totalAnswers: {
      type: Number,
      default: 0
    }
  },
  achievements: [{
    type: {
      type: String,
      required: true
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for accuracy percentage
userSchema.virtual('stats.accuracy').get(function() {
  if (this.stats.totalAnswers === 0) return 0;
  return Math.round((this.stats.correctAnswers / this.stats.totalAnswers) * 100);
});

// Virtual for rank (placeholder - would be calculated from leaderboard)
userSchema.virtual('stats.rank', {
  ref: 'User',
  localField: 'stats.totalScore',
  foreignField: 'stats.totalScore',
  count: true
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ 'stats.totalScore': -1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update average score
userSchema.pre('save', function(next) {
  if (this.isModified('stats.totalQuizzesTaken') || this.isModified('stats.totalScore')) {
    if (this.stats.totalQuizzesTaken > 0) {
      this.stats.averageScore = Math.round(this.stats.totalScore / this.stats.totalQuizzesTaken);
    }
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to update login streak
userSchema.methods.updateLoginStreak = function() {
  const now = new Date();
  const lastLogin = this.lastLogin;
  
  if (!lastLogin) {
    this.loginStreak = 1;
  } else {
    const daysSinceLastLogin = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastLogin === 1) {
      this.loginStreak += 1;
    } else if (daysSinceLastLogin > 1) {
      this.loginStreak = 1;
    }
    // If daysSinceLastLogin === 0, streak remains unchanged
  }
  
  this.lastLogin = now;
  return this.save();
};

// Instance method to add achievement
userSchema.methods.addAchievement = function(type, metadata = {}) {
  // Check if achievement already exists
  const existingAchievement = this.achievements.find(a => a.type === type);
  if (existingAchievement) {
    return false; // Achievement already earned
  }
  
  this.achievements.push({
    type,
    metadata,
    earnedAt: new Date()
  });
  
  return this.save();
};

// Static method to get leaderboard
userSchema.statics.getLeaderboard = function(limit = 10, skip = 0) {
  return this.find({ isActive: true })
    .select('name email avatar stats achievements')
    .sort({ 'stats.totalScore': -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get user by email for authentication
userSchema.statics.findByEmailForAuth = function(email) {
  return this.findOne({ email }).select('+password');
};

module.exports = mongoose.model('User', userSchema);
