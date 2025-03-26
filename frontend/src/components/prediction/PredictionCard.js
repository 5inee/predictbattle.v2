import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const PredictionCard = ({ prediction }) => {
  const { user } = useContext(AuthContext);
  const { text, user: predictionUser, createdAt } = prediction;
  
  // تحقق مما إذا كان التوقع للمستخدم الحالي
  const isCurrentUser = predictionUser?._id === user?._id;
  
  // استخراج الحرف الأول من اسم المستخدم للصورة الرمزية
  const avatarLetter = predictionUser?.username?.charAt(0) || '؟';
  
  // تنسيق التاريخ
  const formattedDate = new Date(createdAt).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="prediction-item">
      <div className="prediction-header">
        <div className="avatar">{avatarLetter}</div>
        <div className="prediction-user">
          {predictionUser?.username || 'مستخدم غير معروف'} 
          {isCurrentUser && <span className="current-user"> (أنت)</span>}
        </div>
        <div className="prediction-date">{formattedDate}</div>
      </div>
      <div className="prediction-text">{text}</div>
    </div>
  );
};

export default PredictionCard;