import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import PrivateRoute from './components/routing/PrivateRoute';

// الصفحات
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GuestLoginPage from './pages/GuestLoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateSessionPage from './pages/CreateSessionPage';
import SessionPage from './pages/SessionPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/guest" element={<GuestLoginPage />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-session"
              element={
                <PrivateRoute>
                  <CreateSessionPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/session/:code"
              element={
                <PrivateRoute>
                  <SessionPage />
                </PrivateRoute>
              }
            />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;