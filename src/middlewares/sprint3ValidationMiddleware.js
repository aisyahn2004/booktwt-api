const { body, query, validationResult } = require('express-validator');

// ─── Reading List ─────────────────────────────────────────────────────────────

exports.addToReadingListValidation = [
  body('book_id')
    .notEmpty().withMessage('book_id is required')
    .isInt({ min: 1 }).withMessage('book_id must be a positive integer'),

  body('status')
    .optional()
    .isIn(['want_to_read', 'reading', 'finished'])
    .withMessage('Status must be want_to_read, reading, or finished'),

  body('notes')
    .optional()
    .isLength({ max: 1000 }).withMessage('Notes must not exceed 1000 characters')
];

exports.updateReadingListValidation = [
  body('status')
    .optional()
    .isIn(['want_to_read', 'reading', 'finished'])
    .withMessage('Status must be want_to_read, reading, or finished'),

  body('current_page')
    .optional()
    .isInt({ min: 0 }).withMessage('Current page must be a non-negative integer'),

  body('notes')
    .optional()
    .isLength({ max: 1000 }).withMessage('Notes must not exceed 1000 characters')
];

exports.readingListQueryValidation = [
  query('status')
    .optional()
    .isIn(['want_to_read', 'reading', 'finished'])
    .withMessage('Status must be want_to_read, reading, or finished'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// ─── Review ───────────────────────────────────────────────────────────────────

exports.createReviewValidation = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

  body('content')
    .optional()
    .isLength({ max: 1000 }).withMessage('Review content must not exceed 1000 characters')
];

exports.updateReviewValidation = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

  body('content')
    .optional()
    .isLength({ max: 1000 }).withMessage('Review content must not exceed 1000 characters')
];

// ─── Reading Progress ─────────────────────────────────────────────────────────

exports.recordProgressValidation = [
  body('book_id')
    .notEmpty().withMessage('book_id is required')
    .isInt({ min: 1 }).withMessage('book_id must be a positive integer'),

  body('pages_read')
    .notEmpty().withMessage('pages_read is required')
    .isInt({ min: 0 }).withMessage('pages_read must be a non-negative integer'),

  body('total_pages')
    .notEmpty().withMessage('total_pages is required')
    .isInt({ min: 1 }).withMessage('total_pages must be at least 1')
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({
        field: e.path,
        message: e.msg
      }))
    });
  }
  next();
};