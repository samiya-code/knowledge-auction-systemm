import React, { useState, useEffect, useCallback } from 'react';
import  resultService  from '../utils/calculateTime';

const Timer = ({ 
  initialTime, 
  onTimeUp, 
  onTick, 
  isActive = true, 
  size = 'medium',
  showWarning = true,
  warningThreshold = 30 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isWarning, setIsWarning] = useState(false);

  // Timer sizes
  const sizeClasses = {
    small: 'text-lg font-medium',
    medium: 'text-2xl font-bold',
    large: 'text-4xl font-bold'
  };

  // Timer colors based on time remaining
  const getTimerColor = () => {
    if (!isActive) return 'text-gray-400';
    if (timeRemaining <= 10) return 'text-red-600 animate-pulse';
    if (timeRemaining <= warningThreshold) return 'text-orange-500';
    return 'text-blue-600';
  };

  // Update timer
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        
        // Trigger onTick callback if provided
        if (onTick) {
          onTick(newTime);
        }

        // Check for warning threshold
        if (showWarning && newTime <= warningThreshold && newTime > 0) {
          setIsWarning(true);
        }

        // Time's up
        if (newTime <= 0) {
          if (onTimeUp) {
            onTimeUp();
          }
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onTimeUp, onTick, showWarning, warningThreshold]);

  // Reset timer function
  const resetTimer = useCallback(() => {
    setTimeRemaining(initialTime);
    setIsWarning(false);
  }, [initialTime]);

  // Add reset method to component instance
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.resetTimer = resetTimer;
    }
  }, [resetTimer]);

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Timer Display */}
      <div className={`${sizeClasses[size]} ${getTimerColor()} tabular-nums`}>
        {formatTime(timeRemaining)}
      </div>

      {/* Warning Message */}
      {isWarning && showWarning && (
        <div className="text-sm text-orange-600 font-medium animate-pulse">
          {timeRemaining <= 10 ? 'Time almost up!' : 'Hurry up!'}
        </div>
      )}

      {/* Progress Ring (for medium and large sizes) */}
      {(size === 'medium' || size === 'large') && initialTime > 0 && (
        <div className="relative">
          <svg className="w-16 h-16 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - timeRemaining / initialTime)}`}
              className={timeRemaining <= 10 ? 'text-red-500' : 
                         timeRemaining <= warningThreshold ? 'text-orange-500' : 'text-blue-500'}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {Math.round((timeRemaining / initialTime) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Control Buttons (optional) */}
      {typeof window !== 'undefined' && window.showTimerControls && (
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => setTimeRemaining(initialTime)}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Reset
          </button>
          <button
            onClick={() => setTimeRemaining(Math.max(0, timeRemaining - 30))}
            className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
          >
            -30s
          </button>
        </div>
      )}
    </div>
  );
};

export default Timer;
