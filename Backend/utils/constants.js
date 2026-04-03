// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  
  // Courses
  COURSES: '/courses',
  JOIN_AUCTION: '/join-auction',
  
  // Quiz
  QUIZ: '/quiz',
  SUBMIT_QUIZ: '/submit-quiz',
  
  // Results
  RESULT: '/result',
  LEADERBOARD: '/leaderboard'
};

// Auction Configuration
export const AUCTION_CONFIG = {
  DEPOSIT_PERCENTAGE: 0.10, // 10% deposit
  REFUND_BASE_RATE: 0.80, // 80% base refund rate
  QUIZ_QUESTIONS_COUNT: 8,
  QUESTION_TIME_LIMIT: 15, // seconds per question
  TOTAL_QUIZ_TIME: 120 // 2 minutes total
};

// Discount Tiers
export const DISCOUNT_TIERS = {
  RANK_1: 100,
  TOP_10: 80,
  TOP_50: 50,
  TOP_100: 20,
  TOP_200: 10,
  DEFAULT: 5
};

// Refund Rates by Rank
export const REFUND_RATES = {
  RANK_1: 1.0, // 100% refund
  TOP_10: 0.9, // 90% refund
  TOP_50: 0.85, // 85% refund
  DEFAULT: 0.8 // 80% refund
};

// Notification Types
export const NOTIFICATION_TYPES = {
  AUCTION_STARTING: 'auction_starting',
  AUCTION_ACTIVE: 'auction_active',
  TIME_RUNNING_OUT: 'time_running_out',
  QUIZ_STARTING: 'quiz_starting',
  RESULT_ANNOUNCED: 'result_announced',
  DISCOUNT_EARNED: 'discount_earned',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed'
};

// Quiz Status
export const QUIZ_STATUS = {
  WAITING: 'waiting',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned'
};

// Auction Status
export const AUCTION_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  ENDED: 'ended'
};

// Time Formats
export const TIME_FORMATS = {
  SECONDS: 'seconds',
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  AUCTION_FULL: 'Auction is full. Please try another course.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  QUIZ_ERROR: 'Error loading quiz. Please refresh.',
  SUBMISSION_ERROR: 'Error submitting quiz. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  AUCTION_JOINED: 'Successfully joined the auction!',
  PAYMENT_SUCCESS: 'Payment successful!',
  QUIZ_SUBMITTED: 'Quiz submitted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!'
};

// Loading Messages
export const LOADING_MESSAGES = {
  JOINING_AUCTION: 'Joining auction...',
  PROCESSING_PAYMENT: 'Processing payment...',
  LOADING_QUIZ: 'Loading quiz questions...',
  SUBMITTING_QUIZ: 'Submitting quiz...',
  CALCULATING_RESULTS: 'Calculating results...'
};

// Course Categories
export const COURSE_CATEGORIES = {
  WEB_DEVELOPMENT: 'Web Development',
  DATA_SCIENCE: 'Data Science',
  MOBILE_DEVELOPMENT: 'Mobile Development',
  DESIGN: 'Design',
  MARKETING: 'Marketing',
  BUSINESS: 'Business'
};

// Course Levels
export const COURSE_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
};

// Animation Durations (ms)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280
};
