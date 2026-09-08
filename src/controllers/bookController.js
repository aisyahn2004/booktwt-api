// src/controllers/bookController.js
const bookService = require('../services/bookService');

const bookController = {
  // POST /api/books
  createBook: async (req, res) => {
    try {
      const userId = req.userId || req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const book = await bookService.createBook(req.body, userId);
      
      res.status(201).json({
        success: true,
        message: 'Book created successfully',
        data: book
      });
    } catch (error) {
      console.error('Create book error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to create book'
      });
    }
  },

  // GET /api/books
  getAllBooks: async (req, res) => {
    try {
      const result = await bookService.getAllBooks(req.query);
      
      res.status(200).json({
        success: true,
        message: 'Books retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Get books error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get books'
      });
    }
  },

  // GET /api/books/:id
  getBookById: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await bookService.getBookById(id);
      
      res.status(200).json({
        success: true,
        data: book
      });
    } catch (error) {
      console.error('Get book error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to get book'
      });
    }
  },

  // PUT /api/books/:id
  updateBook: async (req, res) => {
    try {
      const userId = req.userId || req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const book = await bookService.updateBook(id, userId, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Book updated successfully',
        data: book
      });
    } catch (error) {
      console.error('Update book error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update book'
      });
    }
  },

  // DELETE /api/books/:id
  deleteBook: async (req, res) => {
    try {
      const userId = req.userId || req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      await bookService.deleteBook(id, userId);
      
      res.status(200).json({
        success: true,
        message: 'Book deleted successfully'
      });
    } catch (error) {
      console.error('Delete book error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to delete book'
      });
    }
  },

  // GET /api/books/genres
  getGenres: async (req, res) => {
    try {
      const genres = await bookService.getGenres();
      
      res.status(200).json({
        success: true,
        message: 'Genres retrieved successfully',
        data: { genres }
      });
    } catch (error) {
      console.error('Get genres error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get genres'
      });
    }
  }
};

module.exports = bookController;