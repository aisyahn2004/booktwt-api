const authService = require('../services/authService');

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to register user'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to login'
    });
  }
};