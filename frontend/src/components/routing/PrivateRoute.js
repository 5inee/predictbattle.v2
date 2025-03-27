import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="page"><div className="page-header">جاري التحميل...</div></div>;
  }

  // تغيير المسار من '/login' إلى '/'
  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;