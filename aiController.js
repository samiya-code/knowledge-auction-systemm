const openaiService = require('../services/openaiService');
const { asyncHandler } = require('../middleware/errorHandler');

// Generate quiz questions using AI
const generateQuestions = asyncHandler(async (req, res) => {
  const { courseId, title, difficulty, topic, questionCount = 5 } = req.body;

  try {
    // Generate questions using OpenAI
    const questions = await openaiService.generateQuizQuestions({
      courseTitle: title,
      courseId,
      difficulty: difficulty || 'intermediate',
      topic: topic || title,
      questionCount
    });

    res.status(200).json({
      success: true,
      message: 'Questions generated successfully',
      data: {
        questions,
        metadata: {
          generatedAt: new Date().toISOString(),
          source: 'openai',
          courseId,
          questionCount: questions.length
        }
      }
    });

  } catch (error) {
    console.error('AI generation error:', error);

    // Fallback to predefined questions if AI fails
    const fallbackQuestions = getFallbackQuestions(courseId, title, questionCount);

    res.status(200).json({
      success: true,
      message: 'Questions generated from fallback data',
      data: {
        questions: fallbackQuestions,
        metadata: {
          generatedAt: new Date().toISOString(),
          source: 'fallback',
          courseId,
          questionCount: fallbackQuestions.length
        }
      }
    });
  }
});

// Generate quiz explanations
const generateExplanations = asyncHandler(async (req, res) => {
  const { questions } = req.body;

  try {
    const explanations = await openaiService.generateExplanations(questions);

    res.status(200).json({
      success: true,
      message: 'Explanations generated successfully',
      data: {
        explanations,
        metadata: {
          generatedAt: new Date().toISOString(),
          source: 'openai'
        }
      }
    });

  } catch (error) {
    console.error('AI explanation error:', error);

    // Fallback explanations
    const fallbackExplanations = questions.map((q, index) => ({
      questionId: q.id || index,
      explanation: `This question tests your understanding of ${q.topic || 'the course material'}. The correct answer is based on the fundamental concepts covered in the curriculum.`
    }));

    res.status(200).json({
      success: true,
      message: 'Explanations generated from fallback data',
      data: {
        explanations: fallbackExplanations,
        metadata: {
          generatedAt: new Date().toISOString(),
          source: 'fallback'
        }
      }
    });
  }
});

// Generate personalized learning recommendations
const generateRecommendations = asyncHandler(async (req, res) => {
  const { userStats, recentResults, goals } = req.body;

  try {
    const recommendations = await openaiService.generateRecommendations({
      userStats,
      recentResults,
      goals
    });

    res.status(200).json({
      success: true,
      message: 'Recommendations generated successfully',
      data: {
        recommendations,
        metadata: {
          generatedAt: new Date().toISOString(),
          source: 'openai'
        }
      }
    });

  } catch (error) {
    console.error('AI recommendation error:', error);

    // Fallback recommendations
    const fallbackRecommendations = [
      {
        type: 'course',
        title: 'Continue with Advanced Topics',
        description: 'Based on your performance, you\'re ready for more challenging material.',
        priority: 'high'
      },
      {
        type: 'practice',
        title: 'Review Fundamentals',
        description: 'Focus on strengthening your foundation knowledge.',
        priority: 'medium'
      },
      {
        type: 'quiz',
        title: 'Try Timed Quizzes',
        description: 'Improve your speed and accuracy with time-constrained exercises.',
        priority: 'low'
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Recommendations generated from fallback data',
      data: {
        recommendations: fallbackRecommendations,
        metadata: {
          generatedAt: new Date().toISOString(),
          source: 'fallback'
        }
      }
    });
  }
});

// Generate study plan
const generateStudyPlan = asyncHandler(async (req, res) => {
  const { courseId, objectives, timeframe, currentLevel } = req.body;

  try {
    const studyPlan = await openaiService.generateStudyPlan({
      courseId,
      objectives,
      timeframe,
      currentLevel
    });

    res.status(200).json({
      success: true,
      message: 'Study plan generated successfully',
      data: {
        studyPlan,
        metadata: {
          generatedAt: new Date().toISOString(),
          source: 'openai'
        }
      }
    });

  } catch (error) {
    console.error('AI study plan error:', error);

    // Fallback study plan
    const fallbackStudyPlan = {
      title: `Study Plan for Course ${courseId}`,
      duration: timeframe || '4 weeks',
      objectives: objectives || 'Master the course content',
      weeks: [
        {
          week: 1,
          title: 'Foundation Building',
          topics: ['Introduction', 'Basic Concepts', 'Core Principles'],
          activities: ['Reading materials', 'Practice exercises', 'Quiz 1'],
          estimatedHours: 10
        },
        {
          week: 2,
          title: 'Skill Development',
          topics: ['Intermediate Topics', 'Practical Applications', 'Case Studies'],
          activities: ['Hands-on practice', 'Group discussions', 'Quiz 2'],
          estimatedHours: 12
        },
        {
          week: 3,
          title: 'Advanced Concepts',
          topics: ['Complex Topics', 'Advanced Techniques', 'Best Practices'],
          activities: ['Advanced exercises', 'Project work', 'Quiz 3'],
          estimatedHours: 15
        },
        {
          week: 4,
          title: 'Review & Assessment',
          topics: ['Comprehensive Review', 'Exam Preparation', 'Final Assessment'],
          activities: ['Review sessions', 'Mock exams', 'Final quiz'],
          estimatedHours: 8
        }
      ]
    };

    res.status(200).json({
      success: true,
      message: 'Study plan generated from fallback data',
      data: {
        studyPlan: fallbackStudyPlan,
        metadata: {
          generatedAt: new Date().toISOString(),
          source: 'fallback'
        }
      }
    });
  }
});

// Get fallback questions
function getFallbackQuestions(courseId, courseTitle, count) {
  const fallbackQuestions = [
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
  ];

  return fallbackQuestions.slice(0, count || 5);
}

module.exports = {
  generateQuestions,
  generateExplanations,
  generateRecommendations,
  generateStudyPlan
};
