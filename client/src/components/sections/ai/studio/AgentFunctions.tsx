import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Braces,
  Database,
  Globe,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Tag,
  Terminal,
  Trash2,
  Workflow,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
import { ExternalRequestEditor } from "@/pages/automation/external-request-editor";
import { cn } from "@/lib/utils";
import { AssistantFunction, emptyFunction, FunctionType } from "./api";

/**
 * AI Studio → assistant → Functions tab — replyagent `AIStudio/AI_Functions.vue`.
 * Works on the assistant's in-memory function list; the form's Publish saves
 * it with the assistant, exactly as there.
 */

const MAX_VARIABLES = 12;

async function getJson(url: string) {
  return (await apiRequest("GET", url)).json();
}

/** A picker that stores `{ id, name }` like replyagent's pickers do. */
function ObjectSelect({
  url,
  listKeys,
  value,
  onChange,
  placeholder,
  labelOf,
}: {
  url: string;
  listKeys: string[];
  value: any;
  onChange: (v: any) => void;
  placeholder: string;
  labelOf?: (item: any) => string;
}) {
  const { data } = useQuery({ queryKey: [url], queryFn: () => getJson(url).catch(() => ({})) });
  const list: any[] = useMemo(() => {
    if (Array.isArray(data)) return data;
    for (const k of listKeys) if (Array.isArray(data?.[k])) return data[k];
    return Array.isArray(data?.data) ? data.data : [];
  }, [data, listKeys]);
  const label = labelOf ?? ((i: any) => i.label ?? i.name ?? `#${i.id}`);
  return (
    <Select
      value={value?.id != null ? String(value.id) : ""}
      onValueChange={(id) => {
        const item = list.find((i) => String(i.id) === id);
        if (item) onChange({ ...item, id: item.id, name: label(item), label: label(item) });
      }}
    >
      <SelectTrigger className="h-10 rounded-xl">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {list.map((i) => (
          <SelectItem key={i.id} value={String(i.id)}>
            {label(i)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const CustomFieldPick = ({ value, onChange, placeholder }: { value: any; onChange: (v: any) => void; placeholder: string }) => (
  <ObjectSelect url="/api/custom-fields" listKeys={["fields", "custom_fields"]} value={value} onChange={onChange} placeholder={placeholder} />
);

const TYPE_META: Record<FunctionType, { icon: any; title: string; desc: string }> = {
  CURL: { icon: Terminal, title: "ai_studio.ra.ai.curl_request", desc: "ai_studio.ra.ai.make_curl_request" },
  API: { icon: Globe, title: "ai_studio.ra.ai.voice_assistant.api", desc: "ai_studio.ra.ai.make_api_call" },
  SAVE_DATA: { icon: Braces, title: "ai_studio.ra.ai.voice_assistant.data", desc: "ai_studio.ra.ai.voice_assistant.save_to_cf" },
  TRIGGER_SF: { icon: Workflow, title: "ai_studio.ra.ai.smartflow_function_title", desc: "ai_studio.ra.ai.trigger_smartflow_function" },
  ADD_TAG: { icon: Tag, title: "ai_studio.ra.automation.action_add_tag", desc: "ai_studio.ra.ai.tag_action" },
  BASEROW: { icon: Database, title: "ai_studio.ra.baserow.title", desc: "ai_studio.ra.baserow.read_baserow" },
};

/** http_request (replyagent) ⇄ ExternalRequestEditor value. */
const toEditor = (r: AssistantFunction["http_request"]) => ({
  method: r.method,
  url: r.url,
  headers: r.headers,
  body_type: r.body_type,
  body_json: r.body,
  body_form: r.body_fields,
  mappings: r.mapping,
});
const fromEditor = (v: any): AssistantFunction["http_request"] => ({
  method: v.method ?? "GET",
  url: v.url ?? "",
  headers: v.headers ?? [],
  body: v.body_json ?? "",
  body_type: v.body_type ?? "json",
  body_fields: v.body_form ?? [],
  mapping: v.mappings ?? [],
});

export default function AgentFunctions({
  functions,
  onChange,
}: {
  functions: AssistantFunction[];
  onChange: (next: AssistantFunction[]) => void;
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [draft, setDraft] = useState<AssistantFunction | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState({ name: false, description: false, curl: false });
  const [curlResult, setCurlResult] = useState<string | null>(null);
  const [curlLoading, setCurlLoading] = useState(false);
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const set = (patch: Partial<AssistantFunction>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  const baserowTables = useQuery({
    queryKey: ["/api/baserow/tables-and-fields", draft?.data?.spreadsheet?.id ?? null],
    queryFn: () =>
      getJson(`/api/baserow/tables-and-fields${draft?.data?.spreadsheet?.id ? `?table_id=${draft.data.spreadsheet.id}` : ""}`).catch(() => ({
        tables: [],
        fields: [],
      })),
    enabled: draft?.type === "BASEROW",
  });

  const start = (type: FunctionType) => {
    setDraft(emptyFunction(type));
    setEditIndex(null);
    setErrors({ name: false, description: false, curl: false });
    setCurlResult(null);
  };
  const edit = (i: number) => {
    const fn = functions[i];
    setDraft(JSON.parse(JSON.stringify(fn)));
    setEditIndex(i);
    setErrors({ name: false, description: false, curl: false });
    setCurlResult(null);
  };

  /** replyagent `getQueryParams()` — {{variables}} in the cURL become parameter rows. */
  const syncCurlVariables = (curl: string) => {
    const found = curl.match(/{{(.*?)}}/g) ?? [];
    const rows = found.map((raw) => {
      const name = raw.slice(2, -2);
      return (
        draft?.parameters.find((p: any) => p.name === name) ?? { name, type: "string", description: "", test_value: "", custom_field: null }
      );
    });
    set({ curl, parameters: rows });
  };

  const tryCurl = async () => {
    if (!draft?.curl.trim()) return;
    let cmd = draft.curl;
    for (const p of draft.parameters) {
      const v = String(p.test_value ?? "");
      if (!v.trim() || !String(p.description ?? "").trim()) {
        toast({ title: ra("ai.no_var_values"), variant: "destructive" });
        return;
      }
      cmd = cmd.replace(`{{${p.name}}}`, v.replace(/ /g, "%20"));
    }
    setCurlLoading(true);
    try {
      const res = await (await apiRequest("POST", "/api/ai/try-curl", { curl: cmd })).json();
      setCurlResult(res?.success ? String(res.results ?? "") : ra("ai.curl_failed"));
    } catch {
      setCurlResult(ra("ai.curl_failed"));
    } finally {
      setCurlLoading(false);
    }
  };

  /** replyagent `saveFunction()` + `validateParams()`. */
  const save = () => {
    if (!draft) return;
    const e = { name: !draft.name.trim(), description: !draft.description.trim(), curl: draft.type === "CURL" && !draft.curl.trim() };
    setErrors(e);
    if (e.name || e.description || e.curl) return;
    const fail = (title: string) => {
      toast({ title, variant: "destructive" });
      return false;
    };
    if (draft.type === "ADD_TAG" && !draft.data) return fail(ra("automation.action_tag_label"));
    if (draft.type === "TRIGGER_SF" && !draft.data?.id) return fail(ra("ai_feeder.val_automation_required"));
    if (draft.type === "BASEROW" && !draft.data?.spreadsheet) return fail(ra("baserow.select_spreadsheet_required"));
    for (const p of draft.parameters) {
      if (!String(p.name ?? "").trim() || !String(p.description ?? "").trim()) return fail(ra("ai.attr_name_desction_required"));
      if (draft.type === "SAVE_DATA" && !p.custom_field) return fail(ra("ai_feeder.val_automation_required"));
    }
    if (draft.type === "BASEROW") {
      for (const s of draft.data.strategies ?? []) {
        if (!String(s.column ?? "").trim() || !String(s.description ?? "").trim()) return fail(ra("ai.attr_name_desction_required"));
      }
    }
    const next = [...functions];
    if (editIndex !== null) next[editIndex] = draft;
    else next.push(draft);
    onChange(next);
    setDraft(null);
    setEditIndex(null);
  };

  const input = "h-10 rounded-xl";
  const label = "block text-[12px] font-semibold mb-1.5";

  // ─── Form ──────────────────────────────────────────────────────────
  if (draft) {
    const bf = baserowTables.data ?? { tables: [], fields: [] };
    return (
      <div className="space-y-6">
        <div>
          <label className={label}>{ra("ai.curl_name")}</label>
          <Input value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder={ra("ai.name_example")} className={input} />
          {errors.name && <span className="text-[11px] text-red-500">{ra("validation.required_field")}</span>}
        </div>
        <div>
          <label className={label}>{ra("ai.curl_description")}</label>
          <Textarea rows={3} value={draft.description} onChange={(e) => set({ description: e.target.value })} placeholder={ra("ai.desc_example")} />
          {errors.description && <span className="text-[11px] text-red-500">{ra("validation.required_field")}</span>}
        </div>

        {draft.type === "API" && (
          <ExternalRequestEditor value={toEditor(draft.http_request)} onChange={(v) => set({ http_request: fromEditor(v) })} />
        )}

        {draft.type === "CURL" && (
          <div className="space-y-4">
            <div>
              <label className={label}>{ra("ai.curl_label")}</label>
              <Textarea rows={5} className="font-mono text-[12px]" value={draft.curl} onChange={(e) => syncCurlVariables(e.target.value)} placeholder="curl -X GET 'https://api.example.com/weather?city={{city}}'" />
              {errors.curl && <span className="text-[11px] text-red-500">{ra("validation.required_field")}</span>}
            </div>
            {draft.parameters.length > 0 && (
              <ParamTable
                rows={draft.parameters}
                onChange={(parameters) => set({ parameters })}
                columns={["name", "type", "description", "test_value", "custom_field"]}
                ra={ra}
                fixedNames
              />
            )}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold">{ra("results")}:</span>
              <button type="button" onClick={tryCurl} disabled={curlLoading} className="h-9 px-4 rounded-xl border text-[12px] font-semibold flex items-center gap-2 dark:border-slate-800">
                {curlLoading && <Loader2 size={12} className="animate-spin" />}
                {ra("api_triggers.test_mode")} cURL
              </button>
            </div>
            {curlResult !== null && (
              <pre className="max-h-64 overflow-auto rounded-xl bg-slate-50 dark:bg-slate-900 p-3 text-[11px] whitespace-pre-wrap">{curlResult}</pre>
            )}
          </div>
        )}

        {draft.type === "SAVE_DATA" && (
          <div className="space-y-4">
            {draft.parameters.length > 0 && (
              <ParamTable rows={draft.parameters} onChange={(parameters) => set({ parameters })} columns={["name", "description", "custom_field"]} ra={ra} />
            )}
            <button
              type="button"
              disabled={draft.parameters.length >= MAX_VARIABLES}
              onClick={() =>
                set({ parameters: [...draft.parameters, { name: "", type: "string", description: "", test_value: "", custom_field: null }] })
              }
              className="h-9 px-4 rounded-xl bg-primary text-white text-[12px] font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={12} /> {ra("whatsapp.add_variable")}
            </button>
          </div>
        )}

        {draft.type === "TRIGGER_SF" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Switch checked={!!draft.remove_from_sf} onCheckedChange={(c) => set({ remove_from_sf: c })} className="data-[state=checked]:bg-primary" />
              <span className="text-[13px]">{ra("ai.smartflow_remove_current")}</span>
            </div>
            <div>
              <label className={label}>{ra("ai.smartflow_start_new")}</label>
              <ObjectSelect url="/api/automations" listKeys={["automations"]} value={draft.data} onChange={(v) => set({ data: { id: v.id, name: v.name } })} placeholder={ra("ai_feeder.val_automation_required")} />
            </div>
          </div>
        )}

        {draft.type === "ADD_TAG" && (
          <div>
            <label className={label}>{ra("active_campaign.apply_tag")}</label>
            <ObjectSelect url="/api/tags/list" listKeys={["tags"]} value={draft.data} onChange={(v) => set({ data: { id: v.id, name: v.name } })} placeholder={ra("automation.action_tag_placeholder")} />
          </div>
        )}

        {draft.type === "BASEROW" && (
          <div className="space-y-5">
            <div>
              <label className={label}>{ra("baserow.spreadsheet_label")}</label>
              <Select
                value={draft.data?.spreadsheet?.id != null ? String(draft.data.spreadsheet.id) : ""}
                onValueChange={(id) => {
                  const table = (bf.tables ?? []).find((x: any) => String(x.id) === id);
                  if (table) set({ data: { ...draft.data, spreadsheet: { id: table.id, name: table.name }, strategies: [{ column: "", description: "" }] } });
                }}
              >
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder={ra("baserow.spreadsheet_label")} />
                </SelectTrigger>
                <SelectContent>
                  {(bf.tables ?? []).map((tb: any) => (
                    <SelectItem key={tb.id} value={String(tb.id)}>
                      {tb.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={label}>{ra("ai_themes.baserow.lookup_strategy_label")}</label>
              <div className="flex gap-2">
                {[
                  { v: "everywhere", l: ra("ai_products.baserow.everywhere") },
                  { v: "column", l: ra("ai_products.baserow.specific_column") },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => set({ data: { ...draft.data, strategy: o.v } })}
                    className={cn(
                      "h-9 px-4 rounded-xl border text-[12px] font-semibold",
                      draft.data?.strategy === o.v ? "bg-primary text-white border-primary" : "dark:border-slate-800",
                    )}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_2fr_auto] gap-2 text-[11px] font-semibold text-slate-500">
                <span>{ra("baserow.label_lookup_column")}</span>
                <span>{ra("add_description")}</span>
                <span />
              </div>
              {(draft.data?.strategies ?? []).map((s: any, i: number) => (
                <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
                  <Select
                    value={s.column || ""}
                    onValueChange={(col) => {
                      const next = [...draft.data.strategies];
                      next[i] = { ...s, column: col };
                      set({ data: { ...draft.data, strategies: next } });
                    }}
                  >
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder={ra("baserow.label_lookup_column")} />
                    </SelectTrigger>
                    <SelectContent>
                      {(bf.fields ?? []).map((f: any) => (
                        <SelectItem key={f.id} value={f.name}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={s.description}
                    placeholder={ra("baserow.lookup_description")}
                    className={input}
                    onChange={(e) => {
                      const next = [...draft.data.strategies];
                      next[i] = { ...s, description: e.target.value };
                      set({ data: { ...draft.data, strategies: next } });
                    }}
                  />
                  {draft.data.strategy === "column" ? (
                    <button
                      type="button"
                      className="p-2 text-red-500"
                      onClick={() => set({ data: { ...draft.data, strategies: draft.data.strategies.filter((_: any, j: number) => j !== i) } })}
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              ))}
              {draft.data?.strategy === "column" && (
                <button
                  type="button"
                  onClick={() => set({ data: { ...draft.data, strategies: [...draft.data.strategies, { column: "", description: "" }] } })}
                  className="h-9 px-4 rounded-xl border text-[12px] font-semibold flex items-center gap-2 dark:border-slate-800"
                >
                  <Plus size={12} /> {ra("baserow.add_column")}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>{ra("ai_themes.baserow.number_of_rows_label")}</label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  className={input}
                  value={draft.data?.rows ?? 1}
                  onChange={(e) => {
                    let n = Number(e.target.value) || 1;
                    if (n > 10) {
                      n = 10;
                      toast({ title: ra("contact.max_number", { number: 10 }), variant: "destructive" });
                    }
                    set({ data: { ...draft.data, rows: n } });
                  }}
                />
              </div>
              <div>
                <label className={label}>{ra("baserow.label_save_json")}</label>
                <CustomFieldPick value={draft.data?.customField} onChange={(v) => set({ data: { ...draft.data, customField: v } })} placeholder={ra("custom_field.select_custom_field")} />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t pt-5 dark:border-slate-800">
          <button type="button" onClick={() => setDraft(null)} className="h-9 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
            {ra("cancel")}
          </button>
          <button type="button" onClick={save} className="h-9 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold">
            {ra("save")}
          </button>
        </div>
      </div>
    );
  }

  // ─── Cards + list ──────────────────────────────────────────────────
  return (
    <div>
      <h6 className="text-[12px] font-semibold text-slate-500">{ra("ai.get_started_function")}</h6>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        {(Object.keys(TYPE_META) as FunctionType[]).map((type) => {
          const m = TYPE_META[type];
          const Icon = m.icon;
          return (
            <button
              key={type}
              type="button"
              onClick={() => start(type)}
              className="rounded-2xl border bg-white dark:bg-slate-900/40 dark:border-slate-800 px-5 py-7 text-left shadow-sm hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Icon size={22} className="text-primary" />
              <div className="mt-3 text-[12px] font-bold uppercase">{t(m.title)}</div>
              <div className="mt-1.5 text-[12px] text-slate-500 leading-snug">{t(m.desc)}</div>
            </button>
          );
        })}
      </div>

      {functions.length > 0 && (
        <div className="mt-6">
          <h6 className="text-[12px] font-semibold text-slate-500 mb-3">{ra("ai.functions")}</h6>
          <div className="rounded-2xl border dark:border-slate-800 overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] uppercase text-slate-500">
                <tr>
                  <th className="text-left px-4 py-2.5 w-1/4">{ra("name")}</th>
                  <th className="text-left px-4 py-2.5 w-1/6">{ra("type")}</th>
                  <th className="text-left px-4 py-2.5">{ra("description")}</th>
                  <th className="text-right px-4 py-2.5">{ra("action")}</th>
                </tr>
              </thead>
              <tbody>
                {functions.map((fn, i) => (
                  <tr key={`${fn.id ?? "new"}-${i}`} className="border-t dark:border-slate-800">
                    <td className="px-4 py-3 font-medium truncate">{fn.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold">{fn.type}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{fn.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end items-center gap-3">
                        <Switch
                          checked={fn.is_active}
                          onCheckedChange={(c) => onChange(functions.map((f, j) => (j === i ? { ...f, is_active: c } : f)))}
                          className="data-[state=checked]:bg-primary"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                              <MoreVertical size={14} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => edit(i)}>
                              <Pencil size={13} className="mr-2" /> {ra("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => setRemoveIndex(i)}>
                              <Trash2 size={13} className="mr-2" /> {ra("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AlertDialog open={removeIndex !== null} onOpenChange={(o) => !o && setRemoveIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{ra("ai.remove_api")}?</AlertDialogTitle>
            <AlertDialogDescription>
              {ra("ai.confirm_remove_api", { api_name: removeIndex !== null ? functions[removeIndex]?.name : "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{ra("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (removeIndex !== null) onChange(functions.filter((_, j) => j !== removeIndex));
                setRemoveIndex(null);
              }}
            >
              {ra("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/** Variables table shared by CURL and SAVE_DATA. */
function ParamTable({
  rows,
  onChange,
  columns,
  ra,
  fixedNames,
}: {
  rows: any[];
  onChange: (rows: any[]) => void;
  columns: ("name" | "type" | "description" | "test_value" | "custom_field")[];
  ra: (k: string, o?: any) => string;
  fixedNames?: boolean;
}) {
  const heads: Record<string, string> = {
    name: ra("ai.atrribute"),
    type: ra("type"),
    description: ra("add_description"),
    test_value: ra("ai.test_value"),
    custom_field: ra("custom_field.select_custom_field"),
  };
  const update = (i: number, patch: any) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <div className="rounded-2xl border dark:border-slate-800 overflow-x-auto">
      <table className="w-full text-[12px]">
        <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c} className="text-left px-3 py-2">
                {heads[c]}
              </th>
            ))}
            {!fixedNames && <th />}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t dark:border-slate-800">
              {columns.map((c) => (
                <td key={c} className="px-3 py-2 min-w-[140px]">
                  {c === "name" && (
                    <Input value={r.name} readOnly={fixedNames} onChange={(e) => update(i, { name: e.target.value.replace(/[^A-Za-z0-9_]/g, "") })} className="h-9 rounded-lg" />
                  )}
                  {c === "type" && (
                    <Select value={r.type || "string"} onValueChange={(v) => update(i, { type: v })}>
                      <SelectTrigger className="h-9 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">{ra("string")}</SelectItem>
                        <SelectItem value="number">{ra("number")}</SelectItem>
                        <SelectItem value="boolean">{ra("boolean")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  {c === "description" && (
                    <Input value={r.description} placeholder="The city and state e.g. San Francisco, CA" onChange={(e) => update(i, { description: e.target.value })} className="h-9 rounded-lg" />
                  )}
                  {c === "test_value" &&
                    (r.type === "boolean" ? (
                      <Select value={String(r.test_value ?? "")} onValueChange={(v) => update(i, { test_value: v })}>
                        <SelectTrigger className="h-9 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">{ra("true")}</SelectItem>
                          <SelectItem value="false">{ra("false")}</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={r.test_value ?? ""} placeholder={ra("enter_value")} onChange={(e) => update(i, { test_value: e.target.value })} className="h-9 rounded-lg" />
                    ))}
                  {c === "custom_field" && (
                    <CustomFieldPick value={r.custom_field} onChange={(v) => update(i, { custom_field: v })} placeholder={ra("custom_field.select_custom_field")} />
                  )}
                </td>
              ))}
              {!fixedNames && (
                <td className="px-2">
                  <button type="button" className="p-2 text-red-500" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
                    <Trash2 size={14} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
