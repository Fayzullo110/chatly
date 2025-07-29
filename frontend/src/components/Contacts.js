import React from 'react';
import { Box, Button, Typography, Avatar } from '@mui/material';
import ChatIconMui from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';

const Contacts = ({ users, handleOpenNewChat, handleOpenNewGroup, onNav, mainView }) => (
  <Box sx={{ p: 4, pb: 10, position: 'relative' }}>
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Button
        variant="contained"
        startIcon={<ChatIconMui />}
        onClick={handleOpenNewChat}
      >
        New Chat
      </Button>
      <Button
        variant="outlined"
        startIcon={<GroupIcon />}
        onClick={handleOpenNewGroup}
      >
        New Group
      </Button>
    </Box>
    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Contacts</Typography>
    <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
      {users
        .slice()
        .sort((a, b) => (a.username || '').localeCompare(b.username || ''))
        .map((user) => (
          <Box key={user.id} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={user.avatarUrl ? `http://localhost:8080${user.avatarUrl}` : undefined} />
            <Typography>{user.username}</Typography>
          </Box>
        ))}
    </Box>

  </Box>
);

export default Contacts; 