const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Title is required' },
      len: {
        args: [1, 255],
        msg: 'Title must be between 1 and 255 characters'
      }
    }
  },
  author: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Author is required' },
      len: {
        args: [1, 150],
        msg: 'Author must be between 1 and 150 characters'
      }
    }
  },
  isbn: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: {
      msg: 'ISBN already exists'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  genre: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  cover_image: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'https://via.placeholder.com/200x300'
  },
  published_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: { msg: 'Published year must be an integer' },
      min: {
        args: [1000],
        msg: 'Published year must be a valid year'
      },
      max: {
        args: [new Date().getFullYear()],
        msg: 'Published year cannot be in the future'
      }
    }
  },
  added_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'books',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Book;
