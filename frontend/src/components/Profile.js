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
  useMediaQuery,
  Chip,
  Badge,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Edit, 
  AddAPhoto, 
  Email, 
  Lock, 
  Language, 
  Logout, 
  FlutterDash,
  Visibility,
  VisibilityOff,
  Public,
  Group,
  Block,
  Security,
  DataUsage,
  CalendarToday,
  Message,
  PhotoCamera,
  Crop,
  FilterAlt,
  Save,
  Cancel,
  CheckCircle,
  Warning,
  Info,
  LocationOn,
  Work,
  School,
  Link,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub
} from '@mui/icons-material';
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
  const [form, setForm] = React.useState({ 
    username: '', 
    email: '',
    bio: '',
    location: '',
    website: '',
    company: '',
    position: ''
  });
  const [passwords, setPasswords] = React.useState({ newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = React.useState('');
  const [err, setErr] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  const [privacySettings, setPrivacySettings] = React.useState({
    profileVisibility: 'everyone',
    onlineStatus: 'everyone',
    lastSeen: 'everyone',
    allowFriendRequests: true,
    showEmail: false,
    showLocation: false
  });
  const [socialLinks, setSocialLinks] = React.useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    github: ''
  });

  // Initialize form when user data is available
  React.useEffect(() => {
    if (user) {
      setForm({ 
        username: user.username || '', 
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        company: user.company || '',
        position: user.position || ''
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



  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && children}
    </div>
  );

  const handlePrivacyChange = (setting) => (event) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: event.target.checked !== undefined ? event.target.checked : event.target.value
    }));
  };

  const handleSocialChange = (platform) => (event) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: event.target.value
    }));
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
          {/* Tabs */}
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              mb: 4,
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-selected': {
                  color: 'white',
                  fontWeight: 600
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#2196f3'
              }
            }}
          >
            <Tab icon={<PersonIcon />} label="Profile" />
            <Tab icon={<Security />} label="Privacy" />
            <Tab icon={<Link />} label="Social" />
            <Tab icon={<DataUsage />} label="Stats" />
          </Tabs>
          {/* Profile Tab */}
          <TabPanel value={activeTab} index={0}>
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

                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={3}
                  value={form.bio}
                  onChange={handleFormChange}
                  placeholder="Tell us about yourself..."
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
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={form.location}
                      onChange={handleFormChange}
                      InputProps={{
                        startAdornment: (
                          <LocationOn sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                        )
                      }}
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      name="website"
                      value={form.website}
                      onChange={handleFormChange}
                      InputProps={{
                        startAdornment: (
                          <Link sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                        )
                      }}
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      name="company"
                      value={form.company}
                      onChange={handleFormChange}
                      InputProps={{
                        startAdornment: (
                          <Work sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                        )
                      }}
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Position"
                      name="position"
                      value={form.position}
                      onChange={handleFormChange}
                      InputProps={{
                        startAdornment: (
                          <School sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                        )
                      }}
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
                    />
                  </Grid>
                </Grid>

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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                  <Typography sx={{ color: 'white', fontWeight: 500 }}>
                    Email: {user.email}
                  </Typography>
                </Box>
                {user.bio && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' }}>
                      "{user.bio}"
                    </Typography>
                  </Box>
                )}
                <Grid container spacing={2}>
                  {user.location && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1, fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {user.location}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {user.company && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Work sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1, fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {user.company}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
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
          </TabPanel>

          {/* Privacy Tab */}
          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>Privacy Settings</Typography>
            
            <List sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2, mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <Visibility sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Profile Visibility" 
                  secondary="Who can see your profile"
                  sx={{ 
                    '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                    '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
                <ListItemSecondaryAction>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={privacySettings.profileVisibility}
                      onChange={handlePrivacyChange('profileVisibility')}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                        '& .MuiSvgIcon-root': { color: 'white' }
                      }}
                    >
                      <MenuItem value="everyone">Everyone</MenuItem>
                      <MenuItem value="contacts">Contacts</MenuItem>
                      <MenuItem value="none">Nobody</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Visibility sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Online Status" 
                  secondary="Who can see when you're online"
                  sx={{ 
                    '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                    '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
                <ListItemSecondaryAction>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={privacySettings.onlineStatus}
                      onChange={handlePrivacyChange('onlineStatus')}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                        '& .MuiSvgIcon-root': { color: 'white' }
                      }}
                    >
                      <MenuItem value="everyone">Everyone</MenuItem>
                      <MenuItem value="contacts">Contacts</MenuItem>
                      <MenuItem value="none">Nobody</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Group sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Allow Friend Requests" 
                  secondary="Let others send you friend requests"
                  sx={{ 
                    '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                    '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={privacySettings.allowFriendRequests}
                    onChange={handlePrivacyChange('allowFriendRequests')}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#2196f3',
                        '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.08)' },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#2196f3',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </TabPanel>

          {/* Social Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>Social Links</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Facebook"
                  value={socialLinks.facebook}
                  onChange={handleSocialChange('facebook')}
                  InputProps={{
                    startAdornment: <Facebook sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                  }}
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Twitter"
                  value={socialLinks.twitter}
                  onChange={handleSocialChange('twitter')}
                  InputProps={{
                    startAdornment: <Twitter sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                  }}
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Instagram"
                  value={socialLinks.instagram}
                  onChange={handleSocialChange('instagram')}
                  InputProps={{
                    startAdornment: <Instagram sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                  }}
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={socialLinks.linkedin}
                  onChange={handleSocialChange('linkedin')}
                  InputProps={{
                    startAdornment: <LinkedIn sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                  }}
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
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Stats Tab */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>Account Statistics</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CalendarToday sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>30</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Days Active</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Message sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>1,247</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Messages Sent</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Group sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>45</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Friends</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <PhotoCamera sx={{ fontSize: 40, color: '#e91e63', mb: 1 }} />
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>12</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Photos Shared</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile; 