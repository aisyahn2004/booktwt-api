const User = require('../models/User');

/**
 * Get user profile by ID
 * @param {number} userId
 * @returns {Object} user
 */
exports.getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Update user profile
 * @param {number} userId
 * @param {Object} updateData - { name, bio, profile_picture }
 * @returns {Object} updated user
 */
exports.updateProfile = async (userId, { name, bio, profile_picture }) => {
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Only update fields that are provided
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (profile_picture) user.profile_picture = profile_picture;

  await user.save();

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    profile_picture: user.profile_picture
  };
};