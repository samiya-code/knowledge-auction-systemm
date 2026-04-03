// OpenAI Configuration
const openaiConfig = {
  // API Configuration
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  
  // Request Configuration
  maxTokens: 2000,
  temperature: 0.7,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  
  // Rate Limiting
  maxRequestsPerMinute: 60,
  maxTokensPerMinute: 90000,
  
  // Retry Configuration
  maxRetries: 3,
  retryDelay: 1000, // in milliseconds
  
  // Fallback Configuration
  enableFallback: true,
  fallbackTimeout: 10000, // in milliseconds
  
  // Prompt Templates
  prompts: {
    quizGeneration: `Generate {questionCount} multiple-choice quiz questions for a course titled "{courseTitle}".
    
Course Details:
- Topic: {topic}
- Difficulty Level: {difficulty}
- Question Count: {questionCount}

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
]`,
    
    explanationGeneration: `Generate detailed explanations for the following quiz questions. For each question, explain why the correct answer is right and why the other options are wrong.

Questions:
{questions}

Format the response as a JSON array:
[
  {
    "questionId": 1,
    "explanation": "Detailed explanation here"
  }
]`,
    
    recommendationGeneration: `Based on the following user data, generate personalized learning recommendations:

User Stats:
{userStats}

Recent Results:
{recentResults}

User Goals:
{goals}

Generate 3-5 recommendations with different types (course, practice, quiz, study method). Format as JSON:
[
  {
    "type": "course",
    "title": "Recommendation title",
    "description": "Detailed description",
    "priority": "high|medium|low",
    "estimatedTime": "time estimate"
  }
]`,
    
    studyPlanGeneration: `Create a comprehensive study plan for a course with the following details:

Course ID: {courseId}
Learning Objectives: {objectives}
Timeframe: {timeframe}
Current Level: {currentLevel}

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
}`
  },
  
  // Validation Rules
  validation: {
    minQuestionCount: 1,
    maxQuestionCount: 20,
    minDifficulty: 1,
    maxDifficulty: 5,
    minPoints: 1,
    maxPoints: 5,
    maxOptionsPerQuestion: 6,
    minOptionsPerQuestion: 2
  },
  
  // Error Messages
  errorMessages: {
    missingApiKey: 'OpenAI API key is not configured',
    invalidApiKey: 'OpenAI API key is invalid',
    rateLimitExceeded: 'Rate limit exceeded. Please try again later.',
    insufficientQuota: 'Insufficient quota. Please check your OpenAI account.',
    modelNotFound: 'Model not found. Please check your model configuration.',
    contentFilter: 'Content was filtered due to policy violations.',
    serviceUnavailable: 'OpenAI service is currently unavailable.',
    timeout: 'Request timed out. Please try again.',
    invalidResponse: 'Invalid response from OpenAI API.',
    networkError: 'Network error occurred while connecting to OpenAI.'
  }
};

// Validate configuration
const validateConfig = () => {
  const errors = [];
  
  if (!openaiConfig.apiKey) {
    errors.push('OpenAI API key is required');
  }
  
  if (openaiConfig.maxTokens < 1 || openaiConfig.maxTokens > 4000) {
    errors.push('Max tokens must be between 1 and 4000');
  }
  
  if (openaiConfig.temperature < 0 || openaiConfig.temperature > 2) {
    errors.push('Temperature must be between 0 and 2');
  }
  
  if (errors.length > 0) {
    throw new Error(`OpenAI configuration errors: ${errors.join(', ')}`);
  }
  
  return true;
};

// Get configuration with validation
const getConfig = () => {
  try {
    validateConfig();
    return openaiConfig;
  } catch (error) {
    console.error('OpenAI configuration error:', error.message);
    
    // Return fallback configuration if validation fails
    return {
      ...openaiConfig,
      enableFallback: true,
      model: 'gpt-3.5-turbo'
    };
  }
};

// Update configuration
const updateConfig = (newConfig) => {
  Object.assign(openaiConfig, newConfig);
  return validateConfig();
};

// Check if OpenAI is properly configured
const isConfigured = () => {
  return !!openaiConfig.apiKey && openaiConfig.apiKey.startsWith('sk-');
};

// Get model information
const getModelInfo = () => {
  const models = {
    'gpt-3.5-turbo': {
      maxTokens: 4096,
      costPer1KTokens: 0.002,
      description: 'Fast and efficient model for most use cases'
    },
    'gpt-4': {
      maxTokens: 8192,
      costPer1KTokens: 0.03,
      description: 'More capable model for complex tasks'
    },
    'gpt-4-turbo': {
      maxTokens: 128000,
      costPer1KTokens: 0.01,
      description: 'Latest model with extended context window'
    }
  };
  
  return models[openaiConfig.model] || models['gpt-3.5-turbo'];
};

module.exports = {
  getConfig,
  updateConfig,
  validateConfig,
  isConfigured,
  getModelInfo,
  ...openaiConfig
};
