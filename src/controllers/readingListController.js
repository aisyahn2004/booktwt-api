// src/controllers/readingListController.js

/**
 * Reading List Controller
 * Sprint 3 - Community Features
 */

// src/controllers/readingListController.js
const readingListService = require('../services/readingListService');

const readingListController = {
  // GET /api/reading-list
  getMyReadingList: async (req, res) => {
    try {
      // Gunakan req.user.id atau req.userId
      const userId = req.user?.id || req.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const { status } = req.query;
      const readingList = await readingListService.getUserReadingList(userId, status);
      
      res.status(200).json({
        success: true,
        data: readingList
      });
    } catch (error) {
      console.error('Get reading list error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get reading list'
      });
    }
  },

  // POST /api/reading-list
  addToReadingList: async (req, res) => {
    try {
      const userId = req.user?.id || req.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const { book_id, status, notes } = req.body;
      
      // Validasi book_id
      if (!book_id) {
        return res.status(400).json({
          success: false,
          message: 'book_id is required'
        });
      }

      const result = await readingListService.addToReadingList({
        userId,
        bookId: book_id,
        status: status || 'want_to_read',
        notes
      });
      
      res.status(201).json({
        success: true,
        message: 'Book added to reading list',
        data: result
      });
    } catch (error) {
      console.error('Add to reading list error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to add to reading list'
      });
    }
  },

  // PUT /api/reading-list/:id
  updateReadingList: async (req, res) => {
    try {
      const userId = req.user?.id || req.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const { id } = req.params;
      const { status, notes, current_page } = req.body;
      
      const result = await readingListService.updateReadingListEntry({
        entryId: id,
        userId,
        status,
        notes,
        current_page
      });
      
      res.status(200).json({
        success: true,
        message: 'Reading list updated successfully',
        data: result
      });
    } catch (error) {
      console.error('Update reading list error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update reading list'
      });
    }
  },

  // DELETE /api/reading-list/:id
  removeFromReadingList: async (req, res) => {
    try {
      const userId = req.user?.id || req.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const { id } = req.params;
      
      await readingListService.removeFromReadingList(id, userId);
      
      res.status(200).json({
        success: true,
        message: 'Book removed from reading list successfully'
      });
    } catch (error) {
      console.error('Remove from reading list error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to remove from reading list'
      });
    }
  }
};

module.exports = readingListController;