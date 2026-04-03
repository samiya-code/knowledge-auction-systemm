import { useState, useEffect, useCallback } from 'react';
import { calculateTime } from '../utils/calculateTime';

export const useTimer = (initialTime = 0, isActive = true, onTimeUp = null) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        
        if (newTime <= 0) {
          setIsExpired(true);
          if (onTimeUp) {
            onTimeUp();
          }
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeUp]);

  const reset = useCallback((newTime = initialTime) => {
    setTimeLeft(newTime);
    setIsExpired(false);
  }, [initialTime]);

  const start = useCallback(() => {
    setIsExpired(false);
  }, []);

  const pause = useCallback(() => {
    // Timer is effectively paused when isActive is false
  }, []);

  const formatTime = useCallback(() => {
    return calculateTime(timeLeft);
  }, [timeLeft]);

  return {
    timeLeft,
    isExpired,
    formattedTime: formatTime(),
    reset,
    start,
    pause
  };
};

export const useCountdown = (targetDate, onComplete = null) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft(0);
        setIsComplete(true);
        if (onComplete) onComplete();
        return;
      }

      setTimeLeft(Math.floor(difference / 1000));
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const days = Math.floor(timeLeft / (3600 * 24));
  const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return {
    timeLeft,
    isComplete,
    days,
    hours,
    minutes,
    seconds
  };
};
