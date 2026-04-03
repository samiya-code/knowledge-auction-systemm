const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs').promises;
const path = require('path');

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

class CourseAwareAIService {
  constructor() {
    this.knowledgeBasePath = path.join(__dirname, '../data/knowledgeBase');
  }

  // Load course-specific knowledge base
  async loadCourseKnowledge(courseType) {
    try {
      const filePath = path.join(this.knowledgeBasePath, `${courseType.toLowerCase()}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log(`No knowledge base found for ${courseType}, using generic knowledge`);
      return null;
    }
  }

  // Generate course-specific quiz questions
  async generateCourseQuestions(params) {
    const { courseTitle, courseId, courseType = 'computerscience', difficulty = 'intermediate', topic, questionCount = 5 } = params;
    
    // Load course-specific knowledge
    const courseKnowledge = await this.loadCourseKnowledge(courseType);
    
    // Build context-aware prompt
    const prompt = this.buildCourseSpecificPrompt(courseTitle, courseType, difficulty, topic, questionCount, courseKnowledge);
    
    try {
      const response = await openai.createChatCompletion({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert ${courseType} educator creating comprehensive quiz questions. 
            Use the provided knowledge base to ensure accuracy and relevance. Always respond with valid JSON format.`
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
        category: q.category || this.getCategoryFromTopic(topic, courseKnowledge),
        courseType: courseType
      }));

    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  // Build course-specific prompt
  buildCourseSpecificPrompt(courseTitle, courseType, difficulty, topic, questionCount, knowledge) {
    let knowledgeContext = '';
    
    if (knowledge) {
      knowledgeContext = `
COURSE-SPECIFIC KNOWLEDGE BASE:
Topics: ${knowledge.topics?.join(', ') || 'General topics'}
Key Facts: ${knowledge.facts?.slice(0, 5).join(', ') || 'General facts'}
Relevant Examples: ${knowledge.examples?.slice(0, 3).join(', ') || 'General examples'}

Difficulty-specific topics for ${difficulty}:
${knowledge.difficultyLevels?.[difficulty]?.join(', ') || 'General difficulty topics'}

`;
    }

    const prompt = `${knowledgeContext}
Generate ${questionCount} multiple-choice quiz questions for a ${courseType} course titled "${courseTitle}".

Course Details:
- Course Type: ${courseType}
- Topic: ${topic || courseTitle}
- Difficulty Level: ${difficulty}
- Question Count: ${questionCount}

Requirements:
1. Each question must have 4 options (A, B, C, D)
2. Clearly indicate the correct answer (0-3)
3. Provide a brief explanation for the correct answer
4. Assign a difficulty level (1-5, where 1 is easiest and 5 is hardest)
5. Assign point values (1-3 points based on difficulty)
6. Include a category for each question
7. Questions must be relevant to ${courseType} and accurate according to the knowledge base
8. Include a mix of theoretical and practical questions where applicable

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

Make sure the questions are educational, relevant to ${courseType}, and vary in difficulty within the ${difficulty} range.`;

    return prompt;
  }

  // Get category from topic using knowledge base
  getCategoryFromTopic(topic, knowledge) {
    if (!knowledge || !topic) return 'General';
    
    // Try to match topic with known categories
    const topicLower = topic.toLowerCase();
    
    for (const knowledgeTopic of knowledge.topics || []) {
      if (knowledgeTopic.toLowerCase().includes(topicLower) || 
          topicLower.includes(knowledgeTopic.toLowerCase())) {
        return knowledgeTopic;
      }
    }
    
    return 'General';
  }

  // Generate course-specific feedback
  async generateCourseFeedback(quizResult, courseType) {
    const { score, correctAnswers, totalQuestions, courseTitle, answers } = quizResult;
    
    const courseKnowledge = await this.loadCourseKnowledge(courseType);
    
    const prompt = `Generate personalized feedback for a student who completed a ${courseType} quiz for "${courseTitle}".

${courseKnowledge ? `
Course Context: ${courseType}
Key Topics Covered: ${courseKnowledge.topics?.slice(0, 5).join(', ') || 'Various topics'}
` : ''}

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
  "encouragement": "Motivational message",
  "courseSpecificAdvice": "Advice specific to ${courseType}"
}

Make the feedback encouraging, constructive, and specific to the ${courseType} course and performance level.`;

    try {
      const response = await openai.createChatCompletion({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert ${courseType} educator providing personalized feedback to students. Be encouraging and constructive.`
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
  }

  // Add new knowledge to course base
  async addCourseKnowledge(courseType, content) {
    try {
      const filePath = path.join(this.knowledgeBasePath, `${courseType.toLowerCase()}.json`);
      await fs.mkdir(this.knowledgeBasePath, { recursive: true });
      
      let existingData = await this.loadCourseKnowledge(courseType) || { 
        topics: [], 
        facts: [], 
        examples: [],
        difficultyLevels: {},
        questionTemplates: {}
      };
      
      // Merge new content
      if (content.topics) existingData.topics.push(...content.topics);
      if (content.facts) existingData.facts.push(...content.facts);
      if (content.examples) existingData.examples.push(...content.examples);
      if (content.difficultyLevels) {
        Object.assign(existingData.difficultyLevels, content.difficultyLevels);
      }
      if (content.questionTemplates) {
        Object.assign(existingData.questionTemplates, content.questionTemplates);
      }
      
      await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
      return true;
    } catch (error) {
      console.error('Error adding course knowledge:', error);
      return false;
    }
  }
}

module.exports = new CourseAwareAIService();
