import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import Profile from './components/Profile';
import Settings from './components/Settings';
import VideoCallTest from './components/VideoCallTest';
import TestPage from './components/TestPage';
import Landing from './components/Landing';
import GroupCreatePage from './components/GroupCreatePage';
import { useAuth } from './contexts/AuthContext';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const location = useLocation();
  const theme = useTheme();
  return (
    <Box sx={{ background: theme.palette.background.default, minHeight: '100vh', width: '100vw' }}>
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
        <Route 
          path="/create-group" 
          element={
            <ProtectedRoute>
              <GroupCreatePage user={useAuth().user} />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Landing />} />
      </Routes>
    </Box>
  );
};

export default AppRoutes; 