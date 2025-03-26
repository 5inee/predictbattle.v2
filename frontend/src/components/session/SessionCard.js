import React from 'react';
import { Link } from 'react-router-dom';

const SessionCard = ({ session }) => {
  const { _id, title, code, isComplete, participants, createdAt, creator, maxPlayers } = session;
  
  // تنسيق التاريخ
  const formattedDate = new Date(createdAt).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // حساب النسبة المئوية للمشاركين
  const participationPercentage = Math.round((participants.length / maxPlayers) * 100);

  return (
    <div className="card session-card">
      <div className="session-status-badge">
        {isComplete ? (
          <span className="badge badge-success">
            <i className="fas fa-check-circle"></i> مكتملة
          </span>
        ) : (
          <span className="badge badge-warning">
            <i className="fas fa-hourglass-half"></i> جارية
          </span>
        )}
      </div>
      
      <h3 className="session-title">{title}</h3>
      
      <div className="session-info">
        <div className="session-details">
          <p>
            <i className="fas fa-key icon"></i>
            كود الجلسة: <strong>{code}</strong>
          </p>
          <p>
            <i className="fas fa-calendar-alt icon"></i>
            التاريخ: {formattedDate}
          </p>
          <p>
            <i className="fas fa-users icon"></i>
            المشاركين: {participants.length} / {maxPlayers}
          </p>
          <p>
            <i className="fas fa-user icon"></i>
            المنشئ: {creator?.username || 'غير معروف'}
          </p>
        </div>
      </div>
      
      <div className="participation-progress">
        <div className="progress-label">
          <span>نسبة المشاركة</span>
          <span>{participationPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${participationPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="session-actions">
        <Link to={`/session/${code}`} className="btn btn-primary btn-block">
          <i className="fas fa-sign-in-alt"></i>
          {isComplete ? 'عرض النتائج' : 'الانضمام للجلسة'}
        </Link>
      </div>
    </div>
  );
};

export default SessionCard;