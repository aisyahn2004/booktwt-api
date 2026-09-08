// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== SWAGGER UI ==========
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'BookTwt API Documentation',
}));

// Route untuk redirect ke docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');   
const bookRoutes = require('./routes/bookRoutes');
const readingListRoutes = require('./routes/readingListRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const readingProgressRoutes = require('./routes/readingProgressRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);    
app.use('/api/books', bookRoutes);
app.use('/api/reading-list', readingListRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reading-progress', readingProgressRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});

module.exports = app;