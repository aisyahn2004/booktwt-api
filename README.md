# 📚 BookTwt API

> **RESTful API untuk Pengelolaan Aktivitas Komunitas Pembaca Buku**

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express.js](https://img.shields.io/badge/Express.js-5.2.1-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange)
![Sequelize](https://img.shields.io/badge/Sequelize-6.37.7-blue)
![JWT](https://img.shields.io/badge/JWT-Auth-red)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-brightgreen)
![License](https://img.shields.io/badge/License-ISC-yellow)
![Status](https://img.shields.io/badge/Status-Completed-success)

---

## 📖 Tentang Project

**BookTwt API** adalah sistem backend berbasis **RESTful API** yang dirancang untuk mengelola aktivitas komunitas pembaca buku digital, khususnya komunitas **BookTwt** (Book Twitter). Sistem ini menyediakan endpoint yang dapat diintegrasikan dengan berbagai aplikasi klien (web, mobile, maupun bot) untuk mendukung kegiatan literasi seperti manajemen buku, reading list, review, dan pelacakan progres membaca.

Project ini merupakan hasil penelitian skripsi dengan judul:

> **"Rancang Bangun RESTful API untuk Pengelolaan Aktivitas Komunitas Pembaca Buku"**

**Penulis:** Aisyah Nurhayati (2210631250040)  
**Program Studi:** Sistem Informasi  
**Fakultas:** Ilmu Komputer  
**Universitas:** Universitas Singaperbangsa Karawang  
**Tahun:** 2026

---

## ✨ Fitur Utama

Sistem ini dikembangkan dalam **3 sprint iteratif** menggunakan metodologi **Agile Scrum**:

### 🔐 Sprint 1 — User Management
- Registrasi pengguna
- Login dengan autentikasi JWT
- Manajemen profil pengguna
- Statistik aktivitas pengguna

### 📚 Sprint 2 — Book Management
- CRUD buku (Create, Read, Update, Delete)
- Pencarian buku berdasarkan judul/penulis
- Filter buku berdasarkan genre
- Pagination
- Integrasi dengan **Google Books API** (search & import)

### 👥 Sprint 3 — Community Features
- **Reading List**: Manajemen daftar bacaan dengan status (`want_to_read`, `reading`, `finished`)
- **Reviews & Rating**: Memberikan ulasan dan rating buku (1-5)
- **Reading Progress**: Pelacakan progres membaca
- **Statistics**: Statistik aktivitas membaca pengguna

---

## 🛠️ Teknologi yang Digunakan

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| **Runtime** | Node.js | 20.x |
| **Framework** | Express.js | ^5.2.1 |
| **Database** | MySQL | 8.x |
| **ORM** | Sequelize | ^6.37.7 |
| **Autentikasi** | JSON Web Token (JWT) | ^9.0.3 |
| **Enkripsi Password** | bcryptjs | ^3.0.3 |
| **Validasi** | express-validator | ^7.3.1 |
| **Dokumentasi API** | Swagger UI (OpenAPI 3.0) | ^5.0.1 |
| **Testing** | Postman | - |
| **Deployment** | Railway | - |
| **Version Control** | Git & GitHub | - |

---

## 📁 Struktur Project

```
booktwt-api/
├── src/
│   ├── config/
│   │   ├── database.js         # Konfigurasi koneksi MySQL
│   │   └── swagger.js          # Konfigurasi Swagger UI
│   ├── controllers/            # Logika bisnis endpoint
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── googleBooksController.js
│   │   ├── readingListController.js
│   │   ├── readingProgressController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── middlewares/            # Middleware Express
│   │   ├── authMiddleware.js
│   │   ├── validationMiddleware.js
│   │   └── ...
│   ├── models/                 # Model Sequelize
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── ReadingList.js
│   │   ├── Review.js
│   │   ├── ReadingProgress.js
│   │   └── index.js
│   ├── routes/                 # Definisi endpoint
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── readingListRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── readingProgressRoutes.js
│   │   └── userRoutes.js
│   ├── services/               # Service layer (business logic)
│   │   ├── authService.js
│   │   ├── bookService.js
│   │   ├── googleBooksService.js
│   │   ├── readingListService.js
│   │   ├── readingProgressService.js
│   │   └── reviewService.js
│   └── app.js                  # Entry point aplikasi
├── database/
│   └── ALL_IN_ONE_migration.sql  # Migration database
├── .env.example                # Contoh environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Cara Menjalankan Project

### Prasyarat

Pastikan sudah menginstal:
- [Node.js](https://nodejs.org/) (v20 atau lebih baru)
- [MySQL](https://www.mysql.com/) (v8 atau lebih baru)
- [Git](https://git-scm.com/)

### Langkah Instalasi

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/aisyahn2004/booktwt-api.git
   cd booktwt-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   
   Copy file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Lalu edit file `.env` sesuai konfigurasi:
   ```env
   # Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=booktwt_api
   DB_PORT=3306

   # JWT
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=24h

   # Google Books API
   GOOGLE_BOOKS_API_KEY=your_google_books_api_key

   # Server
   PORT=3000
   NODE_ENV=development
   ```

4. **Setup database:**
   
   Buat database di MySQL:
   ```sql
   CREATE DATABASE booktwt_api;
   ```
   
   Lalu jalankan migration:
   ```bash
   mysql -u root -p booktwt_api < database/ALL_IN_ONE_migration.sql
   ```

5. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```
   
   Aplikasi akan berjalan di: `http://localhost:3000`

6. **Akses dokumentasi API:**
   
   Buka browser: `http://localhost:3000/api-docs`

---

## 📚 Dokumentasi API

Dokumentasi API dibangun menggunakan **Swagger UI** dengan standar **OpenAPI Specification 3.0**.

### 🌐 Akses Dokumentasi Online

**Production:** [https://booktwt-api-production.up.railway.app/api-docs](https://booktwt-api-production.up.railway.app/api-docs)

### 🏠 Akses Dokumentasi Lokal

Setelah menjalankan aplikasi, buka:
```
http://localhost:3000/api-docs
```

### 📋 Daftar Endpoint

| Modul | Endpoint | Method | Deskripsi |
|-------|----------|--------|-----------|
| **Auth** | `/api/auth/register` | POST | Registrasi pengguna |
| | `/api/auth/login` | POST | Login pengguna |
| | `/api/auth/me` | GET | Profil pengguna |
| **Users** | `/api/users/profile` | GET | Lihat profil |
| | `/api/users/profile` | PUT | Update profil |
| | `/api/users/statistics` | GET | Statistik pengguna |
| **Books** | `/api/books` | GET | Daftar buku |
| | `/api/books` | POST | Tambah buku |
| | `/api/books/:id` | GET | Detail buku |
| | `/api/books/:id` | PUT | Update buku |
| | `/api/books/:id` | DELETE | Hapus buku |
| | `/api/books/genres` | GET | Daftar genre |
| **Google Books** | `/api/books/search-google` | GET | Cari di Google Books |
| | `/api/books/import-google` | POST | Import dari Google Books |
| **Reading List** | `/api/reading-list` | GET | Daftar bacaan |
| | `/api/reading-list` | POST | Tambah ke daftar |
| | `/api/reading-list/:id` | PUT | Update entri |
| | `/api/reading-list/:id` | DELETE | Hapus entri |
| **Reviews** | `/api/books/:bookId/reviews` | GET | Lihat review |
| | `/api/books/:bookId/reviews` | POST | Tambah review |
| | `/api/reviews/:id` | PUT | Update review |
| | `/api/reviews/:id` | DELETE | Hapus review |
| **Reading Progress** | `/api/reading-progress` | POST | Catat progres |
| | `/api/reading-progress/:bookId` | GET | Riwayat progres |

**Total: 25 Endpoint**

---

## 🧪 Pengujian

Pengujian sistem dilakukan menggunakan metode **Black Box Testing** dengan tools **Postman**.

### Hasil Pengujian

| Kategori | Jumlah Test Case | Hasil |
|----------|------------------|-------|
| Sprint 1 — User Management | 24 | ✅ 100% Pass |
| Sprint 2 — Book Management | 36 | ✅ 100% Pass |
| Sprint 3 — Community Features | 41 | ✅ 100% Pass |
| End-to-End Testing | 23 | ✅ 100% Pass |
| **TOTAL** | **124** | **✅ 100% Pass** |

---

## 🗄️ Struktur Database

Database terdiri dari **5 tabel** yang saling berelasi:

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data pengguna |
| `books` | Data buku |
| `reading_list` | Daftar bacaan pengguna |
| `reviews` | Ulasan dan rating |
| `reading_progress` | Progres membaca |

**Relasi:**
- `users` → `books` (One-to-Many)
- `users` → `reading_list` (One-to-Many)
- `books` → `reading_list` (One-to-Many)
- `users` → `reviews` (One-to-Many)
- `books` → `reviews` (One-to-Many)
- `users` → `reading_progress` (One-to-Many)
- `books` → `reading_progress` (One-to-Many)

---

## 🔒 Autentikasi

Sistem menggunakan **JWT (JSON Web Token)** untuk autentikasi. Untuk mengakses endpoint yang dilindungi (private), sertakan token pada header:

```
Authorization: Bearer <your_jwt_token>
```

**Cara mendapatkan token:**
1. Register di `POST /api/auth/register`
2. Login di `POST /api/auth/login`
3. Copy token dari response
4. Gunakan token untuk endpoint private

---

## 📦 Dependencies

### Production
- `express` — Web framework
- `mysql2` — MySQL driver
- `sequelize` — ORM
- `jsonwebtoken` — JWT authentication
- `bcryptjs` — Password hashing
- `dotenv` — Environment variables
- `cors` — Cross-Origin Resource Sharing
- `express-validator` — Input validation
- `swagger-jsdoc` — Swagger documentation
- `swagger-ui-express` — Swagger UI

### Development
- `nodemon` — Auto-restart server

---

## 🤝 Kontribusi

Project ini merupakan hasil penelitian skripsi dan **terbuka untuk kontribusi**. Jika ingin berkontribusi:

1. Fork repository ini
2. Buat branch baru (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

---

## 📄 Lisensi

Project ini dilisensikan di bawah **ISC License**. 

---

## 👤 Kontak

**Aisyah Nurhayati**
- 📧 Email: aisyah11hayati@gmail.com
- 🐙 GitHub: [@aisyahn2004](https://github.com/aisyahn2004)
- 🎓 Universitas Singaperbangsa Karawang

---


<p align="center">
  <b>⭐ Jika project ini bermanfaat, jangan lupa beri bintang! ⭐</b>
</p>

<p align="center">
  Dibuat dengan ❤️ untuk komunitas pembaca buku Indonesia
</p>