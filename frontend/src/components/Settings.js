import React, { useState, useContext } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Slider,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Notifications,
  NotificationsOff,
  VolumeUp,
  VolumeOff,
  DarkMode,
  LightMode,
  Language,
  Security,
  Storage,
  Info,
  Close,
  Save,
  Palette,
  Accessibility,
  Speed,
  Visibility,
  VisibilityOff,
  Download,
  Upload,
  Delete,
  Keyboard,
  AutoAwesome,
  PrivacyTip,
  DataUsage,
  AccountCircle,
  Block,
  Report,
  Help,
  Feedback,
  BugReport,
  ExpandMore,
  CheckCircle,
  Warning,
  Settings as SettingsIcon,
  NotificationsActive,
  NotificationsNone,
  NotificationsPaused,
  Message,
  Phone,
  Email,
  Public,
  Lock,
  Group,
  Edit,
  Person,
  Verified,
  Star,
  Favorite,
  TrendingUp,
  Logout,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeContext';
import Profile from './Profile';

// Keyframe animations
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const Settings = ({ onClose, isEmbedded = false }) => {
  const { user, logout } = useAuth();
  const { mode, setThemeMode } = useThemeMode();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    pushNotifications: true,
    soundNotifications: true,
    emailNotifications: false,
    messagePreview: true,
    typingIndicators: true,
    readReceipts: true,
    
    // Privacy
    onlineStatus: 'everyone', // everyone, contacts, none
    lastSeen: 'everyone', // everyone, contacts, none
    profileVisibility: 'everyone', // everyone, contacts, none
    allowFriendRequests: true,
    
    // Appearance
    theme: mode,
    fontSize: 'medium', // small, medium, large
    compactMode: false,
    showAvatars: true,
    
    // Performance
    autoSave: true,
    performanceMode: 'balanced', // low, balanced, high
    dataUsage: 'standard', // low, standard, high
    cacheSize: 100, // MB
    
    // Accessibility
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    keyboardShortcuts: true
  });

  const [volume, setVolume] = useState(70);
  const [language, setLanguage] = useState('English');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked !== undefined ? event.target.checked : event.target.value
    }));
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleResetSettings = () => {
    setSettings({
      pushNotifications: true,
      soundNotifications: true,
      emailNotifications: false,
      messagePreview: true,
      typingIndicators: true,
      readReceipts: true,
      onlineStatus: 'everyone',
      lastSeen: 'everyone',
      profileVisibility: 'everyone',
      allowFriendRequests: true,
      theme: 'dark',
      fontSize: 'medium',
      compactMode: false,
      showAvatars: true,
      autoSave: true,
      performanceMode: 'balanced',
      dataUsage: 'standard',
      cacheSize: 100,
      highContrast: false,
      reduceMotion: false,
      screenReader: false,
      keyboardShortcuts: true
    });
    setVolume(70);
    setLanguage('English');
    setShowResetDialog(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExportSettings = () => {
    const settingsData = {
      settings,
      volume,
      language,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flamegram-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  const handleClearData = () => {
    // Clear local storage, cache, etc.
    localStorage.clear();
    sessionStorage.clear();
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    setShowClearDataDialog(false);
  };

  const handleProfileClick = () => {
    setShowProfileEditor(true);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && children}
    </div>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(-45deg, #2196f3 0%, #4facfe 50%, #1976d2 100%)',
      backgroundSize: '400% 400%',
      animation: `${gradientShift} 15s ease infinite`,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      pt: isMobile ? 2 : 4,
      px: isMobile ? 2 : 0,
      height: '100vh',
      overflowY: 'auto',
    }}>


      <Container maxWidth="lg" sx={{ 
        position: 'relative', 
        zIndex: 2,
        mt: isMobile ? 2 : 4,
        px: isMobile ? 1 : 3
      }}>
        {/* User Info Card */}
        <Paper 
          elevation={0}
          onClick={handleProfileClick}
          sx={{
            p: isMobile ? 3 : 4,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            animation: `${slideIn} 0.5s ease-out`,
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              transition: 'left 0.6s',
            },
            '&:hover': {
              transform: 'translateY(-4px) scale(1.02)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
              '&::before': {
                left: '100%',
              },
              '& .edit-icon': {
                opacity: 1,
                transform: 'translateX(0)',
              }
            }
          }}
        >
          {/* Edit Icon Overlay */}
          <Box
            className="edit-icon"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              opacity: 0,
              transform: 'translateX(10px)',
              transition: 'all 0.3s ease',
              zIndex: 2
            }}
          >
            <Box sx={{
              background: 'rgba(33, 150, 243, 0.9)',
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Edit sx={{ fontSize: 16, color: 'white' }} />
            </Box>
          </Box>

          {/* Avatar with enhanced styling */}
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4caf50, #45a049)',
                border: '3px solid rgba(255,255,255,0.9)',
                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'white',
                  animation: `${pulse} 2s ease-in-out infinite`
                }} />
              </Box>
            }
          >
            <Avatar 
              src={user?.avatarUrl ? `http://localhost:8080${user.avatarUrl}` : undefined} 
              sx={{ 
                width: 80, 
                height: 80, 
                fontSize: 32, 
                background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                border: '3px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 24px rgba(33, 150, 243, 0.4)'
                }
              }}
            >
              {user?.username ? user.username[0].toUpperCase() : '?'}
            </Avatar>
          </Badge>

          {/* User Info with enhanced styling */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h5" sx={{ 
                color: 'white', 
                fontWeight: 800,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '-0.5px'
              }}>
                {user?.username || 'Your Name'}
              </Typography>
              <Verified sx={{ 
                fontSize: 20, 
                color: '#2196f3',
                filter: 'drop-shadow(0 1px 2px rgba(33, 150, 243, 0.3))'
              }} />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Email sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
              <Typography variant="body2" sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 500
              }}>
                {user?.email || 'Your Email'}
              </Typography>
            </Box>

            {/* Enhanced status chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                icon={<TrendingUp sx={{ fontSize: 16 }} />}
                label="Online" 
                size="small" 
                sx={{ 
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))',
                  color: '#4caf50',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  '& .MuiChip-icon': {
                    color: '#4caf50'
                  }
                }} 
              />
              <Chip 
                icon={<Star sx={{ fontSize: 16 }} />}
                label="Premium" 
                size="small" 
                sx={{ 
                  background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.1))',
                  color: '#ffc107',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  '& .MuiChip-icon': {
                    color: '#ffc107'
                  }
                }} 
              />
            </Box>
          </Box>

          {/* Sparkles decoration */}
          <Box sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            opacity: 0.6,
            animation: `${pulse} 3s ease-in-out infinite`
          }}>
            <AutoAwesomeIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.4)' }} />
          </Box>
        </Paper>

        {/* Tabs */}
        <Paper elevation={2} sx={{ 
          mb: 4, 
          borderRadius: 4, 
          background: 'rgba(255,255,255,0.07)',
          overflow: 'hidden'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              background: 'rgba(255,255,255,0.05)',
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
            <Tab icon={<Notifications />} label="Notifications" />
            <Tab icon={<PrivacyTip />} label="Privacy" />
            <Tab icon={<Palette />} label="Appearance" />
            <Tab icon={<Speed />} label="Performance" />
            <Tab icon={<Accessibility />} label="Accessibility" />
            <Tab icon={<DataUsage />} label="Data" />
          </Tabs>

          <Box sx={{ p: isMobile ? 2 : 4 }}>
            {/* Notifications Tab */}
            <TabPanel value={activeTab} index={0}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>Notification Preferences</Typography>
              
              <List sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2, mb: 3 }}>
                <ListItem>
                  <ListItemIcon>
                    {settings.pushNotifications ? <NotificationsActive sx={{ color: 'white' }} /> : <NotificationsNone sx={{ color: 'white' }} />}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Push Notifications" 
                    secondary="Receive notifications for new messages"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={handleSettingChange('pushNotifications')}
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
                
                <ListItem>
                  <ListItemIcon>
                    {settings.soundNotifications ? <VolumeUp sx={{ color: 'white' }} /> : <VolumeOff sx={{ color: 'white' }} />}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Sound Notifications" 
                    secondary="Play sounds for new messages"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.soundNotifications}
                      onChange={handleSettingChange('soundNotifications')}
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

                <ListItem>
                  <ListItemIcon>
                    <Email sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Notifications" 
                    secondary="Receive email notifications"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={handleSettingChange('emailNotifications')}
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

                <ListItem>
                  <ListItemIcon>
                    <Message sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Message Preview" 
                    secondary="Show message content in notifications"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.messagePreview}
                      onChange={handleSettingChange('messagePreview')}
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

              {settings.soundNotifications && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    Volume Level
                  </Typography>
                  <Slider
                    value={volume}
                    onChange={handleVolumeChange}
                    aria-labelledby="volume-slider"
                    sx={{
                      color: '#2196f3',
                      '& .MuiSlider-thumb': { backgroundColor: '#2196f3' },
                      '& .MuiSlider-track': { backgroundColor: '#2196f3' },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Quiet</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Loud</Typography>
                  </Box>
                </Box>
              )}
            </TabPanel>

            {/* Privacy Tab */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>Privacy & Security</Typography>
              
              <List sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2, mb: 3 }}>
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
                        value={settings.onlineStatus}
                        onChange={handleSettingChange('onlineStatus')}
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
                    primary="Last Seen" 
                    secondary="Who can see when you were last online"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={settings.lastSeen}
                        onChange={handleSettingChange('lastSeen')}
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
                    <CheckCircle sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Read Receipts" 
                    secondary="Show when you've read messages"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.readReceipts}
                      onChange={handleSettingChange('readReceipts')}
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

                <ListItem>
                  <ListItemIcon>
                    <Group sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Friend Requests" 
                    secondary="Allow others to send you friend requests"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.allowFriendRequests}
                      onChange={handleSettingChange('allowFriendRequests')}
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

            {/* Appearance Tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>Appearance & Theme</Typography>
              
              <List sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2, mb: 3 }}>
                <ListItem>
                  <ListItemIcon>
                    {mode === 'dark' ? <DarkMode sx={{ color: 'white' }} /> : <LightMode sx={{ color: 'white' }} />}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Theme Mode" 
                    secondary={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      onClick={() => setThemeMode(mode === 'dark' ? 'light' : 'dark')}
                      variant="outlined"
                      size="small"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.3)',
                        '&:hover': {
                          borderColor: 'white',
                          background: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      {mode === 'dark' ? 'Light' : 'Dark'}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <AutoAwesome sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Compact Mode" 
                    secondary="Reduce spacing for more content"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.compactMode}
                      onChange={handleSettingChange('compactMode')}
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

                <ListItem>
                  <ListItemIcon>
                    <AccountCircle sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Show Avatars" 
                    secondary="Display user profile pictures"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.showAvatars}
                      onChange={handleSettingChange('showAvatars')}
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

            {/* Performance Tab */}
            <TabPanel value={activeTab} index={3}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>Performance & Storage</Typography>
              
              <List sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2, mb: 3 }}>
                <ListItem>
                  <ListItemIcon>
                    <Speed sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Performance Mode" 
                    secondary="Optimize app performance"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={settings.performanceMode}
                        onChange={handleSettingChange('performanceMode')}
                        sx={{
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                          '& .MuiSvgIcon-root': { color: 'white' }
                        }}
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="balanced">Balanced</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Storage sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Auto Save" 
                    secondary="Automatically save your data"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.autoSave}
                      onChange={handleSettingChange('autoSave')}
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

            {/* Accessibility Tab */}
            <TabPanel value={activeTab} index={4}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>Accessibility</Typography>
              
              <List sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2, mb: 3 }}>
                <ListItem>
                  <ListItemIcon>
                    <Accessibility sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="High Contrast" 
                    secondary="Increase contrast for better visibility"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.highContrast}
                      onChange={handleSettingChange('highContrast')}
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

                <ListItem>
                  <ListItemIcon>
                    <Keyboard sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Keyboard Shortcuts" 
                    secondary="Enable keyboard navigation"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.keyboardShortcuts}
                      onChange={handleSettingChange('keyboardShortcuts')}
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

            {/* Data Tab */}
            <TabPanel value={activeTab} index={5}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>Data & Storage</Typography>
              
              <List sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2, mb: 3 }}>
                <ListItem>
                  <ListItemIcon>
                    <Download sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Export Settings" 
                    secondary="Download your settings as JSON file"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      onClick={() => setShowExportDialog(true)}
                      variant="outlined"
                      size="small"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.3)',
                        '&:hover': {
                          borderColor: 'white',
                          background: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Export
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Delete sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Clear Data" 
                    secondary="Clear all cached data and settings"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                      '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      onClick={() => setShowClearDataDialog(true)}
                      variant="outlined"
                      size="small"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.3)',
                        '&:hover': {
                          borderColor: 'white',
                          background: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Clear
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </TabPanel>
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<Info />}
            onClick={() => setShowAboutDialog(true)}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'white',
                background: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            About
          </Button>
          <Button
            variant="outlined"
            startIcon={<Help />}
            onClick={() => navigate('/profile')}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'white',
                background: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Help
          </Button>
          <Button
            variant="outlined"
            startIcon={<Feedback />}
            onClick={() => setShowResetDialog(true)}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'white',
                background: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Feedback
          </Button>
        </Box>

        {/* Logout Section */}
        <Paper elevation={0} sx={{
          p: isMobile ? 3 : 4,
          background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
          border: '1px solid rgba(244, 67, 54, 0.2)',
          borderRadius: 4,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #f44336, #ff5722)',
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.1) 100%)',
                borderRadius: '50%',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(244, 67, 54, 0.3)'
              }}>
                <Logout sx={{ fontSize: 24, color: '#f44336' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ 
                  color: 'white', 
                  fontWeight: 700,
                  mb: 0.5
                }}>
                  Sign Out
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  maxWidth: 400
                }}>
                  Sign out of your account. You'll need to log in again to access your messages and settings.
                </Typography>
              </Box>
            </Box>
            
            <Button
              onClick={handleLogout}
              variant="contained"
              startIcon={<Logout />}
              sx={{
                background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                color: 'white',
                px: 3,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 16px rgba(244, 67, 54, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d32f2f, #b71c1c)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(244, 67, 54, 0.4)'
                }
              }}
            >
              Sign Out
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Reset Settings Dialog */}
      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <DialogTitle>Reset Settings</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all settings to their default values? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
          <Button onClick={handleResetSettings} color="primary" variant="contained">
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Settings Dialog */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)}>
        <DialogTitle>Export Settings</DialogTitle>
        <DialogContent>
          <Typography>
            This will download a JSON file containing all your current settings. You can use this file to restore your settings on another device.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>Cancel</Button>
          <Button onClick={handleExportSettings} color="primary" variant="contained">
            Export
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear Data Dialog */}
      <Dialog open={showClearDataDialog} onClose={() => setShowClearDataDialog(false)}>
        <DialogTitle>Clear Data</DialogTitle>
        <DialogContent>
          <Typography>
            This will clear all cached data, settings, and local storage. This action cannot be undone and you will need to log in again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDataDialog(false)}>Cancel</Button>
          <Button onClick={handleClearData} color="error" variant="contained">
            Clear All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* About Dialog */}
      <Dialog open={showAboutDialog} onClose={() => setShowAboutDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>About Flamegram</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Flamegram v1.0.0
          </Typography>
          <Typography paragraph>
            A modern, secure, and beautiful messaging platform for friends, teams, and communities.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Built with React, Material-UI, and Spring Boot.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            © 2024 Flamegram. All rights reserved.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAboutDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Profile Editor Dialog */}
      <Dialog 
        open={showProfileEditor} 
        onClose={() => setShowProfileEditor(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >

        <DialogContent sx={{ p: 0 }}>
          <Profile onClose={() => setShowProfileEditor(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Settings; 