// src/services/reviewService.js
const { Review, User, Book } = require('../models');

const reviewService = {
  // GET /api/books/:bookId/reviews
  getBookReviews: async (bookId, { page = 1, limit = 10 } = {}) => {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;
    
    // Cek apakah buku ada
    const book = await Book.findByPk(bookId);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }

    const { count, rows } = await Review.findAndCountAll({
      where: { book_id: bookId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'profile_picture']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      reviews: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        per_page: parseInt(limit)
      }
    };
  },

  // POST /api/books/:bookId/reviews
  createReview: async ({ userId, bookId, rating, content }) => {
    // Cek apakah buku ada
    const book = await Book.findByPk(bookId);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }

    // Cek apakah user sudah pernah review buku ini
    const existingReview = await Review.findOne({
      where: { user_id: userId, book_id: bookId }
    });

    if (existingReview) {
      const error = new Error('You have already reviewed this book');
      error.statusCode = 409;
      throw error;
    }

    const review = await Review.create({
      user_id: userId,
      book_id: bookId,
      rating,
      content: content || null
    });

    // Reload dengan include user
    return await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'profile_picture']
        }
      ]
    });
  },

  // PUT /api/reviews/:id
  updateReview: async (reviewId, userId, { rating, content }) => {
    const review = await Review.findOne({
      where: { id: reviewId }
    });

    if (!review) {
      const error = new Error('Review not found');
      error.statusCode = 404;
      throw error;
    }

    // Cek kepemilikan
    if (review.user_id !== userId) {
      const error = new Error('You are not authorized to update this review');
      error.statusCode = 403;
      throw error;
    }

    const updates = {};
    if (rating !== undefined) updates.rating = rating;
    if (content !== undefined) updates.content = content;

    await review.update(updates);

    // Reload dengan include user
    return await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'profile_picture']
        }
      ]
    });
  },

  // DELETE /api/reviews/:id
  deleteReview: async (reviewId, userId) => {
    const review = await Review.findOne({
      where: { id: reviewId }
    });

    if (!review) {
      const error = new Error('Review not found');
      error.statusCode = 404;
      throw error;
    }

    // Cek kepemilikan
    if (review.user_id !== userId) {
      const error = new Error('You are not authorized to delete this review');
      error.statusCode = 403;
      throw error;
    }

    await review.destroy();
    return true;
  }
};

module.exports = reviewService;