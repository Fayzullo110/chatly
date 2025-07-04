import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Divider,
  TextField,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Person as PersonIcon, Edit, AddAPhoto, Email, Lock, Language, Logout, FlutterDash } from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const fileInputRef = React.useRef();
  const [editMode, setEditMode] = React.useState(false);
  const [passwordMode, setPasswordMode] = React.useState(false);
  const [form, setForm] = React.useState({ username: '', email: '' });
  const [passwords, setPasswords] = React.useState({ newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = React.useState('');
  const [err, setErr] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Initialize form when user data is available
  React.useEffect(() => {
    if (user) {
      setForm({ 
        username: user.username || '', 
        email: user.email || '' 
      });
    }
  }, [user]);

  const handleAddPhotoClick = () => fileInputRef.current && fileInputRef.current.click();
  
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      setLoading(true);
      setErr('');
      try {
        const res = await axios.post('http://localhost:8080/profile/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.avatarUrl) {
          setUser({ ...user, avatarUrl: res.data.avatarUrl });
          setMsg('Avatar updated successfully!');
        }
      } catch (err) {
        setErr('Failed to upload avatar');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = () => setEditMode(true);
  
  const handleCancel = () => {
    setEditMode(false);
    setPasswordMode(false);
    setForm({ username: user?.username || '', email: user?.email || '' });
    setPasswords({ newPassword: '', confirmPassword: '' });
    setMsg(''); 
    setErr('');
  };
  
  const handleFormChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    console.log('Form changed:', e.target.name, '=', e.target.value);
    console.log('New form state:', newForm);
    setForm(newForm);
  };
  
  const handleSave = async () => {
    setMsg(''); 
    setErr('');
    setLoading(true);
    
    // Validate form data
    if (!form.username || form.username.trim() === '') {
      setErr('Username cannot be empty');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Sending profile update:', form);
      console.log('Current user:', user);
      
      const res = await axios.patch('http://localhost:8080/profile', form);
      console.log('Profile update response:', res.data);
      
      setUser({ ...user, ...res.data });
      setEditMode(false);
      setMsg('Profile updated successfully!');
    } catch (e) {
      console.error('Profile update error:', e);
      console.error('Error response:', e.response?.data);
      console.error('Error status:', e.response?.status);
      setErr(e.response?.data || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });
  
  const handleChangePassword = async () => {
    setMsg(''); 
    setErr('');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErr('Passwords do not match'); 
      return;
    }
    if (passwords.newPassword.length < 6) {
      setErr('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    try {
      await axios.patch('http://localhost:8080/profile/password', { newPassword: passwords.newPassword });
      setMsg('Password changed successfully!');
      setPasswords({ newPassword: '', confirmPassword: '' });
      setPasswordMode(false);
    } catch (e) {
      setErr(e.response?.data || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(-45deg, #2196f3 0%, #4facfe 50%, #1976d2 100%)',
      backgroundSize: '400% 400%',
      animation: `${gradientShift} 15s ease infinite`,
      position: 'relative',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'flex-start',
      px: isMobile ? 2 : 0
    }}>
      {/* Glassy Header */}
      <Box sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: isMobile ? 2 : { xs: 2, md: 6 },
        py: isMobile ? 1.5 : 2,
        mt: isMobile ? 1 : 2,
        mb: isMobile ? 2 : 4,
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255,255,255,0.10)',
        borderRadius: isMobile ? 2 : 4,
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.20)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2 }}>
          <Box sx={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
            borderRadius: '50%',
            p: isMobile ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            animation: `${pulse} 3s ease-in-out infinite`
          }}>
            <FlutterDash sx={{ fontSize: isMobile ? 20 : 24, color: 'white' }} />
          </Box>
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ 
            fontWeight: 700, 
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            display: { xs: 'none', sm: 'block' }
          }}>
            Profile
          </Typography>
        </Box>
        
        <Button
          onClick={handleLogout}
          startIcon={<Logout />}
          sx={{
            color: 'white',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            px: isMobile ? 1.5 : 2,
            py: isMobile ? 0.5 : 1,
            fontSize: isMobile ? '12px' : '14px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          {isMobile ? 'Logout' : 'Sign Out'}
        </Button>
      </Box>

      <Container maxWidth="md" sx={{ 
        position: 'relative', 
        zIndex: 2,
        px: isMobile ? 1 : 3
      }}>
        <Paper elevation={0} sx={{
          p: isMobile ? 3 : 6,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: isMobile ? 3 : 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          animation: `${pulse} 4s ease-in-out infinite`
        }}>
          {/* Avatar Section */}
          <Box sx={{ textAlign: 'center', mb: isMobile ? 3 : 4 }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={user.avatarUrl ? `http://localhost:8080${user.avatarUrl}` : undefined}
                sx={{
                  width: isMobile ? 120 : 150,
                  height: isMobile ? 120 : 150,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  animation: `${float} 6s ease-in-out infinite`
                }}
              >
                <PersonIcon sx={{ fontSize: isMobile ? 50 : 60, color: 'white' }} />
              </Avatar>
              
              <Tooltip title="Change Avatar">
                <IconButton
                  onClick={handleAddPhotoClick}
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <AddAPhoto sx={{ color: 'white', fontSize: isMobile ? 20 : 24 }} />
                </IconButton>
              </Tooltip>
            </Box>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
              fontWeight: 700, 
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 1
            }}>
              {user.username}
            </Typography>
            <Typography variant={isMobile ? "body1" : "h6"} sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              {user.email}
            </Typography>
          </Box>

          {/* Messages */}
          {msg && (
            <Alert severity="success" sx={{ mb: 3, background: 'rgba(76, 175, 80, 0.1)', color: 'white' }}>
              {msg}
            </Alert>
          )}
          {err && (
            <Alert severity="error" sx={{ mb: 3, background: 'rgba(244, 67, 54, 0.1)', color: 'white' }}>
              {err}
            </Alert>
          )}

          {/* Profile Form */}
          <Box sx={{ mb: isMobile ? 3 : 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant={isMobile ? "h6" : "h5"} sx={{ 
                color: 'white', 
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}>
                Profile Information
              </Typography>
              {!editMode && (
                <Button
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  sx={{
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    px: isMobile ? 1.5 : 2,
                    py: isMobile ? 0.5 : 1,
                    fontSize: isMobile ? '12px' : '14px',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {isMobile ? 'Edit' : 'Edit Profile'}
                </Button>
              )}
            </Box>

            {editMode ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleFormChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { border: 'none' },
                      '&.Mui-focused fieldset': { border: '2px solid rgba(255, 255, 255, 0.5)' }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.8)',
                      '&.Mui-focused': { color: 'white' }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': { color: 'rgba(255, 255, 255, 0.6)', opacity: 1 }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                    )
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { border: 'none' },
                      '&.Mui-focused fieldset': { border: '2px solid rgba(255, 255, 255, 0.5)' }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.8)',
                      '&.Mui-focused': { color: 'white' }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': { color: 'rgba(255, 255, 255, 0.6)', opacity: 1 }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <Email sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                    )
                  }}
                />

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                      flex: 1,
                      py: isMobile ? 1 : 1.5,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: 2,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: isMobile ? '14px' : '16px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    sx={{
                      flex: 1,
                      py: isMobile ? 1 : 1.5,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: isMobile ? '14px' : '16px',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: 2, 
                p: isMobile ? 2 : 3,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                  <Typography sx={{ color: 'white', fontWeight: 500 }}>
                    Username: {user.username}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                  <Typography sx={{ color: 'white', fontWeight: 500 }}>
                    Email: {user.email}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: isMobile ? 2 : 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Password Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant={isMobile ? "h6" : "h5"} sx={{ 
                color: 'white', 
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}>
                Security
              </Typography>
              {!passwordMode && (
                <Button
                  startIcon={<Lock />}
                  onClick={() => setPasswordMode(true)}
                  sx={{
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    px: isMobile ? 1.5 : 2,
                    py: isMobile ? 0.5 : 1,
                    fontSize: isMobile ? '12px' : '14px',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {isMobile ? 'Change' : 'Change Password'}
                </Button>
              )}
            </Box>

            {passwordMode ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { border: 'none' },
                      '&.Mui-focused fieldset': { border: '2px solid rgba(255, 255, 255, 0.5)' }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.8)',
                      '&.Mui-focused': { color: 'white' }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': { color: 'rgba(255, 255, 255, 0.6)', opacity: 1 }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <Lock sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                    )
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { border: 'none' },
                      '&.Mui-focused fieldset': { border: '2px solid rgba(255, 255, 255, 0.5)' }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.8)',
                      '&.Mui-focused': { color: 'white' }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': { color: 'rgba(255, 255, 255, 0.6)', opacity: 1 }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <Lock sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                    )
                  }}
                />

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    onClick={handleChangePassword}
                    disabled={loading}
                    sx={{
                      flex: 1,
                      py: isMobile ? 1 : 1.5,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: 2,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: isMobile ? '14px' : '16px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </Button>
                  <Button
                    onClick={() => setPasswordMode(false)}
                    sx={{
                      flex: 1,
                      py: isMobile ? 1 : 1.5,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: isMobile ? '14px' : '16px',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: 2, 
                p: isMobile ? 2 : 3,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Lock sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                  <Typography sx={{ color: 'white', fontWeight: 500 }}>
                    Password: ••••••••
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile; 