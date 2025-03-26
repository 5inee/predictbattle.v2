const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  createGuestUser,
  getUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// مسارات المستخدم
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/guest', createGuestUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;