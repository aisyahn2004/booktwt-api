// src/controllers/readingProgressController.js
const readingProgressService = require('../services/readingProgressService');

const readingProgressController = {
  // POST /api/reading-progress
  recordProgress: async (req, res) => {
    try {
      const userId = req.userId || req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const { book_id, pages_read, total_pages } = req.body;

      // Validasi input
      if (!book_id) {
        return res.status(400).json({
          success: false,
          message: 'book_id is required'
        });
      }

      if (pages_read === undefined || total_pages === undefined) {
        return res.status(400).json({
          success: false,
          message: 'pages_read and total_pages are required'
        });
      }

      const result = await readingProgressService.recordProgress({
        userId,
        bookId: book_id,
        pages_read,
        total_pages
      });

      res.status(201).json({
        success: true,
        message: 'Reading progress recorded successfully',
        data: result
      });
    } catch (error) {
      console.error('Record progress error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to record reading progress'
      });
    }
  },

  // GET /api/reading-progress/:bookId
  getProgressHistory: async (req, res) => {
    try {
      const userId = req.userId || req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const { bookId } = req.params;

      const result = await readingProgressService.getProgressHistory(userId, bookId);

      res.status(200).json({
        success: true,
        message: 'Progress history retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Get progress history error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to get progress history'
      });
    }
  },

  // GET /api/users/statistics (jika belum ada di userController)
  getUserStatistics: async (req, res) => {
    try {
      const userId = req.userId || req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const result = await readingProgressService.getUserStatistics(userId);

      res.status(200).json({
        success: true,
        message: 'User statistics retrieved successfully',
        data: result
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

module.exports = readingProgressController;