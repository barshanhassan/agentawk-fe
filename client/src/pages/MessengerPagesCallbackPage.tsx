import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, XCircle, Loader2, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface AvailablePage {
  page_id: string;
  page_name: string;
  name: string;
  access_token: string;
  long_token: string;
  already_connected: boolean;
}

// Return page for MessengerSignupLauncherPage's self-hosted Facebook Login
// for Business flow (mirrors WhatsApp Embedded Signup's handoff convention —
// WhatsAppOnboardPage): the launcher redirects here with the OAuth code in
// the URL hash (`#c=<code>`), we post it to the backend for server-side
// exchange, then let the user connect the Pages they want (reusing the
// existing POST /messenger/pages route).
export default function MessengerPagesCallbackPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "pages" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [pages, setPages] = useState<AvailablePage[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    const code = hashParams.get("c");

    if (!code) {
      // No code = either an error mid-flow or the user cancelled in the
      // launcher's FB.login popup — either way there's nothing to fetch.
      setStatus("error");
      setErrorMsg(t("messenger_pages_callback_page.no_token_error"));
      return;
    }

    apiRequest("POST", "/api/messenger/available-pages-via-code", { code })
      .then((res) => res.json())
      .then((data: AvailablePage[]) => {
        setPages(data ?? []);
        setStatus("pages");
      })
      .catch((err) => {
        setStatus("error");
        setErrorMsg(err?.message ?? t("messenger_pages_callback_page.fetch_failed_error"));
      });
  }, []);

  async function connectPage(page: AvailablePage) {
    setConnecting(page.page_id);
    try {
      await apiRequest("POST", "/api/messenger/pages", {
        access_token: page.access_token,
        page_id: page.page_id,
        name: page.name,
      });
      setPages((prev) =>
        prev.map((p) => (p.page_id === page.page_id ? { ...p, already_connected: true } : p)),
      );
      toast({
        title: t("messenger_pages_callback_page.connected"),
        description: t("messenger_pages_callback_page.connected_toast_description", {
          name: page.name || t("messenger_pages_callback_page.default_account_name"),
        }),
      });
    } catch (err: any) {
      toast({
        title: t("messenger_pages_callback_page.error"),
        description: err?.message ?? t("messenger_pages_callback_page.connect_failed_error"),
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1829] flex items-center justify-center p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 max-w-lg w-full flex flex-col gap-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-[14px] font-black text-white uppercase tracking-widest">{t("messenger_pages_callback_page.title")}</h2>
            <p className="text-[11px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">{t("messenger_pages_callback_page.subtitle")}</p>
          </div>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <LoadingSpinner size={48} />
            <p className="text-[12px] font-bold text-slate-400">{t("messenger_pages_callback_page.fetching")}</p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <XCircle className="w-8 h-8 text-rose-500" />
            <p className="text-[12px] font-bold text-rose-400">{errorMsg}</p>
            <button
              onClick={() => setLocation("/settings?tab=Messenger")}
              className="h-9 px-6 rounded-xl border border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:border-primary/40 hover:text-primary transition-all"
            >
              {t("messenger_pages_callback_page.back_to_settings")}
            </button>
          </div>
        )}

        {/* Pages list */}
        {status === "pages" && (
          <>
            {pages.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <MessageSquare className="w-8 h-8 text-slate-600" />
                <p className="text-[12px] font-bold text-slate-400">{t("messenger_pages_callback_page.no_accounts_found")}</p>
                <p className="text-[10px] text-slate-500">{t("messenger_pages_callback_page.no_accounts_hint")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  {t("messenger_pages_callback_page.accounts_found", { count: pages.length })}
                </p>
                {pages.map((p) => (
                  <div
                    key={p.page_id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/40"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-black text-white truncate">{p.name || t("messenger_pages_callback_page.default_account_name")}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500">ID {p.page_id}</span>
                      </div>
                    </div>
                    {p.already_connected ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 shrink-0">
                        <CheckCircle size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t("messenger_pages_callback_page.connected")}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => connectPage(p)}
                        disabled={connecting === p.page_id}
                        className="h-8 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-60"
                      >
                        {connecting === p.page_id ? <Loader2 size={11} className="animate-spin" /> : null}
                        {t("messenger_pages_callback_page.connect")}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setLocation("/settings?tab=Messenger")}
              className="h-9 px-6 rounded-xl border border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:border-primary/40 hover:text-primary transition-all self-end"
            >
              {t("messenger_pages_callback_page.back_to_settings")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
