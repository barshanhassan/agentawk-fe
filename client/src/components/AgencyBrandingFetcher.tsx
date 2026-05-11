import { useEffect } from "react";
import { getUserInfo } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/contexts/ThemeContext";

function hexToHsl(hex: string): string {
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

export default function AgencyBrandingFetcher() {
  const { setAgencyPrimaryColor } = useTheme();

  const userInfo = getUserInfo();
  const agencyId = userInfo.modelable_id;

  const { data } = useQuery<any>({
    queryKey: [`/api/agencies/${agencyId}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}`);
      return res.json();
    },
    enabled: !!agencyId,
  });

  useEffect(() => {
    const color = data?.agency?.branding?.color;
    setAgencyPrimaryColor(color ? hexToHsl(color) : DEFAULT_BLUE);
  }, [data]);

  // Clear agency override when leaving the agency panel
  useEffect(() => {
    return () => {
      setAgencyPrimaryColor(null);
    };
  }, []);

  return null;
}
