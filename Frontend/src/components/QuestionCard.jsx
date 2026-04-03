import React, { useState } from 'react';

const QuestionCard = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswerSelect, 
  selectedAnswer,
  showResult = false,
  correctAnswer = null
}) => {
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState(selectedAnswer || null);

  const handleAnswerChange = (answerIndex) => {
    setLocalSelectedAnswer(answerIndex);
    if (onAnswerSelect) {
      onAnswerSelect(question.id, answerIndex);
    }
  };

  const getAnswerStyle = (index) => {
    const baseStyle = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ";
    
    if (showResult) {
      if (index === correctAnswer) {
        return baseStyle + "bg-green-50 border-green-500 text-green-800";
      } else if (index === localSelectedAnswer && index !== correctAnswer) {
        return baseStyle + "bg-red-50 border-red-500 text-red-800";
      } else {
        return baseStyle + "bg-gray-50 border-gray-200 text-gray-600";
      }
    } else {
      if (localSelectedAnswer === index) {
        return baseStyle + "bg-blue-50 border-blue-500 text-blue-800";
      } else {
        return baseStyle + "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50";
      }
    }
  };

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D, etc.
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          {question.points && (
            <span className="text-sm font-medium text-blue-600">
              {question.points} points
            </span>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Text */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {question.text}
        </h2>
        
        {question.category && (
          <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            {question.category}
          </span>
        )}
      </div>

      {/* Question Image (if any) */}
      {question.imageUrl && (
        <div className="mb-6">
          <img
            src={question.imageUrl}
            alt="Question illustration"
            className="w-full max-w-md mx-auto rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`block cursor-pointer ${getAnswerStyle(index)}`}
          >
            <div className="flex items-start">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={index}
                checked={localSelectedAnswer === index}
                onChange={() => handleAnswerChange(index)}
                disabled={showResult}
                className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-start">
                  <span className="font-medium mr-2">
                    {getOptionLabel(index)}.
                  </span>
                  <span className="flex-1">{option}</span>
                </div>
                
                {/* Show result indicators */}
                {showResult && (
                  <div className="mt-2">
                    {index === correctAnswer && (
                      <span className="text-sm font-medium text-green-600">
                        ✓ Correct Answer
                      </span>
                    )}
                    {index === localSelectedAnswer && index !== correctAnswer && (
                      <span className="text-sm font-medium text-red-600">
                        ✗ Your Answer
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Question Explanation (shown in results) */}
      {showResult && question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
          <p className="text-blue-800 text-sm">{question.explanation}</p>
        </div>
      )}

      {/* Difficulty Indicator */}
      {question.difficulty && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">Difficulty:</span>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-2 h-2 rounded-full ${
                  level <= question.difficulty
                    ? 'bg-orange-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
