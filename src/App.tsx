import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SuperAdminAuthProvider } from './context/SuperAdminAuthContext';
import { useSuperAdminAuth } from './context/SuperAdminAuthContext';
import { useNotifications } from './hooks/useNotifications';
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminLayout from './components/layout/SuperAdminLayout';
import {
  Login,
  Dashboard,
  Restaurants,
  Admins,
  Subscriptions,
  Plans,
  Analytics,
  Settings,
  AuditLogs,
  Support,
  Reports,
} from './pages';
import Notifications from './pages/Notifications';

// Inner component that uses hooks
const AppContent: React.FC = () => {
  const { isAuthenticated } = useSuperAdminAuth();

  // Initialize notifications for super admin
  useNotifications(isAuthenticated, {
    onRestaurantRegistration: (restaurantId) => {
      console.log('New restaurant registered:', restaurantId);
      // Optionally trigger data refresh here
    },
    onSystemAlert: () => {
      console.log('System alert received');
      // Handle system alerts
    },
    onDashboardUpdate: () => {
      console.log('Dashboard update received');
      // Refresh dashboard data
    },
  });

  return (
    <>
      <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/admins" element={<Admins />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/support" element={<Support />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        {/* Toast Notifications with Violet Theme */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -2px rgba(139, 92, 246, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#8b5cf6',
                secondary: '#ffffff',
              },
              style: {
                border: '1px solid #8b5cf6',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
              style: {
                border: '1px solid #ef4444',
              },
            },
            loading: {
              iconTheme: {
                primary: '#8b5cf6',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SuperAdminAuthProvider>
        <AppContent />
      </SuperAdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;
