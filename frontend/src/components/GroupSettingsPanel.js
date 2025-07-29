import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Avatar, Switch, Typography, List, ListItem, ListItemAvatar, ListItemText, IconButton, Box, CircularProgress, Autocomplete
} from '@mui/material';
import { Delete, FileCopy, GroupAdd, Close } from '@mui/icons-material';
import axios from 'axios';

const GroupSettingsPanel = ({ open, onClose, group, currentUser, onGroupUpdated, onGroupDeleted }) => {
  const [name, setName] = useState(group?.name || '');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(group?.avatarUrl || '');
  const [isPublic, setIsPublic] = useState(group?.isPublic || false);
  const [members, setMembers] = useState([]);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setName(group?.name || '');
    setAvatarPreview(group?.avatarUrl || '');
    setIsPublic(group?.isPublic || false);
    fetchMembers();
  }, [group]);

  const fetchMembers = async () => {
    if (!group) return;
    try {
      const res = await axios.get(`/chatrooms/${group.id}/members`);
      setMembers(res.data);
    } catch {
      setMembers([]);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('isPublic', isPublic);
    if (avatar) formData.append('avatar', avatar);
    try {
      const res = await axios.patch(`/chatrooms/${group.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onGroupUpdated && onGroupUpdated(res.data);
      onClose();
    } catch {}
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/chatrooms/${group.id}`);
      onGroupDeleted && onGroupDeleted(group.id);
      onClose();
    } catch {}
    setDeleting(false);
  };

  const handleCopyInviteLink = async () => {
    setInviteLoading(true);
    try {
      const res = await axios.get(`/chatrooms/${group.id}/invite-link`);
      setInviteLink(res.data);
      await navigator.clipboard.writeText(res.data);
    } catch {}
    setInviteLoading(false);
  };

  const handleFetchUsers = async () => {
    try {
      const res = await axios.get('/users');
      setUsers(res.data);
    } catch {}
  };

  const handleInviteUsers = async () => {
    if (!selectedUsers.length) return;
    try {
      await axios.post(`/chatrooms/${group.id}/invite`, { userIds: selectedUsers.map(u => u.id) });
      fetchMembers();
      setSelectedUsers([]);
    } catch {}
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Group Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <input accept="image/*" style={{ display: 'none' }} id="group-avatar-upload" type="file" onChange={handleAvatarChange} />
          <label htmlFor="group-avatar-upload">
            <Avatar src={avatarPreview} sx={{ width: 56, height: 56, mr: 2, cursor: 'pointer' }} />
          </label>
          <TextField label="Group Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography>Public Group</Typography>
          <Switch checked={isPublic} onChange={e => setIsPublic(e.target.checked)} sx={{ ml: 1 }} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Members</Typography>
          <List dense>
            {members.map(m => (
              <ListItem key={m.id}>
                <ListItemAvatar><Avatar src={m.avatarUrl} /></ListItemAvatar>
                <ListItemText primary={m.username} />
              </ListItem>
            ))}
          </List>
        </Box>
        {isPublic ? (
          <Box sx={{ mb: 2 }}>
            <Button onClick={handleCopyInviteLink} startIcon={<FileCopy />} disabled={inviteLoading}>
              {inviteLoading ? <CircularProgress size={18} /> : 'Copy Invite Link'}
            </Button>
            {inviteLink && <Typography variant="body2" sx={{ mt: 1 }}>{inviteLink}</Typography>}
          </Box>
        ) : (
          <Box sx={{ mb: 2 }}>
            <Button onClick={handleFetchUsers} startIcon={<GroupAdd />}>Invite Users</Button>
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={option => option.username}
              value={selectedUsers}
              onChange={(e, v) => setSelectedUsers(v)}
              renderInput={params => <TextField {...params} label="Select users" margin="normal" />}
            />
            <Button onClick={handleInviteUsers} disabled={!selectedUsers.length}>Send Invites</Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<Close />}>Close</Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>Save</Button>
        <Button onClick={handleDelete} color="error" startIcon={<Delete />} disabled={deleting}>Delete Group</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupSettingsPanel; 