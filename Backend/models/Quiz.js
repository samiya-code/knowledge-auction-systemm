const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
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
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor ID is required']
  },
  questions: [{
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'fill-blank'],
      default: 'multiple-choice'
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      min: 0
    },
    explanation: {
      type: String,
      trim: true
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    category: {
      type: String,
      trim: true
    },
    points: {
      type: Number,
      default: 1,
      min: 1
    },
    imageUrl: {
      type: String
    },
    timeLimit: {
      type: Number, // in seconds
      default: 60
    }
  }],
  settings: {
    timeLimit: {
      type: Number, // overall quiz time in seconds
      default: 600 // 10 minutes
    },
    allowReview: {
      type: Boolean,
      default: true
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true
    },
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    shuffleOptions: {
      type: Boolean,
      default: false
    },
    maxAttempts: {
      type: Number,
      default: 3
    },
    passingScore: {
      type: Number,
      default: 70
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    estimatedDuration: Number, // in minutes
    language: {
      type: String,
      default: 'en'
    },
    version: {
      type: String,
      default: '1.0'
    }
  },
  stats: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    highestScore: {
      type: Number,
      default: 0
    },
    lowestScore: {
      type: Number,
      default: 0
    },
    averageTimeSpent: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
quizSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

quizSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, question) => total + question.points, 0);
});

// Indexes for better performance
quizSchema.index({ courseId: 1 });
quizSchema.index({ instructor: 1 });
quizSchema.index({ isActive: 1, isPublished: 1 });
quizSchema.index({ 'stats.averageScore': -1 });
quizSchema.index({ createdAt: -1 });

// Pre-save middleware to validate questions
quizSchema.pre('save', function(next) {
  // Ensure questions array is not empty
  if (this.questions.length === 0) {
    return next(new Error('Quiz must have at least one question'));
  }

  // Validate each question
  for (let i = 0; i < this.questions.length; i++) {
    const question = this.questions[i];
    
    // For multiple choice questions, ensure at least 2 options
    if (question.type === 'multiple-choice' && question.options.length < 2) {
      return next(new Error(`Question ${i + 1} must have at least 2 options`));
    }

    // Ensure correct answer is within options range
    if (question.correctAnswer >= question.options.length) {
      return next(new Error(`Question ${i + 1} correct answer index is out of range`));
    }
  }

  next();
});

// Instance method to shuffle questions
quizSchema.methods.shuffleQuestions = function() {
  if (!this.settings.shuffleQuestions) return this;
  
  const shuffled = [...this.questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  this.questions = shuffled;
  return this;
};

// Instance method to shuffle options for each question
quizSchema.methods.shuffleOptions = function() {
  if (!this.settings.shuffleOptions) return this;
  
  this.questions = this.questions.map(question => {
    if (question.type !== 'multiple-choice') return question;
    
    const options = [...question.options];
    const correctAnswerText = options[question.correctAnswer];
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    // Find new correct answer index
    const newCorrectAnswer = options.indexOf(correctAnswerText);
    
    return {
      ...question.toObject(),
      options,
      correctAnswer: newCorrectAnswer
    };
  });
  
  return this;
};

// Instance method to get quiz for user (with shuffled content if needed)
quizSchema.methods.getQuizForUser = function() {
  let quiz = this.toObject();
  
  // Remove correct answers for user view
  quiz.questions = quiz.questions.map(question => {
    const { correctAnswer, ...questionWithoutAnswer } = question;
    return questionWithoutAnswer;
  });
  
  return quiz;
};

// Static method to get published quizzes
quizSchema.statics.getPublishedQuizzes = function(filter = {}, options = {}) {
  const { limit = 10, skip = 0, sort = { createdAt: -1 } } = options;
  
  return this.find({
    ...filter,
    isActive: true,
    isPublished: true
  })
  .populate('instructor', 'name email avatar')
  .populate('courseId', 'title description')
  .sort(sort)
  .limit(limit)
  .skip(skip);
};

// Static method to get quizzes by instructor
quizSchema.statics.getQuizzesByInstructor = function(instructorId, options = {}) {
  const { limit = 10, skip = 0, sort = { createdAt: -1 } } = options;
  
  return this.find({ instructor: instructorId })
    .populate('courseId', 'title description')
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

module.exports = mongoose.model('Quiz', quizSchema);
