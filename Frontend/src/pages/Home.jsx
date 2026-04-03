import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuctionCard from '../components/AuctionCard';
import { mockCourses } from '../data/mockCourses';
import { getAuctionStatus } from '../data/mockCourses';
import { AUCTION_STATUS } from '../utils/constants';
import Loader from '../components/Loader';

const Home = () => {
  const { isAuthenticated, user } = useApp();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || getAuctionStatus(course).status === filter;
    return matchesSearch && matchesFilter;
  });

  const activeAuctions = courses.filter(course => 
    getAuctionStatus(course).status === AUCTION_STATUS.ACTIVE
  );

  const upcomingAuctions = courses.filter(course => 
    getAuctionStatus(course).status === AUCTION_STATUS.UPCOMING
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" message="Loading courses..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎯 AI Knowledge Auction Platform
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Compete in quizzes to earn massive discounts on premium courses!
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {user.name}! 👋
                </h2>
                <p className="text-blue-100">
                  Ready to compete for amazing course discounts?
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Active Auctions Alert */}
      {activeAuctions.length > 0 && (
        <section className="bg-green-50 border-b-2 border-green-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🔴</span>
              <span className="text-green-800 font-medium">
                {activeAuctions.length} auction{activeAuctions.length > 1 ? 's are' : ' is'} live now!
              </span>
              <Link
                to="/leaderboard"
                className="text-green-600 hover:text-green-700 font-medium underline"
              >
                View Leaderboard →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Courses
              </button>
              <button
                onClick={() => setFilter(AUCTION_STATUS.ACTIVE)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === AUCTION_STATUS.ACTIVE
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔴 Live Now
              </button>
              <button
                onClick={() => setFilter(AUCTION_STATUS.UPCOMING)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === AUCTION_STATUS.UPCOMING
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⏰ Upcoming
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <AuctionCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            🚀 How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Join Auction</h3>
              <p className="text-gray-600 text-sm">
                Pay 10% deposit to enter the course auction
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Take Quiz</h3>
              <p className="text-gray-600 text-sm">
                Answer AI-generated questions during the auction window
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Ranked</h3>
              <p className="text-gray-600 text-sm">
                Compete with others for the best score
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">4️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Win Discount</h3>
              <p className="text-gray-600 text-sm">
                Get up to 100% off based on your rank!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Premium Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-gray-600">Happy Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">AI-Powered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">4.9⭐</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
