// PWA Utility Functions

// Check if app is running as PWA
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

// Check if service worker is supported
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};

// Check if push notifications are supported
export const isPushNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isPushNotificationSupported()) {
    console.log('Push notifications not supported');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Send push notification
export const sendPushNotification = (title, options = {}) => {
  if (!isPushNotificationSupported()) {
    console.log('Push notifications not supported');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/logo192.png',
      badge: '/favicon.png',
      vibrate: [100, 50, 100],
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }
};

// Check online/offline status
export const isOnline = () => {
  return navigator.onLine;
};

// Listen for online/offline events
export const onOnlineStatusChange = (callback) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// Register for background sync
export const registerBackgroundSync = async (tag = 'background-sync') => {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    const registration = await navigator.serviceWorker.ready;
    return registration.sync.register(tag);
  }
  return null;
};

// Get app installation status
export const getInstallationStatus = () => {
  return {
    isPWA: isPWA(),
    isServiceWorkerSupported: isServiceWorkerSupported(),
    isPushNotificationSupported: isPushNotificationSupported(),
    notificationPermission: Notification.permission,
    isOnline: isOnline()
  };
};

// Cache management
export const clearAppCache = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('App cache cleared');
  }
};

// Get cache size
export const getCacheSize = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return totalSize;
  }
  return 0;
};

// Format bytes to human readable
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}; 