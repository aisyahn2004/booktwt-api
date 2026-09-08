const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');
const { updateReviewValidation, validate } = require('../middlewares/sprint3ValidationMiddleware');

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update own review
 * @access  Private
 */
router.put('/:id', authMiddleware, updateReviewValidation, validate, reviewController.updateReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete own review
 * @access  Private
 */
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;