import React, { useContext, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Language, 
  Brightness4, 
  Brightness7, 
  AccountCircle, 
  Logout, 
  Person,
  Menu as MenuIcon,
  Home,
  Chat,
  Settings
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeContext';
import { keyframes } from '@emotion/react';
import FyzooLogo from './FyzooLogo';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
    setMobileMenuOpen(false);
  };

  const handleLangClick = (event) => setLangAnchorEl(event.currentTarget);
  const handleLangClose = () => setLangAnchorEl(null);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => location.pathname === path;

  const mobileMenuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Chat', icon: <Chat />, path: '/chat' },
    { text: 'Test', icon: <Settings />, path: '/test' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <>
      <AppBar position="static" sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 1000
      }}>
        <Toolbar sx={{ 
          minHeight: isMobile ? '56px' : '64px',
          px: isMobile ? 2 : 3
        }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              px: isMobile ? 1.5 : 2,
              py: isMobile ? 0.5 : 1,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }
            }} onClick={() => navigate('/')}>
              <FyzooLogo size="medium" variant="full" color="white" />
            </Box>
          </Box>

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleMobileMenuToggle}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                ml: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <MenuIcon sx={{ color: 'white' }} />
            </IconButton>
          )}

          {/* Desktop Action Buttons */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Language Switcher */}
              <Tooltip title="Change Language">
                <IconButton 
                  color="inherit" 
                  onClick={handleLangClick}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Language sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
              
              {/* User Menu */}
              {user ? (
                <>
                  <Tooltip title="Profile">
                    <IconButton
                      onClick={handleMenu}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        animation: `${float} 4s ease-in-out infinite`
                      }}>
                        <Person sx={{ fontSize: 20, color: 'white' }} />
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate('/login')} 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 600,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')} 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 600,
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        background: 'rgba(255, 255, 255, 0.3)',
                        transform: 'translateY(-2px) scale(1.05)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: 280,
            color: 'white'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Menu
          </Typography>
          
          <List>
            {mobileMenuItems.map((item) => (
              <ListItem
                key={item.text}
                button
                onClick={() => handleMobileNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: isActiveRoute(item.path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

          {user ? (
            <List>
              <ListItem
                button
                onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem
                button
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                fullWidth
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                sx={{
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                Login
              </Button>
              <Button
                fullWidth
                onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                sx={{
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Language Menu */}
      <Menu 
        anchorEl={langAnchorEl} 
        open={Boolean(langAnchorEl)} 
        onClose={handleLangClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <MenuItem onClick={handleLangClose} sx={{ color: 'white' }}>English</MenuItem>
        <MenuItem onClick={handleLangClose} sx={{ color: 'white' }}>Deutsch</MenuItem>
        <MenuItem onClick={handleLangClose} sx={{ color: 'white' }}>Русский</MenuItem>
        <MenuItem onClick={handleLangClose} sx={{ color: 'white' }}>Oʻzbekcha</MenuItem>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            mt: 1
          }
        }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleClose(); }} sx={{ color: 'white' }}>
          <AccountCircle sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'white' }}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default Navbar; 