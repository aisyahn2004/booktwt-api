// src/models/index.js
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Import models sebagai fungsi
const UserModel = require('./User');
const BookModel = require('./Book');
const ReadingListModel = require('./ReadingList');
const ReviewModel = require('./Review');
const ReadingProgressModel = require('./ReadingProgress');

// Inisialisasi model
const User = UserModel(sequelize, Sequelize.DataTypes);
const Book = BookModel(sequelize, Sequelize.DataTypes);
const ReadingList = ReadingListModel(sequelize, Sequelize.DataTypes);
const Review = ReviewModel(sequelize, Sequelize.DataTypes);
const ReadingProgress = ReadingProgressModel(sequelize, Sequelize.DataTypes);

// Setup associations
User.hasMany(Book, { foreignKey: 'added_by', as: 'books' });
Book.belongsTo(User, { foreignKey: 'added_by', as: 'addedBy' });

User.hasMany(ReadingList, { foreignKey: 'user_id', as: 'readingList' });
ReadingList.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Book.hasMany(ReadingList, { foreignKey: 'book_id', as: 'readingListEntries' });
ReadingList.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });

User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Book.hasMany(Review, { foreignKey: 'book_id', as: 'reviews' });
Review.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });

User.hasMany(ReadingProgress, { foreignKey: 'user_id', as: 'readingProgress' });
ReadingProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Book.hasMany(ReadingProgress, { foreignKey: 'book_id', as: 'progressEntries' });
ReadingProgress.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Book,
  ReadingList,
  Review,
  ReadingProgress
};