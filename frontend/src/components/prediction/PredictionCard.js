import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import Avatar from '../common/Avatar';

const PredictionCard = ({ prediction }) => {
  const { user } = useContext(AuthContext);
  const { text, user: predictionUser, createdAt } = prediction;
  
  // تحقق مما إذا كان التوقع للمستخدم الحالي
  const isCurrentUser = predictionUser?._id === user?._id;
  
  // تنسيق التاريخ
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : 'غير معروف';

  // التحقق من وجود النص قبل تقسيمه، وإلا استخدم قيمة افتراضية
  const paragraphs = text ? text.split('\n').filter(p => p.trim() !== '') : ['توقع غير متاح'];

  return (
    <div className={`prediction-item ${isCurrentUser ? 'prediction-current-user' : ''}`}>
      <div className="prediction-header">
        <Avatar user={predictionUser} isCurrentUser={isCurrentUser} />
        <div className="prediction-user-info">
          <div className="prediction-user">
            {predictionUser?.username || 'مستخدم غير معروف'} 
            {isCurrentUser && <span className="current-user-badge">أنت</span>}
          </div>
          <div className="prediction-date">{formattedDate}</div>
        </div>
      </div>
      <div className="prediction-content">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <p key={index} className="prediction-paragraph">{paragraph}</p>
          ))
        ) : (
          <p className="prediction-paragraph">توقع غير متاح</p>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;