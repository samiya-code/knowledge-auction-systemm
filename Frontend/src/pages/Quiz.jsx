import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import { useTimer } from '../hooks/useTimer';
import { quizService } from '../services/quizService';
import { AUCTION_CONFIG, QUIZ_STATUS } from '../utils/constants';
import Loader from '../components/Loader';
import ProtectedRoute from '../components/ProtectedRoute';

const Quiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useApp();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [quizStatus, setQuizStatus] = useState(QUIZ_STATUS.WAITING);
  const [timeLeft, setTimeLeft] = useState(AUCTION_CONFIG.TOTAL_QUIZ_TIME);

  // Get auction data from location state
  const auctionData = location.state || {};
  const { deposit, auctionEndTime } = auctionData;

  const currentQuestion = questions[currentQuestionIndex];
  
  // Timer hook
  const { 
    timeLeft: timerTimeLeft, 
    isExpired: isTimeExpired, 
    formattedTime,
    reset: resetTimer
  } = useTimer(AUCTION_CONFIG.TOTAL_QUIZ_TIME, quizStatus === QUIZ_STATUS.ACTIVE, () => {
    if (quizStatus === QUIZ_STATUS.ACTIVE) {
      handleSubmitQuiz(true); // Auto-submit when time expires
    }
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Check if auction is still valid
  useEffect(() => {
    if (auctionEndTime && new Date() > new Date(auctionEndTime)) {
      setError('Auction time has expired. Please join a new auction.');
      setQuizStatus(QUIZ_STATUS.ABANDONED);
      return;
    }
  }, [auctionEndTime]);

  // Load quiz questions
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const response = await quizService.getQuizQuestions(courseId);
        setQuestions(response.questions);
        setQuiz(response.quiz);
        setStartTime(new Date().toISOString());
        setQuizStatus(QUIZ_STATUS.WAITING);
      } catch (error) {
        setError('Failed to load quiz questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadQuiz();
    }
  }, [courseId, isAuthenticated]);

  // Start quiz
  const startQuiz = () => {
    setQuizStatus(QUIZ_STATUS.ACTIVE);
    resetTimer();
  };

  // Handle answer selection
  const handleAnswerSelect = useCallback((questionId, answerIndex) => {
    if (quizStatus !== QUIZ_STATUS.ACTIVE) return;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  }, [quizStatus]);

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Handle quiz submission
  const handleSubmitQuiz = async (timeExpired = false) => {
    if (submitting) return;

    if (!timeExpired && quizStatus !== QUIZ_STATUS.ACTIVE) {
      return;
    }

    setSubmitting(true);
    setQuizStatus(QUIZ_STATUS.COMPLETED);

    try {
      const endTime = new Date().toISOString();
      const timeSpent = Math.floor((Date.now() - new Date(startTime)) / 1000);

      const quizData = {
        courseId,
        userId: user.id,
        answers,
        startTime,
        endTime,
        timeSpent,
        deposit: deposit,
        auctionEndTime: auctionEndTime
      };

      const result = await quizService.submitQuiz(quizData);
      
      // Navigate to results page
      navigate('/result', { 
        state: { 
          result,
          auctionData
        } 
      });
      
    } catch (error) {
      setError('Failed to submit quiz. Please try again.');
      setQuizStatus(QUIZ_STATUS.ABANDONED);
    } finally {
      setSubmitting(false);
    }
  };

  // Check if all questions are answered
  const allQuestionsAnswered = questions.length > 0 && 
    questions.every(q => answers.hasOwnProperty(q.id));

  // Calculate progress
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" message="Loading quiz questions..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Waiting state - show start screen
  if (quizStatus === QUIZ_STATUS.WAITING) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Compete?
            </h1>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Quiz Details:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <div>• {questions.length} questions</div>
                <div>• {AUCTION_CONFIG.TOTAL_QUIZ_TIME} seconds total</div>
                <div>• {AUCTION_CONFIG.QUESTION_TIME_LIMIT} seconds per question</div>
                <div>• Deposit paid: ${deposit ? deposit.toFixed(2) : 'N/A'}</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important:</h3>
              <p className="text-sm text-yellow-800">
                Once you start the quiz, the timer will begin immediately. 
                Make sure you're ready before proceeding!
              </p>
            </div>

            <button
              onClick={startQuiz}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Start Quiz
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quiz Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                🎯 {quiz?.title || 'Knowledge Quiz'}
              </h1>
              <p className="text-sm text-gray-600">
                Course: {quiz?.courseTitle || `Course ${courseId}`}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Time Remaining</div>
              <div className={`text-2xl font-bold ${
                isTimeExpired ? 'text-red-600' : 'text-blue-600'
              }`}>
                {formattedTime}
              </div>
              {isTimeExpired && (
                <div className="text-xs text-red-600 mt-1">Time's up!</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Object.keys(answers).length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {questions.map((question, index) => {
              const isAnswered = answers.hasOwnProperty(question.id);
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  disabled={quizStatus !== QUIZ_STATUS.ACTIVE}
                  className={`w-10 h-10 rounded-md font-medium transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isAnswered
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${quizStatus !== QUIZ_STATUS.ACTIVE ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="container mx-auto px-4 py-8">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={answers[currentQuestion.id]}
            disabled={quizStatus !== QUIZ_STATUS.ACTIVE}
          />
        )}
      </div>

      {/* Navigation Controls */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || quizStatus !== QUIZ_STATUS.ACTIVE}
              className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="text-sm text-gray-600">
              Status: <span className={`font-medium ${
                quizStatus === QUIZ_STATUS.ACTIVE ? 'text-green-600' :
                quizStatus === QUIZ_STATUS.COMPLETED ? 'text-blue-600' :
                'text-gray-600'
              }`}>
                {quizStatus === QUIZ_STATUS.ACTIVE ? 'In Progress' :
                 quizStatus === QUIZ_STATUS.COMPLETED ? 'Completed' :
                 'Waiting'}
              </span>
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={() => handleSubmitQuiz(false)}
                disabled={!allQuestionsAnswered || submitting || quizStatus !== QUIZ_STATUS.ACTIVE}
                className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={quizStatus !== QUIZ_STATUS.ACTIVE}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            )}
          </div>

          {!allQuestionsAnswered && quizStatus === QUIZ_STATUS.ACTIVE && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ Please answer all questions before submitting. You can navigate between questions using the numbered buttons above.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-blue-50 border border-blue-200">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(answers).length}
              </div>
              <div className="text-sm text-blue-800">Answered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {questions.length - Object.keys(answers).length}
              </div>
              <div className="text-sm text-orange-800">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(progress)}%
              </div>
              <div className="text-sm text-green-800">Complete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
