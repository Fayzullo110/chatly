import React, { useState, useContext } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Link, Avatar, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Email, Lock, Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { keyframes } from '@emotion/react';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/chat');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(-45deg, #2196f3 0%, #4facfe 50%, #1976d2 100%)',
      backgroundSize: '400% 400%',
      animation: `${gradientShift} 15s ease infinite`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      flexDirection: 'column'
    }}>
      {/* Glassmorphism AppBar */}
      <Box sx={{ width: '100%', zIndex: 10 }}>
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          px: 4,
          py: 2,
        }}>
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
              <span role="img" aria-label="chat">💬</span>
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
      </Box>

      {/* Animated background shapes */}
      <Box sx={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        animation: `${float} 6s ease-in-out infinite`,
        zIndex: 1
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: 100,
        height: 100,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        animation: `${float} 8s ease-in-out infinite reverse`,
        zIndex: 1
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper elevation={0} sx={{
          p: 6,
          background: 'none',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          animation: `${pulse} 4s ease-in-out infinite`
        }}>
          {/* Logo and Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}>
              <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
            </Avatar>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 1
            }}>
              Welcome Back
            </Typography>
            <Typography variant="h6" align="center" sx={{
              color: 'white',
              opacity: 0.8,
              fontWeight: 300,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              Sign in to your account
            </Typography>
          </Box>
          
          {error && (
            <Box sx={{
              background: 'rgba(244, 67, 54, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              borderRadius: 2,
              p: 2,
              mb: 3,
              textAlign: 'center'
            }}>
              <Typography color="error" sx={{ color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                {error}
              </Typography>
            </Box>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#2196f3', fontSize: 28 }} />
                  </InputAdornment>
                ),
                sx: {
                  fontSize: 20,
                  color: 'white',
                  fontWeight: 500,
                  borderRadius: 3,
                  background: 'transparent',
                  boxShadow: '0 4px 32px 0 rgba(255,182,236,0.10)',
                  backdropFilter: 'blur(16px)',
                  px: 2,
                  py: 1.5,
                  '& .MuiInputBase-input': {
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: 0.5,
                    background: 'transparent !important',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 18,
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: 'transparent',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    boxShadow: '0 4px 32px 0 rgba(255,182,236,0.10)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      border: '1.5px solid #ffb6ec',
                      background: 'transparent',
                    },
                    '&.Mui-focused': {
                      border: '2px solid #ffb6ec',
                      background: 'transparent',
                      boxShadow: '0 0 12px 2px #ffb6ec44',
                    },
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#2196f3', fontSize: 28 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                      sx={{ color: '#2196f3', background: 'rgba(255,255,255,0.12)', borderRadius: 2, '&:hover': { background: 'rgba(33,150,243,0.22)' } }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  fontSize: 20,
                  color: 'white',
                  fontWeight: 500,
                  borderRadius: 3,
                  background: 'transparent',
                  boxShadow: '0 4px 32px 0 rgba(255,182,236,0.10)',
                  backdropFilter: 'blur(16px)',
                  px: 2,
                  py: 1.5,
                  '& .MuiInputBase-input': {
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: 0.5,
                    background: 'transparent !important',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 18,
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: 'transparent',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    boxShadow: '0 4px 32px 0 rgba(255,182,236,0.10)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      border: '1.5px solid #ffb6ec',
                      background: 'transparent',
                    },
                    '&.Mui-focused': {
                      border: '2px solid #ffb6ec',
                      background: 'transparent',
                      boxShadow: '0 0 12px 2px #ffb6ec44',
                    },
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                mb: 3,
                py: 2,
                fontSize: 18,
                fontWeight: 600,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%)'
                }
              }}
            >
              Sign In
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.8, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  variant="body2" 
                  sx={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    fontWeight: 600,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Create one here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login; 