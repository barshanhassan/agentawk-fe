import { useEffect } from "react";
import { getUserInfo } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/contexts/ThemeContext";

export function hexToHsl(hex: string): string {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
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

const DEFAULT_BLUE = "217 91% 60%";
const AGENCY_COLOR_CACHE = "agencyPrimaryColor";

// Reads the last effective colour persisted by ThemeContext — used as a fallback
// seed so even the first load after this change is flash-free.
function readThemeCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )themePrimaryColor=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export default function AgencyBrandingFetcher() {
  const { setAgencyPrimaryColor } = useTheme();

  const userInfo = getUserInfo();
  const agencyId = userInfo.modelable_id;

  // Apply the last-known agency colour IMMEDIATELY on mount (from cache), before
  // the user-theme / workspace-branding fetches can briefly flip the colour to the
  // personal/default blue. The agency override is highest priority, so seeding it
  // synchronously here is what actually kills the blue flash.
  useEffect(() => {
    const cached = localStorage.getItem(AGENCY_COLOR_CACHE) || readThemeCookie();
    if (cached) setAgencyPrimaryColor(cached);
  }, []);

  const { data } = useQuery<any>({
    queryKey: [`/api/agencies/${agencyId}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}`);
      return res.json();
    },
    enabled: !!agencyId,
  });

  useEffect(() => {
    // While the query is loading, `data` is undefined — keep the cached colour,
    // never force blue. Apply (and cache) the real colour once it arrives.
    if (!data) return;
    const color = data?.agency?.branding?.color;
    const hsl = color ? hexToHsl(color) : DEFAULT_BLUE;
    setAgencyPrimaryColor(hsl);
    try { localStorage.setItem(AGENCY_COLOR_CACHE, hsl); } catch { /* ignore */ }
  }, [data]);

  // Clear agency override when leaving the agency panel
  useEffect(() => {
    return () => {
      setAgencyPrimaryColor(null);
    };
  }, []);

  return null;
}
