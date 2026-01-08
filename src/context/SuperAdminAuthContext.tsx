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
    // Optimistic auth check - just check if token exists
    // If token is invalid, API calls will return 401 and interceptor will handle logout
    const checkAuth = () => {
      const token = localStorage.getItem('superadmin_token');
      const cachedAdmin = localStorage.getItem('superadmin_data');

      if (token && cachedAdmin) {
        try {
          // Use cached admin data to avoid unnecessary API call
          setSuperAdmin(JSON.parse(cachedAdmin));
        } catch (error) {
          console.error('Failed to parse cached admin data:', error);
          localStorage.removeItem('superadmin_token');
          localStorage.removeItem('superadmin_data');
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
      localStorage.setItem('superadmin_data', JSON.stringify(response.superAdmin));
      setSuperAdmin(response.superAdmin as SuperAdmin);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_data');
    setSuperAdmin(null);

    // Optional: Call logout API endpoint
    authApi.logout().catch((error) => {
      console.error('Logout API call failed:', error);
    });
  };

  const refreshSuperAdmin = async () => {
    try {
      const admin = await authApi.getCurrentSuperAdmin();
      localStorage.setItem('superadmin_data', JSON.stringify(admin));
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
