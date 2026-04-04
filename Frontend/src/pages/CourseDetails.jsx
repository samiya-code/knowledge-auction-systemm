import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { calculateDeposit } from '../data/mockCourses';
import { getAuctionStatus } from '../data/mockCourses';
import { AUCTION_STATUS, AUCTION_CONFIG } from '../utils/constants';
import { useCountdown } from '../hooks/useTimer';
import Loader from '../components/Loader';
import ProtectedRoute from '../components/ProtectedRoute';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, addNotification } = useApp();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joiningAuction, setJoiningAuction] = useState(false);
  const [error, setError] = useState(null);

  // Mock course data - in real app, this would come from API
  const mockCourse = {
    id: parseInt(id),
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive bootcamp. Master modern web development from scratch and build real-world applications.',
    instructor: {
      name: 'Dr. Sarah Johnson',
      bio: 'Senior Web Developer with 15+ years of experience in building scalable web applications',
      avatar: null,
      rating: 4.8
    },
    price: 99.99,
    originalPrice: 199.99,
    duration: '40 hours',
    level: 'Beginner',
    category: 'Web Development',
    studentsCount: 15420,
    rating: 4.8,
    reviewCount: 342,
    language: 'English',
    lastUpdated: '2024-01-15',
    imageUrl: null,
    auctionStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    auctionEndTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    isActive: true,
    topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
    prerequisites: ['Basic computer skills', 'No programming experience required'],
    whatYouWillLearn: [
      'Build modern web applications from scratch',
      'Master HTML5, CSS3, and JavaScript ES6+',
      'Create responsive websites with Bootstrap and Tailwind CSS',
      'Develop single-page applications with React',
      'Build RESTful APIs with Node.js and Express',
      'Work with MongoDB databases',
      'Deploy applications to production',
      'Implement authentication and security best practices'
    ],
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

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (mockCourse.id === parseInt(id)) {
        setCourse(mockCourse);
        setLoading(false);
      } else {
        setError('Course not found');
        setLoading(false);
      }
    }, 1000);
  }, [id]);

  const auctionStatus = course ? getAuctionStatus(course) : null;
  const { timeLeft, isComplete } = useCountdown(
    auctionStatus?.timeLeft > 0 ? new Date(Date.now() + auctionStatus.timeLeft) : null
  );

  const deposit = course ? calculateDeposit(course.price) : 0;
  const discountRange = "5-100%";

  const handleJoinAuction = async () => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { from: `/course/${id}` }
      });
      return;
    }

    if (auctionStatus?.status !== AUCTION_STATUS.ACTIVE) {
      addNotification({
        type: 'warning',
        title: 'Auction Not Active',
        message: 'Please wait for the auction to start.'
      });
      return;
    }

    setJoiningAuction(true);
    setError(null);

    try {
      // Simulate API call to join auction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addNotification({
        type: 'success',
        title: 'Auction Joined!',
        message: `Successfully paid ${formatCurrency(deposit)} deposit. Get ready for the quiz!`
      });

      // Navigate to quiz page
      navigate(`/quiz/${course.id}`, {
        state: {
          courseId: course.id,
          deposit: deposit,
          auctionEndTime: course.auctionEndTime
        }
      });

    } catch (error) {
      setError('Failed to join auction. Please try again.');
      addNotification({
        type: 'error',
        title: 'Payment Failed',
        message: 'Unable to process payment. Please try again.'
      });
    } finally {
      setJoiningAuction(false);
    }
  };

  const formatTimeLeft = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return 'Ended';
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    } else if (totalSeconds < 3600) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}m ${seconds}s`;
    } else {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  const getStatusColor = () => {
    switch (auctionStatus?.status) {
      case AUCTION_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-300';
      case AUCTION_STATUS.UPCOMING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case AUCTION_STATUS.ENDED:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" message="Loading course details..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>→</span>
            <span>{course.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Title and Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor()}`}>
                  {auctionStatus?.status === AUCTION_STATUS.ACTIVE && '🔴 Auction Live'}
                  {auctionStatus?.status === AUCTION_STATUS.UPCOMING && '⏰ Upcoming'}
                  {auctionStatus?.status === AUCTION_STATUS.ENDED && '🏁 Auction Ended'}
                </span>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                  {course.level}
                </span>
                <span className="text-sm text-gray-500">{course.category}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              
              <p className="text-gray-600 mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {course.instructor.name}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                  {course.studentsCount.toLocaleString()} students
                </div>
              </div>
            </div>

            {/* Course Image */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-2">📚</div>
                  <div className="text-lg font-medium">{course.category}</div>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Topics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Course Topics</h2>
              <div className="flex flex-wrap gap-2">
                {course.topics.map((topic, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Prerequisites</h2>
              <ul className="space-y-2">
                {course.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Auction Rules */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Auction Rules</h2>
              <ul className="space-y-2">
                {course.auctionRules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5">•</span>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Auction Status Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              {/* Timer */}
              {(auctionStatus?.status === AUCTION_STATUS.ACTIVE || auctionStatus?.status === AUCTION_STATUS.UPCOMING) && (
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      {auctionStatus?.status === AUCTION_STATUS.ACTIVE ? '⏰ Auction ends in:' : '🚀 Auction starts in:'}
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatTimeLeft(auctionStatus?.timeLeft)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: auctionStatus?.status === AUCTION_STATUS.ACTIVE 
                          ? `${(1 - auctionStatus?.timeLeft / (course.auctionEndTime - course.auctionStartTime)) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Course Price</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(course.price)}
                  </div>
                  {course.originalPrice > course.price && (
                    <div className="text-sm text-gray-400 line-through">
                      {formatCurrency(course.originalPrice)}
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="text-sm text-gray-500 mb-1">Deposit Required</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(deposit)}
                  </div>
                  <div className="text-sm text-gray-400">10% of course price</div>
                </div>
              </div>

              {/* Discount Info */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  🎯 Discount Range: {discountRange}
                </div>
                <div className="text-xs text-gray-600">
                  Based on your quiz performance - Rank #1 gets 100% off!
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleJoinAuction}
                disabled={
                  joiningAuction || 
                  auctionStatus?.status !== AUCTION_STATUS.ACTIVE ||
                  !isAuthenticated
                }
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  joiningAuction
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : auctionStatus?.status === AUCTION_STATUS.ACTIVE && isAuthenticated
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : auctionStatus?.status === AUCTION_STATUS.UPCOMING
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {joiningAuction
                  ? 'Processing...'
                  : !isAuthenticated
                  ? 'Login to Join'
                  : auctionStatus?.status === AUCTION_STATUS.ACTIVE
                  ? `Join Auction - ${formatCurrency(deposit)}`
                  : auctionStatus?.status === AUCTION_STATUS.UPCOMING
                  ? 'Auction Not Started'
                  : 'Auction Ended'
                }
              </button>

              {!isAuthenticated && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Login required to join auctions
                </p>
              )}
            </div>

            {/* Instructor Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">👨‍🏫 Instructor</h3>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">
                    {course.instructor.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{course.instructor.name}</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    {course.instructor.rating}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700">{course.instructor.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
