import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="page"><div className="page-header">جاري التحميل...</div></div>;
  }

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;