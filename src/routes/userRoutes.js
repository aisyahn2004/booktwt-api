const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const readingProgressController = require('../controllers/readingProgressController');
const authMiddleware = require('../middlewares/authMiddleware');
const { profileUpdateValidation, validate } = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authMiddleware, userController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Aisyah Nurhayati"
 *               bio:
 *                 type: string
 *                 example: "Pecinta buku dari Karawang"
 *               profile_picture:
 *                 type: string
 *                 example: "https://example.com/photo.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', authMiddleware, profileUpdateValidation, validate, userController.updateProfile);

/**
 * @swagger
 * /users/statistics:
 *   get:
 *     summary: Get user reading statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/statistics', authMiddleware, readingProgressController.getUserStatistics);

module.exports = router;