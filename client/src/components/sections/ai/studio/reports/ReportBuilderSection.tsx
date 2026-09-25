import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, FileText, Kanban, Loader2, Pencil, PieChart, Play, Search, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/hooks/use-socket";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import ReportForm, { emptyReport, ReportHeader, ReportModel } from "./ReportForm";

/**
 * Settings → AI Studio → Report Builder — replyagent
 * `views/Workspaces/Settings/ReportBuilder/Index.vue`.
 */

type Mode = "LIST" | "ADD" | "RESPONSE";

/** replyagent ContactSearchBox search types. */
const SEARCH_TYPES: [string, string][] = [
  ["whatsapp", "whatsapp_number"],
  ["email", "contact.source_email"],
  ["phone", "mobile_number"],
  ["first_name", "first_name"],
  ["last_name", "last_name"],
  ["support_ticket", "Support Ticket"],
  ["instagram", "Instagram Handle"],
  ["telegram", "Telegram username"],
  ["messenger", "Messenger username"],
  ["id", "contact_id"],
];

function Hint({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="text-xs">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function ReportBuilderSection() {
  const { t } = useTranslation();
  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = getUserInfo();

  const [mode, setMode] = useState<Mode>("LIST");
  const [editing, setEditing] = useState<ReportModel | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [runFor, setRunFor] = useState<any | null>(null);
  const [toDelete, setToDelete] = useState<any | null>(null);

  const listKey = ["/api/reports"];
  const { data, isLoading } = useQuery({
    queryKey: listKey,
    queryFn: async () => (await apiRequest("GET", "/api/reports")).json(),
  });
  const reports: any[] = data?.reports ?? [];
  const refresh = () => queryClient.invalidateQueries({ queryKey: listKey });

  // replyagent Echo `.report.generated` / `.report.failed` on the workspace channel.
  const socket = useSocket(user.workspace_id ?? user.modelable_id);
  useEffect(() => {
    if (!socket) return;
    const onGenerated = () => {
      refresh();
      toast({ title: ra("success"), description: ra("report_builder.generation_finished") });
    };
    const onFailed = (p: any) => {
      refresh();
      toast({ title: ra("error"), description: ra("report_builder.generation_failed", { name: p?.name ?? "" }) + (p?.error ? ` ${p.error}` : ""), variant: "destructive" });
    };
    socket.on("report.generated", onGenerated);
    socket.on("report.failed", onFailed);
    return () => {
      socket.off("report.generated", onGenerated);
      socket.off("report.failed", onFailed);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const edit = (r: any) => {
    setEditing({ id: r.id, name: r.name, provider: r.provider, model: r.model, type: r.type, save_pdf: !!r.save_pdf, prompt: r.prompt });
    setMode("ADD");
  };

  const confirmDelete = async () => {
    const r = toDelete;
    if (!r) return;
    try {
      await apiRequest("DELETE", `/api/reports/${r.id}`);
      refresh();
    } catch {
      /* the global handler shows the error */
    } finally {
      setToDelete(null);
    }
  };

  const card = "rounded-[2rem] border bg-white dark:bg-[#0f1829] dark:border-slate-800 overflow-hidden shadow-sm";

  if (mode === "ADD" && editing) {
    return (
      <ReportForm
        report={editing}
        onSaved={() => {
          refresh();
          setEditing(null);
          setMode("LIST");
        }}
        onCancel={() => {
          setEditing(null);
          setMode("LIST");
        }}
      />
    );
  }

  if (mode === "RESPONSE") {
    return (
      <div className={card}>
        <ReportHeader
          right={
            <button type="button" onClick={() => setMode("LIST")} className="h-10 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
              {ra("back")}
            </button>
          }
        />
        {/* AI-written HTML: scripts may run (Chart.js), but the frame gets no access to this page or its session. */}
        <iframe title="report" sandbox="allow-scripts" srcDoc={response ?? ""} className="w-full bg-white" style={{ height: "75vh" }} />
      </div>
    );
  }

  const createNew = () => {
    setEditing(emptyReport());
    setMode("ADD");
  };

  return (
    <>
      <div className={card}>
        <ReportHeader
          right={
            <button type="button" onClick={createNew} className="h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold">
              {ra("create_new")}
            </button>
          }
        />
        {isLoading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="animate-spin text-slate-400" />
          </div>
        ) : reports.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="text-[11px] uppercase tracking-wide text-slate-500 border-b dark:border-slate-800">
                <tr>
                  <th className="text-left px-8 py-3">{ra("name")}</th>
                  <th className="text-left px-5 py-3">{ra("type")}</th>
                  <th className="text-left px-5 py-3">{ra("last_run")}</th>
                  <th className="text-right px-8 py-3">{t("ai_studio.table_actions")}</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-t dark:border-slate-800">
                    <td className="px-8 py-3.5 font-medium">
                      <span className="flex items-center gap-2">
                        <Kanban size={14} className="text-slate-400" /> {r.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">{ra(`report_builder.type_${r.type}`)}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-2">
                        {r.generated_at ? new Date(r.generated_at).toLocaleString() : ""}
                        {r.run_started_at && <Loader2 size={14} className="animate-spin text-primary" />}
                      </span>
                    </td>
                    <td className="px-8 py-3.5">
                      <div className="flex justify-end items-center gap-4">
                        <Hint text={ra("edit")}>
                          <button type="button" onClick={() => edit(r)} className="text-slate-500 hover:text-primary">
                            <Pencil size={15} />
                          </button>
                        </Hint>
                        <Hint text={r.run_started_at ? ra("report_builder.running") : "Run"}>
                          <button type="button" disabled={!!r.run_started_at} onClick={() => setRunFor(r)} className="text-slate-500 hover:text-primary disabled:opacity-50">
                            <Play size={15} />
                          </button>
                        </Hint>
                        {r.response && (
                          <Hint text={ra("view")}>
                            <button
                              type="button"
                              onClick={() => {
                                setResponse(r.response);
                                setMode("RESPONSE");
                              }}
                              className="text-slate-500 hover:text-primary"
                            >
                              <PieChart size={15} />
                            </button>
                          </Hint>
                        )}
                        {r.save_pdf && r.generated_pdf && (
                          <Hint text={ra("view_pdf")}>
                            <a href={r.generated_pdf} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary">
                              <FileText size={15} />
                            </a>
                          </Hint>
                        )}
                        <Hint text={ra("delete")}>
                          <button type="button" onClick={() => setToDelete(r)} className="text-red-500 hover:text-red-600">
                            <Trash2 size={15} />
                          </button>
                        </Hint>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 flex flex-col items-center text-center">
            <span className="h-14 w-14 rounded-full bg-red-400 text-white flex items-center justify-center">
              <Kanban size={26} />
            </span>
            <h2 className="mt-3 text-xl font-medium">{ra("report_builder.title")}</h2>
            <p className="mt-3 text-[13px] text-slate-500">{ra("report_builder.empty_description")}</p>
            <button type="button" onClick={createNew} className="mt-5 h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold">
              {ra("create_new")}
            </button>
          </div>
        )}
      </div>

      {runFor && (
        <RunDialog
          report={runFor}
          onClose={() => setRunFor(null)}
          onStarted={() => {
            refresh();
            toast({ title: ra("success"), description: ra("report_builder.generation_started") });
          }}
        />
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{ra("are_you_sure")}</AlertDialogTitle>
            <AlertDialogDescription>{ra("report_builder.confirm_delete_message")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{ra("no")}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={confirmDelete}>
              {ra("yes")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/** replyagent run modal — pick a contact, then Generate. */
function RunDialog({ report, onClose, onStarted }: { report: any; onClose: () => void; onStarted: () => void }) {
  const { t } = useTranslation();
  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const [type, setType] = useState("whatsapp");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [contact, setContact] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // replyagent debounces the contact search by 1 s.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 1000);
    return () => clearTimeout(id);
  }, [search]);
  const { data, isFetching } = useQuery({
    queryKey: ["/api/contacts/search/simple", debounced, type],
    queryFn: async () => (await apiRequest("POST", "/api/contacts/search/simple", { search: debounced, type })).json(),
    enabled: debounced.length > 0,
  });
  const results: any[] = data?.contacts ?? [];

  const generate = async () => {
    if (!contact) {
      setError(ra("select_contact"));
      return;
    }
    setBusy(true);
    try {
      await apiRequest("POST", `/api/reports/${report.id}/run`, { contact: contact.id });
      onStarted();
      onClose();
    } catch {
      /* the global handler shows the server's message */
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto text-orange-500" />
          <h6 className="mt-3 text-[15px] font-bold">{ra("select_contact")}</h6>
        </div>
        <div className="space-y-2">
          <div className="flex rounded-xl border dark:border-slate-800 overflow-hidden">
            <Select value={type} onValueChange={(v) => { setType(v); setContact(null); }}>
              <SelectTrigger className="h-11 w-40 rounded-none border-0 border-r dark:border-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEARCH_TYPES.map(([v, k]) => (
                  <SelectItem key={v} value={v}>
                    {k.includes(" ") ? k : ra(k)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={contact ? contact.full_name ?? contact.name ?? `#${contact.id}` : search}
                onChange={(e) => {
                  setContact(null);
                  setSearch(e.target.value);
                  setError("");
                }}
                placeholder={ra("select_contact")}
                className="h-11 border-0 rounded-none pl-8 focus-visible:ring-0"
              />
            </div>
          </div>
          {!contact && debounced && (
            <div className="max-h-56 overflow-y-auto rounded-xl border dark:border-slate-800">
              {isFetching ? (
                <p className="px-3 py-2 text-[12px] text-slate-400">…</p>
              ) : results.length ? (
                results.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { setContact(c); setError(""); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-[13px] hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold">
                      {String(c.full_name ?? c.name ?? "?").slice(0, 1).toUpperCase()}
                    </span>
                    {c.full_name ?? c.name ?? `#${c.id}`}
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-[12px] text-slate-400">{ra("no_match_found")}</p>
              )}
            </div>
          )}
          {error && <p className="text-[11px] italic text-red-500">{error}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
            {ra("cancel")}
          </button>
          <button type="button" onClick={generate} disabled={busy} className="h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold flex items-center gap-2 disabled:opacity-60">
            {busy && <Loader2 size={13} className="animate-spin" />}
            {ra("ai_feeder.generate")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
