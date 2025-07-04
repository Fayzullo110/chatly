import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, AppBar, Toolbar, Paper } from '@mui/material';
import { ChatBubbleOutline, Security, Speed, Group } from '@mui/icons-material';
import { keyframes } from '@emotion/react';
// import { useTranslation } from 'react-i18next';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Landing = () => {
  const navigate = useNavigate();
  // const { t } = useTranslation();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(-45deg, #2196f3 0%, #4facfe 50%, #1976d2 100%)',
      backgroundSize: '400% 400%',
      animation: `${gradientShift} 15s ease infinite`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background shapes */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        animation: `${float} 6s ease-in-out infinite`,
        zIndex: 1
      }} />
      <Box sx={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: 150,
        height: 150,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        animation: `${float} 8s ease-in-out infinite reverse`,
        zIndex: 1
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: 100,
        height: 100,
        borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        animation: `${float} 7s ease-in-out infinite`,
        zIndex: 1
      }} />

      {/* Glassmorphism AppBar */}
      <AppBar position="static" sx={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              px: 2,
              py: 1,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <ChatBubbleOutline sx={{ fontSize: 32, mr: 2, color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
              <Typography variant="h5" component="div" sx={{ 
                fontWeight: 700, 
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Chatly
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
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
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h1" sx={{ 
            fontWeight: 900, 
            color: 'white', 
            mb: 3, 
            textShadow: '0 4px 32px rgba(0,0,0,0.3)',
            fontSize: { xs: '3rem', md: '4.5rem' },
            animation: `${pulse} 3s ease-in-out infinite`
          }}>
            Welcome to Chatly
          </Typography>
          <Typography variant="h4" sx={{ 
            color: 'white', 
            mb: 6, 
            maxWidth: 800, 
            textAlign: 'center', 
            opacity: 0.95, 
            textShadow: '0 2px 16px rgba(0,0,0,0.2)',
            fontWeight: 300,
            lineHeight: 1.4
          }}>
            Connect, chat, and collaborate instantly. Chatly is your modern, secure, and beautiful messaging platform for friends, teams, and communities.
          </Typography>
          
          {/* CTA Button */}
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/register')}
            sx={{ 
              fontWeight: 700, 
              px: 6, 
              py: 2, 
              fontSize: 20, 
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-4px) scale(1.05)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%)'
              }
            }}
          >
            Get Started
          </Button>
        </Box>

        {/* Features Section */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
          gap: 4, 
          width: '100%',
          maxWidth: 1200
        }}>
          {[
                    { icon: Speed, title: 'Lightning Fast', desc: 'Real-time messaging with instant delivery' },
        { icon: Security, title: 'Secure & Private', desc: 'End-to-end encryption for your conversations' },
        { icon: Group, title: 'Team Collaboration', desc: 'Create groups and collaborate seamlessly' }
          ].map((feature, index) => (
            <Paper
              key={index}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                p: 4,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  background: 'rgba(255, 255, 255, 0.15)'
                }
              }}
            >
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 2
              }}>
                <Box sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <feature.icon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
              </Box>
              <Typography variant="h6" sx={{ 
                color: 'white', 
                fontWeight: 600, 
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {feature.title}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'white', 
                opacity: 0.9,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}>
                {feature.desc}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Landing; 