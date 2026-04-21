import React from 'react';
import { useLocation, Redirect } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const checkAuth = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) return false;

  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith('demoLogin=true')) {
      return true;
    }
  }
  return false;
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
