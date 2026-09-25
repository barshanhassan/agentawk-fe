import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronRight,
  FileText,
  Info,
  Loader2,
  Pencil,
  Pin,
  Plug,
  RotateCw,
  Trash2,
  UserCog,
  Wand2,
  Wrench,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import AgentFunctions from "./AgentFunctions";
import { ModelSelector, useWorkspaceIntegrations } from "./parts";
import { Assistant, McpServer, studioApi } from "./api";
import { PROVIDER_INTEGRATION_TYPE, getProvider } from "./providers";

/**
 * AI Studio → assistant create / edit — replyagent `AIStudio/PortkeyAgentForm.vue`.
 * Six steps: Base (name + models), Prompt, Configurations, Knowledge Base,
 * Functions, MCPs. Everything is saved together by Publish.
 */

type Step = "personalize" | "instructions" | "behaviour" | "knowledgebase" | "functions" | "mcps";

const MCP_TOOLS: Record<string, string[]> = {
  baserow: ["list_databases", "list_tables", "get_table_schema", "list_table_rows", "create_rows", "update_rows", "delete_rows"],
  supabase: [
    "list_tables", "list_extensions", "execute_sql", "list_migrations", "apply_migration", "get_logs", "get_advisors",
    "get_project_url", "get_publishable_keys", "generate_typescript_types", "list_edge_functions", "deploy_edge_function",
    "list_projects", "search_docs", "list_storage_buckets",
  ],
  calcom: [
    "getBookings", "createBooking", "getBooking", "rescheduleBooking", "cancelBooking", "getEventTypes", "getEventTypeById",
    "getAvailableSlots", "updateEventType", "deleteEventType",
  ],
};
const MCP_DEFAULT_TOOLS: Record<string, string[]> = {
  baserow: ["list_databases", "list_tables", "get_table_schema", "list_table_rows"],
  supabase: ["list_tables", "execute_sql", "list_extensions"],
  calcom: ["getBookings", "getBooking", "getEventTypes", "getEventTypeById", "getAvailableSlots", "createBooking", "rescheduleBooking"],
};
const MCP_DEFAULT_URLS: Record<string, string> = { supabase: "https://mcp.supabase.com/mcp" };
const MCP_BRAND: Record<string, { bg: string; color: string }> = {
  baserow: { bg: "#dbeafe", color: "#2563eb" },
  supabase: { bg: "#d1fae5", color: "#059669" },
  calcom: { bg: "#111827", color: "#ffffff" },
};
/** EZCONN integration `type` behind each MCP kind (replyagent: BASEROW / SUPABASE / CAL_DOT_COM). */
const MCP_INTEGRATION: Record<string, string> = { baserow: "BASEROW", supabase: "SUPABASE", calcom: "CAL" };

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

export default function AgentForm({
  agent: initial,
  onSaved,
  onCancel,
}: {
  agent: Assistant;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const { toast } = useToast();
  const { data: integrationsData } = useWorkspaceIntegrations();
  const integrations: any[] = integrationsData?.integrations ?? [];

  const [agent, setAgent] = useState<Assistant>(() => ({
    ...initial,
    knowledgebase_ids: initial.knowledgebase_ids ?? [],
    mcp_servers: (initial.mcp_servers ?? []).map((m) => ({ ...m, mcp_url: m.mcp_url || MCP_DEFAULT_URLS[m.type] || "" })),
  }));
  const [step, setStep] = useState<Step>("personalize");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [mcpForm, setMcpForm] = useState<(McpServer & { cal_account_id?: any }) | null>(null);
  const [mcpEditIndex, setMcpEditIndex] = useState<number | null>(null);
  const [mcpErrors, setMcpErrors] = useState({ name: false, mcp_url: false, cal_account_id: false });
  const instructionsRef = useRef<HTMLTextAreaElement>(null);
  const set = (patch: Partial<Assistant>) => setAgent((a) => ({ ...a, ...patch }));

  const kbQuery = useQuery({
    queryKey: ["/api/ai-studio/knowledgebases"],
    queryFn: () => studioApi.knowledgebases(),
    enabled: step === "knowledgebase",
  });
  const knowledgebases: any[] = kbQuery.data?.knowledgebases ?? [];

  const fieldsQuery = useQuery({
    queryKey: ["/api/custom-fields"],
    queryFn: async () => (await apiRequest("GET", "/api/custom-fields")).json(),
    enabled: agent.prompt_strategy === "dynamic",
  });
  const fieldList: any[] = Array.isArray(fieldsQuery.data?.fields)
    ? fieldsQuery.data.fields
    : Array.isArray(fieldsQuery.data)
      ? fieldsQuery.data
      : Array.isArray(fieldsQuery.data?.data)
        ? fieldsQuery.data.data
        : [];

  const hasActiveProviderAccount = useMemo(() => {
    const type = PROVIDER_INTEGRATION_TYPE[agent.provider as keyof typeof PROVIDER_INTEGRATION_TYPE];
    const i = integrations.find((x) => x.type === type);
    return !!i && String(i.status).toLowerCase() === "active";
  }, [agent.provider, integrations]);
  const isDeepseek = agent.provider === "deepseek";

  // DeepSeek has no function calling; there, the tab shows an explanation instead.
  const steps: { key: Step; icon: any; label: string }[] = [
    { key: "personalize", icon: UserCog, label: t("ai_studio.personality") },
    { key: "instructions", icon: FileText, label: t("ai_studio.instructions_step") },
    { key: "behaviour", icon: Wrench, label: ra("ai.configurations") },
    { key: "knowledgebase", icon: BookOpen, label: t("ai_studio.knowledgebase.title") },
    { key: "functions", icon: Wand2, label: ra("ai.assistants_functions") },
    { key: "mcps", icon: Plug, label: "MCPs" },
  ];

  const historyOptions = [
    { value: 3, label: ra("ai.very_short_context") },
    { value: 5, label: ra("ai.short_context") },
    { value: 10, label: ra("ai.average_context") },
    { value: 25, label: ra("ai.long_context") },
  ];

  /** replyagent `addKeyVariable()` — drop {{field}} at the cursor. */
  const insertVariable = (key: string) => {
    const el = instructionsRef.current;
    const pos = el?.selectionStart ?? agent.instructions.length;
    set({ instructions: `${agent.instructions.slice(0, pos)} {{${key}}} ${agent.instructions.slice(pos)}` });
  };

  const fail = (field: string, message: string, to?: Step) => {
    setErrors({ [field]: message });
    if (to) setStep(to);
    window.scrollTo(0, 0);
    return false;
  };

  /** replyagent `updateAssistant()` validation, in its order. */
  const validate = () => {
    const req = ra("validation.required_field");
    const name = agent.name ?? "";
    if (!name.trim()) return fail("name", req, "personalize");
    if (name.length > 250) return fail("name", ra("max_characters", { character: 250 }), "personalize");
    if (name.length < 5) return fail("name", ra("min_characters", { character: 5 }), "personalize");
    if (!String(agent.instructions ?? "").trim()) return fail("instructions", req, "instructions");
    if (agent.instructions.length > 250000) return fail("instructions", ra("max_characters", { character: 250000 }), "instructions");
    if (!agent.provider || !agent.model) return fail("model", req, "personalize");
    if (agent.fallback_allowed) {
      if (!agent.fallback_provider) return fail("fallback_provider", req, "personalize");
      if (!agent.fallback_model) return fail("fallback_model", req, "personalize");
      if (agent.provider === agent.fallback_provider) return fail("fallback_provider", t("ai_studio.same_provider_error"), "personalize");
    }
    const seen = new Set<string>();
    const dupes = new Set<string>();
    for (const f of agent.a_i_functions ?? []) {
      const n = (f.name || "").trim().toLowerCase();
      if (!n) continue;
      if (seen.has(n)) dupes.add(f.name.trim());
      seen.add(n);
    }
    if (dupes.size) {
      const msg = `${t("ai_studio.duplicate_function_names")}: ${Array.from(dupes).join(", ")}`;
      toast({ title: ra("error"), description: msg, variant: "destructive" });
      return fail("functions", msg, "functions");
    }
    setErrors({});
    return true;
  };

  const publish = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const res = agent.id != null ? await studioApi.update(agent.id, agent) : await studioApi.create(agent);
      if (res?.success && res.agent) onSaved();
      else toast({ title: ra("error"), description: res?.message || t("ai_studio.failed_to_save_agent"), variant: "destructive" });
    } catch (err: any) {
      toast({ title: ra("error"), description: err?.message || t("ai_studio.failed_to_save_agent"), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // ─── MCP ───────────────────────────────────────────────────────────
  const baserowIntegration = integrations.find((i) => i.type === "BASEROW");
  const baserowMcpServers: any[] = baserowIntegration?.modelable?.mcp_servers ?? [];
  const calAccounts = integrations
    .filter((i) => i.type === "CAL" && i.modelable)
    .map((i) => ({ id: i.modelable.id, name: i.modelable.name || "Cal.com Account" }));

  const createMcp = (type: string) => {
    const connected = type === "calcom" ? calAccounts.length > 0 : !!integrations.find((i) => i.type === MCP_INTEGRATION[type]);
    if (!connected) {
      toast({
        title: t("ai_studio.mcp.integration_required_title"),
        description: t("ai_studio.mcp.integration_required_message", { type: type.charAt(0).toUpperCase() + type.slice(1) }),
      });
      return;
    }
    setMcpForm({
      type,
      name: "",
      mcp_url: MCP_DEFAULT_URLS[type] || "",
      tools: [...(MCP_DEFAULT_TOOLS[type] || [])],
      read_only: true,
      ...(type === "calcom" ? { cal_account_id: null } : {}),
    });
    setMcpEditIndex(null);
    setMcpErrors({ name: false, mcp_url: false, cal_account_id: false });
  };
  const editMcp = (i: number) => {
    const m = agent.mcp_servers[i];
    setMcpForm({ ...m, tools: [...(m.tools || [])], read_only: m.read_only !== false, mcp_url: m.mcp_url || MCP_DEFAULT_URLS[m.type] || "", cal_account_id: m.account_id || m.cal_account_id || null });
    setMcpEditIndex(i);
    setMcpErrors({ name: false, mcp_url: false, cal_account_id: false });
  };
  const saveMcp = () => {
    if (!mcpForm) return;
    const errs = {
      name: !mcpForm.name?.trim(),
      mcp_url: mcpForm.type === "baserow" && !mcpForm.mcp_url,
      cal_account_id: mcpForm.type === "calcom" && !mcpForm.cal_account_id,
    };
    setMcpErrors(errs);
    if (errs.name || errs.mcp_url || errs.cal_account_id) return;
    const entry: any = { ...mcpForm };
    if (entry.type === "calcom") {
      entry.account_id = entry.cal_account_id || entry.account_id || null;
      delete entry.cal_account_id;
    }
    const list = [...(agent.mcp_servers ?? [])];
    if (mcpEditIndex !== null) list[mcpEditIndex] = entry;
    else list.push(entry);
    set({ mcp_servers: list });
    setMcpForm(null);
    setMcpEditIndex(null);
  };

  // ─── Render ────────────────────────────────────────────────────────
  const card = "rounded-[2rem] border bg-white dark:bg-[#0f1829] dark:border-slate-800 overflow-hidden shadow-sm";
  const lbl = "block text-[13px] font-semibold mb-1.5";
  const err = (k: string) => (errors[k] ? <p className="mt-1 text-[11px] text-red-500">{errors[k]}</p> : null);
  // A plain render helper, not a component: a component declared inside
  // render would remount on every value change and break the drag.
  const slider = (value: number, min: number, max: number, st: number, onChange: (v: number) => void) => (
    <input type="range" min={min} max={max} step={st} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full max-w-lg accent-[hsl(var(--primary))] mt-3" />
  );

  return (
    <form onSubmit={publish} className={card}>
      {/* Header */}
      <div className="px-8 py-5 border-b dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src="/images/ai-studio.png" alt="AI Studio" className="h-12 w-12 rounded-xl" />
          <div>
            <h1 className="text-[16px] font-bold">{ra("acl.ai_assistants")}</h1>
            <p className="text-[12px] text-slate-500">{ra("ai.ai_subtitle")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="h-10 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
            {ra("back")}
          </button>
          <button type="submit" disabled={saving} className="h-10 px-6 rounded-xl bg-primary text-white text-[12px] font-semibold flex items-center gap-2 disabled:opacity-60">
            {saving && <Loader2 size={12} className="animate-spin" />}
            {ra("publish")}
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="px-6 bg-slate-50 dark:bg-slate-950/40 border-b dark:border-slate-800 flex flex-wrap items-center">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.key} className="flex items-center">
              <button
                type="button"
                onClick={() => setStep(s.key)}
                className={cn("flex items-center gap-2 px-3 py-4 text-[12px] font-bold", step === s.key ? "text-primary" : "text-slate-500 hover:text-slate-800 dark:hover:text-white")}
              >
                <Icon size={15} /> {s.label}
              </button>
              {i < steps.length - 1 && <ChevronRight size={14} className="text-slate-400" />}
            </div>
          );
        })}
      </div>

      <div className="p-8">
        {/* Base: name + models */}
        {step === "personalize" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={lbl}>{ra("ai.assistant_name")}</label>
                <Input maxLength={250} value={agent.name} onChange={(e) => set({ name: e.target.value })} className="h-11 rounded-xl" />
                {err("name")}
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Switch checked={agent.fallback_allowed} onCheckedChange={(c) => set({ fallback_allowed: c })} className="data-[state=checked]:bg-primary" />
                  <span className="text-[13px] font-semibold">{t("ai_studio.enable_fallback_model")}</span>
                </label>
              </div>
            </div>
            <hr className="dark:border-slate-800" />
            {agent.fallback_allowed && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div />
                <div className="flex gap-2 rounded-xl border border-sky-200 bg-sky-50 dark:bg-sky-950/30 dark:border-sky-900 p-3 text-[12px] text-sky-800 dark:text-sky-200">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line">{t("ai_studio.fallback_compatibility_note")}</span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ModelSelector
                  value={{ provider: agent.provider, model: agent.model }}
                  onChange={(v) => set({ provider: v.provider, model: v.model })}
                  label={t("ai_studio.model_primary")}
                  exclude={agent.fallback_allowed ? agent.fallback_provider : ""}
                />
                {err("model")}
              </div>
              <div className={cn(!agent.fallback_allowed && "opacity-50 pointer-events-none")}>
                <ModelSelector
                  value={{ provider: agent.fallback_provider, model: agent.fallback_model }}
                  onChange={(v) => set({ fallback_provider: v.provider, fallback_model: v.model })}
                  label={t("ai_studio.model_fallback")}
                  exclude={agent.provider}
                  disabled={!agent.fallback_allowed}
                />
                {err("fallback_provider")}
                {err("fallback_model")}
                <p className="mt-2 text-[11px] text-slate-500">{t("ai_studio.fallback_model_description")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Prompt */}
        {step === "instructions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className={lbl}>{ra("ai.instructions")}</label>
              <Textarea ref={instructionsRef} rows={16} maxLength={250000} value={agent.instructions} onChange={(e) => set({ instructions: e.target.value })} />
              <p className="mt-1 text-[11px] text-orange-500">{ra("max_characters", { character: 100000 })}</p>
              {err("instructions")}
            </div>
            <div className="space-y-5">
              <label className={lbl}>{ra("ai.model_strategy")}</label>
              {[
                { v: "fixed" as const, icon: Pin, title: ra("cal.select_event_fixed"), desc: ra("ai.prompt_fixed") },
                { v: "dynamic" as const, icon: RotateCw, title: ra("cal.select_event_dynamic"), desc: ra("ai.prompt_dynamic") },
              ].map((o) => {
                const Icon = o.icon;
                return (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => set({ prompt_strategy: o.v })}
                    className={cn(
                      "w-full rounded-xl border-2 px-4 py-5 text-left shadow-sm hover:text-primary",
                      agent.prompt_strategy === o.v ? "border-primary bg-primary/5" : "dark:border-slate-800",
                    )}
                  >
                    <Icon size={18} />
                    <div className="mt-2 text-[11px] font-bold uppercase">{o.title}</div>
                    <div className="mt-1 text-[11px] text-slate-500 leading-snug">{o.desc}</div>
                  </button>
                );
              })}
              {agent.prompt_strategy === "dynamic" && (
                <div>
                  <label className={lbl}>{ra("ai.select_var")}</label>
                  <Select value="" onValueChange={(v) => insertVariable(v)}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder={ra("custom_field.select_custom_field")} />
                    </SelectTrigger>
                    <SelectContent>
                      {["first_name", "last_name", "full_name", "email", "mobile_number"].map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                      {fieldList.map((f: any) => (
                        <SelectItem key={f.id} value={f.slug ?? String(f.id)}>
                          {f.label ?? f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Configurations */}
        {step === "behaviour" && (
          <div className="space-y-8">
            <div className="flex gap-2 rounded-xl border border-sky-200 bg-sky-50 dark:bg-sky-950/30 dark:border-sky-900 p-3 text-[12px] text-sky-800 dark:text-sky-200">
              <Info size={14} className="shrink-0 mt-0.5" /> {t("ai_studio.temperature_alert")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Hint text={ra("ai.temperature_tt")}>
                  <label className={cn(lbl, "inline-flex items-center gap-1.5 cursor-help")}>
                    {ra("ai.temperature")} <Info size={12} />
                  </label>
                </Hint>
                {slider(agent.creativity, 0.01, 2, 0.01, (v) => set({ creativity: v }))}
                <div className="flex justify-between max-w-lg mt-1 text-[11px] text-slate-500">
                  <span>{ra("ai.no_temperature")}</span>
                  <span className="text-primary font-bold">{agent.creativity}</span>
                  <span>{ra("ai.temperature_high")}</span>
                </div>
              </div>
              <div>
                <Hint text={ra("ai.diversity_tt")}>
                  <label className={cn(lbl, "inline-flex items-center gap-1.5 cursor-help")}>
                    {ra("ai.diversity")} <Info size={12} />
                  </label>
                </Hint>
                {slider(agent.diversity, 0.01, 1, 0.01, (v) => set({ diversity: v }))}
                <div className="flex justify-between max-w-lg mt-1 text-[11px] text-slate-500">
                  <span>{ra("ai.less_diversity")}</span>
                  <span className="text-primary font-bold">{agent.diversity}</span>
                  <span>{ra("ai.more_diversity")}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 rounded-xl border border-sky-200 bg-sky-50 dark:bg-sky-950/30 dark:border-sky-900 p-3 text-[12px] text-sky-800 dark:text-sky-200">
              <Info size={14} className="shrink-0 mt-0.5" /> {t("ai_studio.token_size_info").replace(/\*\*/g, "")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Hint text={t("ai_studio.token_size_tt")}>
                  <label className={cn(lbl, "inline-flex items-center gap-1.5 cursor-help")}>
                    {t("ai_studio.token_size")} <Info size={12} />
                  </label>
                </Hint>
                {slider(agent.max_tokens, 100, 4096, 1, (v) => set({ max_tokens: v }))}
                <div className="flex justify-between max-w-lg mt-1 text-[11px] text-slate-500">
                  <span>100</span>
                  <span className="text-primary font-bold">{agent.max_tokens}</span>
                  <span>4096</span>
                </div>
              </div>
            </div>
            <div>
              <Hint text={ra("ai.conversation_history_limit_tt")}>
                <label className={cn(lbl, "inline-flex items-center gap-1.5 cursor-help")}>
                  {ra("ai.conversation_history_limit")} <Info size={12} />
                </label>
              </Hint>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                {historyOptions.map((o) => (
                  <Hint key={o.value} text={ra("ai.conversation_history_tt_n", { history: o.value })}>
                    <button
                      type="button"
                      onClick={() => set({ history_limit: o.value })}
                      className={cn(
                        "h-10 rounded-xl border text-[12px] font-semibold",
                        agent.history_limit === o.value ? "bg-primary text-white border-primary" : "bg-slate-50 dark:bg-slate-900 dark:border-slate-800",
                      )}
                    >
                      {o.label}
                    </button>
                  </Hint>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Base */}
        {step === "knowledgebase" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="text-primary" size={26} />
                <div>
                  <h3 className="text-[15px] font-semibold">{t("ai_studio.knowledgebase.title")}</h3>
                  <p className="text-[12px] text-slate-500">{t("ai_studio.knowledgebase.select_desc")}</p>
                </div>
              </div>
              {agent.knowledgebase_ids.length > 0 && (
                <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-[12px] font-medium">
                  {agent.knowledgebase_ids.length} {t("ai_studio.knowledgebase.selected")}
                </span>
              )}
            </div>
            {agent.provider && !hasActiveProviderAccount && (
              <div className="flex gap-3 rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 p-4">
                <AlertTriangle size={16} className="text-yellow-600 shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-yellow-700 dark:text-yellow-300">{t("ai_studio.knowledgebase.no_active_account_title")}</p>
                  <p className="text-[12px] text-yellow-600 dark:text-yellow-400 mt-1">
                    {t("ai_studio.knowledgebase.no_active_account_desc", { provider: getProvider(agent.provider)?.label ?? agent.provider })}
                  </p>
                </div>
              </div>
            )}
            {kbQuery.isLoading ? (
              <div className="text-[13px] text-slate-500 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> {ra("loading")}
              </div>
            ) : knowledgebases.length === 0 ? (
              <p className="text-[13px] text-slate-500">{t("ai_studio.knowledgebase.no_available")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {knowledgebases.map((kb) => {
                  const on = agent.knowledgebase_ids.map(String).includes(String(kb.id));
                  return (
                    <button
                      key={kb.id}
                      type="button"
                      onClick={() =>
                        set({
                          knowledgebase_ids: on
                            ? agent.knowledgebase_ids.filter((x) => String(x) !== String(kb.id))
                            : [...agent.knowledgebase_ids, kb.id],
                        })
                      }
                      className={cn("flex items-center justify-between rounded-xl border px-4 py-3 text-left", on ? "border-primary bg-primary/5" : "dark:border-slate-800")}
                    >
                      <div className="flex items-center gap-2">
                        {on && <Check size={14} className="text-primary" />}
                        <div>
                          <div className="text-[13px] font-medium">{kb.name}</div>
                          <div className="text-[11px] text-slate-500 flex gap-3">
                            {kb.pdf_files_count > 0 && <span>PDF {kb.pdf_files_count}</span>}
                            {kb.website_files_count > 0 && <span>Web {kb.website_files_count}</span>}
                            {kb.text_files_count > 0 && <span>Text {kb.text_files_count}</span>}
                            {!kb.pdf_files_count && !kb.website_files_count && !kb.text_files_count && <span>0 {t("ai_studio.knowledgebase.files")}</span>}
                          </div>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-bold",
                          kb.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : kb.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {kb.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Functions */}
        {step === "functions" &&
          (isDeepseek ? (
            <div className="py-12 text-center">
              <img src="/images/ai-providers/deepseek.svg" alt="" className="h-14 mx-auto" />
              <h3 className="mt-4 text-[15px] font-bold">{t("ai_studio.functions_not_available")}</h3>
              <p className="mt-1 text-[12px] text-slate-500">{t("ai_studio.functions_not_available_deepseek")}</p>
            </div>
          ) : (
            <AgentFunctions functions={agent.a_i_functions} onChange={(a_i_functions) => set({ a_i_functions })} />
          ))}

        {/* MCPs */}
        {step === "mcps" && (
          <div className="space-y-6">
            <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-3 text-[12px] text-amber-800 dark:text-amber-200">
              <Info size={14} className="shrink-0 mt-0.5" /> {t("ai_studio.mcp.runtime_note")}
            </div>
            {mcpForm ? (
              <div className="space-y-6">
                <div>
                  <label className={lbl}>{t("ai_studio.mcp.server_name")}</label>
                  <Input
                    maxLength={64}
                    value={mcpForm.name}
                    placeholder={t("ai_studio.mcp.server_name_placeholder")}
                    onChange={(e) => setMcpForm({ ...mcpForm, name: e.target.value.replace(/[^a-zA-Z0-9_.\-]/g, "").toLowerCase() })}
                    className="h-11 rounded-xl"
                  />
                  {mcpErrors.name && <p className="mt-1 text-[11px] text-red-500">{ra("validation.required_field")}</p>}
                </div>
                {mcpForm.type === "baserow" && (
                  <div>
                    <label className={lbl}>{t("ai_studio.mcp.select_url")}</label>
                    <Select value={mcpForm.mcp_url || ""} onValueChange={(v) => setMcpForm({ ...mcpForm, mcp_url: v })}>
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder={t("ai_studio.mcp.select_url_placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {baserowMcpServers.map((s: any) => (
                          <SelectItem key={s.url} value={s.url}>
                            {s.name} — {s.url}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {mcpErrors.mcp_url && <p className="mt-1 text-[11px] text-red-500">{ra("validation.required_field")}</p>}
                  </div>
                )}
                {mcpForm.type === "calcom" && (
                  <div>
                    <label className={lbl}>{t("ai_studio.mcp.select_calcom_account")}</label>
                    <Select value={mcpForm.cal_account_id != null ? String(mcpForm.cal_account_id) : ""} onValueChange={(v) => setMcpForm({ ...mcpForm, cal_account_id: v })}>
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder={t("ai_studio.mcp.select_calcom_account_placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {calAccounts.map((a) => (
                          <SelectItem key={a.id} value={String(a.id)}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {mcpErrors.cal_account_id && <p className="mt-1 text-[11px] text-red-500">{ra("validation.required_field")}</p>}
                  </div>
                )}
                {mcpForm.type === "supabase" && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={!!mcpForm.read_only} onCheckedChange={(c) => setMcpForm({ ...mcpForm, read_only: c })} className="data-[state=checked]:bg-primary" />
                      <span className="text-[13px] font-semibold">{t("ai_studio.mcp.read_only")}</span>
                    </label>
                    {!mcpForm.read_only && (
                      <div className="flex gap-2 rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 p-3 text-[12px] text-yellow-700 dark:text-yellow-300">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" /> {t("ai_studio.mcp.read_only_warning")}
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold">{t("ai_studio.mcp.select_tools")}</label>
                    <button
                      type="button"
                      className="text-[12px] text-primary hover:underline"
                      onClick={() => {
                        const all = MCP_TOOLS[mcpForm.type] ?? [];
                        setMcpForm({ ...mcpForm, tools: mcpForm.tools.length === all.length ? [] : [...all] });
                      }}
                    >
                      {mcpForm.tools.length === (MCP_TOOLS[mcpForm.type] ?? []).length ? t("ai_studio.mcp.deselect_all") : t("ai_studio.mcp.select_all")}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(MCP_TOOLS[mcpForm.type] ?? []).map((tool) => {
                      const on = mcpForm.tools.includes(tool);
                      return (
                        <label key={tool} className={cn("flex items-start gap-3 rounded-xl border p-3 cursor-pointer", on ? "border-primary/40 bg-primary/5" : "dark:border-slate-800")}>
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => setMcpForm({ ...mcpForm, tools: on ? mcpForm.tools.filter((x) => x !== tool) : [...mcpForm.tools, tool] })}
                            className="mt-1 accent-[hsl(var(--primary))]"
                          />
                          <div>
                            <div className="text-[13px] font-medium">{tool}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{t(`ai_studio.mcp.tools.${mcpForm.type}.${tool}`)}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-end gap-3 border-t pt-5 dark:border-slate-800">
                  <button type="button" onClick={() => setMcpForm(null)} className="h-9 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
                    {ra("cancel")}
                  </button>
                  <button type="button" onClick={saveMcp} className="h-9 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold">
                    {ra("save")}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h6 className="text-[12px] font-semibold text-slate-500">{t("ai_studio.mcp.get_started")}</h6>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                  {[
                    { type: "baserow", img: "/images/integrations/baserow.png", title: t("ai_studio.mcp.baserow_title"), desc: t("ai_studio.mcp.baserow_desc") },
                    { type: "supabase", img: "/images/integrations/supabase.png", title: ra("supabase.title"), desc: ra("supabase.mcp_desc") },
                    { type: "calcom", img: "/images/integrations/cal_dot_com.png", title: t("ai_studio.mcp.calcom_title"), desc: t("ai_studio.mcp.calcom_desc") },
                  ].map((c) => (
                    <button key={c.type} type="button" onClick={() => createMcp(c.type)} className="rounded-2xl border bg-white dark:bg-slate-900/40 dark:border-slate-800 px-5 py-7 text-left shadow-sm hover:border-primary/40 hover:text-primary">
                      <img src={c.img} alt="" className="h-9" />
                      <div className="mt-3 text-[12px] font-bold uppercase">{c.title}</div>
                      <div className="mt-1.5 text-[12px] text-slate-500 leading-snug">{c.desc}</div>
                    </button>
                  ))}
                </div>
                {agent.mcp_servers.length > 0 && (
                  <div className="mt-5">
                    <h6 className="text-[12px] font-semibold text-slate-500 mb-3">{t("ai_studio.mcp.configured")}</h6>
                    <div className="rounded-2xl border dark:border-slate-800 overflow-hidden">
                      <table className="w-full text-[13px]">
                        <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] uppercase text-slate-500">
                          <tr>
                            <th className="text-left px-4 py-2.5">{ra("name")}</th>
                            <th className="text-left px-4 py-2.5">{ra("type")}</th>
                            <th className="text-left px-4 py-2.5">{t("ai_studio.mcp.url")}</th>
                            <th className="text-center px-4 py-2.5">{t("ai_studio.mcp.tools_count")}</th>
                            <th className="text-right px-4 py-2.5">{ra("action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agent.mcp_servers.map((m, i) => (
                            <tr key={`${m.name}-${i}`} className="border-t dark:border-slate-800">
                              <td className="px-4 py-3">{m.name}</td>
                              <td className="px-4 py-3">
                                <span className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase" style={MCP_BRAND[m.type] ? { background: MCP_BRAND[m.type].bg, color: MCP_BRAND[m.type].color } : {}}>
                                  {m.type}
                                </span>
                              </td>
                              <td className="px-4 py-3 max-w-[220px] truncate text-slate-500">{m.mcp_url}</td>
                              <td className="px-4 py-3 text-center">{m.tools?.length ?? 0}</td>
                              <td className="px-4 py-3">
                                <div className="flex justify-end gap-3">
                                  <button type="button" onClick={() => editMcp(i)} className="text-primary">
                                    <Pencil size={14} />
                                  </button>
                                  <button type="button" onClick={() => set({ mcp_servers: agent.mcp_servers.filter((_, j) => j !== i) })} className="text-red-500">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {step === "personalize" && (
        <div className="px-8 py-5 border-t dark:border-slate-800 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="h-10 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
            {ra("cancel")}
          </button>
          <button type="submit" disabled={saving} className="h-10 px-6 rounded-xl bg-primary text-white text-[12px] font-semibold disabled:opacity-60">
            {ra("publish")}
          </button>
        </div>
      )}
    </form>
  );
}
