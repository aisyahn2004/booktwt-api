// src/models/Book.js
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    author: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    isbn: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
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
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'https://via.placeholder.com/200x300'
    },
    published_year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    added_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    google_books_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
   }
  }, {
    tableName: 'books',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Book;
};