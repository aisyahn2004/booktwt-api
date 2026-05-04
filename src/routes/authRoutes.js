const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  registerValidation, 
  loginValidation, 
  validate 
} = require('../middlewares/validationMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', registerValidation, validate, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginValidation, validate, authController.login);

module.exports = router;