import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import Spinner from './ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-purple-900 to-violet-950">
        <div className="text-center">
          <Spinner size="xl" color="#a78bfa" />
          <p className="mt-4 text-violet-200 font-medium">Loading Super Admin Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
export { ProtectedRoute };
