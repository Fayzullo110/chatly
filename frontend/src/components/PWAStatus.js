import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Warning,
  Storage,
  Wifi,
  WifiOff,
  Notifications,
  NotificationsOff,
  PhoneAndroid,
  Language
} from '@mui/icons-material';
import { getInstallationStatus, requestNotificationPermission, clearAppCache, getCacheSize, formatBytes } from '../utils/pwaUtils';

const PWAStatus = () => {
  const [status, setStatus] = useState(null);
  const [cacheSize, setCacheSize] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      const installationStatus = getInstallationStatus();
      const size = await getCacheSize();
      
      setStatus(installationStatus);
      setCacheSize(size);
      setLoading(false);
    };

    loadStatus();
  }, []);

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setStatus(prev => ({ ...prev, notificationPermission: 'granted' }));
    }
  };

  const handleClearCache = async () => {
    await clearAppCache();
    const size = await getCacheSize();
    setCacheSize(size);
  };

  if (loading) {
    return <Typography>Loading PWA status...</Typography>;
  }

  const getStatusIcon = (condition) => {
    return condition ? <CheckCircle color="success" /> : <Cancel color="error" />;
  };

  const getStatusChip = (condition, label) => {
    return (
      <Chip
        icon={getStatusIcon(condition)}
        label={label}
        color={condition ? 'success' : 'error'}
        size="small"
        sx={{ mr: 1, mb: 1 }}
      />
    );
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          PWA Status
        </Typography>

        <Box sx={{ mb: 2 }}>
          {getStatusChip(status.isPWA, 'PWA Mode')}
          {getStatusChip(status.isServiceWorkerSupported, 'Service Worker')}
          {getStatusChip(status.isPushNotificationSupported, 'Push Notifications')}
          {getStatusChip(status.isOnline, 'Online')}
        </Box>

        <List>
          <ListItem>
            <ListItemIcon>
              <PhoneAndroid />
            </ListItemIcon>
            <ListItemText 
              primary="Installation Status" 
              secondary={status.isPWA ? 'Installed as PWA' : 'Running in browser'}
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              {status.isOnline ? <Wifi color="success" /> : <WifiOff color="error" />}
            </ListItemIcon>
            <ListItemText 
              primary="Connection Status" 
              secondary={status.isOnline ? 'Online' : 'Offline'}
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              {status.notificationPermission === 'granted' ? 
                <Notifications color="success" /> : 
                <NotificationsOff color="error" />
              }
            </ListItemIcon>
            <ListItemText 
              primary="Notification Permission" 
              secondary={status.notificationPermission}
            />
            {status.notificationPermission !== 'granted' && (
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleRequestNotifications}
              >
                Request
              </Button>
            )}
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText 
              primary="Cache Size" 
              secondary={formatBytes(cacheSize)}
            />
            <Button 
              variant="outlined" 
              size="small"
              onClick={handleClearCache}
            >
              Clear
            </Button>
          </ListItem>
        </List>

        {!status.isPWA && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Install Fyzoo as a PWA for the best experience with offline support, 
              push notifications, and app-like features.
            </Typography>
          </Alert>
        )}

        {!status.isOnline && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              You're currently offline. Some features may be limited, but cached content 
              will still be available.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PWAStatus; 