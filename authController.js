const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register user
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Create new user
  const user = new User({
    name,
    email,
    password
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        stats: user.stats
      }
    }
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password
  const user = await User.findByEmailForAuth(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Update login streak
  await user.updateLoginStreak();

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        stats: user.stats,
        loginStreak: user.loginStreak,
        lastLogin: user.lastLogin
      }
    }
  });
});

// Get current user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('achievements');

  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, avatar, preferences } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Update allowed fields
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;
  if (preferences) {
    user.preferences = { ...user.preferences, ...preferences };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        preferences: user.preferences,
        stats: user.stats
      }
    }
  });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  // Get user with password
  const user = await User.findById(userId).select('+password');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// Verify token
const verifyToken = asyncHandler(async (req, res) => {
  // If we reach here, token is valid (middleware already verified)
  const user = await User.findById(req.user._id).select('-password');

  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

// Logout (client-side token removal)
const logout = asyncHandler(async (req, res) => {
  // In a stateless JWT setup, logout is handled client-side
  // But we can implement token blacklisting if needed
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// Delete account
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { password } = req.body;

  // Get user with password
  const user = await User.findById(userId).select('+password');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Password is incorrect'
    });
  }

  // Soft delete by deactivating account
  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

// Get user statistics
const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select('stats achievements loginStreak');
  
  // Get additional stats from quiz results
  const QuizResult = require('../models/QuizResult');
  const recentResults = await QuizResult.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('score courseId courseTitle createdAt');

  res.status(200).json({
    success: true,
    data: {
      stats: user.stats,
      achievements: user.achievements,
      loginStreak: user.loginStreak,
      recentResults
    }
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
  logout,
  deleteAccount,
  getUserStats
};
