// Firebase Messaging Service Worker
// This runs in the background and handles push notifications when the app is not in focus

console.log('🚀 [SW] Service worker script LOADING (Super Admin)...');
console.log('   Timestamp:', new Date().toISOString());
console.log('   Self origin:', self.location.origin);

// Import Firebase scripts
console.log('📦 [SW] Importing Firebase scripts...');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');
console.log('✅ [SW] Firebase scripts imported');

// Firebase configuration (same as main app)
// NOTE: These values should match your .env file
const firebaseConfig = {
  apiKey: "AIzaSyCzaxJmTsQc5R736KdVGAdk3Y5hlRyxH0w",
  authDomain: "eatfood-7e70e.firebaseapp.com",
  projectId: "eatfood-7e70e",
  storageBucket: "eatfood-7e70e.firebasestorage.app",
  messagingSenderId: "710370647048",
  appId: "1:710370647048:web:86e5e4cd05e6607694c5bd",
  measurementId: "G-4PZTF90GB2"
};

// Initialize Firebase in service worker
console.log('🔥 [SW] Initializing Firebase...');
firebase.initializeApp(firebaseConfig);
console.log('✅ [SW] Firebase initialized with project:', firebaseConfig.projectId);

// Get Firebase Messaging instance
const messaging = firebase.messaging();
console.log('✅ [SW] Firebase Messaging instance created');
console.log('📡 [SW] Setting up message handlers...');

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('🔔 [firebase-messaging-sw.js] ===== BACKGROUND MESSAGE RECEIVED (Super Admin) =====');
  console.log('   Full payload:', JSON.stringify(payload, null, 2));
  console.log('   Notification object:', payload.notification);
  console.log('   Data object:', payload.data);

  const notificationData = payload.data || {};
  const notificationType = notificationData.type || 'unknown';

  console.log('   Notification type:', notificationType);

  // SILENT NOTIFICATION - Data-only, no visible notification
  if (notificationType === 'silent') {
    console.log('🔇 [SW] Processing SILENT notification');
    console.log('   Action:', notificationData.action);
    console.log('   Category:', notificationData.category);

    // Send message to all clients (open tabs) to refresh data
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      console.log(`   Found ${clients.length} client window(s)`);
      clients.forEach((client, index) => {
        console.log(`   Sending to client ${index}:`, client.url);
        client.postMessage({
          type: 'SILENT_NOTIFICATION',
          data: notificationData,
        });
      });
    });

    console.log('   ✓ Silent notification processed (no visible alert)');
    // No visible notification for silent notifications
    return;
  }

  // ACTIVE NOTIFICATION - Show visible notification
  if (notificationType === 'active') {
    console.log('🔔 [SW] Processing ACTIVE notification');

    // For data-only notifications, title/body are in the data payload
    const notificationTitle = notificationData.title || payload.notification?.title || 'Super Admin Alert';
    const notificationBody = notificationData.body || payload.notification?.body || 'You have a new update';
    const clickAction = notificationData.clickAction || '/';
    const category = notificationData.category || 'general';

    console.log('   Title:', notificationTitle);
    console.log('   Body:', notificationBody);
    console.log('   Click action:', clickAction);
    console.log('   Category:', category);

    // Custom icons based on notification category
    let icon = '/logo.png';
    let badge = '/badge.png';

    if (category === 'restaurant_registration') {
      icon = '/images/restaurant-icon.png';
    } else if (category === 'system_alert') {
      icon = '/images/alert-icon.png';
    }

    const notificationOptions = {
      body: notificationBody,
      icon: icon,
      badge: badge,
      tag: notificationData.id || 'default',
      requireInteraction: true,
      data: {
        url: clickAction,
        ...notificationData,
      },
      actions: [
        { action: 'view', title: 'View' },
        { action: 'close', title: 'Close' },
      ],
    };

    console.log('   Showing notification with options:', notificationOptions);
    // Show the notification
    return self.registration.showNotification(notificationTitle, notificationOptions);
  }

  // DEFAULT - If type is unknown, show basic notification
  console.log('❓ [SW] Unknown notification type:', notificationType);
  console.log('   Showing basic notification...');

  return self.registration.showNotification(
    payload.notification?.title || 'Super Admin Notification',
    {
      body: payload.notification?.body || 'You have a new notification',
      icon: '/logo.png',
      data: notificationData,
    }
  );
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click (Super Admin):', event);

  event.notification.close();

  const notificationData = event.notification.data || {};
  const urlToOpen = notificationData.url || notificationData.clickAction || '/';

  // Handle action buttons
  if (event.action === 'close') {
    return;
  }

  // Open or focus the app
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            // Navigate to the URL and focus the window
            client.postMessage({
              type: 'NAVIGATE',
              url: urlToOpen,
            });
            return client.focus();
          }
        }

        // If no window is open, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle push events (alternative to onBackgroundMessage)
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push event received (Super Admin):', event);

  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[SW] Push data (JSON):', data);

      // Handle the push data
      // This is an alternative entry point if onBackgroundMessage doesn't fire
    } catch (jsonError) {
      // If JSON parsing fails, try to get text
      try {
        const text = event.data.text();
        console.log('[SW] Push data (Text):', text);
      } catch (textError) {
        console.log('[SW] Could not parse push data as JSON or text');
      }
    }
  }
});

// Install event
self.addEventListener('install', (event) => {
  console.log('⚙️  [SW] Service worker INSTALLING (Super Admin)...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('✅ [SW] Service worker ACTIVATED (Super Admin)');
  event.waitUntil(self.clients.claim());
});

console.log('✅ [SW] All event listeners registered');
console.log('🎯 [SW] Service worker script fully loaded and ready');
