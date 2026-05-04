const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Object} - { user, token }
 */
exports.register = async ({ name, email, password }) => {
  // Check if email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({ name, email, password: hashedPassword });

  // Generate token
  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token
  };
};

/**
 * Login a user
 * @param {Object} credentials - { email, password }
 * @returns {Object} - { user, token }
 */
exports.login = async ({ email, password }) => {
  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Email not registered');
    error.statusCode = 404;
    throw error;
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid password');
    error.statusCode = 401;
    throw error;
  }

  // Generate token
  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token
  };
};

// ─── Helpers (private) ────────────────────────────────────────────────────────

/**
 * Generate JWT token for a user
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/**
 * Remove sensitive fields from user object
 */
const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  profile_picture: user.profile_picture
});