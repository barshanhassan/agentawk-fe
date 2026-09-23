import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/contexts/ThemeContext";

function hexToHslString(hex: string): string {
  if (!hex) return "142 70% 49%";
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Per-host cache so each workspace subdomain remembers its own brand colours
// — without this, the first paint on every load shows the default blue until
// /api/workspaces/branding resolves (the ~2-3s flash the user reported).
const HOST = typeof window !== "undefined" ? window.location.host : "";
const CACHE_KEY = `workspaceBrandingCache:${HOST}`;

type CachedBranding = {
  primaryHsl?: string;
  incomingBubble?: string;
  incomingText?: string;
  outgoingBubble?: string;
  outgoingText?: string;
  linkColor?: string;
  faviconUrl?: string;
};

// The favicon <link> is a static tag in index.html — this is the only place
// that ever updates it, so a workspace's uploaded favicon actually shows in
// the browser tab instead of always being the default AgentAwk icon.
function applyFavicon(url?: string) {
  if (!url) return;
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = url;
}

function readCache(): CachedBranding | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CachedBranding) : null;
  } catch {
    return null;
  }
}

function writeCache(v: CachedBranding) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(v));
  } catch {
    /* localStorage full / disabled — silently skip; next reload will pay the flash */
  }
}

// Explicitly clears an override when there's no value, instead of silently
// leaving whatever was set before — otherwise a color that was once cached
// (e.g. from a bug, or a since-reverted customization) stays stuck as an
// inline override forever, even after the backing data goes back to null.
function applyCssVar(name: string, value?: string) {
  if (value) {
    document.documentElement.style.setProperty(name, value);
  } else {
    document.documentElement.style.removeProperty(name);
  }
}

export default function GlobalBrandingFetcher() {
  const { setWorkspacePrimaryColor } = useTheme();

  // Apply the cached branding IMMEDIATELY on mount — mirrors AgencyBrandingFetcher.
  // Without this the workspace flashes the default blue for the ~2-3s the API takes.
  useEffect(() => {
    const cached = readCache();
    if (!cached) return;
    if (cached.primaryHsl) setWorkspacePrimaryColor(cached.primaryHsl);
    applyCssVar("--incoming-bubble", cached.incomingBubble);
    applyCssVar("--incoming-text", cached.incomingText);
    applyCssVar("--outgoing-bubble", cached.outgoingBubble);
    applyCssVar("--outgoing-text", cached.outgoingText);
    applyCssVar("--link-color", cached.linkColor);
    applyFavicon(cached.faviconUrl);
  }, []);

  const { data: brandingData } = useQuery<any>({
    queryKey: ["/api/workspaces/branding"],
  });

  useEffect(() => {
    if (!brandingData) return;

    const next: CachedBranding = {};

    if (brandingData.color) {
      const hsl = hexToHslString(brandingData.color);
      next.primaryHsl = hsl;
      setWorkspacePrimaryColor(hsl);
    }

    next.incomingBubble = brandingData.incoming_chat_color || undefined;
    applyCssVar("--incoming-bubble", next.incomingBubble);
    next.incomingText = brandingData.incoming_chat_text_color || undefined;
    applyCssVar("--incoming-text", next.incomingText);
    next.outgoingBubble = brandingData.outgoing_chat_color || undefined;
    applyCssVar("--outgoing-bubble", next.outgoingBubble);
    next.outgoingText = brandingData.outgoing_chat_text_color || undefined;
    applyCssVar("--outgoing-text", next.outgoingText);
    next.linkColor = brandingData.link_color || undefined;
    applyCssVar("--link-color", next.linkColor);
    if (brandingData.favicon_url) {
      next.faviconUrl = brandingData.favicon_url;
      applyFavicon(brandingData.favicon_url);
    }

    writeCache(next);
  }, [brandingData]);

  return null;
}
