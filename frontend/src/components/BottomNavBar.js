import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SettingsIcon from '@mui/icons-material/Settings';

const BottomNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const getValue = () => {
    if (location.pathname.startsWith('/contacts')) return 'contacts';
    if (location.pathname.startsWith('/settings')) return 'settings';
    return 'chat';
  };
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, borderRadius: 0 }} elevation={8}>
      <BottomNavigation
        value={getValue()}
        onChange={(e, newValue) => {
          if (newValue === 'contacts') navigate('/contacts');
          if (newValue === 'chat') navigate('/chat');
          if (newValue === 'settings') navigate('/settings');
        }}
        showLabels
        sx={{ background: '#23262F', color: '#F5F6FA' }}
      >
        <BottomNavigationAction label="Contacts" value="contacts" icon={<PeopleIcon />} />
        <BottomNavigationAction label="Chats" value="chat" icon={<ChatBubbleIcon />} />
        <BottomNavigationAction label="Settings" value="settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavBar; 