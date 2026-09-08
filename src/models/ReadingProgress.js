// src/models/ReadingProgress.js
module.exports = (sequelize, DataTypes) => {
  const ReadingProgress = sequelize.define('ReadingProgress', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pages_read: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_pages: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
     recorded_at: {  
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'reading_progress',
    timestamps: false,
  });

  return ReadingProgress;
};