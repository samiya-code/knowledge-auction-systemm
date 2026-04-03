const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Generate quiz questions using OpenAI
const generateQuizQuestions = async (params) => {
  const { courseTitle, courseId, difficulty = 'intermediate', topic, questionCount = 5 } = params;

  const prompt = `Generate ${questionCount} multiple-choice quiz questions for a course titled "${courseTitle}".
  
Course Details:
- Topic: ${topic}
- Difficulty Level: ${difficulty}
- Question Count: ${questionCount}

Requirements:
1. Each question must have 4 options (A, B, C, D)
2. Clearly indicate the correct answer (0-3)
3. Provide a brief explanation for the correct answer
4. Assign a difficulty level (1-5, where 1 is easiest and 5 is hardest)
5. Assign point values (1-3 points based on difficulty)
6. Include a category for each question

Format the response as a JSON array with the following structure:
[
  {
    "id": 1,
    "text": "Question text here",
    "type": "multiple-choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation for why this answer is correct",
    "difficulty": 2,
    "points": 1,
    "category": "Category name"
  }
]

Make sure the questions are educational, relevant to the course topic, and vary in difficulty.`;

  try {
    const response = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational content creator specializing in creating engaging and informative quiz questions. Always respond with valid JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = response.data.choices[0].message.content;
    
    // Parse JSON response
    let questions;
    try {
      questions = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    // Validate and format questions
    return questions.map((q, index) => ({
      id: q.id || index + 1,
      text: q.text || `Question ${index + 1}`,
      type: q.type || 'multiple-choice',
      options: Array.isArray(q.options) && q.options.length === 4 ? q.options : [
        'Option A', 'Option B', 'Option C', 'Option D'
      ],
      correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < 4 ? q.correctAnswer : 0,
      explanation: q.explanation || 'This is the correct answer based on the course material.',
      difficulty: typeof q.difficulty === 'number' && q.difficulty >= 1 && q.difficulty <= 5 ? q.difficulty : 3,
      points: typeof q.points === 'number' && q.points >= 1 && q.points <= 3 ? q.points : 1,
      category: q.category || 'General'
    }));

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
};

// Generate explanations for questions
const generateExplanations = async (questions) => {
  const prompt = `Generate detailed explanations for the following quiz questions. For each question, explain why the correct answer is right and why the other options are wrong.

Questions:
${JSON.stringify(questions, null, 2)}

Format the response as a JSON array:
[
  {
    "questionId": 1,
    "explanation": "Detailed explanation here"
  }
]`;

  try {
    const response = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator who provides clear, detailed explanations for quiz questions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const content = response.data.choices[0].message.content;
    
    let explanations;
    try {
      explanations = JSON.parse(content);
    } catch (parseError) {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        explanations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    return explanations;

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate explanations: ${error.message}`);
  }
};

// Generate personalized recommendations
const generateRecommendations = async (params) => {
  const { userStats, recentResults, goals } = params;

  const prompt = `Based on the following user data, generate personalized learning recommendations:

User Stats:
${JSON.stringify(userStats, null, 2)}

Recent Results:
${JSON.stringify(recentResults, null, 2)}

User Goals:
${JSON.stringify(goals, null, 2)}

Generate 3-5 recommendations with different types (course, practice, quiz, study method). Format as JSON:
[
  {
    "type": "course",
    "title": "Recommendation title",
    "description": "Detailed description",
    "priority": "high|medium|low",
    "estimatedTime": "time estimate"
  }
]`;

  try {
    const response = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI learning assistant that provides personalized educational recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.6,
    });

    const content = response.data.choices[0].message.content;
    
    let recommendations;
    try {
      recommendations = JSON.parse(content);
    } catch (parseError) {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    return recommendations;

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate recommendations: ${error.message}`);
  }
};

// Generate study plan
const generateStudyPlan = async (params) => {
  const { courseId, objectives, timeframe, currentLevel } = params;

  const prompt = `Create a comprehensive study plan for a course with the following details:

Course ID: ${courseId}
Learning Objectives: ${objectives}
Timeframe: ${timeframe}
Current Level: ${currentLevel}

Create a structured study plan with weekly breakdowns. Include topics, activities, and time estimates. Format as JSON:
{
  "title": "Study Plan Title",
  "duration": "total duration",
  "objectives": "main objectives",
  "weeks": [
    {
      "week": 1,
      "title": "Week Title",
      "topics": ["topic1", "topic2"],
      "activities": ["activity1", "activity2"],
      "estimatedHours": 10
    }
  ]
}`;

  try {
    const response = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational planner who creates structured, effective study plans.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.5,
    });

    const content = response.data.choices[0].message.content;
    
    let studyPlan;
    try {
      studyPlan = JSON.parse(content);
    } catch (parseError) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        studyPlan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    return studyPlan;

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate study plan: ${error.message}`);
  }
};

// Generate AI feedback for quiz results
const generateQuizFeedback = async (quizResult) => {
  const { score, correctAnswers, totalQuestions, courseTitle, answers } = quizResult;

  const prompt = `Generate personalized feedback for a student who completed a quiz for "${courseTitle}".

Quiz Results:
- Score: ${score}%
- Correct Answers: ${correctAnswers}/${totalQuestions}
- Performance: ${score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}

Questions and Answers:
${answers.map((answer, index) => `
Q${index + 1}: ${answer.questionText}
Student Answer: ${answer.options[answer.userAnswer]}
Correct Answer: ${answer.options[answer.correctAnswer]}
${answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
`).join('\n')}

Generate feedback in the following JSON format:
{
  "overallFeedback": "Overall assessment of performance",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "nextSteps": ["next step 1", "next step 2", "next step 3"],
  "encouragement": "Motivational message"
}

Make the feedback encouraging, constructive, and specific to the performance level.`;

  try {
    const response = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational AI tutor providing personalized feedback to students. Be encouraging and constructive.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const content = response.data.choices[0].message.content;
    
    let feedback;
    try {
      feedback = JSON.parse(content);
    } catch (parseError) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedback = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    return feedback;

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate feedback: ${error.message}`);
  }
};

// Generate personalized learning recommendations
const generateLearningRecommendations = async (params) => {
  const { userStats, recentResults, goals, courseTitle } = params;

  const prompt = `Generate personalized learning recommendations for a student.

Student Profile:
${userStats ? `
- Total Quizzes Taken: ${userStats.totalQuizzesTaken || 0}
- Average Score: ${userStats.averageScore || 0}%
- Highest Score: ${userStats.highestScore || 0}%
- Total Earnings: $${(userStats.totalEarnings || 0).toFixed(2)}
` : 'No previous data available'}

Recent Performance:
${recentResults ? recentResults.map(result => `
- ${result.courseTitle}: ${result.score}% (Rank #${result.rank})
`).join('\n') : 'No recent results'}

Learning Goals: ${goals || 'General improvement'}

Current Course: ${courseTitle}

Generate recommendations in this JSON format:
{
  "courses": [
    {
      "title": "Course title",
      "reason": "Why this course is recommended",
      "priority": "high|medium|low"
    }
  ],
  "studyTips": ["tip 1", "tip 2", "tip 3"],
  "nextGoals": ["goal 1", "goal 2", "goal 3"],
  "motivation": "Motivational message"
}

Focus on courses that would help improve their quiz performance and overall knowledge.`;

  try {
    const response = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI learning advisor providing personalized course recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const content = response.data.choices[0].message.content;
    
    let recommendations;
    try {
      recommendations = JSON.parse(content);
    } catch (parseError) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    return recommendations;

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate recommendations: ${error.message}`);
  }
};

// Test OpenAI connection
const testConnection = async () => {
  try {
    const response = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'Hello, can you respond with "Connection successful"?'
        }
      ],
      max_tokens: 10,
    });

    return response.data.choices[0].message.content.includes('Connection successful');
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    return false;
  }
};

// Fallback questions when OpenAI fails
const getFallbackQuestions = (courseTitle, questionCount = 5) => {
  return [
    {
      id: 1,
      text: `What is the primary focus of ${courseTitle}?`,
      type: 'multiple-choice',
      options: [
        'Building fundamental understanding',
        'Advanced theoretical concepts',
        'Practical application skills',
        'Historical context'
      ],
      correctAnswer: 0,
      explanation: 'This course focuses on building fundamental understanding of the subject matter.',
      difficulty: 2,
      points: 1,
      category: 'Introduction'
    },
    {
      id: 2,
      text: 'Which learning approach is most effective for mastering this subject?',
      type: 'multiple-choice',
      options: [
        'Passive reading only',
        'Active practice and application',
        'Memorization without understanding',
        'Skipping practice exercises'
      ],
      correctAnswer: 1,
      explanation: 'Active practice and application lead to better retention and deeper understanding.',
      difficulty: 1,
      points: 1,
      category: 'Learning Strategy'
    },
    {
      id: 3,
      text: 'How should you approach complex problems in this field?',
      type: 'multiple-choice',
      options: [
        'Jump directly to the solution',
        'Break down into smaller components',
        'Avoid difficult problems',
        'Only work on easy examples'
      ],
      correctAnswer: 1,
      explanation: 'Breaking down complex problems into smaller, manageable components is the most effective approach.',
      difficulty: 3,
      points: 2,
      category: 'Problem Solving'
    },
    {
      id: 4,
      text: 'What is the importance of continuous learning in this subject?',
      type: 'multiple-choice',
      options: [
        'Not important once basics are learned',
        'Crucial for staying current and growing',
        'Only necessary for experts',
        'Optional for casual learners'
      ],
      correctAnswer: 1,
      explanation: 'Continuous learning is crucial for staying current with new developments and growing your expertise.',
      difficulty: 2,
      points: 1,
      category: 'Professional Development'
    },
    {
      id: 5,
      text: 'How can you best apply what you learn in this course?',
      type: 'multiple-choice',
      options: [
        'Keep knowledge to yourself',
        'Share with others and practice regularly',
        'Forget after the course ends',
        'Only use for exams'
      ],
      correctAnswer: 1,
      explanation: 'Sharing knowledge with others and regular practice helps reinforce learning and benefits everyone.',
      difficulty: 1,
      points: 1,
      category: 'Application'
    }
  ].slice(0, questionCount);
};

module.exports = {
  generateQuizQuestions,
  generateQuizFeedback,
  generateLearningRecommendations,
  testConnection,
  getFallbackQuestions
};
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
