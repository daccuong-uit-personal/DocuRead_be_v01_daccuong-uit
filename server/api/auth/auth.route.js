const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authMiddleware } = require('../../middleware/authMiddleware');

// Auth routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Route test token (ví dụ: /api/auth/profile)
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    success: true,
    code: 200,
    message: 'Token hợp lệ',
    data: req.user,
  });
});

module.exports = router;
