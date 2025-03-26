import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <i className="fas fa-bolt"></i>
        <span>PredictBattle</span>
      </div>
      {user && (
        <div className="user-info">
          <span className="username">مرحباً، {user.username}</span>
          <button className="btn btn-text" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> تسجيل الخروج
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;