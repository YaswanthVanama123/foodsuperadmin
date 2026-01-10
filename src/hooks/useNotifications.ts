import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import firebaseService from '../services/firebase.service';
import apiClient from '../api/client';
import notificationStorage from '../services/notificationStorage.service';

// LocalStorage key for storing registered FCM token
const FCM_TOKEN_STORAGE_KEY = 'superadmin_fcm_token_registered';

// API helper for FCM token management
const fcmTokenApi = {
  register: async (token: string) => {
    const response = await apiClient.post('/superadmin/fcm-token', { token });
    return response.data;
  },
  remove: async (token: string) => {
    const response = await apiClient.delete('/superadmin/fcm-token', { data: { token } });
    return response.data;
  },
};

interface NotificationCallbacks {
  onRestaurantRegistration?: (restaurantId: string) => void;
  onSystemAlert?: () => void;
  onDashboardUpdate?: () => void;
}

/**
 * Custom hook for handling Firebase Cloud Messaging notifications for Super Admin
 * Supports both silent (data-only) and active (visible) notifications
 *
 * @param isAuthenticated - Whether super admin is logged in
 * @param callbacks - Optional callbacks for different notification types
 */
export const useNotifications = (
  isAuthenticated: boolean,
  callbacks?: NotificationCallbacks
) => {
  const navigate = useNavigate();
  const tokenRegistered = useRef(false);
  const currentToken = useRef<string | null>(null);

  /**
   * Handle silent notifications - trigger API calls without showing notification
   */
  const handleSilentNotification = useCallback(
    async (data: Record<string, string>) => {
      console.log('📡 Silent notification received (Super Admin):', data);

      // Save to localStorage
      notificationStorage.save({
        type: 'silent',
        category: data.category || 'silent',
        title: data.title || 'Silent Notification',
        body: data.body || 'Background update',
        data,
      });

      const action = data.action;
      const category = data.category;

      // RESTAURANT REGISTRATION - Refresh restaurant data
      if (action === 'refresh_restaurants' || category === 'restaurant_registration') {
        console.log('🔄 Refreshing restaurants list');
        if (callbacks?.onRestaurantRegistration && data.restaurantId) {
          callbacks.onRestaurantRegistration(data.restaurantId);
        }
      }

      // DASHBOARD UPDATES - Refresh dashboard data
      if (action === 'refresh_dashboard') {
        console.log('🔄 Refreshing dashboard');
        if (callbacks?.onDashboardUpdate) {
          callbacks.onDashboardUpdate();
        }
      }

      // SYSTEM ALERTS - Trigger system alert handling
      if (category === 'system_alert') {
        console.log('🚨 System alert received');
        if (callbacks?.onSystemAlert) {
          callbacks.onSystemAlert();
        }
      }
    },
    [callbacks]
  );

  /**
   * Handle active notifications - visible alerts to the super admin
   */
  const handleActiveNotification = useCallback(
    (data: Record<string, string>) => {
      console.log('🔔 Active notification received (Super Admin):', data);

      const category = data.category;
      const clickAction = data.clickAction;

      // Get title and body from data (sent by backend)
      const title = data.title || 'Super Admin Alert';
      const body = data.body || 'You have a new notification';

      // Save to localStorage
      notificationStorage.save({
        type: 'active',
        category: category || 'general',
        title,
        body,
        data,
      });

      console.log('📱 Showing toast notification:');
      console.log('   Title:', title);
      console.log('   Body:', body);
      console.log('   Category:', category);

      // NEW RESTAURANT REGISTRATION
      if (category === 'restaurant_registration') {
        const restaurantId = data.restaurantId;
        const restaurantName = data.restaurantName;

        toast.success(`New restaurant registered: ${restaurantName || 'Unknown'}`, {
          duration: 6000,
          onClick: () => {
            if (clickAction) {
              console.log('🔗 Navigating to:', clickAction);
              navigate(clickAction);
            } else if (restaurantId) {
              navigate(`/restaurants?highlight=${restaurantId}`);
            }
          },
        } as any);

        // Also trigger refresh
        if (callbacks?.onRestaurantRegistration && restaurantId) {
          console.log('🔄 Triggering restaurant refresh for:', restaurantId);
          callbacks.onRestaurantRegistration(restaurantId);
        }
      }

      // SYSTEM ALERTS
      else if (category === 'system_alert') {
        const severity = data.severity || 'info';

        // Use different toast styles based on severity
        const toastFn = severity === 'critical' || severity === 'error'
          ? toast.error
          : severity === 'warning'
          ? ((msg: string, opts: any) => toast(msg, { ...opts, icon: '⚠️' }))
          : toast.success;

        toastFn(body, {
          duration: 8000,
          onClick: () => {
            if (clickAction) {
              console.log('🔗 Navigating to:', clickAction);
              navigate(clickAction);
            }
          },
        } as any);

        // Trigger system alert callback
        if (callbacks?.onSystemAlert) {
          console.log('🚨 Triggering system alert callback');
          callbacks.onSystemAlert();
        }
      }

      // GENERAL NOTIFICATIONS
      else {
        toast.success(body, {
          duration: 5000,
          onClick: () => {
            if (clickAction) {
              console.log('🔗 Navigating to:', clickAction);
              navigate(clickAction);
            }
          },
        } as any);
      }
    },
    [navigate, callbacks]
  );

  /**
   * Register FCM token with backend
   * Only sends to backend if token is new or not yet registered in localStorage
   */
  const registerToken = useCallback(async () => {
    if (!isAuthenticated || !firebaseService.isReady()) {
      return;
    }

    try {
      console.log('🔑 Requesting FCM token from Firebase (Super Admin)...');

      // Get FCM token
      const token = await firebaseService.getToken();

      if (!token) {
        console.log('❌ No FCM token available');
        return;
      }

      console.log('🎫 FCM Token Generated (Super Admin):');
      console.log('   Full token:', token);
      console.log('   Token preview:', token.substring(0, 50) + '...');

      // Check if this token is already registered in localStorage
      const storedToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);

      if (storedToken === token) {
        console.log('✅ Token already registered in localStorage - skipping backend call');
        currentToken.current = token;
        tokenRegistered.current = true;
        return;
      }

      // New token or not yet registered - send to backend
      console.log('📤 Registering new token with backend...');
      const response = await fcmTokenApi.register(token);
      console.log('   Backend response:', response);

      // Store token in localStorage after successful registration
      localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);

      currentToken.current = token;
      tokenRegistered.current = true;

      console.log('✅ FCM token registered with backend successfully!');
      console.log('💾 Token saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to register FCM token:', error);
    }
  }, [isAuthenticated]);

  /**
   * Remove FCM token from backend (on logout)
   */
  const unregisterToken = useCallback(async () => {
    if (!currentToken.current) {
      return;
    }

    try {
      const token = currentToken.current;

      // Send token to backend for removal
      await fcmTokenApi.remove(token);
      await firebaseService.deleteToken();

      // Remove from localStorage
      localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);

      currentToken.current = null;
      tokenRegistered.current = false;

      console.log('✅ FCM token removed from backend');
      console.log('🗑️ Token removed from localStorage');
    } catch (error) {
      console.error('Failed to remove FCM token:', error);
    }
  }, []);

  /**
   * Request notification permission
   */
  const requestPermission = useCallback(async () => {
    const permission = await firebaseService.requestPermission();

    if (permission === 'granted') {
      console.log('✅ Notification permission granted');
      await registerToken();
    } else if (permission === 'denied') {
      console.log('❌ Notification permission denied');
      toast.error('Notifications are blocked. Enable them in browser settings for real-time updates.');
    }
  }, [registerToken]);

  /**
   * Check permission status
   */
  const checkPermission = useCallback(() => {
    return firebaseService.getPermissionStatus();
  }, []);

  /**
   * Setup foreground message listener
   */
  useEffect(() => {
    if (!firebaseService.isReady()) {
      console.log('⚠️  Firebase not ready, skipping message listener setup');
      return;
    }

    console.log('📡 Setting up foreground message listener (Super Admin)...');

    // Listen for foreground messages
    firebaseService.onForegroundMessage((payload) => {
      console.log('📩 Foreground message received (Super Admin)!');
      console.log('   Type:', payload.type);
      console.log('   Data:', payload.data);

      const { type, data } = payload;

      if (type === 'silent') {
        console.log('🔇 Handling silent notification...');
        handleSilentNotification(data);
      } else if (type === 'active') {
        console.log('🔔 Handling active notification...');
        handleActiveNotification(data);
      } else {
        console.log('❓ Unknown notification type:', type);
      }
    });

    console.log('✅ Foreground message listener setup complete');
  }, [handleSilentNotification, handleActiveNotification]);

  /**
   * Setup service worker message listener for background notifications
   */
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.log('⚠️  Service workers not supported');
      return;
    }

    console.log('📡 Setting up service worker message listener (Super Admin)...');

    const messageHandler = (event: MessageEvent) => {
      console.log('📬 Service worker message received (Super Admin):', event.data);

      if (event.data?.type === 'SILENT_NOTIFICATION') {
        console.log('🔇 Handling silent notification from service worker...');
        handleSilentNotification(event.data.data);
      } else if (event.data?.type === 'NAVIGATE') {
        console.log('🧭 Navigating to:', event.data.url);
        navigate(event.data.url);
      } else {
        console.log('❓ Unknown service worker message type:', event.data?.type);
      }
    };

    navigator.serviceWorker.addEventListener('message', messageHandler);

    console.log('✅ Service worker message listener setup complete');

    return () => {
      navigator.serviceWorker.removeEventListener('message', messageHandler);
      console.log('🗑️ Service worker message listener removed');
    };
  }, [handleSilentNotification, navigate]);

  /**
   * Auto-register token when super admin logs in
   */
  useEffect(() => {
    if (isAuthenticated && !tokenRegistered.current) {
      // Check if permission is already granted
      const permission = firebaseService.getPermissionStatus();

      if (permission === 'granted') {
        registerToken();
      } else if (permission === 'default') {
        // Auto-request permission for super admins on login
        requestPermission();
      }
    } else if (!isAuthenticated && tokenRegistered.current) {
      // Unregister when super admin logs out
      unregisterToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Only depend on isAuthenticated, not the callback functions

  return {
    requestPermission,
    checkPermission,
    isReady: firebaseService.isReady(),
    permissionStatus: checkPermission(),
  };
};

export default useNotifications;
