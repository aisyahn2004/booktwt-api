const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const readingProgressController = require('../controllers/readingProgressController');
const authMiddleware = require('../middlewares/authMiddleware');
const { profileUpdateValidation, validate } = require('../middlewares/validationMiddleware');

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', authMiddleware, profileUpdateValidation, validate, userController.updateProfile);

// GET /api/users/statistics  
router.get('/statistics', authMiddleware, readingProgressController.getUserStatistics);

module.exports = router;