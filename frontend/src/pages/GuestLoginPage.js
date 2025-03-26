import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Alert from '../components/layout/Alert';

const GuestLoginPage = () => {
  const { guestLogin, error, user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  
  // إذا كان المستخدم مسجل الدخول، توجيهه إلى لوحة التحكم
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);
  
  const onChange = (e) => {
    setUsername(e.target.value);
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await guestLogin(username);
    if (success) {
      navigate('/dashboard');
    }
  };
  
  if (isLoading) {
    return <div className="page">جاري التحميل...</div>;
  }

  return (
    <div className="page guest-login-page">
      <div className="logo">
        <i className="fas fa-bolt"></i>
        <span>PredictBattle</span>
      </div>
      
      <div className="card guest-login-card">
        <h1 className="page-title">الدخول كضيف</h1>
        
        {error && <Alert type="danger" message={error} />}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <i className="fas fa-user icon"></i>
              اسم المستخدم
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="اترك فارغاً لاستخدام اسم افتراضي"
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block">
            الدخول كضيف
          </button>
        </form>
        
        <Link to="/" className="btn btn-text">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default GuestLoginPage;