import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Alert from '../components/layout/Alert';

const LoginPage = () => {
  const { login, error, user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const { username, password } = formData;
  
  // إذا كان المستخدم مسجل الدخول، توجيهه إلى لوحة التحكم
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ username, password });
    if (success) {
      navigate('/dashboard');
    }
  };
  
  if (isLoading) {
    return <div className="page">جاري التحميل...</div>;
  }

  return (
    <div className="page login-page">
      <div className="logo">
        <i className="fas fa-bolt"></i>
        <span>PredictBattle</span>
      </div>
      
      <div className="card login-card">
        <h1 className="page-title">تسجيل الدخول</h1>
        
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
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <i className="fas fa-lock icon"></i>
              كلمة المرور
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block">
            تسجيل الدخول
          </button>
        </form>
        
        <p className="login-links">
          ليس لديك حساب؟ <Link to="/register">اضغط هنا لإنشاء حساب</Link>
        </p>
        
        <Link to="/" className="btn btn-text">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;