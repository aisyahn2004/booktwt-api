const { Op } = require('sequelize');
const Book = require('../models/Book');
const User = require('../models/User');

// Helper: buat custom error dengan statusCode
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// GET semua buku dengan search, filter genre, pagination
exports.getAllBooks = async ({ search, genre, author, page, limit }) => {
  const pageNum  = parseInt(page)  || 1;
  const limitNum = parseInt(limit) || 10;
  const offset   = (pageNum - 1) * limitNum;

  // Bangun kondisi WHERE secara dinamis
  const where = {};

  if (search) {
    where[Op.or] = [
      { title:  { [Op.like]: `%${search}%` } },
      { author: { [Op.like]: `%${search}%` } }
    ];
  }

  if (genre) {
    where.genre = { [Op.like]: `%${genre}%` };
  }

  if (author && !search) {
    where.author = { [Op.like]: `%${author}%` };
  }

  const { count, rows } = await Book.findAndCountAll({
    where,
    limit: limitNum,
    offset,
    order: [['created_at', 'DESC']],
    include: [
      {
        model: User,
        as: 'addedBy',
        attributes: ['id', 'name'],
        required: false
      }
    ]
  });

  return {
    books: rows,
    pagination: {
      total_data:  count,
      total_pages: Math.ceil(count / limitNum),
      current_page: pageNum,
      per_page: limitNum
    }
  };
};

// GET detail satu buku by ID
exports.getBookById = async (id) => {
  const book = await Book.findByPk(id, {
    include: [
      {
        model: User,
        as: 'addedBy',
        attributes: ['id', 'name'],
        required: false
      }
    ]
  });

  if (!book) {
    throw createError('Book not found', 404);
  }

  return book;
};

// POST buat buku baru
exports.createBook = async (bookData, userId) => {
  // Cek duplikat ISBN jika diisi
  if (bookData.isbn) {
    const existing = await Book.findOne({ where: { isbn: bookData.isbn } });
    if (existing) {
      throw createError('A book with this ISBN already exists', 409);
    }
  }

  const book = await Book.create({
    ...bookData,
    added_by: userId
  });

  // Return dengan relasi addedBy
  return await exports.getBookById(book.id);
};

// PUT update buku
exports.updateBook = async (id, bookData, userId) => {
  const book = await Book.findByPk(id);

  if (!book) {
    throw createError('Book not found', 404);
  }

  // Hanya yang menambahkan buku yang boleh mengedit
  if (book.added_by !== userId) {
    throw createError('You are not authorized to update this book', 403);
  }

  // Cek ISBN baru tidak bentrok dengan buku lain
  if (bookData.isbn && bookData.isbn !== book.isbn) {
    const existing = await Book.findOne({
      where: { isbn: bookData.isbn, id: { [Op.ne]: id } }
    });
    if (existing) {
      throw createError('A book with this ISBN already exists', 409);
    }
  }

  await book.update(bookData);
  return await exports.getBookById(id);
};

// DELETE buku
exports.deleteBook = async (id, userId) => {
  const book = await Book.findByPk(id);

  if (!book) {
    throw createError('Book not found', 404);
  }

  // Hanya yang menambahkan buku yang boleh menghapus
  if (book.added_by !== userId) {
    throw createError('You are not authorized to delete this book', 403);
  }

  await book.destroy();
  return { message: 'Book deleted successfully' };
};

// GET daftar genre unik dari database
exports.getGenres = async () => {
  const books = await Book.findAll({
    attributes: ['genre'],
    where: {
      genre: { [Op.ne]: null }
    },
    group: ['genre'],
    order: [['genre', 'ASC']]
  });

  return books.map(b => b.genre).filter(Boolean);
};
