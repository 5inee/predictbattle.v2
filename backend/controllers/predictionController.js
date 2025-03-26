const Prediction = require('../models/predictionModel');
const Session = require('../models/sessionModel');

// @desc    إنشاء توقع جديد
// @route   POST /api/predictions
// @access  Private
const createPrediction = async (req, res) => {
  try {
    const { text, sessionId } = req.body;

    // التحقق من وجود الجلسة
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'الجلسة غير موجودة' });
    }

    // التحقق مما إذا كان المستخدم مشارك في الجلسة
    const isParticipant = session.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(401).json({ message: 'يجب أن تكون مشاركًا في الجلسة لإضافة توقع' });
    }

    // التحقق مما إذا كان المستخدم قد قدم توقعًا بالفعل
    const existingPrediction = await Prediction.findOne({
      session: sessionId,
      user: req.user._id,
    });
    if (existingPrediction) {
      return res.status(400).json({ message: 'لقد قمت بتقديم توقع بالفعل لهذه الجلسة' });
    }

    // إنشاء توقع جديد
    const prediction = await Prediction.create({
      text,
      session: sessionId,
      user: req.user._id,
    });

    if (prediction) {
      // التحقق من إذا تم تقديم جميع التوقعات للجلسة
      const predictionsCount = await Prediction.countDocuments({ session: sessionId });
      
      // إذا كان عدد التوقعات يساوي عدد اللاعبين الأقصى، نقوم بتحديث حالة الجلسة إلى "مكتملة"
      if (predictionsCount >= session.maxPlayers) {
        session.isComplete = true;
        await session.save();
      }
      
      res.status(201).json(prediction);
    } else {
      res.status(400).json({ message: 'بيانات التوقع غير صالحة' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    الحصول على توقعات جلسة
// @route   GET /api/predictions/session/:sessionId
// @access  Private
const getSessionPredictions = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    // التحقق من وجود الجلسة
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'الجلسة غير موجودة' });
    }

    // التحقق مما إذا كان المستخدم مشارك في الجلسة
    const isParticipant = session.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(401).json({ message: 'يجب أن تكون مشاركًا في الجلسة لعرض التوقعات' });
    }

    // التحقق من تقديم المستخدم لتوقع قبل عرض توقعات الآخرين
    const userPrediction = await Prediction.findOne({
      session: sessionId,
      user: req.user._id,
    });
    if (!userPrediction) {
      return res.status(400).json({ message: 'يجب تقديم توقعك أولاً قبل عرض توقعات الآخرين' });
    }

    // الحصول على جميع التوقعات للجلسة
    const predictions = await Prediction.find({ session: sessionId })
      .populate('user', 'username')
      .sort({ createdAt: 1 });

    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    الحصول على توقع المستخدم لجلسة معينة
// @route   GET /api/predictions/my/:sessionId
// @access  Private
const getMyPrediction = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    // التحقق من وجود الجلسة
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'الجلسة غير موجودة' });
    }

    // الحصول على توقع المستخدم
    const prediction = await Prediction.findOne({
      session: sessionId,
      user: req.user._id,
    });

    if (prediction) {
      res.json(prediction);
    } else {
      res.json(null); // لا يوجد توقع بعد
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    الحصول على عدد توقعات الجلسة
// @route   GET /api/predictions/session/:sessionId/count
// @access  Private
const getSessionPredictionsCount = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    // التحقق من وجود الجلسة
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'الجلسة غير موجودة' });
    }

    // التحقق مما إذا كان المستخدم مشارك في الجلسة
    const isParticipant = session.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(401).json({ message: 'يجب أن تكون مشاركًا في الجلسة للوصول إلى بياناتها' });
    }

    // الحصول على عدد التوقعات للجلسة
    const count = await Prediction.countDocuments({ session: sessionId });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPrediction,
  getSessionPredictions,
  getMyPrediction,
  getSessionPredictionsCount,
};