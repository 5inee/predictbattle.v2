import React from 'react';

const Loader = ({ size = 'medium', text = 'جاري التحميل...' }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: '30px', height: '30px' };
      case 'large':
        return { width: '60px', height: '60px' };
      default:
        return { width: '40px', height: '40px' };
    }
  };

  const loaderSize = getSize();

  return (
    <div className="loader-container">
      <div 
        className="loader" 
        style={{ 
          width: loaderSize.width, 
          height: loaderSize.height 
        }}
      ></div>
      {text && <div className="loader-text">{text}</div>}
    </div>
  );
};

export default Loader;