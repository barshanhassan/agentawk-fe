// Decodes JWT payload without verifying signature (client-side safe)
function decodeJwt(token: string): Record<string, any> | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

// Always returns a user object with modelable_id resolved.
// Priority: localStorage.user_info → JWT token payload fallback
export function getUserInfo(): Record<string, any> {
  try {
    const stored = JSON.parse(localStorage.getItem('user_info') || '{}');

    if (stored.modelable_id) return stored;

    // Fallback: decode JWT to get modelable_id
    const token = localStorage.getItem('auth_token');
    if (!token) return stored;

    const jwt = decodeJwt(token);
    if (!jwt) return stored;

    return {
      ...stored,
      modelable_id: jwt.modelable_id ?? stored.modelable_id,
      modelable_type: jwt.modelable_type ?? stored.modelable_type,
      role: jwt.role ?? stored.role,
    };
  } catch {
    return {};
  }
}
