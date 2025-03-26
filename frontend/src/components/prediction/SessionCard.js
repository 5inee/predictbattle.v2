import React from 'react';
import { Link } from 'react-router-dom';

const SessionCard = ({ session }) => {
  const { _id, title, code, isComplete, participants, createdAt, creator } = session;
  
  // تنسيق التاريخ
  const formattedDate = new Date(createdAt).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="card session-card">
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
            المشاركين: {participants.length}
          </p>
          <p>
            <i className="fas fa-user icon"></i>
            المنشئ: {creator?.username || 'غير معروف'}
          </p>
          <p>
            <i className={`fas ${isComplete ? 'fa-check-circle' : 'fa-hourglass-half'} icon`}></i>
            الحالة: {isComplete ? 'مكتملة' : 'جارية'}
          </p>
        </div>
      </div>
      <Link to={`/session/${code}`} className="btn btn-primary btn-block">
        عرض التفاصيل
      </Link>
    </div>
  );
};

export default SessionCard;