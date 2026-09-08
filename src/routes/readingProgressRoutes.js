// src/routes/readingProgressRoutes.js
const express = require('express');
const router = express.Router();
const readingProgressController = require('../controllers/readingProgressController');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  recordProgressValidation,
  validate
} = require('../middlewares/sprint3ValidationMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Reading Progress
 *     description: Pelacakan progres membaca (Sprint 3)
 */

/**
 * @swagger
 * /reading-progress:
 *   post:
 *     summary: Record reading progress for a book
 *     tags: [Reading Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - current_page
 *               - total_pages
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 1
 *               current_page:
 *                 type: integer
 *                 example: 50
 *               total_pages:
 *                 type: integer
 *                 example: 300
 *     responses:
 *       201:
 *         description: Progress recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     book_id:
 *                       type: integer
 *                     pages_read:
 *                       type: integer
 *                     total_pages:
 *                       type: integer
 *                     percentage:
 *                       type: number
 *                       example: 16.67
 *                     recorded_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
router.post('/', authMiddleware, recordProgressValidation, validate, readingProgressController.recordProgress);

/**
 * @swagger
 * /reading-progress/{bookId}:
 *   get:
 *     summary: Get reading progress history for a specific book
 *     tags: [Reading Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Progress history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     book:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         title:
 *                           type: string
 *                     current_progress:
 *                       type: object
 *                       properties:
 *                         pages_read:
 *                           type: integer
 *                         total_pages:
 *                           type: integer
 *                         percentage:
 *                           type: number
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           pages_read:
 *                             type: integer
 *                           percentage:
 *                             type: number
 *                           recorded_at:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book or progress not found
 */
router.get('/:bookId', authMiddleware, readingProgressController.getProgressHistory);

module.exports = router;