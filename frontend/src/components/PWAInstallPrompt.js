import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Snackbar, 
  Alert, 
  Typography,
  IconButton,
  Paper,
  Fade,
  Slide,
  Chip
} from '@mui/material';
import { 
  Close, 
  Download, 
  PhoneAndroid, 
  Star,
  AutoAwesome,
  CheckCircle,
  Info
} from '@mui/icons-material';
import PWAInstallModal from './PWAInstallModal';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
      setDismissed(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Delay showing prompt to let page load
      setTimeout(() => setShowInstallPrompt(true), 2000);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For testing: Show prompt after 3 seconds if no beforeinstallprompt event
    const testTimer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled && !dismissed) {
        console.log('Showing test PWA prompt');
        setShowInstallPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(testTimer);
    };
  }, [deferredPrompt, isInstalled, dismissed]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
    setShowInstallPrompt(false);
  };

  const handleClose = () => {
    setShowInstallPrompt(false);
    setDismissed(true);
    // Remember dismissal for 24 hours
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDismissed(true);
    // Remember dismissal for 24 hours
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Production mode - only show when appropriate
  const forceShow = false; // Set to false for production
  
  if ((isInstalled || dismissed || !showInstallPrompt) && !forceShow) {
    return null;
  }

  return (
    <>
      {/* Debug Panel - Only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            left: 20,
            zIndex: 1400,
            bgcolor: 'rgba(0,0,0,0.8)',
            color: 'white',
            p: 2,
            borderRadius: 2,
            fontSize: '12px',
            maxWidth: 300,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h6" sx={{ fontSize: '14px', mb: 1 }}>PWA Debug Info</Typography>
          <Box sx={{ mb: 1 }}>
            <strong>Is PWA:</strong> {window.matchMedia('(display-mode: standalone)').matches ? 'Yes' : 'No'}
          </Box>
          <Box sx={{ mb: 1 }}>
            <strong>Service Worker:</strong> {'serviceWorker' in navigator ? 'Supported' : 'Not Supported'}
          </Box>
          <Box sx={{ mb: 1 }}>
            <strong>Deferred Prompt:</strong> {deferredPrompt ? 'Available' : 'Not Available'}
          </Box>
          <Box sx={{ mb: 1 }}>
            <strong>Show Prompt:</strong> {showInstallPrompt ? 'Yes' : 'No'}
          </Box>
          <Box sx={{ mb: 1 }}>
            <strong>Dismissed:</strong> {dismissed ? 'Yes' : 'No'}
          </Box>
          <Box sx={{ mb: 1 }}>
            <strong>Is Installed:</strong> {isInstalled ? 'Yes' : 'No'}
          </Box>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              setShowInstallPrompt(true);
              setDismissed(false);
              localStorage.removeItem('pwa-prompt-dismissed');
            }}
            sx={{ mt: 1, fontSize: '10px' }}
          >
            Force Show
          </Button>
        </Box>
      )}

      {/* Floating Install Button - Top Right */}
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1300,
          display: { xs: 'none', md: 'block' }
        }}
      >
        <Fade in={showInstallPrompt} timeout={800}>
          <Paper
            elevation={8}
            sx={{
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
              borderRadius: 3,
              p: 2,
              minWidth: 280,
              border: '2px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              animation: 'pulse 2s infinite'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                <AutoAwesome sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Install Fyzoo
                </Typography>
              </Box>
              <Chip 
                label="NEW" 
                size="small" 
                sx={{ 
                  bgcolor: '#ff6b35', 
                  color: 'white', 
                  fontSize: '0.7rem',
                  height: 20
                }} 
              />
            </Box>
            
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2, fontSize: '0.8rem' }}>
              Get the best experience with offline support & notifications
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<Download />}
                onClick={handleInstallClick}
                sx={{ 
                  bgcolor: 'white',
                  color: '#2196f3',
                  fontWeight: 600,
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Install
              </Button>
              <Button
                variant="text"
                size="small"
                startIcon={<Info />}
                onClick={handleShowModal}
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  '&:hover': { 
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Learn More
              </Button>
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': { color: 'white' }
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        </Fade>
      </Box>

      {/* Mobile Bottom Banner */}
      <Snackbar
        open={showInstallPrompt}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ 
          bottom: { xs: 16, sm: 24 },
          display: { xs: 'block', md: 'none' }
        }}
      >
        <Slide direction="up" in={showInstallPrompt} timeout={500}>
          <Paper
            elevation={12}
            sx={{
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
              borderRadius: 3,
              p: 2,
              minWidth: 320,
              maxWidth: 400,
              border: '2px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                color: 'white'
              }}>
                <PhoneAndroid />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Install Fyzoo
                </Typography>
              </Box>
              <Chip 
                label="NEW" 
                size="small" 
                sx={{ 
                  bgcolor: '#ff6b35', 
                  color: 'white',
                  fontSize: '0.7rem'
                }} 
              />
            </Box>

            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
              Get the best experience with offline support & notifications
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleInstallClick}
                sx={{ 
                  bgcolor: 'white',
                  color: '#2196f3',
                  fontWeight: 600,
                  flex: 1,
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Install App
              </Button>
              <Button
                variant="text"
                size="small"
                startIcon={<Info />}
                onClick={handleShowModal}
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  '&:hover': { 
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Learn More
              </Button>
              <IconButton
                onClick={handleDismiss}
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': { color: 'white' }
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Paper>
        </Slide>
      </Snackbar>

      {/* Big Red Test Button - Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1500,
            bgcolor: 'red',
            color: 'white',
            p: 3,
            borderRadius: 3,
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(255,0,0,0.4)',
            '&:hover': {
              bgcolor: 'darkred',
              transform: 'translate(-50%, -50%) scale(1.1)'
            }
          }}
          onClick={handleShowModal}
        >
          🚨 CLICK HERE TO INSTALL FYZOO! 🚨
        </Box>
      )}

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
        `}
      </style>

      {/* Floating Install Button - Bottom Right */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1300,
          display: { xs: 'block', md: 'none' }
        }}
      >
        <Fade in={showInstallPrompt} timeout={800}>
          <IconButton
            onClick={handleShowModal}
            sx={{
              bgcolor: '#2196f3',
              color: 'white',
              width: 56,
              height: 56,
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.4)',
              '&:hover': {
                bgcolor: '#1976d2',
                transform: 'scale(1.1)',
                boxShadow: '0 6px 25px rgba(33, 150, 243, 0.6)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Download />
          </IconButton>
        </Fade>
      </Box>

      {/* PWA Install Modal */}
      <PWAInstallModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onInstall={handleInstallClick}
        deferredPrompt={deferredPrompt}
      />
    </>
  );
};

export default PWAInstallPrompt; 