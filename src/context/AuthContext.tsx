import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SuperAdmin } from '../types';

interface AuthContextType {
  superAdmin: SuperAdmin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (superAdmin: SuperAdmin, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if super admin is already logged in
    const storedAdmin = localStorage.getItem('superAdmin');
    const storedToken = localStorage.getItem('token');

    if (storedAdmin && storedToken) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setSuperAdmin(parsedAdmin);
      } catch (error) {
        console.error('Failed to parse stored super admin data:', error);
        localStorage.removeItem('superAdmin');
        localStorage.removeItem('token');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (adminData: SuperAdmin, token: string) => {
    setSuperAdmin(adminData);
    localStorage.setItem('superAdmin', JSON.stringify(adminData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setSuperAdmin(null);
    localStorage.removeItem('superAdmin');
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    superAdmin,
    isLoading,
    isAuthenticated: !!superAdmin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
