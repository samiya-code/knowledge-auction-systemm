import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';

const CourseCard = ({ course }) => {
  const {
    id,
    title,
    description,
    instructor,
    price,
    duration,
    level,
    category,
    enrolledCount,
    rating,
    imageUrl
  } = course;

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Course Image */}
      <div className="relative h-48 bg-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
            <div className="text-white text-center">
              <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <p className="text-sm font-medium">{category || 'Course'}</p>
            </div>
          </div>
        )}
        
        {/* Level Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(level)}`}>
            {level || 'All Levels'}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            by {instructor || 'Unknown Instructor'}
          </p>
        </div>

        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        {/* Course Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {duration || 'Self-paced'}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {enrolledCount || 0} enrolled
            </span>
          </div>
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {renderStars(rating)}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(price || 0)}
          </div>
          <Link
            to={`/course/${id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
