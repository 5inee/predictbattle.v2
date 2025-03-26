const express = require('express');
const router = express.Router();
const {
  createSession,
  joinSession,
  getSessionByCode,
  getMySessions,
  updateSessionStatus,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

// مسارات الجلسات
router.post('/', protect, createSession);
router.post('/join', protect, joinSession);
router.get('/code/:code', protect, getSessionByCode);
router.get('/my', protect, getMySessions);
router.put('/:id', protect, updateSessionStatus);

module.exports = router;