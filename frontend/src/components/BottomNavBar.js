import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, useMediaQuery, useTheme } from '@mui/material';
import GroupRounded from '@mui/icons-material/GroupRounded';
import ChatIconMui from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BottomNavBar = ({ mainView, onNavChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Only show on mobile and when on chat page
  if (!isMobile || !location.pathname.startsWith('/chat')) {
    return null;
  }

  const getValue = () => {
    return mainView || 'chats';
  };

  const handleChange = (e, newValue) => {
    console.log('BottomNavBar: Changing to', newValue); // Debug log
    console.log('BottomNavBar: onNavChange function exists:', !!onNavChange); // Debug log
    if (onNavChange) {
      onNavChange(newValue);
      console.log('BottomNavBar: onNavChange called with', newValue); // Debug log
    }
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        borderRadius: 0,
        background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={getValue()}
        onChange={handleChange}
        showLabels
        sx={{ 
          background: 'transparent',
          height: 70,
          '& .MuiBottomNavigationAction-root': {
            color: theme.palette.text.secondary,
            minWidth: 'auto',
            padding: '6px 12px 8px',
            '&.Mui-selected': {
              color: '#1976d2',
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
              fontWeight: 500,
            },
          },
        }}
      >
        <BottomNavigationAction 
          label="Contacts" 
          value="contacts" 
          icon={<GroupRounded />} 
        />
        <BottomNavigationAction 
          label="Chats" 
          value="chats" 
          icon={<ChatIconMui />} 
        />
        <BottomNavigationAction 
          label="Settings" 
          value="settings" 
          icon={<AccountCircleIcon />} 
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavBar; 