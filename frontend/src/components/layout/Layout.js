import React from 'react';
import Header from './Header';

const Layout = ({ children, showHeader = true, showFooter = true }) => {
  return (
    <div className="layout">
      {showHeader && <Header />}
      <main className="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;