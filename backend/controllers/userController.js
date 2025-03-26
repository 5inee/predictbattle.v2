const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// إنشاء توكن JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    تسجيل مستخدم جديد
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // التحقق من وجود المستخدم
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'اسم المستخدم مستخدم بالفعل' });
    }

    // إنشاء مستخدم جديد
    const user = await User.create({
      username,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'بيانات المستخدم غير صالحة' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    تسجيل دخول مستخدم
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // البحث عن المستخدم
    const user = await User.findOne({ username });

    // التحقق من أن المستخدم ليس ضيفًا
    if (user && user.isGuest) {
      return res.status(401).json({ 
        message: 'هذا حساب ضيف، يرجى استخدام خيار "الدخول كضيف" بدلاً من ذلك' 
      });
    }

    // التحقق من وجود المستخدم وصحة كلمة المرور
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    إنشاء حساب ضيف
// @route   POST /api/users/guest
// @access  Public
const createGuestUser = async (req, res) => {
  try {
    const { username } = req.body;

    // إنشاء مستخدم ضيف جديد
    const user = await User.create({
      username: username || `ضيف_${Date.now().toString().slice(-6)}`,
      password: Date.now().toString(),
      isGuest: true,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        isGuest: true,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'فشل إنشاء حساب ضيف' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    الحصول على بيانات المستخدم
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        isGuest: user.isGuest,
      });
    } else {
      res.status(404).json({ message: 'المستخدم غير موجود' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  createGuestUser,
  getUserProfile,
};