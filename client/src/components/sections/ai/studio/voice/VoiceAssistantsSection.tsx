import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, AppWindow, Info, Loader2, MoreVertical, NotebookText, Pencil, Phone, PhoneIncoming, PhoneOutgoing, Search, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getUserInfo, hasAnyPerm } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useOpenAiGate } from "../../useOpenAiGate";
import { getProvider } from "../providers";
import VoiceForm, { VoiceStep } from "./VoiceForm";
import { VoiceCallLogs, VoiceFunctionLogs } from "./VoiceLogs";
import { VOICE_PROVIDERS, VoiceAgent, VoiceType, emptyVoiceAgent, formatCredits, fromServer, voiceApi } from "./voiceApi";

/**
 * Settings → AI Studio → Voice Assistants — replyagent
 * `views/Workspaces/Settings/AIVoice/Index.vue`.
 */

type Mode = "LIST" | "EDIT" | "LOGS" | "FUNCTION_LOGS";

function Hint({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/** replyagent AnimatedCounter / AnimatedCredits — count up over 800 ms, ease-out cubic. */
function useAnimated(target: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const from = 0;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 800);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function StatCard({ label, tip, value, credits }: { label: string; tip?: string; value: number; credits?: boolean }) {
  const shown = useAnimated(Math.round(Number(value) || 0));
  return (
    <div className="rounded-2xl border bg-white dark:bg-slate-900/40 dark:border-slate-800 px-4 py-3">
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
        {label}
        {tip && (
          <Hint text={tip}>
            <Info size={12} className="cursor-help" />
          </Hint>
        )}
      </div>
      <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
        {credits ? formatCredits(shown) : shown}
        {credits && <span className="ml-1.5 text-[12px] font-medium text-slate-400">mins/secs</span>}
      </div>
    </div>
  );
}

export default function VoiceAssistantsSection() {
  const { t } = useTranslation();
  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = getUserInfo();
  const perms = user.permissions ?? [];
  const canManage = hasAnyPerm(perms, ["workspace.ai.voice.manage"]);
  const canDelete = hasAnyPerm(perms, ["workspace.ai.voice.delete"]);
  const { checkAssistant, checkVoiceCalls, gateDialog } = useOpenAiGate();

  const [mode, setMode] = useState<Mode>("LIST");
  const [agent, setAgent] = useState<VoiceAgent | null>(null);
  const [formStep, setFormStep] = useState<VoiceStep>("personalize");
  const [formKey, setFormKey] = useState(0);
  const [logAgent, setLogAgent] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [provider, setProvider] = useState("");
  const [toDelete, setToDelete] = useState<any | null>(null);
  const [code, setCode] = useState("");
  const [randomKey, setRandomKey] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // replyagent debounces the search by 400 ms.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  const listKey = ["/api/ai/voice-agent", debouncedSearch, status, provider];
  const { data, isLoading } = useQuery({
    queryKey: listKey,
    queryFn: () => voiceApi.list({ search: debouncedSearch, status_filter: status, provider_filter: provider }),
    enabled: mode === "LIST",
  });
  const agents: any[] = data?.agents ?? [];
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["/api/ai/voice-agent"] });

  const { data: branding } = useQuery<any>({
    queryKey: ["/api/workspaces/branding"],
    queryFn: async () => (await apiRequest("GET", "/api/workspaces/branding")).json(),
    staleTime: 5 * 60 * 1000,
  });

  const defaultInstructions = useMemo(
    () => ra("ai.voice_assistant.instruction", { AGENT_NAME: [user.first_name, user.last_name].filter(Boolean).join(" ") || "Assistant" }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  // ─── Actions ───────────────────────────────────────────────────────

  /** replyagent `editAssistant(agent)` — the AI Voice Calls switch is checked first. */
  const editAssistant = (row: any | null, step: VoiceStep = "personalize") => {
    if (!checkVoiceCalls()) return;
    setAgent(row ? fromServer(row, branding) : emptyVoiceAgent(defaultInstructions, branding));
    setFormStep(step);
    setFormKey((k) => k + 1);
    setMode("EDIT");
  };

  const setAgentType = (type: VoiceType) => setAgent((a) => (a ? { ...a, type } : a));

  const cancelEdit = () => {
    setAgent(null);
    setMode("LIST");
    refresh();
  };

  const onSaved = (saved: any, wasNew: boolean) => {
    toast({ title: wasNew ? ra("ai.created") : ra("ai.voice_assistant.updated") });
    queryClient.invalidateQueries({ queryKey: ["/api/automations/integrations"] });
    // replyagent reopens an active widget on its Install step so the URL is right there.
    if (saved.type === "widget" && saved.status === "ACTIVE") {
      setAgent(fromServer(saved, branding));
      setFormStep("embed");
      setFormKey((k) => k + 1);
      refresh();
      return;
    }
    cancelEdit();
  };

  const openDelete = (row: any) => {
    setCode("");
    setRandomKey(Math.floor(10000 + Math.random() * 90000));
    setToDelete(row);
  };

  const confirmDelete = async () => {
    if (!toDelete || parseInt(code, 10) !== randomKey) return;
    setDeleting(true);
    try {
      const res = await voiceApi.remove(toDelete.id);
      if (res?.success) {
        refresh();
        queryClient.invalidateQueries({ queryKey: ["/api/automations/integrations"] });
      }
    } catch {
      /* the global handler shows the error */
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  // ─── Modes ─────────────────────────────────────────────────────────

  const card = "rounded-3xl border bg-white dark:bg-[#0f1829] dark:border-slate-800 overflow-hidden shadow-sm";

  if (mode === "LOGS" && logAgent) return <VoiceCallLogs agent={logAgent} onBack={() => setMode("LIST")} />;
  if (mode === "FUNCTION_LOGS" && logAgent) return <VoiceFunctionLogs agent={logAgent} onBack={() => setMode("LIST")} />;

  if (mode === "EDIT" && agent && !agent.type) {
    const types: { type: VoiceType; icon: any }[] = [
      { type: "incoming", icon: PhoneIncoming },
      { type: "outgoing", icon: PhoneOutgoing },
      { type: "widget", icon: AppWindow },
    ];
    return (
      <div className={card}>
        <div className="px-8 py-5 border-b dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/images/integrations/chat_gpt.svg" alt="" className="h-10 w-10" />
            <div>
              <h1 className="text-[16px] font-bold">{ra("acl.ai_voice_assistants")}</h1>
              <p className="text-[12px] text-slate-500">{ra("ai.ai_voice_type_subtitle")}</p>
            </div>
          </div>
          <button type="button" onClick={cancelEdit} className="h-10 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
            {ra("back")}
          </button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map(({ type, icon: Icon }) => (
            <div key={type} className="rounded-2xl border dark:border-slate-800 p-6 flex flex-col">
              <img src="/images/integrations/chat_gpt.svg" alt="" className="h-16 w-16" />
              <div className="mt-4 flex items-center gap-2">
                <Icon size={20} className="text-primary" />
                <h5 className="text-[15px] font-bold">{ra(`ai.voice_assistant.type_${type}`)}</h5>
              </div>
              <p className="mt-2 flex-1 text-[12px] text-slate-500 leading-relaxed">{ra(`ai.voice_assistant.type_${type}_desc`)}</p>
              <button type="button" onClick={() => setAgentType(type)} className="mt-5 h-10 rounded-xl border text-[12px] font-semibold hover:border-primary/40 hover:text-primary dark:border-slate-800">
                {ra("select")}
              </button>
            </div>
          ))}
        </div>
        {gateDialog}
      </div>
    );
  }

  if (mode === "EDIT" && agent) {
    return (
      <>
        <VoiceForm
          key={formKey}
          agent={agent}
          initialStep={formStep}
          checkPermission={() => checkAssistant({ agentCount: agents.length, isCreate: agent.id == null })}
          onSaved={onSaved}
          onCancel={cancelEdit}
        />
        {gateDialog}
      </>
    );
  }

  // ─── List ──────────────────────────────────────────────────────────
  const directionOf = (type: string) =>
    type === "outgoing" ? { icon: PhoneOutgoing, label: "OUT" } : type === "widget" ? { icon: AppWindow, label: "WEB" } : { icon: PhoneIncoming, label: "IN" };

  return (
    <>
      <div className={card}>
        <div className="px-6 py-3.5 border-b dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/integrations/chat_gpt.svg" alt="" className="h-10 w-10" />
            <div>
              <h1 className="text-[15px] font-bold">{ra("acl.ai_voice_assistants")}</h1>
              <p className="text-[12px] text-slate-500">{ra("ai.voice_assistants_subtitle")}</p>
            </div>
          </div>
          {canManage && (
            <button type="button" onClick={() => editAssistant(null)} className="h-9 px-4 rounded-xl bg-primary text-white text-[12px] font-semibold">
              {ra("create_new")}
            </button>
          )}
        </div>

        <div className="px-6 py-3 border-b dark:border-slate-800 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1 max-w-xl">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={ra("ai.voice_search_placeholder")} className="h-9 rounded-xl pl-10" />
          </div>
          <div className="w-full md:w-44">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{ra("ai.voice_all_status")}</SelectItem>
                <SelectItem value="ACTIVE">{t("ai_studio.status_active")}</SelectItem>
                <SelectItem value="PENDING">{t("ai_studio.status_pending")}</SelectItem>
                <SelectItem value="PAUSED">{t("ai_studio.status_paused")}</SelectItem>
                <SelectItem value="FAILED">{t("ai_studio.status_failed")}</SelectItem>
                <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select value={provider || "__all__"} onValueChange={(v) => setProvider(v === "__all__" ? "" : v)}>
              <SelectTrigger className="h-9 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{ra("ai_studio.all_providers")}</SelectItem>
                {VOICE_PROVIDERS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span className="flex items-center gap-2">
                      <img src={p.logo} alt="" className="h-4 w-4 object-contain" /> {p.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="px-6 py-3 border-b dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label={ra("ai.voice_total_assistants")} tip={ra("ai.voice_total_assistants")} value={agents.length} />
          <StatCard label={ra("ai.voice_credits_remaining")} value={Number(data?.credits_remaining ?? 0)} credits />
          <StatCard label={ra("ai.voice_credits_used")} value={Number(data?.credits_used ?? 0)} credits />
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="animate-spin text-slate-400" />
            </div>
          ) : agents.length > 0 ? (
            <div className="rounded-2xl border dark:border-slate-800 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="text-[11px] uppercase tracking-wide text-slate-500 border-b dark:border-slate-800">
                  <tr>
                    <th className="text-left px-5 py-3">{ra("name")}</th>
                    <th className="text-left px-5 py-3">{ra("ai.voice_provider")}</th>
                    {/* replyagent's `phone` key is missing in every locale; plain label here. */}
                    <th className="text-left px-5 py-3">Phone</th>
                    <th className="text-left px-5 py-3">{ra("ai.voice_direction")}</th>
                    <th className="text-left px-5 py-3">{ra("ai.voice_recording")}</th>
                    <th className="text-left px-5 py-3">{ra("ai.voice_calls")}</th>
                    <th className="text-left px-5 py-3">{ra("status")}</th>
                    <th className="text-right px-5 py-3">{t("ai_studio.table_actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((row) => {
                    const p = getProvider(row.model_provider || "openai");
                    const dir = directionOf(row.type);
                    const DirIcon = dir.icon;
                    return (
                      <tr key={row.id} className="border-t dark:border-slate-800">
                        <td className="px-5 py-3.5 font-medium break-words">{row.name}</td>
                        <td className="px-5 py-3.5">
                          {p && (
                            <Hint text={`${p.label}: ${row.model ?? ""}`}>
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-blue-50 dark:bg-slate-900 dark:border-slate-700">
                                <img src={p.logo} alt={p.label} className="h-5 w-5 object-contain" />
                              </span>
                            </Hint>
                          )}
                        </td>
                        <td className="px-5 py-3.5">{row.phone_number?.twilio_phone_number ?? ""}</td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase">
                            <Phone size={13} className="text-primary" />
                            <DirIcon size={13} className="text-primary" /> {dir.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                            <span className={cn("h-2.5 w-2.5 rounded-full", row.record_calls ? "bg-green-500" : "bg-gray-300")} />
                            {row.record_calls ? "ON" : "OFF"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">{row.voice_logs_count ?? 0}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                              row.status === "ACTIVE" ? "border-green-300 bg-green-50 text-green-700" : "border-slate-300 bg-slate-50 text-slate-500",
                            )}
                          >
                            {row.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button type="button" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <MoreVertical size={15} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              {canManage && (
                                <DropdownMenuItem onClick={() => editAssistant(row)}>
                                  <Pencil size={13} className="mr-2" /> {ra("edit")}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => { setLogAgent(row); setMode("FUNCTION_LOGS"); }}>
                                <NotebookText size={13} className="mr-2" /> {ra("ai.function_logs")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setLogAgent(row); setMode("LOGS"); }}>
                                <Phone size={13} className="mr-2" /> {ra("ai.call_logs")}
                              </DropdownMenuItem>
                              {canDelete && (
                                <DropdownMenuItem className="text-red-600" onClick={() => openDelete(row)}>
                                  <Trash2 size={13} className="mr-2" /> {ra("delete")}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center text-center">
              <img src="/images/integrations/chat_gpt.svg" alt="" className="h-12 w-12" />
              <h3 className="mt-4 text-[15px] font-bold">{ra("ai.create_assistant")}</h3>
              <p className="mt-1.5 max-w-md text-[12px] text-slate-500">{ra("ai.create_assistant_desc")}</p>
              {canManage && (
                <button type="button" onClick={() => editAssistant(null)} className="mt-5 h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold">
                  {ra("create_new")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* replyagent delete modal with the 5-digit code guard. */}
      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent className="max-w-md">
          <div className="text-center">
            <AlertTriangle size={48} className="mx-auto text-orange-500" />
            <h3 className="mt-4 text-[16px] font-bold">{ra("ai.delete_assistant")}</h3>
          </div>
          <div className="text-[13px] space-y-2">
            <p>{ra("ai.delete_effect")}</p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400">
              <li>{ra("ai.delete_desc_1")}</li>
              <li>{ra("ai.delete_desc_2")}</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-[13px]" dangerouslySetInnerHTML={{ __html: ra("enter_code_here_label", { code: String(randomKey) }) }} />
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={ra("enter_code_here")} className="h-10 rounded-xl" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setToDelete(null)} className="h-10 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
              {ra("cancel")}
            </button>
            <button
              type="button"
              disabled={parseInt(code, 10) !== randomKey || deleting}
              onClick={confirmDelete}
              className="h-10 px-5 rounded-xl bg-red-500 text-white text-[12px] font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {deleting && <Loader2 size={13} className="animate-spin" />}
              {ra("delete")}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {gateDialog}
    </>
  );
}
