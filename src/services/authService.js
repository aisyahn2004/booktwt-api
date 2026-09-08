// src/services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');  

const authService = {
  register: async ({ name, email, password }) => {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({  
      where: { email }
    });
    
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profile_picture: user.profile_picture,
        created_at: user.created_at
      }
    };
  },

  login: async ({ email, password }) => {
    // Cari user berdasarkan email
    const user = await User.findOne({  // ← User bisa dipakai
      where: { email }
    });

    if (!user) {
      const error = new Error('Email not registered');
      error.statusCode = 404;
      throw error;
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profile_picture: user.profile_picture,
        created_at: user.created_at
      }
    };
  },

  getUserById: async (userId) => {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  },

  updateProfile: async (userId, { name, bio, profile_picture }) => {
    const user = await User.findByPk(userId);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (profile_picture) updates.profile_picture = profile_picture;

    await user.update(updates);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profile_picture: user.profile_picture,
      updated_at: user.updated_at
    };
  }
};

module.exports = authService;