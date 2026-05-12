import React from 'react';
import { useLocation, Redirect } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const checkAuth = () => {
  const token = localStorage.getItem("auth_token");
  return !!token;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [location] = useLocation();
  const isAuthenticated = checkAuth();

  if (!isAuthenticated && location !== '/login' && location !== '/forgot-password') {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
