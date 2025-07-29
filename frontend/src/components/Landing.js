import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper, useTheme, useMediaQuery, Grid, Divider } from '@mui/material';
import { ChatBubbleOutline, Security, Speed, Group, ArrowForward, CheckCircle } from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import FlamegramLogo from './FlamegramLogo';
// import { useTranslation } from 'react-i18next';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.02); opacity: 0.9; }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const { t } = useTranslation();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #2196f3 50%, #1976d2 75%, #1565c0 100%)',
      backgroundSize: '400% 400%',
      animation: `${gradientShift} 20s ease infinite`,
      position: 'relative',
      overflow: 'auto'
    }}>
      {/* Subtle background pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
        zIndex: 1
      }} />

      {/* Animated background bubbles */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: { xs: 80, sm: 100, md: 120 },
        height: { xs: 80, sm: 100, md: 120 },
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        animation: `${float} 8s ease-in-out infinite`,
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }} />
      <Box sx={{
        position: 'absolute',
        top: '65%',
        right: { xs: '8%', sm: '12%', md: '15%' },
        width: { xs: 60, sm: 80, md: 100 },
        height: { xs: 60, sm: 80, md: 100 },
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(8px)',
        animation: `${float} 10s ease-in-out infinite reverse`,
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        left: { xs: '5%', sm: '15%', md: '20%' },
        width: { xs: 50, sm: 70, md: 90 },
        height: { xs: 50, sm: 70, md: 90 },
        borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%',
        background: 'rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(8px)',
        animation: `${float} 9s ease-in-out infinite`,
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.09)'
      }} />
      <Box sx={{
        position: 'absolute',
        top: '40%',
        right: { xs: '15%', sm: '20%', md: '25%' },
        width: { xs: 40, sm: 50, md: 60 },
        height: { xs: 40, sm: 50, md: 60 },
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(6px)',
        animation: `${float} 7s ease-in-out infinite reverse`,
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '60%',
        left: { xs: '20%', sm: '25%', md: '30%' },
        width: { xs: 30, sm: 40, md: 50 },
        height: { xs: 30, sm: 40, md: 50 },
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(5px)',
        animation: `${float} 6s ease-in-out infinite`,
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }} />
      
      {/* Additional animated bubbles */}
      <Box sx={{
        position: 'absolute',
        top: '25%',
        right: { xs: '5%', sm: '8%', md: '10%' },
        width: { xs: 35, sm: 45, md: 55 },
        height: { xs: 35, sm: 45, md: 55 },
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(7px)',
        animation: `${float} 11s ease-in-out infinite reverse`,
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.07)'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '35%',
        right: { xs: '25%', sm: '30%', md: '35%' },
        width: { xs: 45, sm: 55, md: 65 },
        height: { xs: 45, sm: 55, md: 65 },
        borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(6px)',
        animation: `${float} 8.5s ease-in-out infinite`,
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }} />
      <Box sx={{
        position: 'absolute',
        top: '75%',
        left: { xs: '35%', sm: '40%', md: '45%' },
        width: { xs: 25, sm: 35, md: 45 },
        height: { xs: 25, sm: 35, md: 45 },
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(5px)',
        animation: `${float} 7.5s ease-in-out infinite reverse`,
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }} />
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: { xs: '45%', sm: '50%', md: '55%' },
        width: { xs: 20, sm: 30, md: 40 },
        height: { xs: 20, sm: 30, md: 40 },
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(4px)',
        animation: `${float} 9.5s ease-in-out infinite`,
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.04)'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        right: { xs: '35%', sm: '40%', md: '45%' },
        width: { xs: 40, sm: 50, md: 60 },
        height: { xs: 40, sm: 50, md: 60 },
        borderRadius: '50% 50% 50% 50% / 60% 40% 40% 60%',
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(7px)',
        animation: `${float} 10.5s ease-in-out infinite reverse`,
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.07)'
      }} />
      <Box sx={{
        position: 'absolute',
        top: '55%',
        left: { xs: '8%', sm: '12%', md: '15%' },
        width: { xs: 15, sm: 25, md: 35 },
        height: { xs: 15, sm: 25, md: 35 },
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(4px)',
        animation: `${float} 6.5s ease-in-out infinite`,
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.04)'
      }} />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 4, sm: 6, md: 8 },
        minHeight: '100vh'
      }}>
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 8, sm: 10, md: 12 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh'
        }}>
          {/* Logo */}
          <Box
            component="img"
            src="/images/Flame.png"
            alt="Flamegram Logo"
            sx={{
              width: { xs: 200, sm: 200, md: 200, lg: 200 },
              height: { xs: 200, sm: 200, md: 200, lg: 200 },
              mb: { xs: 2, sm: 3 },
              filter: 'drop-shadow(0 8px 24px rgba(33, 150, 243, 0.3))',
              animation: `${pulse} 3s ease-in-out infinite`,
              zIndex: 2,
              position: 'relative'
            }}
          />

          {/* Main Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.8rem', sm: '1.8rem', md: '1.8rem', lg: '1.8rem' },
              fontWeight: 900,
              color: 'white',
              textAlign: 'center',
              mb: { xs: 1.5, sm: 2 },
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              letterSpacing: { xs: '0.05em', sm: '0.1em' },
              zIndex: 2,
              position: 'relative'
            }}
          >
            FLAMEGRAM
          </Typography>
          
          {/* Tagline */}
          <Typography variant="h3" sx={{ 
            color: 'white', 
            mb: { xs: 3, sm: 4, md: 5 }, 
            maxWidth: 1000, 
            textAlign: 'center', 
            opacity: 0.95, 
            textShadow: '0 2px 16px rgba(0,0,0,0.3)',
            fontWeight: 300,
            lineHeight: 1.3,
            fontSize: { 
              xs: '1.25rem', 
              sm: '1.5rem', 
              md: '1.75rem', 
              lg: '2rem' 
            },
            px: { xs: 2, sm: 3 }
          }}>
            The Next Generation of Secure Messaging
          </Typography>
          
          {/* Description */}
          <Typography variant="h6" sx={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            mb: { xs: 5, sm: 6, md: 7 }, 
            maxWidth: 700, 
            textAlign: 'center', 
            fontWeight: 400,
            lineHeight: 1.6,
            fontSize: { 
              xs: '1rem', 
              sm: '1.1rem', 
              md: '1.2rem'
            },
            px: { xs: 2, sm: 3 }
          }}>
            Experience lightning-fast messaging with enterprise-grade security. Connect with friends, collaborate with teams, and share moments with confidence.
          </Typography>
          
          {/* CTA Buttons */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: { xs: 4, sm: 5 }
          }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              endIcon={<ArrowForward />}
              sx={{
                fontWeight: 600,
                px: { xs: 4, sm: 5, md: 6 },
                py: { xs: 1.5, sm: 1.75, md: 2 },
                fontSize: { xs: 15, sm: 15, md: 15 },
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.4)',
                transition: 'all 0.3s ease',
                minWidth: { xs: '280px', sm: '200px' },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(33, 150, 243, 0.5)',
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                }
              }}
            >
              Get Started
            </Button>
          </Box>

          {/* Trust indicators */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: { xs: 1, sm: 3 },
            opacity: 0.8
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'white', fontSize: '0.9rem' }}>
                End-to-End Encryption
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'white', fontSize: '0.9rem' }}>
                Real-Time Messaging
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'white', fontSize: '0.9rem' }}>
                Cross-Platform Sync
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ 
          width: '100%',
          maxWidth: 1400,
          mb: { xs: 8, sm: 10, md: 12 }
        }}>
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
            <Typography variant="h2" sx={{
              color: 'white',
              fontWeight: 700,
              mb: 3,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              opacity: 0.95
            }}>
              Enterprise-Grade Features
            </Typography>
            <Typography variant="h5" sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
            }}>
              Built for modern teams and individuals who demand the best in communication technology
            </Typography>
          </Box>
          
          {/* Features Grid */}
          <Grid container spacing={4}>
            {[
              { 
                icon: Speed, 
                title: 'Lightning Performance', 
                desc: 'Messages delivered in milliseconds with real-time synchronization across all your devices.',
                features: ['Instant delivery', 'Offline support', 'Message sync']
              },
              { 
                icon: Security, 
                title: 'Military-Grade Security', 
                desc: 'End-to-end encryption ensures your conversations remain private and secure at all times.',
                features: ['E2E encryption', 'Zero-knowledge', 'Secure protocols']
              },
              { 
                icon: Group, 
                title: 'Team Collaboration', 
                desc: 'Advanced group features designed for seamless team communication and project management.',
                features: ['Group management', 'File sharing', 'Team channels']
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  sx={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 3,
                    p: { xs: 3, sm: 4, md: 5 },
                    height: '100%',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #2196f3, #1976d2)',
                      transform: 'scaleX(0)',
                      transition: 'transform 0.3s ease'
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      '&::before': {
                        transform: 'scaleX(1)'
                      }
                    }
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 3
                  }}>
                    <Box sx={{
                      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(25, 118, 210, 0.1) 100%)',
                      borderRadius: '50%',
                      p: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(33, 150, 243, 0.3)'
                    }}>
                      <feature.icon sx={{ 
                        fontSize: { xs: 32, sm: 36, md: 40 }, 
                        color: '#2196f3'
                      }} />
                    </Box>
                  </Box>
                  <Typography variant="h5" sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 2,
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    fontSize: { xs: '1.3rem', sm: '1.4rem', md: '1.5rem' }
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    mb: 3,
                    fontSize: { xs: '0.95rem', sm: '1rem' },
                    lineHeight: 1.6
                  }}>
                    {feature.desc}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    {feature.features.map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckCircle sx={{ 
                          color: '#2196f3', 
                          fontSize: 18, 
                          mr: 1.5 
                        }} />
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.9rem'
                        }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Footer Section */}
        <Box sx={{
          width: '100%',
          textAlign: 'center',
          mt: { xs: 8, sm: 10, md: 12 },
          pt: { xs: 6, sm: 8, md: 10 },
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: 3,
          p: { xs: 4, sm: 6, md: 8 }
        }}>
          <Typography variant="h3" sx={{
            color: 'white',
            fontWeight: 700,
            mb: 3,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }
          }}>
            Ready to Transform Your Communication?
          </Typography>
          <Typography variant="h6" sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            lineHeight: 1.6
          }}>
            Join thousands of professionals and teams who trust Flamegram for their daily communication needs
          </Typography>
          
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3 },
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4
          }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/register')}
              endIcon={<ArrowForward />}
              sx={{ 
                fontWeight: 600, 
                px: { xs: 4, sm: 5, md: 6 }, 
                py: { xs: 1.5, sm: 1.75, md: 2 }, 
                fontSize: { xs: 16, sm: 18, md: 20 }, 
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.4)',
                transition: 'all 0.3s ease',
                minWidth: { xs: '280px', sm: '220px' },
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(33, 150, 243, 0.5)',
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                }
              }}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/login')}
              sx={{ 
                fontWeight: 600, 
                px: { xs: 4, sm: 5, md: 6 }, 
                py: { xs: 1.5, sm: 1.75, md: 2 }, 
                fontSize: { xs: 16, sm: 18, md: 20 }, 
                borderRadius: 2,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                minWidth: { xs: '280px', sm: '220px' },
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }
              }}
            >
              Sign In
            </Button>
          </Box>
          
          <Divider sx={{ 
            borderColor: 'rgba(255, 255, 255, 0.2)', 
            my: 4,
            mx: 'auto',
            width: '60%'
          }} />
          
          <Typography variant="body2" sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem'
          }}>
            © 2024 Flamegram. All rights reserved. | Enterprise-grade messaging for modern teams
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing; 