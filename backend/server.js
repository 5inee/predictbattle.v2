const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// تحميل متغيرات البيئة
dotenv.config();

// إنشاء تطبيق Express
const app = express();

// الإعدادات الأساسية
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('تم الاتصال بقاعدة البيانات MongoDB بنجاح'))
  .catch(err => console.error('خطأ في الاتصال بقاعدة البيانات:', err));

// استيراد المسارات
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

// استخدام المسارات
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/predictions', predictionRoutes);

// إعداد للإنتاج
if (process.env.NODE_ENV === 'production') {
  // استخدام ملفات الفرونت إند المبنية
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// تعريف المنفذ
const PORT = process.env.PORT || 5000;

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});