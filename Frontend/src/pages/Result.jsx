import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { calculateTime } from '../utils/calculateTime';
import { getDiscountByRank, calculateRefund, calculateFinalPrice } from '../data/mockLeaderboard';
import { DISCOUNT_TIERS, REFUND_RATES } from '../utils/constants';

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, addNotification } = useApp();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  // Get result and auction data from location state
  const locationData = location.state || {};
  const { result: resultData, auctionData } = locationData;

  useEffect(() => {
    // Simulate loading and AI feedback generation
    const loadResult = async () => {
      setLoading(true);
      
      // Use provided result or create mock result
      const mockResult = resultData || {
        id: 'mock-result-123',
        score: 85,
        correctAnswers: 7,
        totalQuestions: 8,
        timeSpent: 95,
        rank: 3,
        totalParticipants: 15,
        quizTitle: 'Complete Web Development Bootcamp Quiz',
        courseTitle: 'Complete Web Development Bootcamp',
        answers: [
          {
            questionId: 1,
            questionText: 'What is React?',
            userAnswer: 0,
            correctAnswer: 0,
            isCorrect: true,
            options: ['A JavaScript library', 'A database', 'A programming language', 'An operating system']
          },
          {
            questionId: 2,
            questionText: 'What is a React component?',
            userAnswer: 1,
            correctAnswer: 0,
            isCorrect: false,
            options: ['Reusable UI piece', 'Database table', 'CSS file', 'HTML file']
          }
        ]
      };

      setResult(mockResult);

      // Simulate AI feedback generation
      setTimeout(() => {
        setAiFeedback({
          strengths: [
            'Strong understanding of React fundamentals',
            'Good grasp of component concepts',
            'Solid knowledge of JavaScript basics'
          ],
          weaknesses: [
            'Need to improve understanding of React hooks',
            'Practice more with state management',
            'Review component lifecycle methods'
          ],
          recommendations: [
            'Focus on advanced React patterns',
            'Practice building real projects',
            'Study React Router and state management libraries'
          ],
          nextSteps: [
            'Take the advanced React course',
            'Build a portfolio project',
            'Join React community forums'
          ]
        });
      }, 2000);

      setLoading(false);
    };

    loadResult();
  }, [resultData]);

  const handleRetakeQuiz = () => {
    navigate(`/quiz/${result?.courseId}`);
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  const handleShareResult = (platform) => {
    const shareText = `I just scored ${result?.score}% on ${result?.courseTitle}! 🎉`;
    const shareUrl = window.location.href;

    let shareLink = '';
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareLink, '_blank', 'width=600,height=400');
    setShareModalOpen(false);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent! Outstanding performance! 🌟';
    if (score >= 70) return 'Great job! Keep up the good work! 👏';
    if (score >= 50) return 'Good effort! Room for improvement! 💪';
    return 'Keep practicing! You\'ll do better next time! 📚';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Calculating your results...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
        <p className="text-gray-600 mb-6">Unable to load quiz results.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Result Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}>
            {result.score}%
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getScoreMessage(result.score)}
          </h2>
          <p className="text-gray-600">
            You completed the quiz for {result.courseTitle}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              {result.correctAnswers}/{result.totalQuestions}
            </div>
            <div className="text-sm text-gray-600">Correct Answers</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600">Time Spent</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              #{result.rank}
            </div>
            <div className="text-sm text-gray-600">Rank</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(result.earnings)}
            </div>
            <div className="text-sm text-gray-600">Earnings</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetakeQuiz}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Retake Quiz
          </button>
          <button
            onClick={handleViewLeaderboard}
            className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Leaderboard
          </button>
          <button
            onClick={() => setShareModalOpen(true)}
            className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Share Result
          </button>
        </div>
      </div>

      {/* Achievements */}
      {result.achievements && result.achievements.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Review */}
      {result.questions && result.questions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Question Review</h3>
          <div className="space-y-4">
            {result.questions.map((question, index) => (
              <div
                key={question.id}
                className={`p-4 rounded-lg border-2 ${
                  question.isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Question {index + 1}: {question.text}
                    </h4>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Your answer:</span>
                        <span className={question.isCorrect ? 'text-green-700' : 'text-red-700'}>
                          {question.userAnswer !== undefined ? `Option ${String.fromCharCode(65 + question.userAnswer)}` : 'Not answered'}
                        </span>
                      </div>
                      {!question.isCorrect && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Correct answer:</span>
                          <span className="text-green-700">
                            Option {String.fromCharCode(65 + question.correctAnswer)}
                          </span>
                        </div>
                      )}
                    </div>
                    {question.explanation && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    {question.isCorrect ? (
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Result</h3>
            <p className="text-gray-600 mb-6">
              Share your quiz achievement with friends!
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleShareResult('twitter')}
                className="p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
                <span className="text-xs mt-1 block">Twitter</span>
              </button>
              <button
                onClick={() => handleShareResult('facebook')}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-xs mt-1 block">Facebook</span>
              </button>
              <button
                onClick={() => handleShareResult('linkedin')}
                className="p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-xs mt-1 block">LinkedIn</span>
              </button>
            </div>
            <button
              onClick={() => setShareModalOpen(false)}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
