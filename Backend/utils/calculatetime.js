// Utility functions for time calculations and formatting

// Format seconds to MM:SS format
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format seconds to HH:MM:SS format
export const formatTimeWithHours = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return formatTime(seconds);
};

// Calculate time difference between two dates
export const calculateTimeDifference = (startDate, endDate) => {
  const diff = Math.abs(new Date(endDate) - new Date(startDate));
  return Math.floor(diff / 1000); // Return difference in seconds
};

// Get relative time string (e.g., "2 hours ago", "3 days ago")
export const getRelativeTime = (date) => {
  const now = new Date();
  const pastDate = new Date(date);
  const diffInSeconds = Math.floor((now - pastDate) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};

// Calculate quiz time remaining
export const calculateTimeRemaining = (startTime, timeLimit) => {
  const elapsed = Math.floor((Date.now() - new Date(startTime)) / 1000);
  const remaining = timeLimit - elapsed;
  return Math.max(0, remaining);
};

// Validate if time is expired
export const isTimeExpired = (startTime, timeLimit) => {
  const elapsed = Math.floor((Date.now() - new Date(startTime)) / 1000);
  return elapsed >= timeLimit;
};

// Convert time string to seconds (e.g., "10:00" -> 600)
export const timeStringToSeconds = (timeString) => {
  const parts = timeString.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  } else if (parts.length === 3) {
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }
  return 0;
};
