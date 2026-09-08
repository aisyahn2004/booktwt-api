// src/services/readingListService.js
const { ReadingList, Book } = require('../models');

const readingListService = {
  getUserReadingList: async (userId, status) => {
    const where = { user_id: userId };
    if (status) where.status = status;
    
    const items = await ReadingList.findAll({
      where,
      include: [
        {
          model: Book,
          as: 'book',
          attributes: ['id', 'title', 'author', 'genre', 'cover_image']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    return {
      items,
      total: items.length
    };
  },

  addToReadingList: async ({ userId, bookId, status, notes }) => {
    // Cek apakah buku sudah ada di reading list
    const existing = await ReadingList.findOne({
      where: { user_id: userId, book_id: bookId }
    });
    
    if (existing) {
      const error = new Error('Book already in reading list');
      error.statusCode = 409;
      throw error;
    }
    
    // Cek apakah buku ada di database
    const book = await Book.findByPk(bookId);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }
    
    const entry = await ReadingList.create({
      user_id: userId,
      book_id: bookId,
      status: status || 'want_to_read',
      notes: notes || null,
      started_at: status === 'reading' ? new Date() : null
    });
    
    return entry;
  },

  updateReadingListEntry: async ({ entryId, userId, status, notes, current_page }) => {
  // Cari entry tanpa filter user_id dulu
  const entry = await ReadingList.findOne({
    where: { id: entryId }
  });
  
  if (!entry) {
    const error = new Error('Reading list entry not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Cek apakah user adalah pemilik entry
  if (entry.user_id !== userId) {
    const error = new Error('You are not authorized to update this reading list entry');
    error.statusCode = 403;
    throw error;
  }
    
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (current_page !== undefined) updates.current_page = current_page;
    
    if (status === 'reading' && !entry.started_at) {
      updates.started_at = new Date();
    }
    if (status === 'finished') {
      updates.finished_at = new Date();
    }
    
    await entry.update(updates);
    return entry;
  },

  removeFromReadingList: async (entryId, userId) => {
  // Cari entry tanpa filter user_id dulu
  const entry = await ReadingList.findOne({
    where: { id: entryId }
  });
  
  if (!entry) {
    const error = new Error('Reading list entry not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Cek apakah user adalah pemilik entry
  if (entry.user_id !== userId) {
    const error = new Error('You are not authorized to delete this reading list entry');
    error.statusCode = 403;
    throw error;
  }
  
  await entry.destroy();
  return true;
}
};

module.exports = readingListService;