const express = require('express');
const router  = express.Router();

const bookController        = require('../controllers/bookController');
const googleBooksController = require('../controllers/googleBooksController');
const authMiddleware        = require('../middlewares/authMiddleware');
const {
  createBookValidation,
  updateBookValidation,
  getBooksQueryValidation,
  validate
} = require('../middlewares/bookValidationMiddleware');

/**
 * @route   GET /api/books/search-google
 * @desc    Cari buku di Google Books (preview, tidak simpan ke DB)
 * @access  Public
 * @query   q          - kata kunci pencarian (wajib)
 * @query   maxResults - jumlah hasil (default: 10, maks: 40)
 * @example GET /api/books/search-google?q=harry+potter&maxResults=5
 */
router.get('/search-google', googleBooksController.searchGoogleBooks);

/**
 * @route   POST /api/books/import-google
 * @desc    Import satu buku dari Google Books ke database lokal
 * @access  Private (requires JWT)
 * @body    { "google_books_id": "zyTCAlFPjgYC" }
 *
 * Cara pakai:
 * 1. Panggil GET /search-google untuk dapatkan daftar buku
 * 2. Catat google_books_id dari buku yang ingin di-import
 * 3. Panggil endpoint ini untuk simpan ke DB
 */
router.post('/import-google', authMiddleware, googleBooksController.importFromGoogle);

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL BOOKS (CRUD)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @route   GET /api/books/genres
 * @desc    Get list of all unique genres
 * @access  Public
 */
router.get('/genres', bookController.getGenres);

/**
 * @route   GET /api/books
 * @desc    Get all books with search, filter & pagination
 * @access  Public
 * @query   search  - cari berdasarkan judul atau penulis
 * @query   genre   - filter berdasarkan genre
 * @query   author  - filter berdasarkan penulis
 * @query   page    - nomor halaman (default: 1)
 * @query   limit   - jumlah data per halaman (default: 10)
 */
router.get('/', getBooksQueryValidation, validate, bookController.getAllBooks);

/**
 * @route   GET /api/books/:id
 * @desc    Get detail of a single book
 * @access  Public
 */
router.get('/:id', bookController.getBookById);

/**
 * @route   POST /api/books
 * @desc    Add a new book manually
 * @access  Private (requires JWT)
 */
router.post('/', authMiddleware, createBookValidation, validate, bookController.createBook);

/**
 * @route   PUT /api/books/:id
 * @desc    Update a book (only by the user who added it)
 * @access  Private (requires JWT)
 */
router.put('/:id', authMiddleware, updateBookValidation, validate, bookController.updateBook);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book (only by the user who added it)
 * @access  Private (requires JWT)
 */
router.delete('/:id', authMiddleware, bookController.deleteBook);

module.exports = router;
