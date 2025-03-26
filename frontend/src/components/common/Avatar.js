import React from 'react';

// دالة لتوليد لون ثابت من نص (اسم المستخدم أو المعرّف)
export const generateColorFromString = (str) => {
  if (!str) return '#5e60ce'; // اللون الافتراضي إذا لم يكن هناك نص
  
  // دالة هاش بسيطة لتحويل النص إلى رقم
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // تحويل الرقم إلى لون مشبع وساطع مناسب للافاتار
  let hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 55%)`;
};

const Avatar = ({ user, size = 'medium', isCurrentUser = false }) => {
  const username = user?.username || '؟';
  const letter = username.charAt(0).toUpperCase();
  const userId = user?._id || '';
  
  // استخدام لون محدد للمستخدم الحالي، أو توليد لون من اسم المستخدم
  const backgroundColor = isCurrentUser 
    ? 'var(--primary-dark)' 
    : generateColorFromString(username || userId);
  
  // حجم الافاتار
  const getSize = () => {
    switch(size) {
      case 'small': return { width: '30px', height: '30px', fontSize: '12px' };
      case 'large': return { width: '60px', height: '60px', fontSize: '24px' };
      default: return { width: '40px', height: '40px', fontSize: '16px' };
    }
  };
  
  const avatarSize = getSize();
  
  return (
    <div 
      className="avatar" 
      style={{ 
        backgroundColor, 
        width: avatarSize.width, 
        height: avatarSize.height, 
        fontSize: avatarSize.fontSize 
      }}
    >
      {letter}
    </div>
  );
};

export default Avatar;