import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/contexts/ThemeContext";

function hexToHslString(hex: string): string {
  if (!hex) return "217 91% 60%";
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
};

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

function applyCssVar(name: string, value?: string) {
  if (value) document.documentElement.style.setProperty(name, value);
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

    if (brandingData.incoming_chat_color) {
      next.incomingBubble = brandingData.incoming_chat_color;
      document.documentElement.style.setProperty("--incoming-bubble", brandingData.incoming_chat_color);
    }
    if (brandingData.incoming_chat_text_color) {
      next.incomingText = brandingData.incoming_chat_text_color;
      document.documentElement.style.setProperty("--incoming-text", brandingData.incoming_chat_text_color);
    }
    if (brandingData.outgoing_chat_color) {
      next.outgoingBubble = brandingData.outgoing_chat_color;
      document.documentElement.style.setProperty("--outgoing-bubble", brandingData.outgoing_chat_color);
    }
    if (brandingData.outgoing_chat_text_color) {
      next.outgoingText = brandingData.outgoing_chat_text_color;
      document.documentElement.style.setProperty("--outgoing-text", brandingData.outgoing_chat_text_color);
    }
    if (brandingData.link_color) {
      next.linkColor = brandingData.link_color;
      document.documentElement.style.setProperty("--link-color", brandingData.link_color);
    }

    writeCache(next);
  }, [brandingData]);

  return null;
}
