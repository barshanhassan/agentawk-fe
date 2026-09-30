// Meta (Instagram / Facebook) login redirect handling for the multi-tenant subdomain model.
//
// Meta only accepts redirect URIs that are registered on the app, and every
// workspace lives on its own <tenant>.agentawk.com subdomain — they can't all be
// registered. So a tenant sends Meta back to ONE registered URI on the central
// app host (app.agentawk.com/<path>), which relays the result (query code or
// hash token) to the same path on the tenant's own origin, where the user is
// logged in. Same idea as replyagent's metaconnect `/instagram/business?r=`.
// Local dev hosts keep using their own origin.

import { isTenantHost, appHostUrl, ROOT_DOMAIN } from "./host";

/** The redirect_uri sent to Meta — and later to the backend's token exchange (they must match). */
export function oauthRedirectUri(path: string): string {
  return isTenantHost() ? appHostUrl(path) : `${window.location.origin}${path}`;
}

/** OAuth `state`: the workspace origin to return to, plus the page id when re-authorising an account. */
export function buildOAuthState(pageId?: string | number | null): string {
  const s = new URLSearchParams({ o: window.location.origin });
  if (pageId != null && pageId !== "") s.set("p", String(pageId));
  return s.toString();
}

export function parseOAuthState(state: string | null): { origin: string | null; pageId: string | null } {
  if (!state) return { origin: null, pageId: null };
  // Links from before the relay carried just the page id.
  if (!state.includes("=")) return { origin: null, pageId: state };
  const s = new URLSearchParams(state);
  return { origin: s.get("o"), pageId: s.get("p") };
}

/** `state` from the query (code flow) or the hash (token flow). */
function currentState(): string | null {
  return (
    new URLSearchParams(window.location.search).get("state") ??
    new URLSearchParams(window.location.hash.replace(/^#/, "")).get("state")
  );
}

/**
 * On the central host: the tenant URL this Meta callback must be forwarded to,
 * or null when it belongs to this origin. Only our own HTTPS workspace
 * subdomains can receive a code / token.
 */
export function oauthRelayTarget(path: string): string | null {
  const { origin } = parseOAuthState(currentState());
  if (!origin || origin === window.location.origin) return null;
  try {
    const u = new URL(origin);
    if (u.protocol !== "https:" || u.origin !== origin || !u.hostname.endsWith(`.${ROOT_DOMAIN}`)) return null;
  } catch {
    return null;
  }
  return `${origin}${path}${window.location.search}${window.location.hash}`;
}
