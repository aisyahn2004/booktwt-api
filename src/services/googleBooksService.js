const https = require('https');
const Book  = require('../models/Book');

// Helper: custom error
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Helper: fetch dengan native https (tidak butuh install axios)
const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Failed to parse response')); }
      });
    }).on('error', reject);
  });
};

// ─── Cari buku di Google Books API ──────────────────────────────────────────
// GET /api/books/search-google?q=harry+potter&maxResults=10
exports.searchGoogleBooks = async ({ q, maxResults = 10 }) => {
  if (!q || q.trim() === '') {
    throw createError('Search query (q) is required', 400);
  }

  const limit  = Math.min(parseInt(maxResults) || 10, 40); // Google max 40
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY || '';
  const keyParam = apiKey ? `&key=${apiKey}` : '';

  const query = encodeURIComponent(q.trim());
  const url   = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${limit}${keyParam}`;

  const response = await fetchJson(url);

  if (!response.items || response.items.length === 0) {
    return { books: [], total: 0 };
  }

  // Normalisasi data dari Google Books ke format yang rapi
  const books = response.items.map(item => {
    const info = item.volumeInfo || {};
    return {
      google_books_id: item.id,
      title:           info.title || 'Unknown Title',
      author:          (info.authors || []).join(', ') || 'Unknown Author',
      isbn:            extractIsbn(info.industryIdentifiers),
      description:     info.description
                         ? info.description.substring(0, 500) + (info.description.length > 500 ? '...' : '')
                         : null,
      genre:           (info.categories || [])[0] || null,
      cover_image:     info.imageLinks?.thumbnail?.replace('http://', 'https://') || null,
      published_year:  extractYear(info.publishedDate),
      publisher:       info.publisher || null,
      page_count:      info.pageCount  || null,
      language:        info.language   || null
    };
  });

  return { books, total: response.totalItems || books.length };
};

// ─── Import buku dari Google Books ke database lokal ────────────────────────
// POST /api/books/import-google
exports.importFromGoogle = async (googleBooksId, userId) => {
  if (!googleBooksId) {
    throw createError('google_books_id is required', 400);
  }

  const apiKey   = process.env.GOOGLE_BOOKS_API_KEY || '';
  const keyParam = apiKey ? `?key=${apiKey}` : '';
  const url      = `https://www.googleapis.com/books/v1/volumes/${googleBooksId}${keyParam}`;

  let response;
  try {
    response = await fetchJson(url);
  } catch (e) {
    throw createError('Failed to fetch book from Google Books', 502);
  }

  if (response.error) {
    throw createError('Book not found on Google Books', 404);
  }

  const info = response.volumeInfo || {};

  // Cek apakah buku dengan ISBN ini sudah ada di database
  const isbn = extractIsbn(info.industryIdentifiers);
  if (isbn) {
    const existing = await Book.findOne({ where: { isbn } });
    if (existing) {
      throw createError(
        `Book already exists in database (id: ${existing.id})`,
        409
      );
    }
  }

  // Simpan ke database
  const book = await Book.create({
    title:          info.title || 'Unknown Title',
    author:         (info.authors || []).join(', ') || 'Unknown Author',
    isbn:           isbn || null,
    description:    info.description
                      ? info.description.substring(0, 1000)
                      : null,
    genre:          (info.categories || [])[0] || null,
    cover_image:    info.imageLinks?.thumbnail?.replace('http://', 'https://')
                      || 'https://via.placeholder.com/200x300',
    published_year: extractYear(info.publishedDate),
    added_by:       userId
  });

  // Return dengan format lengkap
  const { default: bookService } = require('./bookService');
  return await require('./bookService').getBookById(book.id);
};

// ─── Helper: ekstrak ISBN dari array industryIdentifiers ────────────────────
function extractIsbn(identifiers) {
  if (!identifiers || !Array.isArray(identifiers)) return null;

  // Prioritaskan ISBN_13
  const isbn13 = identifiers.find(i => i.type === 'ISBN_13');
  if (isbn13) return isbn13.identifier;

  const isbn10 = identifiers.find(i => i.type === 'ISBN_10');
  if (isbn10) return isbn10.identifier;

  return null;
}

// ─── Helper: ekstrak tahun dari string tanggal (mis: "2001-03-15" → 2001) ───
function extractYear(dateStr) {
  if (!dateStr) return null;
  const year = parseInt(dateStr.substring(0, 4));
  return isNaN(year) ? null : year;
}
