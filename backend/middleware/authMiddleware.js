const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  // التحقق من وجود توكن في الهيدر
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // الحصول على التوكن من الهيدر
      token = req.headers.authorization.split(' ')[1];

      // فك تشفير التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // الحصول على بيانات المستخدم باستثناء كلمة المرور
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'غير مصرح، التوكن غير صالح' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'غير مصرح، لا يوجد توكن' });
  }
};

module.exports = { protect };