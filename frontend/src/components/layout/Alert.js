import React from 'react';

const Alert = ({ type, message }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type || 'info'}`}>
      {type === 'danger' && <i className="fas fa-exclamation-circle"></i>}
      {type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
      {type === 'success' && <i className="fas fa-check-circle"></i>}
      {type === 'info' && <i className="fas fa-info-circle"></i>}
      <span style={{ marginRight: '8px' }}>{message}</span>
    </div>
  );
};

export default Alert;