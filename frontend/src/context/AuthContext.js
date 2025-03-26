import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // تعيين توكن في الهيدر وفي التخزين المحلي
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // تحميل بيانات المستخدم من الخادم
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`);
          setUser(res.data);
        } catch (err) {
          // حذف التوكن إذا كان غير صحيح
          setToken(null);
          setError('فشل في تحميل بيانات المستخدم، يرجى تسجيل الدخول مرة أخرى');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  // تسجيل مستخدم جديد
  const register = async (formData) => {
    try {
      setError(null);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, formData);
      setToken(res.data.token);
      setUser(res.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء التسجيل');
      return false;
    }
  };

  // تسجيل الدخول
  const login = async (formData) => {
    try {
      setError(null);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, formData);
      setToken(res.data.token);
      setUser(res.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
      return false;
    }
  };

  // الدخول كضيف
  const guestLogin = async (username) => {
    try {
      setError(null);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/guest`, { username });
      setToken(res.data.token);
      setUser(res.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء الدخول كضيف');
      return false;
    }
  };

  // تسجيل الخروج
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        register,
        login,
        guestLogin,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;