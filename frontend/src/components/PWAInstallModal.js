import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import {
  Close,
  Download,
  PhoneAndroid,
  AutoAwesome,
  WifiOff,
  Notifications,
  Speed,
  Security,
  Star,
  CheckCircle
} from '@mui/icons-material';

const PWAInstallModal = ({ open, onClose, onInstall, deferredPrompt }) => {
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        onClose();
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const features = [
    {
      icon: <WifiOff color="primary" />,
      title: 'Offline Support',
      description: 'Access your messages even without internet'
    },
    {
      icon: <Notifications color="primary" />,
      title: 'Push Notifications',
      description: 'Get instant notifications for new messages'
    },
    {
      icon: <Speed color="primary" />,
      title: 'Faster Loading',
      description: 'Cached resources for lightning-fast performance'
    },
    {
      icon: <Security color="primary" />,
      title: 'Enhanced Security',
      description: 'Secure, app-like experience with HTTPS'
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: '2px solid rgba(33, 150, 243, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: '#2196f3',
              width: 48,
              height: 48,
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
            }}
          >
            <AutoAwesome />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
              Install Fyzoo
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Get the best messaging experience
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
            borderRadius: 2,
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <Star sx={{ color: '#ffd700' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Premium Experience
            </Typography>
            <Star sx={{ color: '#ffd700' }} />
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Transform your browser into a powerful messaging app
          </Typography>
        </Paper>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          What you'll get:
        </Typography>

        <List sx={{ mb: 3 }}>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {feature.icon}
              </ListItemIcon>
              <ListItemText
                primary={feature.title}
                secondary={feature.description}
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ 
          p: 2, 
          bgcolor: 'rgba(33, 150, 243, 0.05)', 
          borderRadius: 2,
          border: '1px solid rgba(33, 150, 243, 0.1)'
        }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
            Free to install • No additional storage required • Easy to uninstall
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderColor: 'rgba(0,0,0,0.2)',
            color: 'text.secondary'
          }}
        >
          Maybe Later
        </Button>
        <Button
          onClick={handleInstall}
          variant="contained"
          startIcon={<Download />}
          disabled={isInstalling}
          sx={{
            bgcolor: '#2196f3',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#1976d2',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(33, 150, 243, 0.3)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          {isInstalling ? 'Installing...' : 'Install Fyzoo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PWAInstallModal; 