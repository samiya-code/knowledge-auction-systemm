// Test AI functionality
const openaiService = require('./services/openaiService');
const courseAwareAIService = require('./services/courseAwareAIService');

// Test functions
async function testAIServices() {
  console.log('🧪 Testing AI Services...\n');

  // Test 1: Basic OpenAI Questions
  console.log('1. Testing basic OpenAI question generation...');
  try {
    const questions = await openaiService.generateQuizQuestions({
      courseTitle: 'Introduction to React',
      courseId: 'react-101',
      difficulty: 'intermediate',
      topic: 'React Hooks',
      questionCount: 3
    });
    console.log('✅ Basic AI Questions Generated:', questions.length);
    console.log('Sample Question:', questions[0]?.text || 'No questions generated');
  } catch (error) {
    console.log('❌ Basic AI Questions Failed:', error.message);
  }

  // Test 2: Course-Aware Questions
  console.log('\n2. Testing course-aware AI question generation...');
  try {
    const courseQuestions = await courseAwareAIService.generateCourseQuestions({
      courseTitle: 'Advanced JavaScript',
      courseId: 'js-advanced',
      courseType: 'computerscience',
      difficulty: 'advanced',
      topic: 'Async Programming',
      questionCount: 2
    });
    console.log('✅ Course-Aware Questions Generated:', courseQuestions.length);
    console.log('Sample Course Question:', courseQuestions[0]?.text || 'No questions generated');
  } catch (error) {
    console.log('❌ Course-Aware Questions Failed:', error.message);
  }

  // Test 3: AI Feedback
  console.log('\n3. Testing AI feedback generation...');
  try {
    const mockResult = {
      score: 85,
      correctAnswers: 7,
      totalQuestions: 8,
      answers: [
        {
          questionText: 'What is React?',
          userAnswer: 0,
          correctAnswer: 0,
          isCorrect: true,
          options: ['A JavaScript library', 'A database', 'A programming language', 'An operating system']
        }
      ]
    };
    
    const feedback = await openaiService.generateQuizFeedback(mockResult);
    console.log('✅ AI Feedback Generated');
    console.log('Sample Feedback:', feedback.overallFeedback || 'No feedback generated');
  } catch (error) {
    console.log('❌ AI Feedback Failed:', error.message);
  }

  // Test 4: Course-Specific Feedback
  console.log('\n4. Testing course-specific feedback generation...');
  try {
    const courseFeedback = await courseAwareAIService.generateCourseFeedback({
      quizResult: mockResult,
      courseType: 'computerscience',
      courseTitle: 'Advanced JavaScript'
    });
    console.log('✅ Course-Specific Feedback Generated');
    console.log('Sample Course Feedback:', courseFeedback.overallFeedback || 'No feedback generated');
  } catch (error) {
    console.log('❌ Course-Specific Feedback Failed:', error.message);
  }

  // Test 5: AI Connection
  console.log('\n5. Testing OpenAI connection...');
  try {
    const isConnected = await openaiService.testConnection();
    console.log(isConnected ? '✅ OpenAI Connection Successful' : '❌ OpenAI Connection Failed');
  } catch (error) {
    console.log('❌ OpenAI Connection Test Failed:', error.message);
  }

  // Test 6: Fallback Questions
  console.log('\n6. Testing fallback question generation...');
  try {
    const fallbackQuestions = await openaiService.getFallbackQuestions('Test Course', 3);
    console.log('✅ Fallback Questions Generated:', fallbackQuestions.length);
    console.log('Sample Fallback Question:', fallbackQuestions[0]?.text || 'No fallback questions');
  } catch (error) {
    console.log('❌ Fallback Questions Failed:', error.message);
  }

  console.log('\n🎯 AI Services Test Complete!');
  console.log('\n📋 Summary:');
  console.log('- Update your .env file with a valid OpenAI API key');
  console.log('- Run: node test-ai.js to verify functionality');
  console.log('- Check server logs for detailed error information');
}

// Run tests
testAIServices();
