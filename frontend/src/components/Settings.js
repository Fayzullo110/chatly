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
  Chip
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
  Speed
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeContext';

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

const Settings = () => {
  const { user, logout } = useAuth();
  const { mode, setThemeMode } = useThemeMode();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    autoSave: true,
    accessibility: false,
    performance: 'balanced'
  });

  const [volume, setVolume] = useState(70);
  const [language, setLanguage] = useState('English');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handlePerformanceChange = (event, newValue) => {
    setSettings(prev => ({
      ...prev,
      performance: newValue
    }));
  };

  const handleResetSettings = () => {
    setSettings({
      notifications: true,
      sound: true,
      autoSave: true,
      accessibility: false,
      performance: 'balanced'
    });
    setVolume(70);
    setLanguage('English');
    setShowResetDialog(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const performanceMarks = [
    { value: 'low', label: 'Low' },
    { value: 'balanced', label: 'Balanced' },
    { value: 'high', label: 'High' }
  ];

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
      px: isMobile ? 2 : 0
    }}>
      {/* Header */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: isMobile ? 2 : 4,
        py: isMobile ? 1.5 : 2,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        zIndex: 10
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            animation: `${pulse} 3s ease-in-out infinite`
          }}>
            <Palette sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Settings
          </Typography>
        </Box>
        
        <Button
          onClick={() => navigate('/chat')}
          startIcon={<Close />}
          sx={{
            color: 'white',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Close
        </Button>
      </Box>

      <Container maxWidth="md" sx={{ 
        position: 'relative', 
        zIndex: 2,
        mt: isMobile ? 8 : 12,
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
          {/* Theme Settings */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              fontWeight: 600,
              mb: 2,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              Appearance
            </Typography>
            <List sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
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
            </List>
          </Box>

          {/* Notification Settings */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              fontWeight: 600,
              mb: 2,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              Notifications
            </Typography>
            <List sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <ListItem>
                <ListItemIcon>
                  {settings.notifications ? <Notifications sx={{ color: 'white' }} /> : <NotificationsOff sx={{ color: 'white' }} />}
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
                    checked={settings.notifications}
                    onChange={handleSettingChange('notifications')}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#2196f3',
                        '&:hover': {
                          backgroundColor: 'rgba(33, 150, 243, 0.08)',
                        },
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
                  {settings.sound ? <VolumeUp sx={{ color: 'white' }} /> : <VolumeOff sx={{ color: 'white' }} />}
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
                    checked={settings.sound}
                    onChange={handleSettingChange('sound')}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#2196f3',
                        '&:hover': {
                          backgroundColor: 'rgba(33, 150, 243, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#2196f3',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            
            {settings.sound && (
              <Box sx={{ mt: 2, px: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                  Volume Level
                </Typography>
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-labelledby="volume-slider"
                  sx={{
                    color: '#2196f3',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#2196f3',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#2196f3',
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Quiet
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Loud
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Performance Settings */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              fontWeight: 600,
              mb: 2,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              Performance
            </Typography>
            <List sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
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
                  <Chip 
                    label={settings.performance.charAt(0).toUpperCase() + settings.performance.slice(1)}
                    sx={{
                      backgroundColor: 'rgba(33, 150, 243, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(33, 150, 243, 0.3)'
                    }}
                  />
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
                        '&:hover': {
                          backgroundColor: 'rgba(33, 150, 243, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#2196f3',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Box>

          {/* Accessibility Settings */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              fontWeight: 600,
              mb: 2,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              Accessibility
            </Typography>
            <List sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <ListItem>
                <ListItemIcon>
                  <Accessibility sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Accessibility Mode" 
                  secondary="Enhanced accessibility features"
                  sx={{ 
                    '& .MuiListItemText-primary': { color: 'white', fontWeight: 500 },
                    '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.accessibility}
                    onChange={handleSettingChange('accessibility')}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#2196f3',
                        '&:hover': {
                          backgroundColor: 'rgba(33, 150, 243, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#2196f3',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
              startIcon={<Security />}
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
              Security
            </Button>
            <Button
              variant="outlined"
              startIcon={<Save />}
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
              Reset Settings
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

      {/* About Dialog */}
      <Dialog open={showAboutDialog} onClose={() => setShowAboutDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>About Chatly</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Chatly v1.0.0
          </Typography>
          <Typography paragraph>
            A modern, secure, and beautiful messaging platform for friends, teams, and communities.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Built with React, Material-UI, and Spring Boot.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            © 2024 Chatly. All rights reserved.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAboutDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 