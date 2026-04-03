const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// In-memory course storage (in production, this would be a database)
let courses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive bootcamp.',
    price: 99.99,
    originalPrice: 199.99,
    instructor: 'Dr. Sarah Johnson',
    duration: '40 hours',
    level: 'beginner',
    category: 'Web Development',
    studentsCount: 15420,
    rating: 4.8,
    reviewCount: 342,
    language: 'English',
    lastUpdated: '2024-01-15',
    auctionStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    auctionEndTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    isActive: true,
    topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
    prerequisites: ['Basic computer skills', 'No programming experience required']
  },
  {
    id: 2,
    title: 'Python for Data Science',
    description: 'Master Python programming and dive into data analysis and machine learning.',
    price: 149.99,
    originalPrice: 299.99,
    instructor: 'Prof. Michael Chen',
    duration: '60 hours',
    level: 'intermediate',
    category: 'Data Science',
    studentsCount: 12350,
    rating: 4.9,
    reviewCount: 267,
    language: 'English',
    lastUpdated: '2024-01-10',
    auctionStartTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
    auctionEndTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    isActive: true,
    topics: ['Python', 'NumPy', 'Pandas', 'Data Visualization', 'Machine Learning', 'TensorFlow'],
    prerequisites: ['Basic Python knowledge', 'Statistics fundamentals']
  },
  {
    id: 3,
    title: 'React Native Mobile App Development',
    description: 'Build native mobile apps for iOS and Android using React Native.',
    price: 89.99,
    originalPrice: 179.99,
    instructor: 'Alex Williams',
    duration: '35 hours',
    level: 'intermediate',
    category: 'Mobile Development',
    studentsCount: 8920,
    rating: 4.7,
    reviewCount: 189,
    language: 'English',
    lastUpdated: '2024-01-14',
    auctionStartTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    auctionEndTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    isActive: true,
    topics: ['React Native', 'Navigation', 'State Management', 'APIs', 'Deployment'],
    prerequisites: ['React knowledge', 'JavaScript ES6+', 'Basic mobile concepts']
  },
  {
    id: 4,
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design.',
    price: 59.99,
    originalPrice: 119.99,
    instructor: 'Sarah Wilson',
    duration: '30 hours',
    level: 'beginner',
    category: 'Design',
    studentsCount: 987,
    rating: 4.6,
    reviewCount: 142,
    language: 'English',
    lastUpdated: '2024-01-08',
    auctionStartTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    auctionEndTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000), // 2.5 hours from now
    isActive: true,
    topics: ['Design Principles', 'Figma', 'User Research', 'Prototyping', 'Design Systems'],
    prerequisites: ['Creative mindset', 'No design experience needed']
  },
  {
    id: 5,
    title: 'Advanced JavaScript & Node.js',
    description: 'Master advanced JavaScript concepts and build scalable backend applications.',
    price: 119.99,
    originalPrice: 239.99,
    instructor: 'David Martinez',
    duration: '45 hours',
    level: 'advanced',
    category: 'Web Development',
    studentsCount: 6780,
    rating: 4.8,
    reviewCount: 234,
    language: 'English',
    lastUpdated: '2024-01-12',
    auctionStartTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    auctionEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    isActive: true,
    topics: ['Advanced JS', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Authentication'],
    prerequisites: ['JavaScript fundamentals', 'Basic Node.js', 'API concepts']
  },
  {
    id: 6,
    title: 'Machine Learning Basics',
    description: 'Introduction to machine learning algorithms and their practical applications.',
    price: 99.99,
    originalPrice: 199.99,
    instructor: 'Dr. Emily Chen',
    duration: '50 hours',
    level: 'intermediate',
    category: 'Data Science',
    studentsCount: 1876,
    rating: 4.9,
    reviewCount: 178,
    language: 'English',
    lastUpdated: '2024-01-11',
    auctionStartTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    auctionEndTime: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
    isActive: true,
    topics: ['ML Fundamentals', 'Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Model Deployment'],
    prerequisites: ['Python programming', 'Statistics knowledge', 'Linear algebra basics']
  }
];

// Get auction status for a course
const getAuctionStatus = (course) => {
  const now = new Date();
  const { auctionStartTime, auctionEndTime } = course;
  
  if (now < auctionStartTime) {
    return {
      status: 'upcoming',
      message: 'Auction starts soon',
      timeLeft: auctionStartTime - now
    };
  } else if (now >= auctionStartTime && now <= auctionEndTime) {
    return {
      status: 'active',
      message: 'Auction is live!',
      timeLeft: auctionEndTime - now
    };
  } else {
    return {
      status: 'ended',
      message: 'Auction ended',
      timeLeft: 0
    };
  }
};

// GET /courses - Get all courses
router.get('/', asyncHandler(async (req, res) => {
  const { category, level, status } = req.query;
  
  let filteredCourses = courses;
  
  // Filter by category
  if (category) {
    filteredCourses = filteredCourses.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Filter by level
  if (level) {
    filteredCourses = filteredCourses.filter(course => 
      course.level.toLowerCase() === level.toLowerCase()
    );
  }
  
  // Filter by auction status
  if (status) {
    filteredCourses = filteredCourses.filter(course => 
      getAuctionStatus(course).status === status
    );
  }
  
  // Add auction status to each course
  const coursesWithStatus = filteredCourses.map(course => ({
    ...course,
    auctionStatus: getAuctionStatus(course),
    deposit: Math.round(course.price * 0.10 * 100) / 100 // 10% deposit
  }));
  
  res.status(200).json({
    success: true,
    data: {
      courses: coursesWithStatus,
      total: coursesWithStatus.length
    }
  });
}));

// GET /courses/:id - Get course by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const courseId = parseInt(id);
  
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Add auction status and deposit
  const courseWithDetails = {
    ...course,
    auctionStatus: getAuctionStatus(course),
    deposit: Math.round(course.price * 0.10 * 100) / 100,
    auctionRules: [
      'Pay 10% deposit to join the auction',
      'Complete the quiz during the auction window',
      'Higher scores = better discounts',
      'Rank #1 gets 100% discount (free course)',
      'Top 10 get 80% discount',
      'Top 50 get 50% discount',
      'Others get 5-20% discount based on performance',
      '80% of deposit is refunded to all participants'
    ]
  };
  
  res.status(200).json({
    success: true,
    data: {
      course: courseWithDetails
    }
  });
}));

// POST /courses/:id/join-auction - Join auction for a course
router.post('/:id/join-auction', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const courseId = parseInt(id);
  const { userId, userName } = req.body;
  
  if (!userId || !userName) {
    return res.status(400).json({
      success: false,
      message: 'User ID and name are required'
    });
  }
  
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  const auctionStatus = getAuctionStatus(course);
  
  if (auctionStatus.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: `Auction is ${auctionStatus.status}. Cannot join.`
    });
  }
  
  const deposit = Math.round(course.price * 0.10 * 100) / 100;
  
  // In a real app, this would process payment
  // For now, we'll simulate payment processing
  const paymentResult = {
    success: true,
    paymentId: `payment_${Date.now()}_${userId}`,
    amount: deposit,
    currency: 'USD',
    status: 'completed',
    processedAt: new Date().toISOString()
  };
  
  // Create auction entry
  const auctionEntry = {
    id: `auction_${Date.now()}_${userId}`,
    courseId,
    userId,
    userName,
    deposit,
    joinedAt: new Date().toISOString(),
    auctionEndTime: course.auctionEndTime,
    payment: paymentResult,
    status: 'active'
  };
  
  // In a real app, this would be stored in a database
  // For now, we'll just return the entry
  
  res.status(201).json({
    success: true,
    message: 'Successfully joined auction',
    data: {
      auctionEntry,
      course: {
        id: course.id,
        title: course.title,
        auctionEndTime: course.auctionEndTime
      }
    }
  });
}));

module.exports = router;
