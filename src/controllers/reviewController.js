// src/controllers/reviewController.js
const reviewService = require('../services/reviewService');

const reviewController = {
  // GET /api/books/:bookId/reviews
  getBookReviews: async (req, res) => {
    try {
      const { bookId } = req.params;
      const { page, limit } = req.query;
      
       // Parse ke integer dengan default
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      
      const result = await reviewService.getBookReviews(bookId, { 
        page: pageNum, 
        limit: limitNum 
      });
      
      res.status(200).json({
        success: true,
        message: 'Reviews retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to get reviews'
      });
    }
  },

  // POST /api/books/:bookId/reviews
  createReview: async (req, res) => {
    try {
      const userId = req.userId || req.user?.id;
      const { bookId } = req.params;
      const { rating, content } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      const result = await reviewService.createReview({
        userId,
        bookId,
        rating,
        content
      });
      
      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: result
      });
    } catch (error) {
      console.error('Create review error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to create review'
      });
    }
  },

  // PUT /api/reviews/:id
  updateReview: async (req, res) => {
    try {
      const userId = req.userId || req.user?.id;
      const { id } = req.params;
      const { rating, content } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const result = await reviewService.updateReview(id, userId, { rating, content });
      
      res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: result
      });
    } catch (error) {
      console.error('Update review error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update review'
      });
    }
  },

  // DELETE /api/reviews/:id
  deleteReview: async (req, res) => {
    try {
      const userId = req.userId || req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      await reviewService.deleteReview(id, userId);
      
      res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to delete review'
      });
    }
  }
};

module.exports = reviewController;