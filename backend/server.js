const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// تحميل متغيرات البيئة
dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

// إنشاء تطبيق Express
const app = express();

// الإعدادات الأساسية
app.use(cors());
app.use(express.json());

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
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// ميدلوير التعامل مع الأخطاء
app.use(notFound);
app.use(errorHandler);

// تعريف المنفذ
const PORT = process.env.PORT || 5000;

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل في بيئة ${process.env.NODE_ENV} على المنفذ ${PORT}`);
});