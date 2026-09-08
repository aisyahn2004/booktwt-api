// src/routes/reviewRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createReviewValidation,
  updateReviewValidation,
  validate
} = require('../middlewares/sprint3ValidationMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Review dan rating buku (Sprint 3)
 */

/**
 * @swagger
 * /books/{bookId}/reviews:
 *   get:
 *     summary: Get all reviews for a specific book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of reviews
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
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ReviewResponse'
 *       404:
 *         description: Book not found
 */
router.get('/', reviewController.getBookReviews);

/**
 * @swagger
 * /books/{bookId}/reviews:
 *   post:
 *     summary: Add a review to a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ReviewResponse'
 *       400:
 *         description: Validation error or already reviewed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
router.post('/', authMiddleware, createReviewValidation, validate, reviewController.createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review (only by owner)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ReviewResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your review
 *       404:
 *         description: Review not found
 */
router.put('/:id', authMiddleware, updateReviewValidation, validate, reviewController.updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review (only by owner)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your review
 *       404:
 *         description: Review not found
 */
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;