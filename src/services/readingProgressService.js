// src/services/readingProgressService.js
const { ReadingProgress, Book, ReadingList, Review, sequelize } = require('../models');

const readingProgressService = {
  // ──────────────────────────────────────────────────────────────
  // POST /api/reading-progress
  // ──────────────────────────────────────────────────────────────
  recordProgress: async ({ userId, bookId, pages_read, total_pages }) => {
    const book = await Book.findByPk(bookId);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }

    if (pages_read > total_pages) {
      const error = new Error('Pages read cannot exceed total pages');
      error.statusCode = 400;
      throw error;
    }

    const percentage = Math.round((pages_read / total_pages) * 100);

    const progress = await ReadingProgress.create({
      user_id: userId,
      book_id: bookId,
      pages_read,
      total_pages,
      percentage
    });

    return progress;
  },

  // ──────────────────────────────────────────────────────────────
  // GET /api/reading-progress/:bookId
  // ──────────────────────────────────────────────────────────────
  getProgressHistory: async (userId, bookId) => {
    const book = await Book.findByPk(bookId);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }

    const history = await ReadingProgress.findAll({
      where: { user_id: userId, book_id: bookId },
      order: [['recorded_at', 'DESC']]
    });

    return {
      book: {
        id: book.id,
        title: book.title,
        author: book.author
      },
      history
    };
  },

  // ──────────────────────────────────────────────────────────────
  // GET /api/users/statistics
  // ──────────────────────────────────────────────────────────────
  getUserStatistics: async (userId) => {
    // Total buku di reading list
    const totalBooks = await ReadingList.count({
      where: { user_id: userId }
    });

    // Total review
    const totalReviews = await Review.count({
      where: { user_id: userId }
    });

    // Buku berdasarkan status
    const booksByStatus = await ReadingList.findAll({
      where: { user_id: userId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    const statusCounts = {};
    booksByStatus.forEach(item => {
      statusCounts[item.status] = parseInt(item.dataValues.count);
    });

    // Rata-rata rating
    const avgRatingResult = await Review.findOne({
      where: { user_id: userId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
      ]
    });

    const averageRating = avgRatingResult?.dataValues?.avgRating || 0;

    // Total halaman dibaca
    const progressResult = await ReadingProgress.findAll({
      where: { user_id: userId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('pages_read')), 'totalPagesRead']
      ]
    });

    const totalPagesRead = progressResult[0]?.dataValues?.totalPagesRead || 0;

    return {
      total_books: totalBooks,
      total_reviews: totalReviews,
      total_pages_read: parseInt(totalPagesRead) || 0,
      books_by_status: statusCounts,
      average_rating: parseFloat(averageRating).toFixed(1)
    };
  }
}; 

module.exports = readingProgressService;