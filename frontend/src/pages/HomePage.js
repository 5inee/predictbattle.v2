import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // إذا كان المستخدم مسجل الدخول، توجيهه إلى لوحة التحكم
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="page">جاري التحميل...</div>;
  }

  return (
    <div className="page home-page">
      <div className="logo">
        <i className="fas fa-bolt"></i>
        <span>PredictBattle</span>
      </div>
      
      <div className="card welcome-card">
        <h1 className="page-title">مرحباً بك في PredictBattle</h1>
        <p className="welcome-description">
          منصة توقعات تفاعلية للمجموعات
        </p>
        
        <div className="action-buttons">
          <Link to="/login" className="btn btn-primary btn-block">
            تسجيل الدخول
          </Link>
          
          <Link to="/register" className="btn btn-secondary btn-block">
            إنشاء حساب
          </Link>
          
          <Link to="/guest" className="btn btn-text btn-block">
            الدخول كضيف
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;