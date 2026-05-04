const googleBooksService = require('../services/googleBooksService');

// GET /api/books/search-google?q=harry+potter&maxResults=10
// Cari buku di Google Books (TIDAK menyimpan ke DB, hanya preview)
exports.searchGoogleBooks = async (req, res) => {
  try {
    const { q, maxResults } = req.query;
    const result = await googleBooksService.searchGoogleBooks({ q, maxResults });

    res.status(200).json({
      success: true,
      message: `Found ${result.total} books on Google Books`,
      data: result
    });

  } catch (error) {
    console.error('Search Google Books error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to search Google Books'
    });
  }
};

// POST /api/books/import-google
// Import satu buku dari Google Books ke database lokal
// Body: { "google_books_id": "zyTCAlFPjgYC" }
exports.importFromGoogle = async (req, res) => {
  try {
    const { google_books_id } = req.body;
    const book = await googleBooksService.importFromGoogle(google_books_id, req.userId);

    res.status(201).json({
      success: true,
      message: 'Book imported from Google Books successfully',
      data: { book }
    });

  } catch (error) {
    console.error('Import Google Books error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to import book from Google Books'
    });
  }
};
