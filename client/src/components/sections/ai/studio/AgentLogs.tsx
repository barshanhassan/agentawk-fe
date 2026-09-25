import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, Inbox, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { studioApi } from "./api";
import { ProviderLogos } from "./parts";
import { modelName } from "./providers";

/**
 * AI Studio → assistant → View Logs — replyagent `AIStudio/PortkeyAgentLogs.vue`.
 */

type Range = "today" | "yesterday" | "72hours" | "custom";

function rangeBounds(range: Range, custom: { from: string; to: string }) {
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  switch (range) {
    case "today":
      return { date_from: startOfDay(now).toISOString(), date_to: now.toISOString() };
    case "yesterday": {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      const end = new Date(startOfDay(now).getTime() - 1000);
      return { date_from: startOfDay(y).toISOString(), date_to: end.toISOString() };
    }
    case "72hours":
      return { date_from: new Date(now.getTime() - 72 * 3600 * 1000).toISOString(), date_to: now.toISOString() };
    case "custom":
      return custom.from && custom.to
        ? { date_from: new Date(custom.from).toISOString(), date_to: new Date(custom.to).toISOString() }
        : {};
  }
}

const formatJson = (data: any) => {
  if (!data) return "-";
  try {
    return JSON.stringify(typeof data === "string" ? JSON.parse(data) : data, null, 2);
  } catch {
    return String(data);
  }
};

export default function AgentLogs({ agent, onBack }: { agent: any; onBack: () => void }) {
  const { t } = useTranslation();
  const [range, setRange] = useState<Range>("72hours");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any | null>(null);

  const filters = { ...rangeBounds(range, custom), status, used_fallback: fallback, page, per_page: 20 };
  const logsQuery = useQuery({
    queryKey: ["ai-studio-logs", agent.id, filters],
    queryFn: () => studioApi.logs(agent.id, filters),
  });
  const statsQuery = useQuery({
    queryKey: ["ai-studio-stats", agent.id],
    queryFn: () => studioApi.statistics(agent.id),
  });

  const logs = logsQuery.data?.logs ?? { data: [], current_page: 1, last_page: 1, total: 0, from: 0, to: 0 };
  const s = statsQuery.data?.statistics ?? {};
  const successRate = s.total_queries ? ((s.successful_queries / s.total_queries) * 100).toFixed(2) : 0;

  const statusLabel = (st: string) =>
    ({
      SUCCESS: t("ai_studio.logs.status.success"),
      FAILED: t("ai_studio.logs.status.failed"),
      FALLBACK_SUCCESS: t("ai_studio.logs.status.fallback_success"),
    })[st] ?? st;
  const statusClass = (st: string) =>
    st === "SUCCESS" ? "bg-emerald-100 text-emerald-700" : st === "FAILED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700";

  const refresh = () => {
    logsQuery.refetch();
    statsQuery.refetch();
  };
  const contactName = (c: any) => c?.full_name || [c?.first_name, c?.last_name].filter(Boolean).join(" ") || null;

  return (
    <div className="rounded-[2rem] border bg-white dark:bg-[#0f1829] dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-8 py-5 border-b dark:border-slate-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[16px] font-bold">{t("ai_studio.logs.title")}</h1>
          <p className="text-[12px] text-slate-500">
            {t("ai_studio.logs.subtitle")}: <strong>{agent.name}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={refresh} className="h-10 px-4 rounded-xl border text-[12px] font-semibold flex items-center gap-2 dark:border-slate-800">
            <RefreshCw size={12} className={cn(logsQuery.isFetching && "animate-spin")} /> {t("ai_studio.logs.refresh")}
          </button>
          <button type="button" onClick={onBack} className="h-10 px-4 rounded-xl border text-[12px] font-semibold flex items-center gap-2 dark:border-slate-800">
            <ArrowLeft size={12} /> {t("ai_studio.logs.back_to_list")}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-5 border-b dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[12px] font-semibold mb-1.5">{t("ai_studio.logs.filters.date_range")}</label>
          <Select value={range} onValueChange={(v) => { setRange(v as Range); setPage(1); }}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">{t("ai_studio.logs.filters.today")}</SelectItem>
              <SelectItem value="yesterday">{t("ai_studio.logs.filters.yesterday")}</SelectItem>
              <SelectItem value="72hours">{t("ai_studio.logs.filters.last_72_hours")}</SelectItem>
              <SelectItem value="custom">{t("ai_studio.logs.filters.custom")}</SelectItem>
            </SelectContent>
          </Select>
          {range === "custom" && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input type="datetime-local" value={custom.from} onChange={(e) => setCustom({ ...custom, from: e.target.value })} className="h-9 rounded-lg border px-2 text-[12px] dark:bg-slate-950 dark:border-slate-800" />
              <input type="datetime-local" value={custom.to} onChange={(e) => setCustom({ ...custom, to: e.target.value })} className="h-9 rounded-lg border px-2 text-[12px] dark:bg-slate-950 dark:border-slate-800" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-[12px] font-semibold mb-1.5">{t("ai_studio.logs.filters.status")}</label>
          <Select value={status || "__all__"} onValueChange={(v) => { setStatus(v === "__all__" ? "" : v); setPage(1); }}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{t("ai_studio.logs.filters.all")}</SelectItem>
              <SelectItem value="SUCCESS">{t("ai_studio.logs.status.success")}</SelectItem>
              <SelectItem value="FAILED">{t("ai_studio.logs.status.failed")}</SelectItem>
              <SelectItem value="FALLBACK_SUCCESS">{t("ai_studio.logs.status.fallback_success")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-[12px] font-semibold mb-1.5">{t("ai_studio.logs.filters.fallback")}</label>
          <Select value={fallback || "__all__"} onValueChange={(v) => { setFallback(v === "__all__" ? "" : v); setPage(1); }}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{t("ai_studio.logs.filters.all")}</SelectItem>
              <SelectItem value="1">{t("ai_studio.logs.filters.fallback_only")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="px-8 py-5 border-b dark:border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: t("ai_studio.logs.stats.total_conversations"), v: s.total_queries ?? 0 },
          { l: t("ai_studio.logs.stats.success_rate"), v: `${successRate}%` },
          { l: t("ai_studio.logs.stats.avg_response_time"), v: `${s.avg_response_time_ms ?? 0}ms` },
          { l: t("ai_studio.logs.stats.total_tokens"), v: Number(s.total_tokens_consumed ?? 0).toLocaleString() },
        ].map((c) => (
          <div key={c.l} className="rounded-2xl border dark:border-slate-800 p-4">
            <div className="text-[12px] text-slate-500">{c.l}</div>
            <div className="mt-1 text-xl font-bold">{c.v}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="p-8">
        {logs.data.length > 0 ? (
          <>
            <div className="rounded-2xl border dark:border-slate-800 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] uppercase text-slate-500">
                  <tr>
                    <th className="text-left px-4 py-2.5">{t("ai_studio.logs.table.timestamp")}</th>
                    <th className="text-left px-4 py-2.5">{t("ai_studio.logs.table.contact")}</th>
                    <th className="text-left px-4 py-2.5">{t("ai_studio.logs.table.provider")}</th>
                    <th className="text-left px-4 py-2.5">{t("ai_studio.logs.table.message_preview")}</th>
                    <th className="text-left px-4 py-2.5">{t("ai_studio.logs.table.status")}</th>
                    <th className="text-right px-4 py-2.5">{t("ai_studio.logs.table.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.data.map((log: any) => (
                    <tr key={log.id} className="border-t dark:border-slate-800">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500">{log.created_at ? new Date(log.created_at).toLocaleString() : "-"}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{contactName(log.contact) ?? t("ai_studio.logs.unknown_contact")}</div>
                      </td>
                      <td className="px-4 py-3">
                        <ProviderLogos provider={log.provider_used} model={log.model_used} />
                      </td>
                      <td className="px-4 py-3 max-w-[320px] truncate text-slate-600 dark:text-slate-300">{log.user_message}</td>
                      <td className="px-4 py-3">
                        <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold", statusClass(log.status))}>{statusLabel(log.status)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" title={t("ai_studio.logs.view_details")} onClick={() => setSelected(log)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {logs.last_page > 1 && (
              <div className="mt-4 flex items-center justify-between text-[12px]">
                <p>
                  {t("ai_studio.logs.pagination.showing")} <strong>{logs.from}</strong> {t("ai_studio.logs.pagination.to")} <strong>{logs.to}</strong>{" "}
                  {t("ai_studio.logs.pagination.of")} <strong>{logs.total}</strong> {t("ai_studio.logs.pagination.results")}
                </p>
                <div className="flex gap-2">
                  <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="h-9 px-4 rounded-xl border font-semibold disabled:opacity-40 dark:border-slate-800">
                    {t("ai_studio.logs.pagination.previous")}
                  </button>
                  <button type="button" disabled={page >= logs.last_page} onClick={() => setPage(page + 1)} className="h-9 px-4 rounded-xl border font-semibold disabled:opacity-40 dark:border-slate-800">
                    {t("ai_studio.logs.pagination.next")}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-14 text-center">
            <Inbox size={28} className="mx-auto text-slate-400" />
            <h3 className="mt-3 text-[15px] font-bold">{t("ai_studio.logs.empty.title")}</h3>
            <p className="mt-1 text-[12px] text-slate-500">{t("ai_studio.logs.empty.description")}</p>
          </div>
        )}
      </div>

      {/* Details */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("ai_studio.logs.modal.title")}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-5 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                {selected.contact && (
                  <div>
                    <span className="text-slate-500">{t("ai_studio.logs.modal.contact")}:</span> {contactName(selected.contact)}
                  </div>
                )}
                <div>
                  <span className="text-slate-500">{t("ai_studio.logs.modal.provider")}:</span> {selected.provider_used}
                </div>
                <div>
                  <span className="text-slate-500">{t("ai_studio.logs.modal.tokens_used")}:</span> {selected.tokens_used ?? 0}
                </div>
                <div>
                  <span className="text-slate-500">{t("ai_studio.logs.modal.response_time")}:</span> {selected.response_time_ms ?? 0}ms
                </div>
                <div>
                  <span className="text-slate-500">{t("ai_studio.logs.modal.timestamp")}:</span> {selected.created_at ? new Date(selected.created_at).toLocaleString() : "-"}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t("ai_studio.logs.modal.conversation")}</h4>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">{t("ai_studio.logs.modal.user")}</div>
                  <div className="whitespace-pre-wrap">{selected.user_message}</div>
                </div>
              </div>
              {selected.function_calls && selected.function_calls !== "null" && (
                <div>
                  <h4 className="font-semibold mb-2">{t("ai_studio.logs.modal.function_calls")}</h4>
                  <pre className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3 text-[11px] whitespace-pre-wrap overflow-x-auto">{formatJson(selected.function_calls)}</pre>
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-2">{t("ai_studio.logs.modal.ai_assistant")}</h4>
                <pre className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3 text-[11px] whitespace-pre-wrap overflow-x-auto">{formatJson(selected.ai_response)}</pre>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500">{t("ai_studio.logs.modal.model_used")}:</span> {modelName(selected.model_used, selected.provider_used)}
                </div>
                <div>
                  <span className="text-slate-500">{t("ai_studio.logs.modal.status")}:</span> {statusLabel(selected.status)}
                </div>
              </div>
              {selected.status === "FALLBACK_SUCCESS" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-3">
                  <div className="font-semibold">{t("ai_studio.logs.modal.fallback_info")}</div>
                  <div className="text-[12px]">{t("ai_studio.logs.modal.fallback_used")}</div>
                </div>
              )}
              <div className="flex justify-end">
                <button type="button" onClick={() => setSelected(null)} className="h-9 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
                  {t("ai_studio.logs.modal.close")}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
