// src/routes/bookRoutes.js
const express = require('express');
const router  = express.Router();

const bookController        = require('../controllers/bookController');
const googleBooksController = require('../controllers/googleBooksController');
const reviewRoutes = require('./reviewRoutes'); 
const authMiddleware        = require('../middlewares/authMiddleware');
const {
  createBookValidation,
  updateBookValidation,
  getBooksQueryValidation,
  validate
} = require('../middlewares/bookValidationMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Books
 *     description: Book management endpoints (local database)
 *   - name: GoogleBooks
 *     description: Google Books API integration
 */

/**
 * @swagger
 * /books/search-google:
 *   get:
 *     summary: Search books from Google Books API
 *     tags: [GoogleBooks]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword
 *         example: "harry potter"
 *       - in: query
 *         name: maxResults
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 40
 *         description: Maximum number of results
 *         example: 5
 *     responses:
 *       200:
 *         description: Search results from Google Books
 *       400:
 *         description: Missing search query
 */
router.get('/search-google', googleBooksController.searchGoogleBooks);

/**
 * @swagger
 * /books/import-google:
 *   post:
 *     summary: Import a book from Google Books to local database
 *     tags: [GoogleBooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - google_books_id
 *             properties:
 *               google_books_id:
 *                 type: string
 *                 example: "zyTCAlFPjgYC"
 *     responses:
 *       201:
 *         description: Book imported successfully
 *       400:
 *         description: Missing or invalid google_books_id
 *       401:
 *         description: Unauthorized - JWT token required
 *       404:
 *         description: Book not found in Google Books
 */
router.post('/import-google', authMiddleware, googleBooksController.importFromGoogle);

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL BOOKS (CRUD)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /books/genres:
 *   get:
 *     summary: Get all unique book genres
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of genres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/genres', bookController.getGenres);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books with pagination and filters
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     books:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BookResponse'
 */
router.get('/', getBooksQueryValidation, validate, bookController.getAllBooks);

// Mount review routes
router.use('/:bookId/reviews', reviewRoutes);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book details by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BookResponse'
 *       404:
 *         description: Book not found
 */
router.get('/:id', bookController.getBookById);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book manually
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, createBookValidation, validate, bookController.createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               genre:
 *                 type: string
 *               published_year:
 *                 type: integer
 *               cover_image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the book owner
 *       404:
 *         description: Book not found
 */
router.put('/:id', authMiddleware, updateBookValidation, validate, bookController.updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the book owner
 *       404:
 *         description: Book not found
 */
router.delete('/:id', authMiddleware, bookController.deleteBook);

module.exports = router;