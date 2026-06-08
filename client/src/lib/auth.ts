// Decodes JWT payload without verifying signature (client-side safe)
function decodeJwt(token: string): Record<string, any> | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

// Always returns a user object with modelable_id and permissions resolved.
// Priority: localStorage.user_info merged with JWT token payload (permissions only live in JWT).
export function getUserInfo(): Record<string, any> {
  try {
    const stored = JSON.parse(localStorage.getItem('user_info') || '{}');
    const token = localStorage.getItem('auth_token');
    const jwt = token ? decodeJwt(token) : null;

    return {
      ...stored,
      modelable_id: stored.modelable_id ?? jwt?.modelable_id,
      modelable_type: stored.modelable_type ?? jwt?.modelable_type,
      role: stored.role ?? jwt?.role,
      // Owner flag — owners bypass per-slug permission gates in the UI.
      is_owner: jwt?.is_owner ?? stored.is_owner ?? false,
      permissions: (jwt?.permissions ?? stored.permissions ?? []) as string[],
    };
  } catch {
    return {};
  }
}

// Returns true if user has ANY of the required permission slugs.
// Semantics:
//   - Empty/missing `required` → always true (public item).
//   - Group wildcard requirement like 'agency.users.*' → matches if user has the literal
//     'agency.users.*', any descendant 'agency.users.X', or the namespace owner wildcard 'agency.*'.
//   - Top-level namespace requirement 'agency.*' (or 'workspace.*') → owner-only:
//     ONLY matches the literal owner wildcard, NOT any descendant.
//   - Plain leaf requirement like 'agency.settings.help' → exact match, or namespace owner wildcard.
export function hasAnyPerm(userPerms: string[] | undefined, required: string[]): boolean {
  if (!required || required.length === 0) return true;
  const perms = userPerms ?? [];
  return required.some((req) => {
    // Owner wildcard always satisfies anything in its namespace
    const namespaceWildcard = req.split('.')[0] + '.*'; // 'agency.*' or 'workspace.*'
    if (perms.includes(namespaceWildcard)) return true;

    if (req.endsWith('.*')) {
      // Namespace-only requirement (e.g. 'agency.*') = owner-only, already checked above
      const parts = req.split('.');
      if (parts.length <= 2) return false;
      // Group wildcard (e.g. 'agency.users.*') matches the literal or any descendant
      const prefix = req.slice(0, -1); // 'agency.users.'
      return perms.some((p) => p === req || p.startsWith(prefix));
    }

    return perms.includes(req);
  });
}
