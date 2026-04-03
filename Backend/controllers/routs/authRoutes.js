const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Validation middleware
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long'
    });
  }
  
  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required'
    });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  next();
};

const validatePasswordChange = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long'
    });
  }
  
  next();
};

// Public routes
router.post('/register', validateRegistration, asyncHandler(authController.register));
router.post('/login', validateLogin, asyncHandler(authController.login));

// Protected routes
router.use(authenticateToken);

router.get('/profile', asyncHandler(authController.getProfile));
router.put('/profile', asyncHandler(authController.updateProfile));
router.put('/change-password', validatePasswordChange, asyncHandler(authController.changePassword));
router.get('/verify', asyncHandler(authController.verifyToken));
router.post('/logout', asyncHandler(authController.logout));
router.delete('/account', asyncHandler(authController.deleteAccount));
router.get('/stats', asyncHandler(authController.getUserStats));

module.exports = router;
