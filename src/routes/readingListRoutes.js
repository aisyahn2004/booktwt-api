// src/routes/readingListRoutes.js
const express = require('express');
const router = express.Router();
const readingListController = require('../controllers/readingListController');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  addToReadingListValidation,
  updateReadingListValidation,
  readingListQueryValidation,
  validate
} = require('../middlewares/sprint3ValidationMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Reading List
 *     description: Manajemen reading list pengguna
 */

/**
 * @swagger
 * /reading-list:
 *   get:
 *     summary: Get user's reading list with optional status filter
 *     tags: [Reading List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [want_to_read, reading, finished]
 *         description: Filter by reading status
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
 *     responses:
 *       200:
 *         description: Reading list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ReadingListResponse'
 *                     total:
 *                       type: integer
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/', authMiddleware, readingListQueryValidation, validate, readingListController.getMyReadingList);

/**
 * @swagger
 * /reading-list:
 *   post:
 *     summary: Add a book to reading list
 *     tags: [Reading List]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReadingListInput'
 *     responses:
 *       201:
 *         description: Book added to reading list successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ReadingListResponse'
 *       400:
 *         description: Validation error - book_id is required or invalid status
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Book not found
 *       409:
 *         description: Book already in reading list
 */
router.post('/', authMiddleware, addToReadingListValidation, validate, readingListController.addToReadingList);

/**
 * @swagger
 * /reading-list/{id}:
 *   put:
 *     summary: Update reading list entry (status, notes, current_page)
 *     tags: [Reading List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reading list entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [want_to_read, reading, finished]
 *               notes:
 *                 type: string
 *               current_page:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reading list entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ReadingListResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - You are not the owner of this entry
 *       404:
 *         description: Reading list entry not found
 */
router.put('/:id', authMiddleware, updateReadingListValidation, validate, readingListController.updateReadingList);

/**
 * @swagger
 * /reading-list/{id}:
 *   delete:
 *     summary: Remove a book from reading list
 *     tags: [Reading List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reading list entry ID
 *     responses:
 *       200:
 *         description: Book removed from reading list successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - You are not the owner of this entry
 *       404:
 *         description: Reading list entry not found
 */
router.delete('/:id', authMiddleware, readingListController.removeFromReadingList);

module.exports = router;