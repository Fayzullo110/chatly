import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { Language, Brightness4, Brightness7, AccountCircle, Logout, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeContext';
import { keyframes } from '@emotion/react';

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [langAnchorEl, setLangAnchorEl] = React.useState(null);

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
  };

  const handleLangClick = (event) => setLangAnchorEl(event.currentTarget);
  const handleLangClose = () => setLangAnchorEl(null);

  return (
    <AppBar position="static" sx={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      zIndex: 1000
    }}>
      <Toolbar>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            px: 2,
            py: 1,
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
            <Box sx={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
              borderRadius: '50%',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              animation: `${pulse} 3s ease-in-out infinite`
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                C
              </Typography>
            </Box>
            <Typography variant="h5" component="div" sx={{ 
              fontWeight: 700, 
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Chatly
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
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
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 