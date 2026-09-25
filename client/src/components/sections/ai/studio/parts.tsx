import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Bot, Info, Search, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { connectedProviders, getProvider, modelName, modelsFor, ProviderInfo } from "./providers";

/**
 * Small AI Studio pieces — replyagent ProviderLogos.vue, ProviderDropdown.vue,
 * ModelSelector.vue, PortkeyAgentStats.vue, PortkeyAgentFilters.vue and
 * PortkeyEmptyState.vue.
 */

export function useWorkspaceIntegrations() {
  return useQuery({
    queryKey: ["/api/integrations"],
    queryFn: async () => (await apiRequest("GET", "/api/integrations")).json(),
  });
}

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

// ─── ProviderLogos ────────────────────────────────────────────────────

export function ProviderLogos({
  provider,
  model,
  fallbackProvider,
  fallbackModel,
  showFallback,
}: {
  provider?: string;
  model?: string;
  fallbackProvider?: string;
  fallbackModel?: string;
  showFallback?: boolean;
}) {
  const primary = getProvider(provider);
  const fallback = getProvider(fallbackProvider);
  const badge = "inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white dark:bg-slate-900 dark:border-slate-700";
  return (
    <div className="flex items-center gap-1.5">
      {primary && (
        <Hint text={`${primary.label}: ${modelName(model, provider)}`}>
          <span className={badge}>
            <img src={primary.logo} alt={primary.label} className="h-5 w-5 object-contain" />
          </span>
        </Hint>
      )}
      {showFallback && fallback && (
        <Hint text={`Fallback — ${fallback.label}: ${modelName(fallbackModel, fallbackProvider)}`}>
          <span className={cn(badge, "opacity-70 border-dashed")}>
            <img src={fallback.logo} alt={fallback.label} className="h-4 w-4 object-contain" />
          </span>
        </Hint>
      )}
    </div>
  );
}

// ─── ProviderSelect / ModelSelector ───────────────────────────────────

/** replyagent ProviderDropdown — only providers the workspace has connected. */
export function ProviderSelect({
  value,
  onChange,
  exclude,
  disabled,
  allOption,
  placeholder,
  limitTo,
  triggerClassName = "h-11",
}: {
  value: string;
  onChange: (v: string) => void;
  exclude?: string;
  disabled?: boolean;
  allOption?: string;
  placeholder?: string;
  limitTo?: ProviderInfo[];
  triggerClassName?: string;
}) {
  const { data } = useWorkspaceIntegrations();
  const providers = (limitTo ?? connectedProviders(data?.integrations)).filter((p) => !exclude || p.value !== exclude);
  const ALL = "__all__";
  return (
    <Select
      value={value ? value : allOption ? ALL : ""}
      onValueChange={(v) => onChange(v === ALL ? "" : v)}
      disabled={disabled}
    >
      <SelectTrigger className={`${triggerClassName} rounded-xl`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allOption && <SelectItem value={ALL}>{allOption}</SelectItem>}
        {providers.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            <span className="flex items-center gap-2">
              <img src={p.logo} alt="" className="h-4 w-4 object-contain" />
              {p.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ModelSelector({
  value,
  onChange,
  label,
  exclude,
  disabled,
}: {
  value: { provider: string; model: string };
  onChange: (v: { provider: string; model: string }) => void;
  label: string;
  exclude?: string;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const models = modelsFor(value.provider);
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[12px] font-semibold">{label} Provider</label>
        <ProviderSelect
          value={value.provider}
          onChange={(p) => onChange({ provider: p, model: "" })}
          exclude={exclude}
          disabled={disabled}
          placeholder={t("ai_studio.select_provider")}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[12px] font-semibold">{label} Model</label>
        <Select
          value={value.model || ""}
          onValueChange={(m) => onChange({ provider: value.provider, model: m })}
          disabled={disabled || !value.provider}
        >
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder={value.provider ? t("ai_studio.select_model") : t("ai_studio.select_provider_first")} />
          </SelectTrigger>
          <SelectContent>
            {models.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────

export function AgentStats({ statistics }: { statistics: any }) {
  const { t } = useTranslation();
  const s = statistics ?? {};
  const cards = [
    { label: t("ai_studio.stats.total_assistants"), tip: t("ai_studio.stats.total_assistants_tooltip"), value: s.total_assistants ?? 0 },
    { label: t("ai_studio.stats.success_rate"), tip: t("ai_studio.stats.success_rate_tooltip"), value: `${s.success_rate ?? 0}%` },
    { label: t("ai_studio.stats.avg_response_time"), tip: t("ai_studio.stats.avg_response_time_tooltip"), value: `${s.avg_response_time ?? 0}ms` },
    { label: t("ai_studio.stats.total_tokens"), tip: t("ai_studio.stats.total_tokens_tooltip"), value: Number(s.total_tokens ?? 0).toLocaleString() },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border bg-white dark:bg-slate-900/40 dark:border-slate-800 px-4 py-3">
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
              {c.label}
              <Hint text={c.tip}>
                <Info size={12} className="cursor-help" />
              </Hint>
            </div>
            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
        <Hint text={t("ai_studio.stats.realtime_logs_tooltip")}>
          <Info size={12} className="cursor-help" />
        </Hint>
        {t("ai_studio.stats.realtime_logs_info")}
      </div>
    </div>
  );
}

// ─── Filters ──────────────────────────────────────────────────────────

export interface AgentFiltersValue {
  search: string;
  status: string;
  provider: string;
}

export function AgentFilters({
  value,
  onChange,
  onClear,
}: {
  value: AgentFiltersValue;
  onChange: (v: AgentFiltersValue) => void;
  onClear: () => void;
}) {
  const { t } = useTranslation();
  const active = !!(value.search || value.status || value.provider);
  const ALL = "__all__";
  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center">
      <div className="relative flex-1 max-w-xl">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          placeholder={t("ai_studio.search_placeholder")}
          className="w-full h-9 rounded-xl border pl-10 pr-3 text-[13px] bg-white dark:bg-slate-950/50 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div className="w-full md:w-44">
        <Select value={value.status || ALL} onValueChange={(v) => onChange({ ...value, status: v === ALL ? "" : v })}>
          <SelectTrigger className="h-9 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("ai_studio.all_status")}</SelectItem>
            <SelectItem value="ACTIVE">{t("ai_studio.status_active")}</SelectItem>
            <SelectItem value="PENDING">{t("ai_studio.status_pending")}</SelectItem>
            <SelectItem value="PAUSED">{t("ai_studio.status_paused")}</SelectItem>
            <SelectItem value="FAILED">{t("ai_studio.status_failed")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-48">
        <ProviderSelect
          value={value.provider}
          onChange={(p) => onChange({ ...value, provider: p })}
          allOption={t("ai_studio.all_providers")}
          placeholder={t("ai_studio.all_providers")}
          triggerClassName="h-9"
        />
      </div>
      {active && (
        <button
          type="button"
          onClick={onClear}
          className="h-9 px-4 rounded-xl border text-[12px] font-semibold flex items-center gap-1.5 hover:border-primary/40 hover:text-primary dark:border-slate-800"
        >
          <X size={12} /> {t("ai_studio.clear")}
        </button>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────

export function AgentsEmptyState({
  hasFilters,
  onClear,
  onCreate,
}: {
  hasFilters: boolean;
  onClear: () => void;
  onCreate: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="py-6 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <Bot size={24} />
      </div>
      <h3 className="mt-4 text-[15px] font-bold">
        {hasFilters ? t("ai_studio.no_agents_found") : t("ai_studio.no_assistants_yet")}
      </h3>
      <p className="mt-1.5 max-w-md text-[12px] text-slate-500">
        {hasFilters ? t("ai_studio.no_match_description") : t("ai_studio.empty_state_description")}
      </p>
      <div className="mt-5 flex gap-2">
        {hasFilters && (
          <button type="button" onClick={onClear} className="h-10 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
            {t("ai_studio.clear_filters")}
          </button>
        )}
        <button type="button" onClick={onCreate} className="h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold">
          {t("ai_studio.create_new_assistant")}
        </button>
      </div>
    </div>
  );
}
