const bookService = require('../services/bookService');

// GET /api/books — daftar semua buku (search, filter, pagination)
exports.getAllBooks = async (req, res) => {
  try {
    const { search, genre, author, page, limit } = req.query;
    const result = await bookService.getAllBooks({ search, genre, author, page, limit });

    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('Get all books error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve books'
    });
  }
};

// GET /api/books/:id — detail satu buku
exports.getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: { book }
    });

  } catch (error) {
    console.error('Get book by id error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve book'
    });
  }
};

// POST /api/books — tambah buku baru
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, description, genre, cover_image, published_year } = req.body;
    const book = await bookService.createBook(
      { title, author, isbn, description, genre, cover_image, published_year },
      req.userId
    );

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: { book }
    });

  } catch (error) {
    console.error('Create book error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create book'
    });
  }
};

// PUT /api/books/:id — update buku
exports.updateBook = async (req, res) => {
  try {
    const { title, author, isbn, description, genre, cover_image, published_year } = req.body;
    const book = await bookService.updateBook(
      req.params.id,
      { title, author, isbn, description, genre, cover_image, published_year },
      req.userId
    );

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: { book }
    });

  } catch (error) {
    console.error('Update book error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update book'
    });
  }
};

// DELETE /api/books/:id — hapus buku
exports.deleteBook = async (req, res) => {
  try {
    await bookService.deleteBook(req.params.id, req.userId);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: null
    });

  } catch (error) {
    console.error('Delete book error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete book'
    });
  }
};

// GET /api/books/genres — daftar genre unik
exports.getGenres = async (req, res) => {
  try {
    const genres = await bookService.getGenres();

    res.status(200).json({
      success: true,
      message: 'Genres retrieved successfully',
      data: { genres }
    });

  } catch (error) {
    console.error('Get genres error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve genres'
    });
  }
};
