const Session = require('../models/sessionModel');
const Prediction = require('../models/predictionModel');

// @desc    إنشاء جلسة جديدة
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res) => {
  try {
    const { title, maxPlayers, secretCode } = req.body;

    // التحقق من الرمز السري
    if (secretCode !== '021') {
      return res.status(401).json({ message: 'الرمز السري غير صحيح' });
    }

    // إنشاء كود جلسة عشوائي
    const code = Session.generateSessionCode();

    // إنشاء جلسة جديدة
    const session = await Session.create({
      title,
      code,
      maxPlayers,
      creator: req.user._id,
      participants: [{ user: req.user._id }],
    });

    if (session) {
      res.status(201).json(session);
    } else {
      res.status(400).json({ message: 'بيانات الجلسة غير صالحة' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    الانضمام إلى جلسة
// @route   POST /api/sessions/join
// @access  Private
const joinSession = async (req, res) => {
  try {
    const { code } = req.body;

    // البحث عن الجلسة
    const session = await Session.findOne({ code });

    if (!session) {
      return res.status(404).json({ message: 'الجلسة غير موجودة' });
    }

    // التحقق مما إذا كان المستخدم منضم بالفعل
    const isParticipant = session.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );

    // إذا كان المستخدم منضم بالفعل، نسمح له بالعودة إلى الجلسة
    if (isParticipant) {
      return res.json(session);
    }

    // التحقق مما إذا كانت الجلسة ممتلئة للمستخدمين الجدد فقط
    if (session.participants.length >= session.maxPlayers) {
      return res.status(400).json({ message: 'الجلسة ممتلئة' });
    }

    // إضافة المستخدم الجديد إلى الجلسة
    session.participants.push({ user: req.user._id });
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    الحصول على جلسة بواسطة الكود
// @route   GET /api/sessions/:code
// @access  Private
const getSessionByCode = async (req, res) => {
  try {
    const session = await Session.findOne({ code: req.params.code })
      .populate('participants.user', 'username')
      .populate('creator', 'username');

    if (!session) {
      return res.status(404).json({ message: 'الجلسة غير موجودة' });
    }

    // التحقق من حالة الجلسة بناءً على عدد التوقعات
    const predictionsCount = await Prediction.countDocuments({ session: session._id });
    
    // تحديث حالة الجلسة إذا كان عدد التوقعات يساوي أو أكبر من عدد اللاعبين الأقصى
    if (predictionsCount >= session.maxPlayers && !session.isComplete) {
      session.isComplete = true;
      await session.save();
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    الحصول على جلسات المستخدم
// @route   GET /api/sessions/my
// @access  Private
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      'participants.user': req.user._id,
    })
      .populate('creator', 'username')
      .sort({ createdAt: -1 });

    // تحديث حالة كل جلسة بناءً على عدد التوقعات
    for (const session of sessions) {
      const predictionsCount = await Prediction.countDocuments({ session: session._id });
      
      // تحديث حالة الجلسة إذا كان عدد التوقعات يساوي أو أكبر من عدد اللاعبين الأقصى
      if (predictionsCount >= session.maxPlayers && !session.isComplete) {
        session.isComplete = true;
        await session.save();
      }
    }

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    تحديث حالة الجلسة
// @route   PUT /api/sessions/:id
// @access  Private
const updateSessionStatus = async (req, res) => {
  try {
    const { isComplete } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'الجلسة غير موجودة' });
    }

    // التحقق من أن المستخدم هو منشئ الجلسة
    if (session.creator.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'غير مصرح لك بتحديث الجلسة' });
    }

    session.isComplete = isComplete;
    const updatedSession = await session.save();

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSession,
  joinSession,
  getSessionByCode,
  getMySessions,
  updateSessionStatus,
};