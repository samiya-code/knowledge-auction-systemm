import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { calculateTime } from '../utils/calculateTime';
import { getAuctionStatus, calculateDeposit } from '../data/mockCourses';
import { AUCTION_STATUS } from '../utils/constants';

const AuctionCard = ({ course }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const updateStatus = () => {
      const auctionStatus = getAuctionStatus(course);
      setStatus(auctionStatus);
      setTimeLeft(auctionStatus.timeLeft);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [course]);

  const getStatusColor = () => {
    switch (status?.status) {
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

  const getStatusIcon = () => {
    switch (status?.status) {
      case AUCTION_STATUS.ACTIVE:
        return '🔴';
      case AUCTION_STATUS.UPCOMING:
        return '⏰';
      case AUCTION_STATUS.ENDED:
        return '🏁';
      default:
        return '📚';
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

  const deposit = calculateDeposit(course.price);
  const discountRange = "5-100%"; // Dynamic based on auction results

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Course Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-sm font-medium">{course.category}</div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${getStatusColor()}`}>
            <span>{getStatusIcon()}</span>
            <span className="text-xs font-medium">{status?.message}</span>
          </div>
        </div>

        {/* Timer for active/upcoming auctions */}
        {(status?.status === AUCTION_STATUS.ACTIVE || status?.status === AUCTION_STATUS.UPCOMING) && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  {status?.status === AUCTION_STATUS.ACTIVE ? 'Ends in:' : 'Starts in:'}
                </span>
                <span className="text-sm font-bold">{formatTimeLeft(timeLeft)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Course Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
              {course.instructor}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              {course.duration}
            </span>
          </div>
          <div className="flex items-center">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {course.rating}
            </span>
          </div>
        </div>

        {/* Auction Info */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Course Price</div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(course.price)}
              </div>
              {course.originalPrice > course.price && (
                <div className="text-xs text-gray-400 line-through">
                  {formatCurrency(course.originalPrice)}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Deposit Required</div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(deposit)}
              </div>
              <div className="text-xs text-gray-400">10% of price</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 mb-4">
            <div className="text-sm font-medium text-gray-700 mb-1">
              🎯 Discount Range: {discountRange}
            </div>
            <div className="text-xs text-gray-600">
              Based on your quiz performance - Rank #1 gets 100% off!
            </div>
          </div>

          {/* Action Button */}
          <Link
            to={`/course/${course.id}`}
            className={`w-full block text-center py-3 px-4 rounded-lg font-medium transition-colors ${
              status?.status === AUCTION_STATUS.ACTIVE
                ? 'bg-green-600 text-white hover:bg-green-700'
                : status?.status === AUCTION_STATUS.UPCOMING
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : status?.status === AUCTION_STATUS.ENDED
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {status?.status === AUCTION_STATUS.ACTIVE
              ? 'Join Auction Now'
              : status?.status === AUCTION_STATUS.UPCOMING
              ? 'View Details'
              : status?.status === AUCTION_STATUS.ENDED
              ? 'Auction Ended'
              : 'View Details'
            }
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
