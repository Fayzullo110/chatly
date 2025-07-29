import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Avatar, Box, Typography, Autocomplete, CircularProgress } from '@mui/material';
import axios from 'axios';

const GroupCreatePage = ({ user }) => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [groupAvatarPreview, setGroupAvatarPreview] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8080/users');
        setUsers(res.data);
      } catch {
        setError('Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  const handleGroupAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupAvatar(file);
      setGroupAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateGroup = async () => {
    setError('');
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }
    setLoading(true);
    let attempt = 0;
    let maxAttempts = 3;
    let lastError = '';
    let finalGroupName = groupName;
    while (attempt < maxAttempts) {
      try {
        let userIds = selectedUsers.map(u => typeof u === 'object' && u !== null ? u.id : u).filter(id => typeof id === 'number' && id !== user.id);
        userIds = [user.id, ...userIds];
        userIds = Array.from(new Set(userIds));
        const formData = new FormData();
        formData.append('name', finalGroupName);
        userIds.forEach(id => formData.append('userIds', id));
        if (groupAvatar) formData.append('avatar', groupAvatar);
        const res = await axios.post('http://localhost:8080/chatrooms/group', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        navigate(`/chat/${res.data.id}`);
        setLoading(false);
        return;
      } catch (e) {
        lastError = e.response?.data?.error || 'Failed to create group';
        if (lastError.includes('already exists')) {
          // Try a new name
          finalGroupName = `${groupName}_${Date.now()}`;
          attempt++;
        } else {
          break;
        }
      }
    }
    setError(lastError || 'Failed to create group');
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 6, p: 3, boxShadow: 3, borderRadius: 3, background: 'white' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Create New Group</Typography>
      <TextField
        fullWidth
        label="Group Name"
        value={groupName}
        onChange={e => setGroupName(e.target.value)}
        margin="normal"
      />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="group-avatar-upload"
          type="file"
          onChange={handleGroupAvatarChange}
        />
        <label htmlFor="group-avatar-upload">
          <Button variant="outlined" component="span">
            Upload Avatar
          </Button>
        </label>
        {groupAvatarPreview && (
          <Avatar src={groupAvatarPreview} sx={{ ml: 2, width: 48, height: 48 }} />
        )}
      </Box>
      <Autocomplete
        multiple
        options={users.filter(u => u.id !== user?.id)}
        getOptionLabel={option => option.username}
        value={selectedUsers}
        onChange={(event, newValue) => setSelectedUsers(newValue)}
        renderInput={params => <TextField {...params} label="Select members (optional)" fullWidth margin="normal" />}
      />
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
        onClick={handleCreateGroup}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Create Group'}
      </Button>
      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 2, py: 1.5, fontWeight: 600 }}
        onClick={() => navigate('/chat')}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default GroupCreatePage; 