const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const { asyncHandler } = require('../middleware/errorHandler');

// Get quiz questions for a course
const getQuizQuestions = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  // Find published quiz for this course
  const quiz = await Quiz.findOne({
    courseId,
    isPublished: true,
    isActive: true
  }).populate('instructor', 'name email');

  if (!quiz) {
    // Return fallback questions from JSON file
    const fs = require('fs');
    const path = require('path');
    
    try {
      const questionsPath = path.join(__dirname, '../data/questions.json');
      const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
      
      // Filter questions by course or return general questions
      const courseQuestions = questionsData.questions.filter(
        q => q.courseId === parseInt(courseId) || q.courseId === 'general'
      );

      return res.status(200).json({
        success: true,
        data: {
          quiz: {
            id: `fallback_${courseId}`,
            title: `Quiz for Course ${courseId}`,
            description: 'Generated quiz questions',
            courseId,
            courseTitle: `Course ${courseId}`,
            settings: {
              timeLimit: 600,
              allowReview: true,
              showCorrectAnswers: true
            }
          },
          questions: courseQuestions.slice(0, 10) // Limit to 10 questions
        }
      });
    } catch (error) {
      console.error('Error loading fallback questions:', error);
      
      // Generate generic questions if JSON file doesn't exist
      const genericQuestions = [
        {
          id: 1,
          text: 'What is the primary purpose of this course?',
          type: 'multiple-choice',
          options: [
            'To learn fundamental concepts',
            'To master advanced techniques',
            'To prepare for certification',
            'To explore theoretical aspects'
          ],
          correctAnswer: 0,
          explanation: 'This course focuses on building fundamental knowledge.',
          difficulty: 2,
          points: 1,
          category: 'General'
        },
        {
          id: 2,
          text: 'Which learning approach is most effective?',
          type: 'multiple-choice',
          options: [
            'Passive reading only',
            'Active practice and application',
            'Memorization without understanding',
            'Skipping exercises'
          ],
          correctAnswer: 1,
          explanation: 'Active practice and application lead to better retention and understanding.',
          difficulty: 1,
          points: 1,
          category: 'Learning Strategy'
        }
      ];

      return res.status(200).json({
        success: true,
        data: {
          quiz: {
            id: `generated_${courseId}`,
            title: `Quiz for Course ${courseId}`,
            description: 'Generated quiz questions',
            courseId,
            courseTitle: `Course ${courseId}`,
            settings: {
              timeLimit: 600,
              allowReview: true,
              showCorrectAnswers: true
            }
          },
          questions: genericQuestions
        }
      });
    }
  }

  // Get quiz for user (without correct answers)
  const quizForUser = quiz.getQuizForUser();

  res.status(200).json({
    success: true,
    data: {
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        courseId: quiz.courseId,
        courseTitle: quiz.courseTitle,
        instructor: quiz.instructor,
        settings: quiz.settings,
        questionCount: quiz.questionCount,
        totalPoints: quiz.totalPoints
      },
      questions: quizForUser.questions
    }
  });
});

// Submit quiz answers
const submitQuiz = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { answers, startTime, endTime, timeSpent } = req.body;
  const userId = req.user._id;

  // Find the quiz
  const quiz = await Quiz.findOne({
    courseId,
    isPublished: true,
    isActive: true
  });

  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found'
    });
  }

  // Calculate results
  let correctAnswers = 0;
  const processedAnswers = [];

  for (const answer of answers) {
    const question = quiz.questions.id(answer.questionId);
    if (!question) continue;

    const isCorrect = answer.userAnswer === question.correctAnswer;
    if (isCorrect) correctAnswers++;

    processedAnswers.push({
      questionId: question._id,
      questionText: question.text,
      userAnswer: answer.userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      options: question.options,
      explanation: question.explanation,
      points: question.points,
      timeSpent: answer.timeSpent || 0
    });
  }

  const score = Math.round((correctAnswers / quiz.questions.length) * 100);
  const passed = score >= quiz.settings.passingScore;

  // Create quiz result
  const quizResult = new QuizResult({
    user: userId,
    quiz: quiz._id,
    courseId: quiz.courseId,
    courseTitle: quiz.courseTitle,
    quizTitle: quiz.title,
    answers: processedAnswers,
    score,
    correctAnswers,
    totalQuestions: quiz.questions.length,
    timeSpent,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    passed,
    metadata: {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    }
  });

  await quizResult.save();

  // Update user stats
  const User = require('../models/User');
  const user = await User.findById(userId);
  
  user.stats.totalQuizzesTaken += 1;
  user.stats.totalScore += score;
  user.stats.correctAnswers += correctAnswers;
  user.stats.totalAnswers += quiz.questions.length;
  user.stats.totalEarnings += quizResult.earnings;
  
  if (score > user.stats.highestScore) {
    user.stats.highestScore = score;
  }

  await user.save();

  // Update quiz stats
  quiz.stats.totalAttempts += 1;
  await quiz.save();

  // Add achievements if applicable
  if (score === 100) {
    await user.addAchievement('perfect_score', { quizId: quiz._id, score });
  }
  if (user.stats.totalQuizzesTaken === 1) {
    await user.addAchievement('first_quiz', { quizId: quiz._id });
  }

  res.status(201).json({
    success: true,
    message: 'Quiz submitted successfully',
    data: {
      result: {
        id: quizResult._id,
        score,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        timeSpent,
        passed,
        earnings: quizResult.earnings,
        rank: quizResult.rank,
        totalParticipants: quizResult.totalParticipants
      }
    }
  });
});

// Get quiz history for user
const getQuizHistory = asyncHandler(async (req, res) => {
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

// Get specific quiz result
const getQuizResult = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user._id;

  const result = await QuizResult.findOne({
    _id: quizId,
    user: userId
  }).populate('quiz', 'title settings')
    .populate('courseId', 'title');

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Quiz result not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      result
    }
  });
});

// Get quiz statistics
const getQuizStats = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const quiz = await Quiz.findOne({ courseId });
  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found'
    });
  }

  const stats = await QuizResult.getQuizStats(quiz._id);

  res.status(200).json({
    success: true,
    data: {
      quiz: {
        id: quiz._id,
        title: quiz.title,
        questionCount: quiz.questionCount,
        totalPoints: quiz.totalPoints
      },
      stats: stats[0] || {
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        averageTimeSpent: 0,
        passRate: 0,
        totalEarnings: 0
      }
    }
  });
});

// Get leaderboard for quiz
const getQuizLeaderboard = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { limit = 10 } = req.query;

  const quiz = await Quiz.findOne({ courseId });
  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found'
    });
  }

  const leaderboard = await QuizResult.getQuizLeaderboard(quiz._id, parseInt(limit));

  res.status(200).json({
    success: true,
    data: {
      quiz: {
        id: quiz._id,
        title: quiz.title
      },
      leaderboard
    }
  });
});

module.exports = {
  getQuizQuestions,
  submitQuiz,
  getQuizHistory,
  getQuizResult,
  getQuizStats,
  getQuizLeaderboard
};
