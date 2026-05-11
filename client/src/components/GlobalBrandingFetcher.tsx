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

export default function GlobalBrandingFetcher() {
  const { setWorkspacePrimaryColor } = useTheme();

  const { data: brandingData } = useQuery<any>({
    queryKey: ["/api/workspaces/branding"],
  });

  useEffect(() => {
    if (!brandingData) return;

    if (brandingData.color) {
      setWorkspacePrimaryColor(hexToHslString(brandingData.color));
    }

    if (brandingData.incoming_chat_color) {
      document.documentElement.style.setProperty("--incoming-bubble", brandingData.incoming_chat_color);
    }
    if (brandingData.incoming_chat_text_color) {
      document.documentElement.style.setProperty("--incoming-text", brandingData.incoming_chat_text_color);
    }
    if (brandingData.outgoing_chat_color) {
      document.documentElement.style.setProperty("--outgoing-bubble", brandingData.outgoing_chat_color);
    }
    if (brandingData.outgoing_chat_text_color) {
      document.documentElement.style.setProperty("--outgoing-text", brandingData.outgoing_chat_text_color);
    }
    if (brandingData.link_color) {
      document.documentElement.style.setProperty("--link-color", brandingData.link_color);
    }
  }, [brandingData]);

  return null;
}
