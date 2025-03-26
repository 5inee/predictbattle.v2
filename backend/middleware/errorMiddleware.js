// ميدلوير للتعامل مع الأخطاء
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    console.error(`${err.message}\n${err.stack}`);
    
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  // ميدلوير للتعامل مع المسارات غير الموجودة
  const notFound = (req, res, next) => {
    const error = new Error(`المسار غير موجود - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  module.exports = { errorHandler, notFound };