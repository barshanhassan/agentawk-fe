import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { loadFacebookSdk } from "@/lib/metaEmbeddedSignup";

/**
 * Self-hosted Facebook Login for Business launcher for Messenger — mirrors
 * WhatsAppSignupLauncherPage's own replyagent-parity pattern exactly: a
 * dedicated full-page route (`/messenger-connect`) shows a "Connect Facebook"
 * screen, and on click runs Meta's `FB.login` (which opens its own small
 * Facebook popup — not something this app manages). On completion it does a
 * full-page redirect back to the `?r=` return URL with the result in the hash
 * (`#c=<code>`), matching WhatsApp Embedded Signup's handoff convention.
 *
 * This Meta app is Business-type, so Messenger's `pages_messaging` /
 * `pages_manage_metadata` permissions can only be requested through a
 * Facebook Login for Business Login Configuration (`config_id`) — the
 * classic scope-based `/dialog/oauth` redirect is rejected for them ("this
 * app isn't available, needs at least one supported permission").
 */

// User-access-token config. Without a role on the app, Standard Access
// returns no Pages (a System-user config needs Advanced Access instead), so
// this only works for people holding a role on the Meta app until App Review
// is approved. The old System-user config is 1115534317507972.
const MESSENGER_LOGIN_CONFIG_ID = "1762165861669416";

function launchMessengerLogin(configId: string): Promise<{ code: string }> {
  return new Promise((resolve, reject) => {
    const FB = (window as any).FB;
    if (!FB) {
      reject(new Error("Facebook SDK is not initialised."));
      return;
    }
    // Keep this callback a plain (non-async) function — the SDK itself
    // type-checks it and rejects an `async function`.
    FB.login(
      (response: any) => {
        const code = response?.authResponse?.code;
        if (code) {
          resolve({ code });
          return;
        }
        if (response?.status === "unknown") {
          const err: any = new Error("User cancelled the sign-in.");
          err.code = "USER_CANCELLED";
          reject(err);
          return;
        }
        reject(new Error("Meta did not return an authorization code."));
      },
      {
        config_id: configId,
        response_type: "code",
        override_default_response_type: true,
      },
    );
  });
}

export default function MessengerSignupLauncherPage() {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const dark = mode === "dark";

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const returnUrlRef = useRef<string>(
    new URLSearchParams(window.location.search).get("r") || `${window.location.origin}/messenger-pages`,
  );
  const tenantOrigin = useRef<string>(
    (() => {
      try {
        return new URL(returnUrlRef.current, window.location.origin).origin;
      } catch {
        return window.location.origin;
      }
    })(),
  ).current;

  const appId = "979553311024998";
  const graphVersion = "v22.0";

  useEffect(() => {
    // Warm up the SDK so the dialog opens instantly on the first click.
    loadFacebookSdk(appId, graphVersion).catch(() => {
      /* surfaced on click */
    });
  }, []);

  const redirectToReturn = (hash: string) => {
    window.location.href = `${returnUrlRef.current}${hash}`;
  };

  const handleContinue = async () => {
    setError(null);
    setBusy(true);
    try {
      await loadFacebookSdk(appId, graphVersion);
      const { code } = await launchMessengerLogin(MESSENGER_LOGIN_CONFIG_ID);
      redirectToReturn(`#c=${encodeURIComponent(code)}`);
    } catch (err: any) {
      if (err?.code === "USER_CANCELLED") {
        redirectToReturn("");
        return;
      }
      setError(err?.message ?? t("messenger_signup_launcher_page.launch_error"));
      setBusy(false);
    }
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center px-4", dark ? "bg-slate-950" : "bg-white")}>
      <div className="max-w-2xl w-full text-center flex flex-col items-center">
        <div className="w-[88px] h-[88px] rounded-full bg-blue-600 flex items-center justify-center">
          <img src="/images/automations/messenger.svg" alt="Messenger" className="w-10 h-10" />
        </div>

        {error ? (
          <>
            <h1 className={cn("mt-8 font-bold text-3xl", dark ? "text-white" : "text-slate-900")}>
              {t("messenger_signup_launcher_page.could_not_start")}
            </h1>
            <p className={cn("mt-4 text-base leading-normal max-w-lg", dark ? "text-slate-400" : "text-slate-600")}>
              {error}
            </p>
          </>
        ) : (
          <>
            <h1 className={cn("mt-8 font-bold text-4xl md:text-5xl", dark ? "text-white" : "text-slate-900")}>
              {t("messenger_signup_launcher_page.connect_facebook")}
            </h1>
            <p className={cn("mt-4 text-base", dark ? "text-slate-400" : "text-slate-500")}>
              {t("messenger_signup_launcher_page.follow_instructions")}
            </p>
            <p className={cn("mt-8 text-lg leading-relaxed max-w-xl", dark ? "text-slate-300" : "text-slate-700")}>
              {t("messenger_signup_launcher_page.permissions_note")}
            </p>
          </>
        )}

        <button
          onClick={handleContinue}
          disabled={busy || !!error}
          className={cn(
            "mt-8 px-8 h-12 rounded-lg text-base font-bold text-white transition-all disabled:opacity-60",
            "bg-blue-600 hover:bg-blue-500",
          )}
        >
          {busy ? t("messenger_signup_launcher_page.waiting_for_facebook") : t("messenger_signup_launcher_page.continue_with_facebook")}
        </button>

        <button
          onClick={() => (window.location.href = `${tenantOrigin}/settings?tab=Messenger`)}
          className={cn("mt-5 text-sm font-medium", dark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")}
        >
          {t("messenger_signup_launcher_page.cancel")}
        </button>
      </div>
    </div>
  );
}
