// src/controllers/userController.js
const userService = require('../services/userService');
const readingProgressService = require('../services/readingProgressService');

const userController = {
  // GET /api/users/profile
  getProfile: async (req, res) => {
    try {
      const userId = req.userId || req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = await userService.getProfile(userId);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to get profile'
      });
    }
  },

  // PUT /api/users/profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.userId || req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const { name, bio, profile_picture } = req.body;
      const user = await userService.updateProfile(userId, { name, bio, profile_picture });
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  },

  // GET /api/users/statistics
  getUserStatistics: async (req, res) => {
    try {
      const userId = req.userId || req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const statistics = await readingProgressService.getUserStatistics(userId);
      
      res.status(200).json({
        success: true,
        data: statistics
      });
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get user statistics'
      });
    }
  }
};

module.exports = userController;