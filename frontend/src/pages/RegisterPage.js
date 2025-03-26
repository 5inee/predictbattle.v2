import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Alert from '../components/layout/Alert';

const RegisterPage = () => {
  const { register, error, user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  
  const [passwordError, setPasswordError] = useState('');
  
  const { username, password, confirmPassword } = formData;
  
  // إذا كان المستخدم مسجل الدخول، توجيهه إلى لوحة التحكم
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // التحقق من تطابق كلمات المرور
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      if (e.target.name === 'confirmPassword' && e.target.value !== password) {
        setPasswordError('كلمات المرور غير متطابقة');
      } else if (e.target.name === 'password' && e.target.value !== confirmPassword && confirmPassword !== '') {
        setPasswordError('كلمات المرور غير متطابقة');
      } else {
        setPasswordError('');
      }
    }
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('كلمات المرور غير متطابقة');
      return;
    }
    
    const success = await register({ username, password });
    if (success) {
      navigate('/dashboard');
    }
  };
  
  if (isLoading) {
    return <div className="page">جاري التحميل...</div>;
  }

  return (
    <div className="page register-page">
      <div className="logo">
        <i className="fas fa-bolt"></i>
        <span>PredictBattle</span>
      </div>
      
      <div className="card register-card">
        <h1 className="page-title">إنشاء حساب</h1>
        
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <i className="fas fa-lock icon"></i>
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
            />
            {passwordError && <Alert type="danger" message={passwordError} />}
          </div>
          
          <button type="submit" className="btn btn-primary btn-block">
            إنشاء حساب
          </button>
        </form>
        
        <p className="register-links">
          لديك حساب بالفعل؟ <Link to="/login">اضغط هنا لتسجيل الدخول</Link>
        </p>
        
        <Link to="/" className="btn btn-text">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;