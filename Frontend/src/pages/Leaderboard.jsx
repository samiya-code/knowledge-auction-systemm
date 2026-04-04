import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { resultService } from '../utils/calculateTime';
import { getRelativeTime } from '../utils/getRelativeTime';


const Leaderboard = () => {
  const { isAuthenticated } = useApp();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Mock leaderboard data
  const mockLeaderboardData = [
    {
      rank: 1,
      userId: 'user1',
      userName: 'Alice Johnson',
      avatar: null,
      totalScore: 9850,
      quizzesTaken: 45,
      averageScore: 89.1,
      earnings: 1250.75,
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      streak: 15,
      badges: ['🏆', '⭐', '🔥']
    },
    {
      rank: 2,
      userId: 'user2',
      userName: 'Bob Smith',
      avatar: null,
      totalScore: 9420,
      quizzesTaken: 42,
      averageScore: 88.7,
      earnings: 1180.50,
      lastActive: new Date(Date.now() - 7200000).toISOString(),
      streak: 12,
      badges: ['🏆', '⭐']
    },
    {
      rank: 3,
      userId: 'user3',
      userName: 'Carol Williams',
      avatar: null,
      totalScore: 8950,
      quizzesTaken: 38,
      averageScore: 87.2,
      earnings: 1095.25,
      lastActive: new Date(Date.now() - 1800000).toISOString(),
      streak: 8,
      badges: ['🏆', '🔥']
    },
    {
      rank: 4,
      userId: 'user4',
      userName: 'David Brown',
      avatar: null,
      totalScore: 8720,
      quizzesTaken: 40,
      averageScore: 85.5,
      earnings: 980.00,
      lastActive: new Date(Date.now() - 14400000).toISOString(),
      streak: 6,
      badges: ['⭐']
    },
    {
      rank: 5,
      userId: 'user5',
      userName: 'Emma Davis',
      avatar: null,
      totalScore: 8450,
      quizzesTaken: 35,
      averageScore: 84.9,
      earnings: 875.50,
      lastActive: new Date(Date.now() - 21600000).toISOString(),
      streak: 10,
      badges: ['🔥']
    },
    {
      rank: 6,
      userId: 'user6',
      userName: 'Frank Miller',
      avatar: null,
      totalScore: 8200,
      quizzesTaken: 33,
      averageScore: 83.3,
      earnings: 750.00,
      lastActive: new Date(Date.now() - 28800000).toISOString(),
      streak: 5,
      badges: ['⭐']
    },
    {
      rank: 7,
      userId: 'user7',
      userName: 'Grace Wilson',
      avatar: null,
      totalScore: 7950,
      quizzesTaken: 30,
      averageScore: 82.1,
      earnings: 680.25,
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      streak: 7,
      badges: ['🔥']
    },
    {
      rank: 8,
      userId: 'user8',
      userName: 'Henry Moore',
      avatar: null,
      totalScore: 7680,
      quizzesTaken: 28,
      averageScore: 81.4,
      earnings: 620.00,
      lastActive: new Date(Date.now() - 43200000).toISOString(),
      streak: 4,
      badges: []
    },
    {
      rank: 9,
      userId: 'user9',
      userName: 'Iris Taylor',
      avatar: null,
      totalScore: 7420,
      quizzesTaken: 27,
      averageScore: 80.7,
      earnings: 575.75,
      lastActive: new Date(Date.now() - 86400000).toISOString(),
      streak: 3,
      badges: []
    },
    {
      rank: 10,
      userId: 'user10',
      userName: 'Jack Anderson',
      avatar: null,
      totalScore: 7150,
      quizzesTaken: 25,
      averageScore: 79.8,
      earnings: 525.00,
      lastActive: new Date(Date.now() - 172800000).toISOString(),
      streak: 2,
      badges: []
    }
  ];

  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: '1', name: 'Introduction to React' },
    { id: '2', name: 'Advanced JavaScript' },
    { id: '3', name: 'Python for Data Science' },
    { id: '4', name: 'UI/UX Design' }
  ];

  const timeFilters = [
    { id: 'all', name: 'All Time' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'today', name: 'Today' }
  ];

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        // In a real app, this would call the API
        // const response = await resultService.getLeaderboard(page, 10);
        
        // Simulate API call
        setTimeout(() => {
          setLeaderboardData(mockLeaderboardData);
          setTotalPages(3);
          setLoading(false);
        }, 1000);
      } catch (error) {
        setError('Failed to load leaderboard data');
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [page, timeFilter, courseFilter]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-300';
      case 2:
        return 'bg-gray-50 border-gray-300';
      case 3:
        return 'bg-orange-50 border-orange-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Leaderboard</h1>
        <p className="text-gray-600">
          Compete with learners worldwide and climb the ranks!
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <div className="flex flex-wrap gap-2">
              {timeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTimeFilter(filter.id)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    timeFilter === filter.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <div className="flex flex-wrap gap-2">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setCourseFilter(course.id)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    courseFilter === course.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {course.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Winners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaderboardData.slice(0, 3).map((user, index) => (
          <div
            key={user.userId}
            className={`rounded-lg shadow-lg p-6 text-center border-2 ${getRankColor(user.rank)}`}
          >
            <div className="text-4xl mb-3">{getRankIcon(user.rank)}</div>
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {user.userName.charAt(0)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{user.userName}</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">{user.totalScore.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mb-3">Total Points</p>
            <div className="flex justify-center space-x-1 mb-3">
              {user.badges.map((badge, i) => (
                <span key={i} className="text-xl">{badge}</span>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              <div>{user.quizzesTaken} quizzes</div>
              <div>{formatCurrency(user.earnings)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quizzes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Streak
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData.map((user) => (
                <tr
                  key={user.userId}
                  className={`hover:bg-gray-50 ${user.rank <= 3 ? getRankColor(user.rank) : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-900">
                        {getRankIcon(user.rank)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-gray-600">
                          {user.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.userName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getRelativeTime(user.lastActive)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {user.totalScore.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.quizzesTaken}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.averageScore}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(user.earnings)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-1">{user.streak}</span>
                      <span className="text-orange-500">🔥</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{page}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === i + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            Join the Competition!
          </h3>
          <p className="text-blue-700 mb-4">
            Sign up and start taking quizzes to appear on the leaderboard.
          </p>
          <button
            onClick={() => window.location.href = '/signup'}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Sign Up Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
