import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Book, ChevronDown, ChevronLeft, ChevronUp, Download, ExternalLink, FileText, FolderOpen, Globe, Info, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/hooks/use-socket";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GalleryPickerDialog } from "@/components/contact-profile/sub-dialogs";
import { getUserInfo, hasAnyPerm } from "@/lib/auth";
import { cn } from "@/lib/utils";

/**
 * Settings → AI Studio → Knowledge Base — replyagent
 * `views/Workspaces/Settings/AIStudio/Knowledgebase.vue`.
 *
 * Chat knowledge bases use `ai-studio/knowledgebases`; voice ones the legacy
 * `ai/knowledgebase` resource, exactly as there. Website crawling needs a
 * FireCrawl integration, which EZCONN does not have yet, so that tab shows
 * replyagent's "integration required" state.
 */

type Mode = "LIST" | "EDIT" | "VIEW";
type KbType = "chat" | "voice";
type Tab = "pdf" | "text" | "website";

const MAX_PDFS = 10;

async function json(method: string, url: string, body?: any, silent?: number[]) {
  return (await apiRequest(method, url, body, silent ? { silentStatuses: silent } : undefined)).json();
}

const statusTag = (s: string) =>
  s === "PUBLISHED"
    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    : s === "FAILED"
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

const emptyForm = () => ({ name: "", pending_files: [] as any[], website: "", website_content: "" });

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

export default function KnowledgebaseSection() {
  const { t } = useTranslation();
  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = getUserInfo();
  const perms = user.permissions ?? [];
  const canCreate = hasAnyPerm(perms, ["workspace.ai.create_kb"]);
  const canDelete = hasAnyPerm(perms, ["workspace.ai.delete_kb"]);

  const [mode, setMode] = useState<Mode>("LIST");
  const [createType, setCreateType] = useState<KbType>("chat");
  const [form, setForm] = useState(emptyForm());
  const [tab, setTab] = useState<Tab>("pdf");
  const [nameError, setNameError] = useState("");
  const [saving, setSaving] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [toDelete, setToDelete] = useState<any | null>(null);
  const [viewing, setViewing] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | KbType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "PUBLISHED" | "FAILED" | "PENDING">("all");

  // ─── List: chat + voice, merged (chat first) ───────────────────────
  const listKey = ["ai-studio-knowledgebases-page"];
  const { data: rows = [], isLoading } = useQuery({
    queryKey: listKey,
    queryFn: async () => {
      const [chat, voice] = await Promise.all([
        json("GET", "/api/ai-studio/knowledgebases"),
        json("GET", "/api/ai/knowledgebase").catch(() => ({ knowledgebases: [] })),
      ]);
      return [
        ...(chat?.knowledgebases ?? []).map((kb: any) => ({ ...kb, kb_type: "chat" as KbType })),
        ...(voice?.knowledgebases ?? []).map((kb: any) => ({ ...kb, kb_type: "voice" as KbType })),
      ];
    },
    enabled: mode === "LIST",
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: listKey });
    queryClient.invalidateQueries({ queryKey: ["/api/ai-studio/knowledgebases"] });
  };

  // Stats always reflect the full list — mirrors Chat Assistants, whose
  // AgentStats cards don't move when the search/filter fields change.
  const stats = {
    total: rows.length,
    chat: rows.filter((r: any) => r.kb_type === "chat").length,
    voice: rows.filter((r: any) => r.kb_type === "voice").length,
    files: rows.reduce((sum: number, r: any) => sum + (r.text_files_count ?? 0) + (r.pdf_files_count ?? 0) + (r.website_files_count ?? 0), 0),
  };
  const hasFilters = !!(search || typeFilter !== "all" || statusFilter !== "all");
  const filteredRows = rows.filter((kb: any) => {
    if (search && !String(kb.name ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && kb.kb_type !== typeFilter) return false;
    if (statusFilter !== "all" && kb.status !== statusFilter) return false;
    return true;
  });

  // replyagent listens for `ai.knowledgebase` → `updated` (voice knowledge bases being published).
  const workspaceId = user.workspace_id ?? user.modelable_id;
  const socket = useSocket(workspaceId);
  useEffect(() => {
    if (!socket) return;
    const onUpdated = () => queryClient.invalidateQueries({ queryKey: listKey });
    socket.on("knowledgebase.updated", onUpdated);
    return () => {
      socket.off("knowledgebase.updated", onUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // ─── Actions ───────────────────────────────────────────────────────

  const create = (type: KbType) => {
    setCreateType(type);
    setForm(emptyForm());
    setNameError("");
    setTab("pdf");
    setMode("EDIT");
  };

  const cancel = () => {
    setForm(emptyForm());
    setNameError("");
    setTab("pdf");
    setViewing(null);
    setMode("LIST");
  };

  /** replyagent `uploadFile()` — PDFs only, at most 10. */
  const addPdf = (media: any) => {
    const ext = String(media?.extension ?? media?.object_name?.split(".").pop() ?? "").toLowerCase();
    if (ext !== "pdf") {
      toast({ title: ra("error"), description: ra("ai.only_pdf_allowed"), variant: "destructive" });
      return;
    }
    if (form.pending_files.length >= MAX_PDFS) {
      toast({ title: ra("error"), description: ra("ai.max_files", { max_file: MAX_PDFS }), variant: "destructive" });
      return;
    }
    if (form.pending_files.some((f) => String(f.id) === String(media.id))) return;
    setForm((f) => ({ ...f, pending_files: [...f.pending_files, media] }));
  };

  /** replyagent `store()`. */
  const store = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setNameError(ra("validation.required_field"));
      return;
    }
    setSaving(true);
    const payload = {
      id: null,
      name: form.name,
      pending_files: form.pending_files,
      website: form.website,
      website_content: form.website_content,
      web_pages: null,
      selected_pages: [],
      source_type: tab,
      sitemap: false,
    };
    try {
      if (createType === "voice") {
        await json("POST", "/api/ai/knowledgebase", payload, [400]);
      } else {
        await json("POST", "/api/ai-studio/knowledgebases", payload, [400]);
        toast({ title: ra("success"), description: "Knowledge base created successfully" });
      }
      refresh();
      cancel();
    } catch (err: any) {
      // replyagent hid the server's reason behind a generic text; show it.
      const code = err?.body?.error_code;
      const description = code === "INTEGRATION_MISSING" ? ra("ai.integration_not_found") : err?.message || "Failed to create knowledge base";
      toast({ title: ra("error"), description, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    const kb = toDelete;
    setToDelete(null);
    if (!kb) return;
    try {
      if (kb.kb_type === "voice") {
        await json("DELETE", `/api/ai/knowledgebase/${kb.id}`);
      } else {
        await json("POST", `/api/ai-studio/knowledgebases/delete/${kb.id}`);
        toast({ title: ra("success"), description: "Knowledge base deleted successfully" });
      }
    } catch {
      /* the global handler shows the error */
    } finally {
      refresh();
    }
  };

  const view = async (kb: any) => {
    try {
      const res = await json("GET", `/api/ai-studio/knowledgebases/${kb.id}`);
      setViewing(res.knowledgebase);
      setMode("VIEW");
    } catch {
      /* the global handler shows the error */
    }
  };

  // ─── Layout ────────────────────────────────────────────────────────

  const card = "rounded-2xl border bg-white dark:bg-[#0f1829] dark:border-slate-800 overflow-hidden shadow-sm";
  const label = "block text-[11px] font-semibold mb-1.5";

  return (
    <div className={card}>
      <div className="px-8 py-5 border-b dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {mode !== "LIST" && (
            <button type="button" onClick={cancel} className="text-slate-400 hover:text-primary transition-colors shrink-0">
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="p-2.5 rounded-xl shadow-sm bg-primary/10 dark:bg-primary/15">
            <Book className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-[16px] font-bold tracking-tight">{ra("ai.knowledgebase")}</h1>
            <p className="text-[11px] font-bold mt-0.5 opacity-60 text-slate-500">{ra("ai.knowledgebase_subtitle")}</p>
          </div>
        </div>
        {mode === "LIST" && canCreate && <CreateMenu onPick={create} ra={ra} />}
      </div>

      {mode === "LIST" && (
        <>
        <div className="px-6 py-3 border-b dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={ra("ai.search_kb_placeholder")}
                className="w-full h-9 rounded-xl border pl-9 pr-3 text-[13px] bg-white dark:bg-slate-950/50 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-full sm:w-32">
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                  <SelectTrigger className="h-9 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{ra("ai.all_types")}</SelectItem>
                    <SelectItem value="chat">{ra("ai_studio.knowledgebase.for_chat_assistants")}</SelectItem>
                    <SelectItem value="voice">{ra("ai_studio.knowledgebase.for_voice_assistants")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-32">
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                  <SelectTrigger className="h-9 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{ra("ai.all_kb_status")}</SelectItem>
                    <SelectItem value="PUBLISHED">{ra("published")}</SelectItem>
                    <SelectItem value="FAILED">{ra("failed")}</SelectItem>
                    <SelectItem value="PENDING">{ra("pending")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); setTypeFilter("all"); setStatusFilter("all"); }}
                  className="h-9 px-4 rounded-xl border text-[12px] font-semibold flex items-center gap-1.5 hover:border-primary/40 hover:text-primary dark:border-slate-800"
                >
                  <X size={12} /> {t("ai_studio.clear")}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-b dark:border-slate-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: ra("ai.total_knowledgebases"), tip: ra("ai.total_knowledgebases_tooltip"), value: stats.total },
              { label: ra("ai.chat_kbs"), tip: ra("ai.chat_kbs_tooltip"), value: stats.chat },
              { label: ra("ai.voice_kbs"), tip: ra("ai.voice_kbs_tooltip"), value: stats.voice },
              { label: ra("ai.total_files"), tip: ra("ai.total_files_tooltip"), value: stats.files },
            ].map((c) => (
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
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-slate-500">
            <Hint text={ra("ai.kb_stats_tooltip")}>
              <Info size={12} className="cursor-help" />
            </Hint>
            {ra("ai.kb_stats_info")}
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-10 flex justify-center">
              <LoadingSpinner size={32} />
            </div>
          ) : filteredRows.length > 0 ? (
            <div className="rounded-2xl border dark:border-slate-800 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="text-[11px] uppercase tracking-wide text-slate-500 border-b dark:border-slate-800">
                  <tr>
                    <th className="text-left px-5 py-3">{ra("name")}</th>
                    <th className="text-left px-5 py-3">{ra("type")}</th>
                    <th className="text-left px-5 py-3">{ra("status")}</th>
                    <th className="text-right px-5 py-3">{t("ai_studio.table_actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((kb: any) => (
                    <tr key={`${kb.kb_type}-${kb.id}`} className="border-t dark:border-slate-800">
                      <td className="px-5 py-3.5 break-words">
                        {kb.kb_type === "chat" ? (
                          <button type="button" onClick={() => view(kb)} className="text-primary font-medium hover:underline text-left">
                            {kb.name}
                          </button>
                        ) : (
                          <span className="font-medium">{kb.name}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                            kb.kb_type === "voice" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700",
                          )}
                        >
                          {kb.kb_type === "voice" ? ra("ai_studio.knowledgebase.type_voice") : ra("ai_studio.knowledgebase.type_chat")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", statusTag(kb.status))}>
                          {ra(String(kb.status ?? "").toLowerCase()) || kb.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {canDelete && (
                          <button type="button" onClick={() => setToDelete(kb)} className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : hasFilters ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/15 text-primary flex items-center justify-center">
                <Book size={24} />
              </div>
              <h3 className="mt-4 text-[15px] font-bold">{ra("ai.no_kb_match")}</h3>
              <p className="mt-1.5 max-w-md text-[12px] text-slate-500">{ra("ai.no_kb_match_desc")}</p>
              <button
                type="button"
                onClick={() => { setSearch(""); setTypeFilter("all"); setStatusFilter("all"); }}
                className="mt-5 h-10 px-5 rounded-xl border text-[11px] font-semibold dark:border-slate-800"
              >
                {t("ai_studio.clear")}
              </button>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/15 text-primary flex items-center justify-center">
                <Book size={24} />
              </div>
              <h3 className="mt-4 text-[15px] font-bold">{ra("ai.create_knowledgebase")}</h3>
              <p className="mt-1.5 max-w-md text-[12px] text-slate-500">{ra("ai.create_knowledgebase_desc")}</p>
            </div>
          )}
        </div>
        </>
      )}

      {mode === "EDIT" && (
        <form onSubmit={store}>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={label}>{ra("name")}</label>
                <Input
                  maxLength={250}
                  value={form.name}
                  placeholder={ra("name_placeholder")}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, name: e.target.value }));
                    setNameError("");
                  }}
                  className="h-11 rounded-xl"
                />
                {nameError && <span className="text-[11px] italic text-red-500">{nameError}</span>}
              </div>
            </div>

            <div className="flex gap-1 border-b dark:border-slate-800">
              {(
                [
                  ["pdf", "PDF"],
                  ["text", ra("whatsapp.text")],
                  ["website", ra("ai.website")],
                ] as [Tab, string][]
              ).map(([key, text]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={cn(
                    "px-4 py-2.5 text-[13px] font-semibold border-b-2 -mb-px",
                    tab === key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
                  )}
                >
                  {text}
                </button>
              ))}
            </div>

            {tab === "pdf" && (
              <div className="space-y-4">
                <p className="flex items-center gap-2 text-[12px] text-slate-500">
                  <Info size={13} /> {ra("ai.only_pdf_allowed")}
                </p>
                <button type="button" onClick={() => setGalleryOpen(true)} className="h-10 px-4 rounded-xl border flex items-center gap-2 dark:border-slate-800">
                  <FileText size={16} className="text-red-500" />
                  <span className="text-[13px] font-semibold text-primary underline">{ra("gallery.add_files")}</span>
                </button>
                {form.pending_files.length > 0 && (
                  <div className="space-y-2">
                    <label className={label}>{ra("ai.assistant_files")}</label>
                    {form.pending_files.map((file, i) => (
                      <div key={file.id} className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] dark:border-slate-800">
                        <FileText size={15} className="text-red-500 shrink-0" />
                        <span className="flex-1 truncate">{file.object_name}</span>
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, pending_files: f.pending_files.filter((_, j) => j !== i) }))}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "text" && (
              <div>
                <label className={label}>{ra("automation.activity_text_label")}</label>
                <Textarea
                  rows={10}
                  value={form.website_content}
                  placeholder={ra("ai.add_assistant_files")}
                  onChange={(e) => setForm((f) => ({ ...f, website_content: e.target.value }))}
                />
              </div>
            )}

            {tab === "website" && (
              <div className="space-y-4">
                <div className="flex gap-3 rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900 px-4 py-3">
                  <AlertTriangle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold">{ra("ai.firecrawl_required")}</p>
                    <p className="text-[12px] text-slate-600 dark:text-slate-400">{ra("ai.firecrawl_required_desc")}</p>
                  </div>
                </div>
                <div className="opacity-50 pointer-events-none">
                  <label className={label}>{ra("ai.url_title")}</label>
                  <div className="flex items-center gap-3 max-w-2xl">
                    <div className="flex flex-1">
                      <span className="h-11 w-20 shrink-0 rounded-l-xl border border-r-0 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-center text-[12px] text-slate-500">
                        https://
                      </span>
                      <Input disabled value={form.website} placeholder="yoursite.com" className="h-11 rounded-l-none rounded-r-xl" />
                    </div>
                    <button type="button" disabled className="h-11 px-7 rounded-xl bg-primary text-white text-[11px] font-semibold shadow-lg shadow-primary/20 cursor-not-allowed">
                      {ra("ai.fetch_pages")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 py-5 border-t dark:border-slate-800 flex justify-end gap-2">
            <button type="submit" disabled={saving} className="h-11 px-7 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-[11px] font-semibold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
              {saving && <Loader2 size={13} className="animate-spin" />}
              {ra("publish")}
            </button>
          </div>

          <GalleryPickerDialog
            open={galleryOpen}
            onOpenChange={setGalleryOpen}
            onPick={(media) => {
              setGalleryOpen(false);
              addPdf(media);
            }}
          />
        </form>
      )}

      {mode === "VIEW" && viewing && <KnowledgebaseView kb={viewing} ra={ra} />}

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{ra("confirm")}</AlertDialogTitle>
            <AlertDialogDescription>{ra("ai_feeder.confirm_delete_message")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{ra("cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={confirmDelete}>
              {ra("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* replyagent's blocking "Please wait..." dialog while the knowledge base is created. */}
      <AlertDialog open={saving}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> {ra("please_wait")}...
            </AlertDialogTitle>
            <AlertDialogDescription>{ra("ai.save_inprocess")}</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/** "Create new ▾" with For Chat / For Voice. */
function CreateMenu({ onPick, ra }: { onPick: (t: KbType) => void; ra: (k: string) => string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="h-11 w-[178px] px-4 justify-center whitespace-nowrap rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-[11px] font-semibold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus size={12} /> {ra("create_new")} <ChevronDown size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-background">
        {(["chat", "voice"] as KbType[]).map((type) => (
          <DropdownMenuItem
            key={type}
            onClick={() => onPick(type)}
            className="text-[13px] hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary"
          >
            {type === "chat" ? ra("ai_studio.knowledgebase.for_chat_assistants") : ra("ai_studio.knowledgebase.for_voice_assistants")}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** replyagent VIEW mode — read-only details of a chat knowledge base. */
function KnowledgebaseView({ kb, ra }: { kb: any; ra: (k: string) => string }) {
  const { toast } = useToast();
  const files: any[] = kb.files ?? [];
  const pdfs = files.filter((f) => f.type === "PDF");
  const sites = files.filter((f) => f.type === "WEBSITE");
  const texts = files.filter((f) => f.type === "TEXT");
  const [open, setOpen] = useState({ pdf: false, website: false, text: false });

  const download = async (file: any) => {
    try {
      const res = await json("GET", `/api/ai-studio/knowledgebases/${file.ai_assistant_knowledgebase_id}/files/${file.id}/download-url`);
      if (res?.url) window.open(res.url, "_blank", "noopener");
    } catch {
      toast({ title: ra("error"), variant: "destructive" });
    }
  };

  const section = (id: "pdf" | "website" | "text", title: string, count: number, children: React.ReactNode) =>
    count > 0 ? (
      <div className="space-y-3">
        <button type="button" onClick={() => setOpen((o) => ({ ...o, [id]: !o[id] }))} className="flex items-center gap-2 text-[16px] font-semibold">
          {title} ({count}) {open[id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {open[id] && children}
      </div>
    ) : null;

  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[13px] font-semibold mb-1.5">{ra("name")}</label>
          <div className="h-11 rounded-xl border bg-slate-50 dark:bg-slate-900 dark:border-slate-800 px-3 flex items-center text-[13px] cursor-not-allowed">{kb.name}</div>
        </div>
        <div>
          <label className="block text-[13px] font-semibold mb-1.5">{ra("status")}</label>
          <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", statusTag(kb.status))}>{ra(String(kb.status ?? "").toLowerCase()) || kb.status}</span>
        </div>
      </div>

      {section("pdf", ra("ai_studio.pdf_files"), pdfs.length,
        <div className="space-y-2">
          {pdfs.map((f) => {
            const viewUrl = f.media?.file_url || (/^https?:\/\//.test(f.url ?? "") ? f.url : null);
            return (
              <div key={f.id} className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] dark:border-slate-800">
                <FileText size={15} className="text-red-500 shrink-0" />
                <span className="flex-1 truncate">{f.media?.name ?? f.url}</span>
                {viewUrl && (
                  <>
                    <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary text-[12px] font-semibold">
                      <ExternalLink size={13} /> {ra("view")}
                    </a>
                    <button type="button" onClick={() => download(f)} className="flex items-center gap-1 text-[12px] font-semibold text-slate-600 dark:text-slate-300">
                      <Download size={13} /> {ra("download")}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {section("website", ra("ai_studio.website_urls"), sites.length,
        <div className="space-y-2">
          {sites.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] dark:border-slate-800">
              <Globe size={15} className="text-blue-500 shrink-0" />
              <span className="flex-1 break-all">{f.url}</span>
              {f.url && (
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary text-[12px] font-semibold">
                  <ExternalLink size={13} /> {ra("ai.view_page")}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {section("text", ra("ai_studio.text_content"), texts.length,
        <div className="space-y-3">
          {texts.map((f) => (
            <div key={f.id} className="rounded-xl border bg-slate-50 dark:bg-slate-900 dark:border-slate-800 p-4">
              <p className="flex items-center gap-2 text-[13px] font-semibold mb-2">
                <FileText size={14} /> {ra("ai.text_content")}
              </p>
              <p className="whitespace-pre-wrap max-h-60 overflow-y-auto text-[13px]">{f.content}</p>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <div className="py-10 flex flex-col items-center text-slate-400">
          <FolderOpen size={48} />
          <p className="mt-3 text-[13px]">No files in this knowledge base.</p>
        </div>
      )}
    </div>
  );
}
