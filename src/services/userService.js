// src/services/userService.js
const { User } = require('../models');

const userService = {
  getProfile: async (userId) => {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  },

  updateProfile: async (userId, { name, bio, profile_picture }) => {
    const user = await User.findByPk(userId);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (profile_picture) updates.profile_picture = profile_picture;

    await user.update(updates);
    return user;
  },

  getUserStatistics: async (userId) => {
    const user = await User.findByPk(userId);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Hitung statistik
    const { ReadingList, Review } = require('../models');
    
    const totalBooks = await ReadingList.count({
      where: { user_id: userId }
    });

    const totalReviews = await Review.count({
      where: { user_id: userId }
    });

    const booksByStatus = await ReadingList.findAll({
      where: { user_id: userId },
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    const averageRating = await Review.findOne({
      where: { user_id: userId },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating']
      ]
    });

    const statusCounts = {};
    booksByStatus.forEach(item => {
      statusCounts[item.status] = parseInt(item.dataValues.count);
    });

    return {
      total_books: totalBooks,
      total_reviews: totalReviews,
      books_by_status: statusCounts,
      average_rating: averageRating?.dataValues?.avgRating || 0
    };
  }
};

module.exports = userService;