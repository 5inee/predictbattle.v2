import React, { useEffect } from 'react';

const Toast = ({ type = 'info', message, duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // تحديد الأيقونة بناءً على النوع
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="fas fa-check-circle"></i>;
      case 'error':
      case 'danger':
        return <i className="fas fa-exclamation-circle"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle"></i>;
      default:
        return <i className="fas fa-info-circle"></i>;
    }
  };

  return (
    <div className={`toast show toast-${type}`}>
      <div className="toast-header">
        {getIcon()}
        <span>{message}</span>
        <button className="toast-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Toast;