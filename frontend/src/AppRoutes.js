import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import Profile from './components/Profile';
import Settings from './components/Settings';
import VideoCallTest from './components/VideoCallTest';
import TestPage from './components/TestPage';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const location = useLocation();
  return (
    <>
      {!["/", "/login", "/register", "/profile", "/settings"].includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/video-test" 
          element={
            <ProtectedRoute>
              <VideoCallTest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/test" 
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Landing />} />
      </Routes>
    </>
  );
};

export default AppRoutes; 