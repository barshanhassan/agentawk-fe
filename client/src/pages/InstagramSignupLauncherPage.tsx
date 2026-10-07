import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { oauthRedirectUri, buildOAuthState } from "@/lib/instagramOAuth";

/**
 * Self-hosted "Connect Instagram" intro screen — same replyagent
 * "metaconnect" pattern as the WhatsApp / Messenger launchers
 * (WhatsAppSignupLauncherPage, MessengerSignupLauncherPage), but simpler:
 * Instagram's native login (instagram.com/oauth/authorize) is a plain
 * full-page OAuth redirect, not a Facebook-SDK popup, so this page's only
 * job is to show the explanatory screen before handing off to Instagram's
 * own login page. Instagram redirects back to the existing
 * `/instagram-callback` route directly (same redirect_uri as before) —
 * this launcher isn't in that return path at all.
 */

const IG_APP_ID = "996773679700787";
const IG_SCOPES = [
  "instagram_business_basic",
  "instagram_business_manage_messages",
  "instagram_business_manage_comments",
  "instagram_business_content_publish",
  "instagram_business_manage_insights",
].join(",");

function buildIgAuthUrl(pageId?: string | number): string {
  const redirectUri = encodeURIComponent(oauthRedirectUri("/instagram-callback"));
  const state = encodeURIComponent(buildOAuthState(pageId));
  return `https://www.instagram.com/oauth/authorize?client_id=${IG_APP_ID}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(IG_SCOPES)}&response_type=code&state=${state}`;
}

export default function InstagramSignupLauncherPage() {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const dark = mode === "dark";
  const [busy, setBusy] = useState(false);

  // Reconnect flow carries the existing page id so the callback refreshes
  // that account's token in place, instead of creating a new row.
  const pageId = new URLSearchParams(window.location.search).get("page") || undefined;

  const handleContinue = () => {
    setBusy(true);
    window.location.href = buildIgAuthUrl(pageId);
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center px-4", dark ? "bg-slate-950" : "bg-white")}>
      <div className="max-w-2xl w-full text-center flex flex-col items-center">
        <div
          className="w-[88px] h-[88px] rounded-[22px] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)" }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2c-2.716 0-3.056.012-4.123.06-1.064.049-1.791.218-2.427.465a4.901 4.901 0 00-1.772 1.153A4.901 4.901 0 002.525 5.45c-.247.636-.416 1.363-.465 2.427C2.012 8.944 2 9.284 2 12s.012 3.056.06 4.123c.049 1.064.218 1.791.465 2.427a4.902 4.902 0 001.153 1.772 4.901 4.901 0 001.772 1.153c.636.247 1.363.416 2.427.465C8.944 21.988 9.284 22 12 22s3.056-.012 4.123-.06c1.064-.049 1.791-.218 2.427-.465a4.901 4.901 0 001.772-1.153 4.902 4.902 0 001.153-1.772c.247-.636.416-1.363.465-2.427.048-1.067.06-1.407.06-4.123s-.012-3.056-.06-4.123c-.049-1.064-.218-1.791-.465-2.427a4.902 4.902 0 00-1.153-1.772A4.901 4.901 0 0018.55 2.525c-.636-.247-1.363-.416-2.427-.465C15.056 2.012 14.716 2 12 2zm0 1.802c2.67 0 2.986.01 4.04.059.976.044 1.505.207 1.858.344.467.182.8.399 1.15.748.35.35.567.683.748 1.15.137.353.3.882.344 1.857.048 1.055.059 1.37.059 4.04 0 2.67-.01 2.986-.059 4.04-.044.976-.207 1.505-.344 1.858a3.1 3.1 0 01-.748 1.15 3.1 3.1 0 01-1.15.748c-.353.137-.882.3-1.857.344-1.054.048-1.37.059-4.04.059-2.67 0-2.987-.01-4.041-.059-.976-.044-1.505-.207-1.857-.344a3.098 3.098 0 01-1.15-.748 3.098 3.098 0 01-.749-1.15c-.137-.353-.3-.882-.344-1.857-.048-1.055-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.044-.976.207-1.505.344-1.858.182-.466.399-.8.749-1.15.35-.35.683-.566 1.15-.748.352-.137.881-.3 1.857-.344 1.054-.048 1.37-.059 4.04-.059z"
              fill="white"
            />
            <path
              d="M12 15.333A3.333 3.333 0 1112 8.667a3.333 3.333 0 010 6.666zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zM18.538 6.662a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"
              fill="white"
            />
          </svg>
        </div>

        <h1 className={cn("mt-8 font-bold text-4xl md:text-5xl", dark ? "text-white" : "text-slate-900")}>
          {t("instagram_signup_launcher_page.connect_instagram")}
        </h1>
        <p className={cn("mt-4 text-base", dark ? "text-slate-400" : "text-slate-500")}>
          {t("instagram_signup_launcher_page.follow_instructions")}
        </p>
        <p className={cn("mt-8 text-lg leading-relaxed max-w-xl", dark ? "text-slate-300" : "text-slate-700")}>
          {t("instagram_signup_launcher_page.permissions_note")}
        </p>

        <button
          onClick={handleContinue}
          disabled={busy}
          className="mt-8 px-8 h-12 rounded-lg text-base font-bold text-white transition-all disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)" }}
        >
          {busy ? t("instagram_signup_launcher_page.redirecting") : t("instagram_signup_launcher_page.continue_with_instagram")}
        </button>

        <button
          onClick={() => (window.location.href = `${window.location.origin}/settings?tab=Instagram`)}
          className={cn("mt-5 text-sm font-medium", dark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")}
        >
          {t("instagram_signup_launcher_page.cancel")}
        </button>
      </div>
    </div>
  );
}
