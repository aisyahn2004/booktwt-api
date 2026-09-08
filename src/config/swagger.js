// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BookTwt API Documentation',
      version: '1.0.0',
      description: `
        RESTful API untuk Pengelolaan Aktivitas Komunitas Pembaca Buku
        
        Fitur yang Tersedia:
        - 1. User Management (Register, Login, Profile)
        - 2. Book Management (CRUD, Search, Filter)
        - 3. Community Features (Reading List, Reviews, Progress)
      `,
      contact: {
        name: 'Aisyah Nurhayati',
        email: 'aisyah@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Masukkan token JWT yang didapat dari login',
        },
      },
      schemas: {
        // User Schemas
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', minLength: 6, example: 'password123' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            bio: { type: 'string', nullable: true },
            profile_picture: { type: 'string', example: 'https://via.placeholder.com/150' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        // Book Schemas
        BookInput: {
          type: 'object',
          required: ['title', 'author'],
          properties: {
            title: { type: 'string', example: 'Atomic Habits' },
            author: { type: 'string', example: 'James Clear' },
            isbn: { type: 'string', example: '9780735211292' },
            description: { type: 'string', example: 'Tiny Changes, Remarkable Results' },
            genre: { type: 'string', example: 'Self Development' },
            cover_image: { type: 'string', example: 'https://example.com/cover.jpg' },
            published_year: { type: 'integer', example: 2018 },
          },
        },
        BookResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            author: { type: 'string' },
            isbn: { type: 'string' },
            description: { type: 'string' },
            genre: { type: 'string' },
            cover_image: { type: 'string' },
            published_year: { type: 'integer' },
            avg_rating: { type: 'number', format: 'float', example: 4.5 },
            total_reviews: { type: 'integer', example: 10 },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        // Reading List Schemas
        ReadingListInput: {
          type: 'object',
          required: ['book_id'],
          properties: {
            book_id: { type: 'integer', example: 1 },
            status: { type: 'string', enum: ['want_to_read', 'reading', 'finished'], example: 'want_to_read' },
            notes: { type: 'string', example: 'Buku ini direkomendasikan teman' },
          },
        },
        ReadingListResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            status: { type: 'string', enum: ['want_to_read', 'reading', 'finished'] },
            current_page: { type: 'integer' },
            notes: { type: 'string' },
            started_at: { type: 'string', format: 'date-time' },
            finished_at: { type: 'string', format: 'date-time' },
            book: { $ref: '#/components/schemas/BookResponse' },
          },
        },
        // Review Schemas
        ReviewInput: {
          type: 'object',
          required: ['rating'],
          properties: {
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            content: { type: 'string', example: 'Buku yang sangat menginspirasi!' },
          },
        },
        ReviewResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            rating: { type: 'integer' },
            content: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
              },
            },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        // Error Response
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Error message here' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Authentication', description: 'Endpoint untuk registrasi dan login' },
      { name: 'Users', description: 'Manajemen profil pengguna' },
      { name: 'Books', description: 'Manajemen data buku' },
      { name: 'Reading List', description: 'Manajemen reading list pengguna' },
      { name: 'Reviews', description: 'Review dan rating buku' },
      { name: 'Reading Progress', description: 'Pelacakan progres membaca' },
    ],
  },
  apis: [
    './src/routes/*.js',  // Path ke file routes
    './src/models/*.js',  // Path ke models (untuk schema)
  ],
};

module.exports = swaggerJsdoc(options);