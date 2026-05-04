const userService = require('../services/userService');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.userId);

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to get profile'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, profile_picture } = req.body;
    const user = await userService.updateProfile(req.userId, { name, bio, profile_picture });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};