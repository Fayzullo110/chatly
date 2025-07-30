import React, { useState, useContext } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Link, 
  Avatar, 
  InputAdornment, 
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Email, Lock, Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import FyzooLogo from './FyzooLogo';

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
  const { login, clearAuthForRegistration } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/chat');
    } else {
      setError(result.error || 'Login failed');
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
      overflow: 'auto',
      flexDirection: 'column',
      px: { xs: 1, sm: 2, md: 0 }
    }}>
      {/* Animated background shapes */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: { xs: '5%', sm: '15%' },
        width: { xs: 80, sm: 120 },
        height: { xs: 80, sm: 120 },
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        animation: `${float} 6s ease-in-out infinite`,
        zIndex: 1
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        right: { xs: '5%', sm: '15%' },
        width: { xs: 60, sm: 100 },
        height: { xs: 60, sm: 100 },
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        animation: `${float} 8s ease-in-out infinite reverse`,
        zIndex: 1
      }} />

      <Container maxWidth="sm" sx={{ 
        position: 'relative', 
        zIndex: 2,
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 4 }
      }}>
        <Paper elevation={0} sx={{
          p: { xs: 3, sm: 4, md: 6 },
          background: 'none',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: { xs: 3, sm: 4 },
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          animation: `${pulse} 4s ease-in-out infinite`
        }}>
          {/* Logo and Title */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
            <Avatar sx={{
              width: { xs: 60, sm: 70, md: 80 },
              height: { xs: 60, sm: 70, md: 80 },
              mx: 'auto',
              mb: { xs: 1.5, sm: 2 },
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}>
              <LoginIcon sx={{ 
                fontSize: { xs: 30, sm: 35, md: 40 }, 
                color: 'white' 
              }} />
            </Avatar>
            <Typography variant={isSmallMobile ? "h4" : "h3"} component="h1" gutterBottom align="center" sx={{
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
            }}>
              Welcome Back
            </Typography>
            <Typography variant={isSmallMobile ? "body1" : "h6"} align="center" sx={{
              color: 'white',
              opacity: 0.8,
              fontWeight: 300,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
            }}>
              Sign in to your account
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{
                mb: { xs: 2, sm: 3 },
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: '2px',
                    transition: 'border-color 0.3s ease',
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                      borderWidth: '2px',
                    },
                  },
                  '&.Mui-focused .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.9)',
                  },
                  // Fix autofill background
                  '& input:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 1000px rgba(255, 255, 255, 0.15) inset',
                    '-webkit-text-fill-color': 'white',
                    'border-radius': '12px',
                    'transition': 'background-color 5000s ease-in-out 0s',
                  },
                  '& input:-webkit-autofill:hover': {
                    '-webkit-box-shadow': '0 0 0 1000px rgba(255, 255, 255, 0.2) inset',
                  },
                  '& input:-webkit-autofill:focus': {
                    '-webkit-box-shadow': '0 0 0 1000px rgba(255, 255, 255, 0.25) inset',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: 'rgba(255, 255, 255, 0.9)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '1rem',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: 1,
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          color: 'rgba(255, 255, 255, 0.9)',
                          background: 'rgba(255, 255, 255, 0.1)',
                        }
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: { xs: 2, sm: 3 },
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: '2px',
                    transition: 'border-color 0.3s ease',
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                      borderWidth: '2px',
                    },
                  },
                  '&.Mui-focused .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.9)',
                  },
                  // Fix autofill background
                  '& input:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 1000px rgba(255, 255, 255, 0.15) inset',
                    '-webkit-text-fill-color': 'white',
                    'border-radius': '12px',
                    'transition': 'background-color 5000s ease-in-out 0s',
                  },
                  '& input:-webkit-autofill:hover': {
                    '-webkit-box-shadow': '0 0 0 1000px rgba(255, 255, 255, 0.2) inset',
                  },
                  '& input:-webkit-autofill:focus': {
                    '-webkit-box-shadow': '0 0 0 1000px rgba(255, 255, 255, 0.25) inset',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: 'rgba(255, 255, 255, 0.9)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '1rem',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: 1,
                  },
                },
              }}
            />
            
            {error && (
              <Typography color="error" variant="body2" sx={{ 
                mb: 2, 
                textAlign: 'center',
                background: 'rgba(244, 67, 54, 0.1)',
                padding: 1,
                borderRadius: 1,
                border: '1px solid rgba(244, 67, 54, 0.3)'
              }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: { xs: 2, sm: 3 },
                mb: { xs: 2, sm: 3 },
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 600,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
                }
              }}
            >
              Sign In
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    console.log('Sign up here clicked - forcing navigation to register');
                    // Clear everything and force navigation
                    localStorage.removeItem('token');
                    sessionStorage.clear();
                    window.location.href = '/register';
                  }}
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Sign up here
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