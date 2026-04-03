import React, { useState } from 'react';
import { generateCourseQuestions } from '../services/aiService';

const CourseAIQuestionGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    title: 'Introduction to Computer Science',
    courseType: 'computerscience',
    difficulty: 'intermediate',
    topic: 'Programming Fundamentals',
    questionCount: 5
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateQuestions = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQuestions([]);

    try {
      const response = await generateCourseQuestions(formData);
      if (response.success) {
        setQuestions(response.data.questions);
      } else {
        alert('Failed to generate questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Error generating questions');
    } finally {
      setLoading(false);
    }
  };

  const addKnowledge = async () => {
    const knowledgeData = {
      courseType: 'computerscience',
      content: {
        topics: ['React Hooks', 'State Management', 'Component Lifecycle'],
        facts: ['React uses virtual DOM', 'Hooks start with "use"', 'State is immutable'],
        examples: ['useState for state', 'useEffect for side effects', 'useContext for global state']
      }
    };

    try {
      const response = await fetch('/api/ai/add-course-knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(knowledgeData)
      });

      const result = await response.json();
      if (result.success) {
        alert('Knowledge added successfully!');
      } else {
        alert('Failed to add knowledge');
      }
    } catch (error) {
      console.error('Error adding knowledge:', error);
      alert('Error adding knowledge');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Course-Aware AI Question Generator
      </h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• AI uses course-specific knowledge base for accurate questions</li>
          <li>• Questions are tailored to Computer Science curriculum</li>
          <li>• Difficulty levels adapt to your selection</li>
          <li>• Knowledge can be expanded by adding course content</li>
        </ul>
      </div>

      <form onSubmit={generateQuestions} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course ID
            </label>
            <input
              type="text"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="CS101"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Course title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Type
            </label>
            <select
              name="courseType"
              value={formData.courseType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="computerscience">Computer Science</option>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Specific topic"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions
            </label>
            <input
              type="number"
              name="questionCount"
              value={formData.questionCount}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Questions'}
          </button>

          <button
            type="button"
            onClick={addKnowledge}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add React Knowledge
          </button>
        </div>
      </form>

      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Generated Questions ({questions.length})
          </h3>
          {questions.map((question, index) => (
            <div key={question.id || index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">
                  Question {index + 1}: {question.text}
                </h4>
                <div className="flex space-x-2 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {question.difficulty}/5
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                    {question.points} pts
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                    {question.category}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-2 rounded ${
                      optIndex === question.correctAnswer
                        ? 'bg-green-100 border border-green-300'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className="font-medium">
                      {String.fromCharCode(65 + optIndex)}.
                    </span>{' '}
                    {option}
                    {optIndex === question.correctAnswer && (
                      <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50 rounded text-sm text-gray-700">
                <strong>Explanation:</strong> {question.explanation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseAIQuestionGenerator;
