const express = require('express');
const router = express.Router();
const {
  createPrediction,
  getSessionPredictions,
  getMyPrediction,
} = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

// مسارات التوقعات
router.post('/', protect, createPrediction);
router.get('/session/:sessionId', protect, getSessionPredictions);
router.get('/my/:sessionId', protect, getMyPrediction);

module.exports = router;