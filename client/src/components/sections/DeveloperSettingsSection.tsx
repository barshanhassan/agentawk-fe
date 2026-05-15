import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import {
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Trash2,
  Loader2,
  Code2,
  Webhook as WebhookIcon,
  Plus,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

type WebhookEvent = "Sent Message" | "Delivered Message" | "Read Message" | "Failed Message";

interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
}

interface DeveloperSettings {
  apiKey: string;
  webhooks: Webhook[];
}

const ALL_EVENTS: WebhookEvent[] = ["Sent Message", "Delivered Message", "Read Message", "Failed Message"];

const DeveloperSettingsSection = () => {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { toast } = useToast();

  const [showApiKey, setShowApiKey] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([]);
  const [webhookToDelete, setWebhookToDelete] = useState<Webhook | null>(null);

  // ── Design tokens ─────────────────────────────────────────
  const card       = dark ? "bg-[#0f1829]"    : "bg-white";
  const border     = dark ? "border-slate-800" : "border-slate-200";
  const text       = dark ? "text-white"      : "text-slate-900";
  const sub        = dark ? "text-slate-500"  : "text-slate-400";
  const softBg     = dark ? "bg-slate-950/40" : "bg-slate-50/50";
  const softBorder = dark ? "border-slate-800" : "border-slate-100";

  const inputCls = cn(
    "w-full h-11 rounded-xl text-[13px] font-bold transition-all px-4 border outline-none",
    "focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
    dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
  );

  const outlineBtn = cn(
    "h-11 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    dark ? "border-slate-800 text-slate-300 hover:border-primary/40 hover:text-primary" : "border-slate-200 text-slate-700 hover:border-primary/40 hover:text-primary"
  );

  const primaryOutlineBtn = cn(
    "h-10 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    "border-primary text-primary hover:bg-primary hover:text-white"
  );

  const primaryBtn =
    "h-11 px-7 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center gap-2";

  const labelCls = cn("block text-[10px] font-black uppercase tracking-widest", sub);

  const iconBtn = cn(
    "w-11 h-11 rounded-xl border flex items-center justify-center transition-all shrink-0",
    dark ? "border-slate-800 hover:border-primary/40 hover:text-primary text-slate-400" : "border-slate-200 hover:border-primary/40 hover:text-primary text-slate-500"
  );

  const { data: settings, isLoading } = useQuery<DeveloperSettings>({
    queryKey: ["/api/workspaces/developer-settings"],
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/workspaces/developer-settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces/developer-settings"] });
      toast({ title: "Settings Updated", description: "Your changes have been saved." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCopy = () => {
    if (settings?.apiKey) {
      navigator.clipboard.writeText(settings.apiKey);
      toast({ title: "Copied", description: "The API Key has been copied to your clipboard." });
    }
  };

  const handleRegenerate = () => mutation.mutate({ regenerateKey: true });

  const handleCreateWebhook = () => {
    let isValid = !!webhookUrl.trim();
    if (isValid) {
      try {
        new URL(webhookUrl);
      } catch {
        isValid = false;
      }
    }
    if (selectedEvents.length === 0) isValid = false;

    if (!isValid) {
      toast({ title: "Invalid Input", description: "Please provide a valid URL and select at least one event.", variant: "destructive" });
      return;
    }

    const newWebhook: Webhook = { id: `webhook-${Date.now()}`, url: webhookUrl, events: selectedEvents };
    mutation.mutate({ webhooks: [...(settings?.webhooks || []), newWebhook] });
    setWebhookUrl("");
    setSelectedEvents([]);
    setShowWebhookModal(false);
  };

  const handleDeleteWebhook = () => {
    if (!webhookToDelete) return;
    const updated = (settings?.webhooks || []).filter((w) => w.id !== webhookToDelete.id);
    mutation.mutate({ webhooks: updated });
    setWebhookToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
        <CardContent className="p-0">
          {/* Header */}
          <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl shadow-sm", "bg-primary/10")}>
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>Developer Settings</h1>
                <p className={cn("text-[11px] font-bold mt-0.5 opacity-60 max-w-2xl", sub)}>
                  Everything you need to connect your application with Digital Connect APIs.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            {/* API Docs */}
            <div className={cn("flex items-center justify-between gap-4 p-5 rounded-[1.5rem] border", softBg, softBorder)}>
              <div>
                <p className={cn("text-[13px] font-black", text)}>API Documentation</p>
                <p className={cn("text-[11px] font-medium opacity-60 mt-0.5", sub)}>
                  Understand our API capabilities and endpoints.
                </p>
              </div>
              <button className={cn(primaryOutlineBtn, "shrink-0")}>
                <ExternalLink size={12} /> View Docs
              </button>
            </div>

            {/* API Key */}
            <div className={cn("rounded-[1.5rem] border p-6 space-y-3", softBg, softBorder)}>
              <div>
                <p className={cn("text-[13px] font-black", text)}>API Key</p>
                <p className={cn("text-[11px] font-medium opacity-60 mt-0.5", sub)}>
                  Use this key to authenticate API requests.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-[480px]">
                  <input
                    readOnly
                    type={showApiKey ? "text" : "password"}
                    value={settings?.apiKey || ""}
                    className={cn(inputCls, "pr-12 font-mono text-[12px]")}
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className={cn("absolute right-3 top-1/2 -translate-y-1/2 transition-colors", sub, "hover:text-primary")}
                  >
                    {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <button onClick={handleCopy} className={iconBtn} title="Copy">
                  <Copy size={15} />
                </button>
                <button onClick={handleRegenerate} disabled={mutation.isPending} className={iconBtn} title="Regenerate">
                  <RefreshCw size={15} className={cn(mutation.isPending && "animate-spin")} />
                </button>
              </div>
            </div>

            {/* Webhooks */}
            <div className={cn("rounded-[1.5rem] border overflow-hidden", softBorder)}>
              <div className={cn("p-6 border-b flex items-center justify-between gap-4", softBorder, dark ? "bg-slate-900/40" : "bg-white/60")}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <WebhookIcon size={15} />
                  </div>
                  <div>
                    <p className={cn("text-[13px] font-black", text)}>Webhooks</p>
                    <p className={cn("text-[11px] font-medium opacity-60", sub)}>
                      Receive delivery reports for your WhatsApp template messages.
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowWebhookModal(true)} className={cn(primaryOutlineBtn, "shrink-0")}>
                  <Plus size={12} /> Configure
                </button>
              </div>

              <div className={cn("p-6", softBg)}>
                {settings?.webhooks && settings.webhooks.length > 0 ? (
                  <div className="space-y-3">
                    {settings.webhooks.map((webhook) => (
                      <div
                        key={webhook.id}
                        className={cn("flex items-center justify-between gap-3 p-4 rounded-xl border", softBorder, dark ? "bg-slate-900/40" : "bg-white")}
                      >
                        <div className="min-w-0 flex-1">
                          <p className={cn("text-[13px] font-black break-all", text)}>{webhook.url}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {webhook.events.map((e) => (
                              <span key={e} className="inline-flex h-5 px-2 items-center rounded-md border border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest">
                                {e}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => setWebhookToDelete(webhook)}
                          disabled={mutation.isPending}
                          className={cn("w-9 h-9 rounded-lg border flex items-center justify-center transition-all shrink-0", dark ? "border-slate-800 hover:border-rose-500/40 hover:text-rose-500 text-slate-400" : "border-slate-200 hover:border-rose-500/40 hover:text-rose-500 text-slate-500")}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <WebhookIcon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className={cn("text-[13px] font-black", text)}>No webhooks configured</h3>
                      <p className={cn("text-[11px] font-medium opacity-60", sub)}>
                        Configure a webhook to receive message status updates.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Webhook Modal ── */}
      <Dialog open={showWebhookModal} onOpenChange={setShowWebhookModal}>
        <DialogContent className={cn("border p-0 overflow-hidden rounded-[2rem] max-w-md", card, border)}>
          <div className="p-6 space-y-5">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <WebhookIcon size={18} />
                </div>
                <div className="text-left">
                  <DialogTitle className={cn("text-[13px] font-black uppercase tracking-widest", text)}>
                    Configure Webhook
                  </DialogTitle>
                  <DialogDescription className={cn("text-[11px] font-medium opacity-60 mt-0.5", sub)}>
                    Receive status updates at your endpoint.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-2">
              <label className={labelCls}>Webhook URL <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input
                  placeholder="https://example.com/api/webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value.slice(0, 2000))}
                  className={cn(inputCls, "pr-16")}
                />
                <span className={cn("absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold", sub)}>
                  {webhookUrl.length}/2000
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelCls}>Events <span className="text-rose-500">*</span></label>
              <p className={cn("text-[11px] font-medium opacity-60", sub)}>
                Select the events to receive status updates for.
              </p>
              <div className="space-y-2 pt-1">
                {ALL_EVENTS.map((event) => {
                  const checked = selectedEvents.includes(event);
                  return (
                    <div
                      key={event}
                      onClick={() =>
                        setSelectedEvents(checked ? selectedEvents.filter((e) => e !== event) : [...selectedEvents, event])
                      }
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all",
                        checked ? "border-primary bg-primary/5" : cn(softBorder, dark ? "bg-slate-900/40 hover:border-primary/40" : "bg-white hover:border-primary/40")
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        readOnly
                        className="rounded accent-[hsl(var(--primary))] w-4 h-4 pointer-events-none"
                      />
                      <span className={cn("text-[12px] font-black uppercase tracking-widest", text)}>{event}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={cn("flex justify-end gap-2 pt-4 border-t", softBorder)}>
              <button onClick={() => setShowWebhookModal(false)} className={outlineBtn}>Cancel</button>
              <button onClick={handleCreateWebhook} disabled={mutation.isPending} className={primaryBtn}>
                {mutation.isPending && <Loader2 size={12} className="animate-spin" />}
                <Plus size={12} /> Create
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <AlertDialog open={!!webhookToDelete} onOpenChange={(open) => !open && setWebhookToDelete(null)}>
        <AlertDialogContent className={cn("rounded-[2rem] border p-0 max-w-md overflow-hidden", card, border)}>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertCircle size={18} />
              </div>
              <div>
                <h2 className={cn("text-[13px] font-black uppercase tracking-widest", text)}>Delete Webhook?</h2>
                <p className={cn("text-[11px] font-medium opacity-60 mt-0.5 leading-relaxed", sub)}>
                  <span className="text-rose-500 font-black break-all">{webhookToDelete?.url || "This webhook"}</span> will be permanently removed.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel className={cn(outlineBtn, "m-0")}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteWebhook}
                className="h-11 px-7 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
              >
                <Trash2 size={12} /> Delete
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeveloperSettingsSection;
