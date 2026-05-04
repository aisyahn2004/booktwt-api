const { body, query, validationResult } = require('express-validator');

// ─── Validasi untuk CREATE buku ──────────────────────────────────────────────
exports.createBookValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),

  body('author')
    .notEmpty().withMessage('Author is required')
    .isLength({ max: 150 }).withMessage('Author must not exceed 150 characters'),

  body('isbn')
    .optional()
    .isLength({ max: 20 }).withMessage('ISBN must not exceed 20 characters'),

  body('genre')
    .optional()
    .isLength({ max: 100 }).withMessage('Genre must not exceed 100 characters'),

  body('cover_image')
    .optional()
    .isURL().withMessage('Cover image must be a valid URL'),

  body('published_year')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(`Published year must be between 1000 and ${new Date().getFullYear()}`)
];

// ─── Validasi untuk UPDATE buku ──────────────────────────────────────────────
exports.updateBookValidation = [
  body('title')
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),

  body('author')
    .optional()
    .notEmpty().withMessage('Author cannot be empty')
    .isLength({ max: 150 }).withMessage('Author must not exceed 150 characters'),

  body('isbn')
    .optional()
    .isLength({ max: 20 }).withMessage('ISBN must not exceed 20 characters'),

  body('genre')
    .optional()
    .isLength({ max: 100 }).withMessage('Genre must not exceed 100 characters'),

  body('cover_image')
    .optional()
    .isURL().withMessage('Cover image must be a valid URL'),

  body('published_year')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(`Published year must be between 1000 and ${new Date().getFullYear()}`)
];

// ─── Validasi query params GET /api/books ────────────────────────────────────
exports.getBooksQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// ─── Handler hasil validasi (sama polanya dengan Sprint 1) ───────────────────
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
