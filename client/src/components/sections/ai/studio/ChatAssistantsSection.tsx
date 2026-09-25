import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, MessageSquareDashed, MoreVertical, NotebookText, Pencil, Trash2, UserCog, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
import { getUserInfo } from "@/lib/auth";
import AgentForm from "./AgentForm";
import AgentLogs from "./AgentLogs";
import AgentTest from "./AgentTest";
import { AgentFilters, AgentFiltersValue, AgentsEmptyState, AgentStats, ProviderLogos } from "./parts";
import { Assistant, emptyAssistant, normalizeAssistant, studioApi } from "./api";

/**
 * Settings → AI Studio → Chat Assistants — replyagent
 * `views/Workspaces/Settings/AIStudio/ChatAssistants.vue`.
 */

type Mode = "LIST" | "EDIT" | "LOGS" | "TEST" | "ACCESS";

/**
 * replyagent `ChatAssistantsController@store` limits (item_id → max). Its page
 * falls back to 1 for an unknown plan while its API falls back to 5; the API's
 * number is used on both sides here so the button and the server agree.
 */
const AGENT_LIMITS: Record<string, number> = {
  "default-plan": 5,
  "premium-plan": 10,
  "ignite-plan": 20,
  "enterprise-plan": 50,
};
const DEFAULT_LIMIT = 5;

const EMPTY_FILTERS: AgentFiltersValue = { search: "", status: "", provider: "" };

export default function ChatAssistantsSection() {
  const { t } = useTranslation();
  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = getUserInfo();

  const [mode, setMode] = useState<Mode>("LIST");
  const [selected, setSelected] = useState<any | null>(null);
  const [filters, setFilters] = useState<AgentFiltersValue>(EMPTY_FILTERS);
  const [debounced, setDebounced] = useState<AgentFiltersValue>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<any | null>(null);
  const [limitOpen, setLimitOpen] = useState(false);
  const [access, setAccess] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);

  // replyagent debounces the search by 300 ms.
  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(filters);
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [filters]);

  const hasFilters = !!(debounced.search.trim() || debounced.status || debounced.provider);
  const listKey = ["ai-studio-assistants", debounced, page];
  const { data, isLoading } = useQuery({
    queryKey: listKey,
    queryFn: () => (hasFilters ? studioApi.search({ ...debounced, page }) : studioApi.list(page)),
    enabled: mode === "LIST",
  });
  const agents: any[] = data?.agents?.data ?? [];
  const meta = data?.agents?.meta ?? { total: 0, last_page: 1, from: 0, to: 0 };
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["ai-studio-assistants"] });

  const { data: planFeatures } = useQuery({
    queryKey: ["/api/workspaces/plan-features"],
    queryFn: async () => (await apiRequest("GET", "/api/workspaces/plan-features")).json(),
  });
  const { data: usersData } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => (await apiRequest("GET", "/api/users")).json(),
    enabled: mode === "ACCESS",
  });
  const members: any[] = usersData?.users ?? [];

  const defaultInstructions = useMemo(
    () => ra("ai.instruction", { AGENT_NAME: [user.first_name, user.last_name].filter(Boolean).join(" ") || "Assistant" }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  // ─── Actions ───────────────────────────────────────────────────────

  const createNew = () => {
    const limit = AGENT_LIMITS[planFeatures?.plan_item_id ?? ""] ?? DEFAULT_LIMIT;
    if ((meta.total ?? 0) >= limit) {
      setLimitOpen(true);
      return;
    }
    setSelected(emptyAssistant(defaultInstructions));
    setMode("EDIT");
  };

  const withAgent = async (agent: any, next: Mode) => {
    setBusy(true);
    try {
      const res = await studioApi.get(agent.id);
      const full = normalizeAssistant(res.agent);
      setSelected(full);
      if (next === "ACCESS") {
        const map: Record<string, boolean> = {};
        (full.user_ids ?? []).forEach((id: any) => (map[String(id)] = true));
        setAccess(map);
      }
      setMode(next);
    } catch (e: any) {
      toast({ title: e?.message ?? "Failed to load agent details", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = async (agent: any, on: boolean) => {
    const status = on ? "ACTIVE" : "PAUSED";
    try {
      await studioApi.setStatus(agent.id, status);
      toast({ title: `Agent ${on ? "activated" : "paused"} successfully` });
      refresh();
    } catch (e: any) {
      toast({ title: e?.message ?? "Failed to update agent status", variant: "destructive" });
    }
  };

  const toggleAccess = async (memberId: string, on: boolean) => {
    const next = { ...access, [memberId]: on };
    setAccess(next);
    const ids = Object.keys(next).filter((k) => next[k]).map((k) => Number(k));
    try {
      await studioApi.syncUsers(selected.id, ids);
      toast({ title: "User access updated successfully" });
    } catch (e: any) {
      setAccess(access);
      toast({ title: e?.message ?? "Failed to update user access", variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await studioApi.remove(toDelete.id);
      toast({ title: "Agent deleted successfully" });
      refresh();
    } catch (e: any) {
      toast({ title: e?.message ?? "Failed to delete agent", variant: "destructive" });
    } finally {
      setToDelete(null);
    }
  };

  const backToList = () => {
    setSelected(null);
    setMode("LIST");
    refresh();
  };

  // ─── Modes ─────────────────────────────────────────────────────────

  if (mode === "EDIT" && selected) {
    return (
      <AgentForm
        agent={selected as Assistant}
        onSaved={() => {
          toast({ title: selected.id != null ? "Agent updated successfully" : "Agent created successfully" });
          backToList();
        }}
        onCancel={backToList}
      />
    );
  }
  if (mode === "LOGS" && selected) return <AgentLogs agent={selected} onBack={backToList} />;
  if (mode === "TEST" && selected) return <AgentTest agent={selected} onBack={backToList} onEdit={() => withAgent(selected, "EDIT")} />;

  const card = "rounded-3xl border bg-white dark:bg-[#0f1829] dark:border-slate-800 overflow-hidden shadow-sm";

  if (mode === "ACCESS" && selected) {
    return (
      <div className={card}>
        <div className="px-8 py-5 border-b dark:border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-[16px] font-bold">{t("ai_studio.assistant_access.manage_access")}</h1>
            <p className="text-[12px] text-slate-500">
              {t("ai_studio.assistant_access.manage_access_subtitle")}: <strong>{selected.name}</strong>
            </p>
          </div>
          <button type="button" onClick={backToList} className="h-10 px-4 rounded-xl border text-[12px] font-semibold flex items-center gap-2 dark:border-slate-800">
            <ArrowLeft size={12} /> {t("ai_studio.back")}
          </button>
        </div>
        <div className="p-8">
          {members.length > 0 ? (
            <div className="rounded-2xl border dark:border-slate-800 overflow-hidden">
              <table className="w-full text-[13px]">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] uppercase text-slate-500">
                  <tr>
                    <th className="text-left px-4 py-2.5">{t("ai_studio.assistant_access.user.name")}</th>
                    <th className="text-left px-4 py-2.5">{t("ai_studio.assistant_access.user.email")}</th>
                    <th className="text-right px-4 py-2.5">{t("ai_studio.assistant_access.access")}</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id} className="border-t dark:border-slate-800">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold">
                            {String(m.full_name ?? "?").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium">{m.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{m.email}</td>
                      <td className="px-4 py-3 text-right">
                        <Switch checked={!!access[String(m.id)]} onCheckedChange={(c) => toggleAccess(String(m.id), c)} className="data-[state=checked]:bg-primary" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center text-slate-400">
              <Users size={28} className="mx-auto mb-2" />
              <p>{t("ai_studio.no_members")}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── List ──────────────────────────────────────────────────────────
  return (
    <>
      <div className={card}>
        <div className="px-6 py-3.5 border-b dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/ai-studio.png" alt="AI Studio" className="h-10 w-10 rounded-xl" />
            <div>
              <h1 className="text-[15px] font-bold">{t("ai_studio.chat_assistants")}</h1>
              <p className="text-[12px] text-slate-500">{t("ai_studio.manage_assistants_subtitle")}</p>
            </div>
          </div>
          <button type="button" onClick={createNew} className="h-9 px-4 rounded-xl border border-primary text-primary text-[12px] font-semibold hover:bg-primary hover:text-white transition-colors">
            {t("ai_studio.create_new")}
          </button>
        </div>

        <div className="px-6 py-3 border-b dark:border-slate-800">
          <AgentFilters value={filters} onChange={setFilters} onClear={() => setFilters(EMPTY_FILTERS)} />
        </div>
        <div className="px-6 py-3 border-b dark:border-slate-800">
          <AgentStats statistics={data?.statistics} />
        </div>

        <div className="p-6">
          {isLoading || busy ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="animate-spin text-slate-400" />
            </div>
          ) : agents.length > 0 ? (
            <>
              <div className="rounded-2xl border dark:border-slate-800 overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="text-[11px] uppercase tracking-wide text-slate-500 border-b dark:border-slate-800">
                    <tr>
                      <th className="text-left px-5 py-3">{t("ai_studio.table_name")}</th>
                      <th className="text-left px-5 py-3 w-48">{t("ai_studio.table_provider")}</th>
                      <th className="text-left px-5 py-3 w-28">{t("ai_studio.table_ai_calls")}</th>
                      <th className="text-left px-5 py-3 w-28">{t("ai_studio.table_status")}</th>
                      <th className="text-right px-5 py-3 w-20">{t("ai_studio.table_actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent.id} className="border-t dark:border-slate-800">
                        <td className="px-5 py-3.5 font-medium break-words">{agent.name}</td>
                        <td className="px-5 py-3.5">
                          <ProviderLogos
                            provider={agent.provider}
                            model={agent.model}
                            fallbackProvider={agent.fallback_provider}
                            fallbackModel={agent.fallback_model}
                            showFallback={agent.fallback_allowed && !!agent.fallback_provider}
                          />
                        </td>
                        <td className="px-5 py-3.5">{agent.total_queries || 0}</td>
                        <td className="px-5 py-3.5">
                          <Switch checked={agent.status === "ACTIVE"} onCheckedChange={(c) => toggleStatus(agent, c)} className="data-[state=checked]:bg-primary" />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button type="button" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <MoreVertical size={15} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => withAgent(agent, "EDIT")}>
                                <Pencil size={13} className="mr-2" /> {t("ai_studio.edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelected(agent); setMode("LOGS"); }}>
                                <NotebookText size={13} className="mr-2" /> {t("ai_studio.view_logs")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelected(agent); setMode("TEST"); }}>
                                <MessageSquareDashed size={13} className="mr-2" /> {t("ai_studio.test_agent.menu_title")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => withAgent(agent, "ACCESS")}>
                                <UserCog size={13} className="mr-2" /> {t("ai_studio.assistant_access.manage_access")}
                              </DropdownMenuItem>
                              {/* replyagent's "+ Clonekit" (Add to Bundle) item belongs here. EZCONN
                                  has no Clonekit module yet (BundlesModule is not even registered),
                                  so the item is left out rather than shown and failing. */}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => setToDelete(agent)}>
                                <Trash2 size={13} className="mr-2" /> {t("ai_studio.delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {meta.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between text-[12px]">
                  <p>
                    {t("ai_studio.showing")} <strong>{meta.from}</strong> {t("ai_studio.to")} <strong>{meta.to}</strong> {t("ai_studio.of")}{" "}
                    <strong>{meta.total}</strong> {t("ai_studio.results")}
                  </p>
                  <div className="flex gap-2">
                    <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="h-9 px-4 rounded-xl border font-semibold disabled:opacity-40 dark:border-slate-800">
                      {t("ai_studio.previous")}
                    </button>
                    <button type="button" disabled={page >= meta.last_page} onClick={() => setPage(page + 1)} className="h-9 px-4 rounded-xl border font-semibold disabled:opacity-40 dark:border-slate-800">
                      {t("ai_studio.next")}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <AgentsEmptyState hasFilters={hasFilters} onClear={() => setFilters(EMPTY_FILTERS)} onCreate={createNew} />
          )}
        </div>
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("ai_studio.delete_assistant_title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("ai_studio.delete_assistant_message", { name: toDelete?.name ?? "" })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{ra("cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={confirmDelete}>
              {t("ai_studio.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={limitOpen} onOpenChange={setLimitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("ai_studio.limit_exceeded_title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("ai_studio.limit_exceeded_message")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{ra("cancel")}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}
