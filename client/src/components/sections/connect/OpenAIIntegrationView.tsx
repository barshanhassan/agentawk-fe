import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, ApiError } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, ExternalLink, Info, KeyRound, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Settings → Integrations → OpenAI.
 *
 * replyagent `views/Workspaces/Integrations/OpenAI.vue`, route
 * `/w/settings/integration/openai`:
 *   - a payment notice linking to the OpenAI Playground;
 *   - the API key — editable until saved, then shown masked and read-only,
 *     with Save swapped for Delete;
 *   - once connected, five feature cards. Four carry a switch that writes
 *     straight to `PUT /integrations/openai/:id`; Vision is information only
 *     (its switch is commented out in replyagent too).
 *
 * The key arrives already masked from the server (`*****…abc12`), so the page
 * never holds the real value after it is saved.
 */

type Flags = {
  chatgpt: boolean;
  transcribe: boolean;
  transcribe_outgoing: boolean;
  voice_calls: boolean;
};

const EMPTY_FLAGS: Flags = {
  chatgpt: false,
  transcribe: false,
  transcribe_outgoing: false,
  voice_calls: false,
};

const PLAYGROUND_URL = "https://platform.openai.com/playground";

/**
 * The same page serves replyagent's Anthropic.vue / Google.vue / DeepSeek.vue:
 * those are the key section alone (APIKeyManager) with a provider-specific
 * info line and link; only OpenAI has the payment notice and feature cards.
 */
export type AiProviderType = "CHATGPT" | "ANTHROPIC" | "GOOGLE" | "DEEPSEEK";

const PROVIDER_PAGE: Record<AiProviderType, { name: string; logo: string; info?: string; url?: string; placeholder: string }> = {
  CHATGPT: { name: "OpenAI", logo: "/images/integrations/chat_gpt.svg", placeholder: "sk-..." },
  ANTHROPIC: {
    name: "Anthropic",
    logo: "/images/ai-providers/anthropic.svg",
    info: "Enter your Anthropic API key to enable AI-powered responses using Claude models.",
    url: "https://console.anthropic.com/",
    placeholder: "sk-ant-...",
  },
  GOOGLE: {
    name: "Google Gemini",
    logo: "/images/ai-providers/google.svg",
    info: "Enter your Google Gemini API key to enable AI-powered responses using Gemini models.",
    url: "https://ai.google.dev/",
    placeholder: "AIza...",
  },
  DEEPSEEK: {
    name: "DeepSeek",
    logo: "/images/ai-providers/deepseek.svg",
    info: "Enter your DeepSeek API key to enable AI-powered responses using DeepSeek models.",
    url: "https://www.deepseek.com/",
    placeholder: "sk-...",
  },
};

export default function OpenAIIntegrationView({
  onBack,
  type = "CHATGPT",
}: {
  onBack: () => void;
  type?: AiProviderType;
}) {
  const page = PROVIDER_PAGE[type];
  const isOpenAi = type === "CHATGPT";
  const { t } = useTranslation();
  const { mode } = useTheme();
  const dark = mode === "dark";
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ── Design tokens (same as IntegrationsSection) ───────────
  const card = dark ? "bg-[#0f1829]" : "bg-white";
  const border = dark ? "border-slate-800" : "border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const sub = dark ? "text-slate-500" : "text-slate-400";
  const softBg = dark ? "bg-slate-950/40" : "bg-slate-50/50";
  const softBorder = dark ? "border-slate-800" : "border-slate-100";

  const inputCls = cn(
    "w-full h-11 rounded-xl text-[13px] font-bold transition-all px-4 pl-11 border outline-none",
    "focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
    dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900",
  );
  const primaryBtn =
    "h-11 px-7 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-semibold transition-all shadow-lg shadow-primary/20 flex items-center gap-2";
  const dangerBtn =
    "h-11 px-7 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-semibold transition-all flex items-center gap-2";
  const outlineBtn = cn(
    "h-10 px-5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-2",
    dark
      ? "border-slate-800 text-slate-300 hover:border-primary/40 hover:text-primary"
      : "border-slate-200 text-slate-700 hover:border-primary/40 hover:text-primary",
  );

  // Same cache entry as the Integrations list, so both views stay in step.
  const { data: integrationsData, isLoading } = useQuery({
    queryKey: ["/api/integrations"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/integrations");
      return res.json();
    },
  });
  const integration = integrationsData?.integrations?.find((i: any) => i.type === type) ?? null;
  const account = integration?.modelable ?? null;

  const [apiKey, setApiKey] = useState("");
  const [showRequired, setShowRequired] = useState(false);
  const [flags, setFlags] = useState<Flags>(EMPTY_FLAGS);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Load the stored flags whenever the account (re)appears.
  useEffect(() => {
    if (!account) {
      setFlags(EMPTY_FLAGS);
      return;
    }
    setFlags({
      chatgpt: !!account.chatgpt,
      transcribe: !!account.transcribe,
      transcribe_outgoing: !!account.transcribe_outgoing,
      voice_calls: !!account.voice_calls,
    });
  }, [account?.id, account?.chatgpt, account?.transcribe, account?.transcribe_outgoing, account?.voice_calls]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });

  const errorToast = (err: unknown) => {
    const e = err as ApiError;
    if (e?.body?.code === "VERFICATION_FAILED") {
      toast({
        title: t("openai_integration.toast_invalid_key"),
        description: e.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: t("openai_integration.toast_error_title"),
      description: (e as any)?.message ?? "",
      variant: "destructive",
    });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      // replyagent sends the key together with the (still default) flags.
      const res = await apiRequest(
        "POST",
        "/api/integrations",
        isOpenAi
          ? {
              type,
              api_key: apiKey.trim(),
              chatgpt: flags.chatgpt,
              transcribe: flags.transcribe,
              transcribe_outgoing: flags.transcribe_outgoing,
            }
          : { type, api_key: apiKey.trim() },
      );
      return res.json();
    },
    onSuccess: () => {
      setApiKey("");
      setShowRequired(false);
      refresh();
      toast({ title: t("openai_integration.toast_saved") });
    },
    onError: errorToast,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/integrations/${integration.id}`);
    },
    onSuccess: () => {
      setConfirmDelete(false);
      refresh();
      toast({ title: t("openai_integration.toast_deleted") });
    },
    onError: (err) => {
      setConfirmDelete(false);
      errorToast(err);
    },
  });

  const flagsMutation = useMutation({
    mutationFn: async (next: Flags) => {
      const res = await apiRequest("PUT", `/api/integrations/openai/${account.id}`, next);
      return res.json();
    },
    onSuccess: () => {
      refresh();
      toast({ title: t("openai_integration.toast_updated") });
    },
    onError: (err) => {
      // Put the switch back where the server still has it.
      refresh();
      errorToast(err);
    },
  });

  const toggle = (key: keyof Flags, value: boolean) => {
    const next = { ...flags, [key]: value };
    setFlags(next);
    flagsMutation.mutate(next);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setShowRequired(true);
      return;
    }
    saveMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  const featureCards: { key: keyof Flags | "vision"; title: string; description: string }[] = [
    { key: "chatgpt", title: t("openai_integration.chatgpt_title"), description: t("openai_integration.chatgpt_description") },
    { key: "transcribe", title: t("openai_integration.whisper_title"), description: t("openai_integration.whisper_description") },
    { key: "transcribe_outgoing", title: t("openai_integration.whisper_outgoing_title"), description: t("openai_integration.whisper_outgoing_description") },
    { key: "vision", title: t("openai_integration.vision_title"), description: t("openai_integration.vision_description") },
    { key: "voice_calls", title: t("openai_integration.voice_calls_title"), description: t("openai_integration.voice_calls_description") },
  ];

  return (
    <div className="space-y-5">
      <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
        <CardContent className="p-0">
          {/* Header */}
          <div className={cn("px-8 py-5 border-b flex items-center justify-between gap-4", border)}>
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center border shrink-0", dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <img src={page.logo} alt={page.name} className="h-8 w-8 object-contain" />
              </div>
              <div>
                <p className={cn("text-[11px] font-semibold", sub)}>{t("openai_integration.eyebrow")}</p>
                <h1 className={cn("text-[16px] font-bold tracking-tight", text)}>{isOpenAi ? t("openai_integration.title") : page.name}</h1>
              </div>
            </div>
            <button onClick={onBack} className={outlineBtn}>
              <ArrowLeft size={12} />
              {t("openai_integration.back")}
            </button>
          </div>

          <div className="p-8 space-y-6">
            {/* Payment notice */}
            <div
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3",
                dark ? "border-sky-900/60 bg-sky-950/30 text-sky-200" : "border-sky-200 bg-sky-50 text-sky-800",
              )}
            >
              <Info size={16} className="mt-0.5 shrink-0" />
              <p className="text-[12px] font-medium leading-relaxed flex-1">
                {isOpenAi ? t("openai_integration.payment_notice") : page.info}{" "}
                <a
                  href={isOpenAi ? PLAYGROUND_URL : page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold underline underline-offset-2"
                >
                  {isOpenAi ? t("openai_integration.payment_link") : null}
                  <ExternalLink size={12} />
                </a>
              </p>
            </div>

            {/* API key */}
            <form onSubmit={submit} autoComplete="off" className="w-full md:w-1/2 space-y-2">
              <label className={cn("block text-[11px] font-semibold", sub)}>
                {t("openai_integration.api_key_label")}
              </label>
              <div className="flex gap-3">
                <div className="grow">
                  <div className="relative">
                    <div className={cn("absolute left-4 top-1/2 -translate-y-1/2", sub)}>
                      <KeyRound size={14} />
                    </div>
                    {account ? (
                      <input
                        type="text"
                        readOnly
                        value={account.api_key ?? ""}
                        className={cn(inputCls, "opacity-70 cursor-not-allowed")}
                      />
                    ) : (
                      <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value);
                          if (e.target.value.trim()) setShowRequired(false);
                        }}
                        placeholder={page.placeholder}
                        className={inputCls}
                      />
                    )}
                  </div>
                  {showRequired && (
                    <em className="block text-[11px] text-red-500 mt-1">
                      {t("openai_integration.required_field")}
                    </em>
                  )}
                </div>

                {integration ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    disabled={deleteMutation.isPending}
                    className={dangerBtn}
                  >
                    {deleteMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    {t("openai_integration.delete")}
                  </button>
                ) : (
                  <button type="submit" disabled={saveMutation.isPending} className={primaryBtn}>
                    {saveMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                    {t("openai_integration.save")}
                  </button>
                )}
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Feature cards — only once connected */}
      {isOpenAi && integration && account && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featureCards.map((f) => (
            <div key={f.key} className={cn("p-6 rounded-[1.5rem] border flex gap-4", card, softBorder, softBg)}>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border shrink-0", dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <img src="/images/integrations/chat_gpt.svg" alt="" className="h-7 w-7 object-contain" />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className={cn("text-[14px] font-black tracking-tight", text)}>{f.title}</h3>
                <p className={cn("text-[11px] font-medium opacity-70 leading-relaxed", sub)}>{f.description}</p>
                {f.key !== "vision" && (
                  <div className="flex justify-end">
                    <Switch
                      checked={flags[f.key]}
                      onCheckedChange={(c) => toggle(f.key as keyof Flags, c)}
                      disabled={flagsMutation.isPending}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("openai_integration.confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("openai_integration.confirm_description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("openai_integration.confirm_cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                deleteMutation.mutate();
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              {t("openai_integration.confirm_ok")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
