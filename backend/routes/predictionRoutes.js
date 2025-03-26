const express = require('express');
const router = express.Router();
const {
  createPrediction,
  getSessionPredictions,
  getMyPrediction,
  getSessionPredictionsCount,
} = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

// مسارات التوقعات
router.post('/', protect, createPrediction);
router.get('/session/:sessionId', protect, getSessionPredictions);
router.get('/session/:sessionId/count', protect, getSessionPredictionsCount);
router.get('/my/:sessionId', protect, getMyPrediction);

module.exports = router;