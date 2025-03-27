import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Avatar from '../common/Avatar';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    // التوجيه إلى الصفحة الرئيسية بدلاً من صفحة تسجيل الدخول
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="header">
      <Link to="/dashboard" className="logo-link">
        <div className="logo">
          <i className="fas fa-bolt"></i>
          <span>PredictBattle</span>
        </div>
      </Link>
      
      {user && (
        <div className="user-info">
          <span className="username">مرحباً، {user.username}</span>
          <div className="user-dropdown">
            <button 
              className="avatar-btn" 
              onClick={toggleDropdown} 
              aria-label="قائمة المستخدم"
            >
              <Avatar user={user} isCurrentUser={true} />
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/dashboard" className="dropdown-item">
                  <i className="fas fa-tachometer-alt"></i>
                  لوحة التحكم
                </Link>
                <Link to="/profile" className="dropdown-item">
                  <i className="fas fa-user"></i>
                  الملف الشخصي
                </Link>
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;