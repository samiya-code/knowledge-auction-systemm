export const mockCourses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive bootcamp",
    price: 99.99,
    originalPrice: 199.99,
    instructor: "Dr. Sarah Johnson",
    rating: 4.8,
    studentsCount: 15420,
    duration: "40 hours",
    level: "Beginner",
    category: "Web Development",
    image: "/images/courses/web-dev.jpg",
    auctionStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    auctionEndTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    isActive: true,
    topics: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    prerequisites: ["Basic computer skills", "No programming experience required"]
  },
  {
    id: 2,
    title: "Python for Data Science & Machine Learning",
    description: "Master Python programming and dive into data science, machine learning, and AI",
    price: 149.99,
    originalPrice: 299.99,
    instructor: "Prof. Michael Chen",
    rating: 4.9,
    studentsCount: 12350,
    duration: "60 hours",
    level: "Intermediate",
    category: "Data Science",
    image: "/images/courses/python-ds.jpg",
    auctionStartTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
    auctionEndTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    isActive: true,
    topics: ["Python", "NumPy", "Pandas", "Machine Learning", "Deep Learning", "TensorFlow"],
    prerequisites: ["Basic Python knowledge", "Statistics fundamentals"]
  },
  {
    id: 3,
    title: "React Native Mobile App Development",
    description: "Build native mobile apps for iOS and Android using React Native",
    price: 89.99,
    originalPrice: 179.99,
    instructor: "Alex Williams",
    rating: 4.7,
    studentsCount: 8920,
    duration: "35 hours",
    level: "Intermediate",
    category: "Mobile Development",
    image: "/images/courses/react-native.jpg",
    auctionStartTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    auctionEndTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    isActive: true,
    topics: ["React Native", "Navigation", "State Management", "APIs", "Deployment"],
    prerequisites: ["React knowledge", "JavaScript ES6+", "Basic mobile concepts"]
  },
  {
    id: 4,
    title: "Advanced JavaScript & Node.js",
    description: "Master advanced JavaScript concepts and build scalable backend applications",
    price: 119.99,
    originalPrice: 239.99,
    instructor: "David Martinez",
    rating: 4.8,
    studentsCount: 6780,
    duration: "45 hours",
    level: "Advanced",
    category: "Web Development",
    image: "/images/courses/advanced-js.jpg",
    auctionStartTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    auctionEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    isActive: true,
    topics: ["Advanced JS", "Node.js", "Express", "MongoDB", "REST APIs", "Authentication"],
    prerequisites: ["JavaScript fundamentals", "Basic Node.js", "API concepts"]
  },
  {
    id: 5,
    title: "UI/UX Design Masterclass",
    description: "Learn user interface and user experience design from scratch",
    price: 79.99,
    originalPrice: 159.99,
    instructor: "Emma Thompson",
    rating: 4.6,
    studentsCount: 11230,
    duration: "30 hours",
    level: "Beginner",
    category: "Design",
    image: "/images/courses/ui-ux.jpg",
    auctionStartTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    auctionEndTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000), // 2.5 hours from now
    isActive: true,
    topics: ["Design Principles", "Figma", "User Research", "Prototyping", "Design Systems"],
    prerequisites: ["Creative mindset", "No design experience needed"]
  },
  {
    id: 6,
    title: "Digital Marketing Complete Course",
    description: "Master SEO, social media marketing, content marketing, and paid advertising",
    price: 69.99,
    originalPrice: 139.99,
    instructor: "Lisa Anderson",
    rating: 4.5,
    studentsCount: 18920,
    duration: "25 hours",
    level: "Beginner",
    category: "Marketing",
    image: "/images/courses/digital-marketing.jpg",
    auctionStartTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    auctionEndTime: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
    isActive: true,
    topics: ["SEO", "Social Media", "Content Marketing", "Google Ads", "Analytics"],
    prerequisites: ["Basic computer skills", "Interest in marketing"]
  }
];

export const getAuctionStatus = (course) => {
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

export const calculateDeposit = (price) => {
  return Math.round(price * 0.10 * 100) / 100; // 10% deposit, rounded to 2 decimals
};
