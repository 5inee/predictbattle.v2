import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="page not-found-page">
        <div className="container">
          <div className="not-found-content">
            <h1 className="not-found-title">404</h1>
            <h2 className="not-found-subtitle">الصفحة غير موجودة</h2>
            <p className="not-found-message">
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
            </p>
            <Link to="/" className="btn btn-primary">
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;