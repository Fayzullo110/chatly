import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { 
  Home, 
  Chat, 
  Person, 
  Settings 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavigation = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/chat');
        break;
      case 2:
        navigate('/profile');
        break;
      case 3:
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  const getCurrentValue = () => {
    switch (location.pathname) {
      case '/':
        return 0;
      case '/chat':
        return 1;
      case '/profile':
        return 2;
      case '/settings':
        return 3;
      default:
        return 0;
    }
  };

  if (!user) {
    return null; // Don't show mobile nav for non-authenticated users
  }

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        display: { xs: 'block', md: 'none' }
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={getCurrentValue()}
        onChange={handleNavigation}
        sx={{
          background: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-selected': {
              color: 'white',
              '& .MuiBottomNavigationAction-label': {
                color: 'white',
              }
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '12px',
              fontWeight: 500,
              '&.Mui-selected': {
                color: 'white',
              }
            }
          }
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<Home />}
        />
        <BottomNavigationAction
          label="Chat"
          icon={<Chat />}
        />
        <BottomNavigationAction
          label="Profile"
          icon={<Person />}
        />
        <BottomNavigationAction
          label="Settings"
          icon={<Settings />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileNav; 