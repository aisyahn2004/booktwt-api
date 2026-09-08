const express = require('express');
const router = express.Router();
const googleBooksController = require('../controllers/googleBooksController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/search-google', googleBooksController.searchGoogleBooks);
router.post('/import-google', authMiddleware, googleBooksController.importFromGoogle);

module.exports = router;