import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authApi, { SuperAdmin } from '../api/auth.api';

interface SuperAdminAuthContextType {
  superAdmin: SuperAdmin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSuperAdmin: () => Promise<void>;
}

const SuperAdminAuthContext = createContext<SuperAdminAuthContextType | undefined>(undefined);

interface SuperAdminAuthProviderProps {
  children: ReactNode;
}

export const SuperAdminAuthProvider: React.FC<SuperAdminAuthProviderProps> = ({ children }) => {
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-check auth on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('superadmin_token');

      if (token) {
        try {
          const admin = await authApi.getCurrentSuperAdmin();
          setSuperAdmin(admin);
        } catch (error) {
          console.error('Failed to fetch current super admin:', error);
          localStorage.removeItem('superadmin_token');
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password);
      localStorage.setItem('superadmin_token', response.token);
      setSuperAdmin(response.superAdmin as SuperAdmin);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('superadmin_token');
    setSuperAdmin(null);

    // Optional: Call logout API endpoint
    authApi.logout().catch((error) => {
      console.error('Logout API call failed:', error);
    });
  };

  const refreshSuperAdmin = async () => {
    try {
      const admin = await authApi.getCurrentSuperAdmin();
      setSuperAdmin(admin);
    } catch (error) {
      console.error('Failed to refresh super admin:', error);
      throw error;
    }
  };

  const value: SuperAdminAuthContextType = {
    superAdmin,
    isLoading,
    isAuthenticated: !!superAdmin,
    login,
    logout,
    refreshSuperAdmin,
  };

  return (
    <SuperAdminAuthContext.Provider value={value}>
      {children}
    </SuperAdminAuthContext.Provider>
  );
};

export const useSuperAdminAuth = (): SuperAdminAuthContextType => {
  const context = useContext(SuperAdminAuthContext);

  if (context === undefined) {
    throw new Error('useSuperAdminAuth must be used within a SuperAdminAuthProvider');
  }

  return context;
};

// Export as useAuth for convenience
export const useAuth = useSuperAdminAuth;
