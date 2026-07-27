import React from 'react';
import { useLocation, Redirect } from 'wouter';
import { getUserInfo, hasAnyPerm } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  // If provided, user must have ANY of these permission slugs to access the route.
  // Same semantics as the sidebar's hasAnyPerm — owner wildcards (`agency.*`/`workspace.*`)
  // always pass; group wildcards like `agency.users.*` match any descendant.
  permissions?: string[];
  // Where to send users who fail the permission check. Defaults to the agency dashboard.
  fallbackTo?: string;
}

const checkAuth = () => {
  const token = localStorage.getItem('auth_token');
  return !!token;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, permissions, fallbackTo }) => {
  const [location] = useLocation();
  const isAuthenticated = checkAuth();

  if (!isAuthenticated && location !== '/login' && location !== '/forgot-password') {
    return <Redirect to="/login" />;
  }

  if (permissions && permissions.length > 0) {
    const userPerms = (getUserInfo().permissions as string[] | undefined) ?? [];
    if (!hasAnyPerm(userPerms, permissions)) {
      const target = fallbackTo ?? (location.startsWith('/org') ? '/org' : '/');
      return <Redirect to={target} />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
