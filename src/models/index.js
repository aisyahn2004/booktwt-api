const User = require('./User');
const Book = require('./Book');

// Asosiasi User <-> Book
User.hasMany(Book, { foreignKey: 'added_by', as: 'books' });
Book.belongsTo(User, { foreignKey: 'added_by', as: 'addedBy' });

module.exports = { User, Book };
