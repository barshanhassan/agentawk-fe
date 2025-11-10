import React from 'react';
import { useLocation, Redirect } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const checkAuth = () => {
  // In a real application, this would involve checking a token, session, etc.
  // For this demo, we check for a simple 'demoLogin=true' cookie.
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
