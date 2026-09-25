import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Braces, Globe, Loader2, MoreVertical, Pencil, Plus, Terminal, Trash2, Workflow } from "lucide-react";
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
import { getUserInfo, hasAnyPerm } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { PRIMARY_FIELDS, VoiceFunction, VoiceFunctionType, VoiceType, voiceApi } from "./voiceApi";
import { FieldSelect, useActiveFlows } from "./voiceParts";

/**
 * Voice assistant → Functions step — replyagent `AIVoice/StepFunctions.vue`.
 * Works on the agent's in-memory list; Publish saves it. Deleting a saved
 * function calls the API straight away, as there.
 */

const MAX_VARIABLES = 12;

const TYPE_META: Record<VoiceFunctionType, { icon: any; title: string; desc: string; badge: string; badgeLabel: string }> = {
  CURL: { icon: Terminal, title: "ai.curl_request", desc: "ai.make_curl_request", badge: "bg-orange-100 text-orange-700", badgeLabel: "CURL" },
  API: { icon: Globe, title: "ai.api_function_title", desc: "ai.api_function_subtitle", badge: "bg-blue-100 text-blue-700", badgeLabel: "ai.voice_assistant.api" },
  SAVE_DATA: { icon: Braces, title: "ai.data_function_title", desc: "ai.data_function_subtitle", badge: "bg-green-100 text-green-700", badgeLabel: "ai.voice_assistant.data" },
  TRIGGER_SMARTFLOW: {
    icon: Workflow,
    title: "ai.smartflow_function_title",
    desc: "ai.smartflow_function_subtitle",
    badge: "bg-purple-100 text-purple-700",
    badgeLabel: "ai.voice_assistant.smartflow",
  },
};

/** replyagent `createFunction(type)` defaults. */
function newFunction(type: VoiceFunctionType): VoiceFunction {
  const base: VoiceFunction = { id: null, name: "", description: "", type, is_active: 1, data: null, status: "new" };
  if (type === "CURL") return { ...base, api: "", parameters: [], data: { curl_string: "", parameters: [] } };
  if (type === "SAVE_DATA") return { ...base, data: [{ name: "", description: "", value: "", custom_field: null }] };
  if (type === "API") {
    return {
      ...base,
      data: {
        method: "GET",
        url: "",
        headers: [],
        mapping: [],
        bodyParam: {},
        body_type: "form",
        primary_data: { type: "primary_email", description: "" },
      },
    };
  }
  return base;
}

/** replyagent API function data ⇄ ExternalRequestEditor value. */
function toEditor(d: any) {
  const bodyParam = d?.bodyParam && typeof d.bodyParam === "object" ? d.bodyParam : {};
  return {
    method: d?.method ?? "GET",
    url: d?.url ?? "",
    headers: Array.isArray(d?.headers) ? d.headers : [],
    body_type: d?.body_type ?? "form",
    body_json: d?.body_json ?? (Object.keys(bodyParam).length ? JSON.stringify(bodyParam, null, 2) : ""),
    body_form: d?.body_form ?? Object.entries(bodyParam).map(([key, value]) => ({ key, value: typeof value === "string" ? value : JSON.stringify(value) })),
    mappings: Array.isArray(d?.mapping)
      ? d.mapping.map((m: any) => ({ json_path: m.json_path ?? `${m.prefix ?? "$."}${m.path ?? ""}`, field_id: m.field_id ?? m.field?.value ?? m.field ?? "" }))
      : [],
    last_response: d?.last_response ?? null,
  };
}
function fromEditor(v: any, prev: any) {
  let bodyParam: Record<string, any> = {};
  if (v.body_type === "json") {
    try {
      const parsed = JSON.parse(v.body_json || "{}");
      if (parsed && typeof parsed === "object") bodyParam = parsed;
    } catch {
      bodyParam = prev?.bodyParam ?? {};
    }
  } else {
    for (const row of v.body_form ?? []) {
      if (!row?.key) continue;
      try {
        bodyParam[row.key] = JSON.parse(row.value);
      } catch {
        bodyParam[row.key] = row.value;
      }
    }
  }
  return {
    ...prev,
    method: v.method ?? "GET",
    url: v.url ?? "",
    headers: v.headers ?? [],
    body_type: v.body_type ?? "form",
    bodyParam,
    body_json: v.body_json ?? "",
    body_form: v.body_form ?? [],
    mapping: (v.mappings ?? []).map((m: any) => ({
      prefix: "$.",
      path: String(m.json_path ?? "").replace(/^\$\.?/, ""),
      field: m.field_id,
      json_path: m.json_path,
      field_id: m.field_id,
    })),
    last_response: v.last_response ?? null,
  };
}

export default function VoiceFunctions({
  agentType,
  functions,
  onChange,
}: {
  agentType: VoiceType | null;
  functions: VoiceFunction[];
  onChange: (next: VoiceFunction[]) => void;
}) {
  const { t } = useTranslation();
  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const { toast } = useToast();
  const user = getUserInfo();
  // replyagent gates Edit / Delete here with this (legacy) permission.
  const canEdit = hasAnyPerm(user.permissions ?? [], ["workspace.ai.delete_knowledgebase"]);
  const isWidget = agentType === "widget";

  const [draft, setDraft] = useState<VoiceFunction | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState({ name: false, description: false, api: false });
  const [curlResult, setCurlResult] = useState<string | null>(null);
  const [curlLoading, setCurlLoading] = useState(false);
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);
  const flows = useActiveFlows();

  const set = (patch: Partial<VoiceFunction>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  const types = (Object.keys(TYPE_META) as VoiceFunctionType[]).filter((ty) => !(isWidget && ty === "TRIGGER_SMARTFLOW"));

  const start = (type: VoiceFunctionType) => {
    setDraft(newFunction(type));
    setEditIndex(null);
    setErrors({ name: false, description: false, api: false });
    setCurlResult(null);
  };

  /** replyagent `editFunction()` — CURL back-fills api / parameters from data. */
  const edit = (i: number) => {
    const fn: VoiceFunction = JSON.parse(JSON.stringify(functions[i]));
    if (fn.type === "CURL") {
      fn.api = fn.api ?? fn.data?.curl_string ?? "";
      fn.parameters = fn.parameters ?? fn.data?.parameters ?? [];
    }
    setDraft(fn);
    setEditIndex(i);
    setErrors({ name: false, description: false, api: false });
    setCurlResult(null);
  };

  /** replyagent `getQueryParams()` — every {{var}} becomes a parameter row. */
  const syncCurl = (api: string) => {
    const names = Array.from(new Set((api.match(/{{(.*?)}}/g) ?? []).map((m) => m.slice(2, -2))));
    const rows = names.map(
      (name) => (draft?.parameters ?? []).find((p: any) => p.name === name) ?? { name, type: "string", description: "", value: "", custom_field: null },
    );
    set({ api, parameters: rows });
  };

  /** replyagent `testCurl()`. */
  const testCurl = async () => {
    if (!draft) return;
    let cmd = draft.api ?? "";
    for (const p of draft.parameters ?? []) {
      if (!String(p.value ?? "").trim() || !String(p.description ?? "").trim()) {
        toast({ title: ra("ai.no_var_values"), variant: "destructive" });
        return;
      }
      cmd = cmd.split(`{{${p.name}}}`).join(String(p.value).replace(/ /g, "%20"));
    }
    setCurlLoading(true);
    try {
      const res = await (await apiRequest("POST", "/api/ai/try-curl", { curl: cmd })).json();
      setCurlResult(res?.success ? (typeof res.results === "string" ? res.results : JSON.stringify(res.results, null, 2)) : ra("ai.curl_failed"));
    } catch {
      setCurlResult(ra("ai.curl_failed"));
    } finally {
      setCurlLoading(false);
    }
  };

  /** replyagent `saveFunction()`. */
  const save = () => {
    if (!draft) return;
    const e = { name: !draft.name.trim(), description: !draft.description.trim(), api: draft.type === "CURL" && !String(draft.api ?? "").trim() };
    setErrors(e);
    if (e.name || e.description || e.api) return;

    let fn = { ...draft };
    if (fn.type === "SAVE_DATA" && isWidget) {
      const hasPrimary = (fn.data ?? []).some((row: any) => PRIMARY_FIELDS.includes(row?.custom_field?.value));
      if (!hasPrimary) {
        toast({ title: ra("contact.primary_fields_required"), variant: "destructive" });
        return;
      }
    }
    if (fn.type === "TRIGGER_SMARTFLOW" && !fn.data) {
      toast({ title: ra("select_automation"), variant: "destructive" });
      return;
    }
    if (fn.type === "CURL") {
      fn = { ...fn, data: { curl_string: fn.api ?? "", parameters: fn.parameters ?? [] } };
    }
    const next = [...functions];
    if (editIndex !== null) next[editIndex] = fn;
    else next.push(fn);
    onChange(next);
    setDraft(null);
    setEditIndex(null);
  };

  const remove = async () => {
    if (removeIndex === null) return;
    const fn = functions[removeIndex];
    const index = removeIndex;
    setRemoveIndex(null);
    if (fn?.id != null && !fn.status) {
      try {
        const res = await voiceApi.deleteFunction(fn.id);
        if (!res?.success) return;
      } catch {
        return;
      }
    }
    onChange(functions.filter((_, j) => j !== index));
  };

  const label = "block text-[12px] font-semibold mb-1.5";

  // ─── Create / edit ─────────────────────────────────────────────────
  if (draft) {
    const rows: any[] = draft.type === "SAVE_DATA" ? draft.data ?? [] : draft.parameters ?? [];
    const updateRow = (i: number, patch: any) => {
      const next = rows.map((r, j) => (j === i ? { ...r, ...patch } : r));
      if (draft.type === "SAVE_DATA") set({ data: next });
      else set({ parameters: next });
    };
    const removeRow = (i: number) => {
      const next = rows.filter((_, j) => j !== i);
      if (draft.type === "SAVE_DATA") set({ data: next });
      else set({ parameters: next });
    };

    return (
      <div className="space-y-6">
        <div>
          <label className={label}>{ra("ai.curl_name")}</label>
          <Input maxLength={255} value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder={ra("ai.name_example")} className="h-10 rounded-xl" />
          {errors.name && <span className="text-[11px] text-red-500">{ra("validation.required_field")}</span>}
        </div>
        <div>
          <label className={label}>{ra("ai.curl_description")}</label>
          <Textarea rows={2} maxLength={255} value={draft.description} onChange={(e) => set({ description: e.target.value })} placeholder={ra("ai.desc_example")} />
          {errors.description && <span className="text-[11px] text-red-500">{ra("validation.required_field")}</span>}
        </div>

        {draft.type === "CURL" && (
          <div className="space-y-4">
            <div>
              <label className={label}>{ra("ai.curl_label")}</label>
              <Textarea rows={10} className="font-mono text-[12px]" value={draft.api ?? ""} onChange={(e) => syncCurl(e.target.value)} />
              {errors.api && <span className="text-[11px] text-red-500">{ra("validation.required_field")}</span>}
            </div>
            {rows.length > 0 && <VariableTable rows={rows} onUpdate={updateRow} onRemove={removeRow} withType withValue fixedNames ra={ra} />}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold">{ra("results")}:</span>
              <button type="button" onClick={testCurl} disabled={curlLoading} className="h-9 px-4 rounded-xl bg-primary text-white text-[12px] font-semibold flex items-center gap-2 disabled:opacity-60">
                {curlLoading && <Loader2 size={12} className="animate-spin" />}
                {ra("api_triggers.test_mode")} cURL
              </button>
            </div>
            {curlResult !== null && (
              <pre className="max-h-40 overflow-auto rounded-xl bg-slate-50 dark:bg-slate-900 p-3 text-[11px] whitespace-pre-wrap">{curlResult}</pre>
            )}
          </div>
        )}

        {draft.type === "API" && (
          <div className="space-y-5">
            {isWidget && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={label}>{ra("plugin.collect_primary_data")}</label>
                  <Select
                    value={draft.data?.primary_data?.type ?? "primary_email"}
                    onValueChange={(v) => set({ data: { ...draft.data, primary_data: { ...(draft.data?.primary_data ?? {}), type: v } } })}
                  >
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary_email">{ra("email_address")}</SelectItem>
                      <SelectItem value="primary_phone">{ra("contact.module_phone_number")}</SelectItem>
                      <SelectItem value="primary_whatsapp">{ra("whatsapp_number")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className={label}>{ra("add_description")}</label>
                  <Input
                    maxLength={100}
                    className="h-10 rounded-xl"
                    placeholder={ra("plugin.primary_email_pl")}
                    value={draft.data?.primary_data?.description ?? ""}
                    onChange={(e) => set({ data: { ...draft.data, primary_data: { ...(draft.data?.primary_data ?? {}), description: e.target.value } } })}
                  />
                </div>
              </div>
            )}
            <ExternalRequestEditor value={toEditor(draft.data)} onChange={(v) => set({ data: fromEditor(v, draft.data) })} />
          </div>
        )}

        {draft.type === "SAVE_DATA" && (
          <div className="space-y-4">
            {isWidget && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900 px-4 py-3 text-[12px] text-blue-700 dark:text-blue-300">
                {ra("contact.primary_phone_email_required")}
              </div>
            )}
            {rows.length > 0 && <VariableTable rows={rows} onUpdate={updateRow} onRemove={removeRow} lowercaseNames ra={ra} />}
            <button
              type="button"
              disabled={rows.length >= MAX_VARIABLES}
              onClick={() => set({ data: [...rows, { name: "", type: "string", description: "", value: "", custom_field: null }] })}
              className="h-9 px-4 rounded-xl bg-primary text-white text-[12px] font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={12} /> {ra("whatsapp.add_variable")}
            </button>
          </div>
        )}

        {draft.type === "TRIGGER_SMARTFLOW" && (
          <div className="max-w-sm">
            <label className={label}>{ra("ai.smartflow_function_title")}</label>
            <Select value={draft.data != null ? String(draft.data) : ""} onValueChange={(v) => set({ data: Number(v) })}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder={ra("automation.start_automation_empty")} />
              </SelectTrigger>
              <SelectContent>
                {flows.map((f) => (
                  <SelectItem key={f.id} value={String(f.id)}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex justify-between gap-3 border-t pt-5 dark:border-slate-800">
          <button type="button" onClick={() => setDraft(null)} className="h-9 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
            {ra("back")}
          </button>
          <button type="button" onClick={save} className="h-9 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold">
            {ra("save")}
          </button>
        </div>
      </div>
    );
  }

  // ─── Cards + table ─────────────────────────────────────────────────
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {types.map((type) => {
          const m = TYPE_META[type];
          const Icon = m.icon;
          return (
            <button
              key={type}
              type="button"
              onClick={() => start(type)}
              className="rounded-2xl border-2 bg-white dark:bg-slate-900/40 dark:border-slate-800 px-6 py-10 text-center shadow-sm hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Icon size={26} className="mx-auto text-primary" />
              <div className="mt-3 text-[12px] font-bold uppercase">{ra(m.title)}</div>
              <div className="mt-1.5 text-[12px] text-slate-500">{ra(m.desc)}</div>
            </button>
          );
        })}
      </div>

      {functions.length > 0 && (
        <div className="mt-6 rounded-2xl border dark:border-slate-800 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] uppercase text-slate-500">
              <tr>
                <th className="text-left px-4 py-2.5 w-1/4">{ra("name")}</th>
                <th className="text-left px-4 py-2.5 w-1/6">{ra("type")}</th>
                <th className="text-left px-4 py-2.5">{ra("description")}</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {functions.map((fn, i) => {
                const meta = TYPE_META[fn.type as VoiceFunctionType] ?? TYPE_META.API;
                return (
                  <tr key={`${fn.id ?? "new"}-${i}`} className="border-t dark:border-slate-800">
                    <td className="px-4 py-3 font-medium truncate">{fn.name}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold", meta.badge)}>
                        {meta.badgeLabel === "CURL" ? "CURL" : ra(meta.badgeLabel)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{fn.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end items-center gap-3">
                        <Switch
                          checked={!!fn.is_active}
                          onCheckedChange={(c) => onChange(functions.map((f, j) => (j === i ? { ...f, is_active: c ? 1 : 0 } : f)))}
                          className="data-[state=checked]:bg-primary"
                        />
                        {canEdit && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button type="button" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                <MoreVertical size={14} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => edit(i)}>
                                <Pencil size={13} className="mr-2" /> {ra("edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => setRemoveIndex(i)}>
                                <Trash2 size={13} className="mr-2" /> {ra("delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={removeIndex !== null} onOpenChange={(o) => !o && setRemoveIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{ra("ai.remove_api")}?</AlertDialogTitle>
            <AlertDialogDescription>
              {ra("ai.confirm_remove_api", { api_name: removeIndex !== null ? functions[removeIndex]?.name : "" }).replace(/<\/?strong>/g, "")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{ra("cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={remove}>
              {ra("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/** CURL parameters / Collect Data variables table. */
function VariableTable({
  rows,
  onUpdate,
  onRemove,
  withType,
  withValue,
  fixedNames,
  lowercaseNames,
  ra,
}: {
  rows: any[];
  onUpdate: (i: number, patch: any) => void;
  onRemove: (i: number) => void;
  withType?: boolean;
  withValue?: boolean;
  fixedNames?: boolean;
  lowercaseNames?: boolean;
  ra: (k: string, o?: any) => string;
}) {
  return (
    <div className="rounded-2xl border dark:border-slate-800 overflow-x-auto">
      <table className="w-full text-[12px]">
        <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] text-slate-500">
          <tr>
            <th className="text-left px-3 py-2 w-[20%]">{ra("ai.attribute")}</th>
            {withType && <th className="text-left px-3 py-2 w-[10%]">{ra("type")}</th>}
            <th className="text-left px-3 py-2 w-[20%]">{ra("add_description")}</th>
            {withValue && <th className="text-left px-3 py-2 w-[15%]">{ra("ai.test_value")}</th>}
            <th className="text-left px-3 py-2 w-[30%]">{ra("custom_field.select_custom_field")}</th>
            <th className="w-[5%]" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t dark:border-slate-800 align-top">
              <td className="px-3 py-2">
                <Input
                  value={r.name ?? ""}
                  readOnly={fixedNames}
                  onKeyDown={(e) => lowercaseNames && e.key === " " && e.preventDefault()}
                  onChange={(e) => onUpdate(i, { name: lowercaseNames ? e.target.value.toLowerCase() : e.target.value })}
                  className="h-9 rounded-lg"
                />
              </td>
              {withType && (
                <td className="px-3 py-2">
                  <Select value={r.type || "string"} onValueChange={(v) => onUpdate(i, { type: v })}>
                    <SelectTrigger className="h-9 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">{ra("string")}</SelectItem>
                      <SelectItem value="number">{ra("number")}</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              )}
              <td className="px-3 py-2">
                <Textarea
                  rows={1}
                  maxLength={60}
                  value={r.description ?? ""}
                  placeholder="The city and state e.g. San Francisco, CA"
                  onChange={(e) => onUpdate(i, { description: e.target.value })}
                  className="min-h-9 rounded-lg"
                />
              </td>
              {withValue && (
                <td className="px-3 py-2">
                  <Input value={r.value ?? ""} placeholder={ra("enter_value")} onChange={(e) => onUpdate(i, { value: e.target.value })} className="h-9 rounded-lg" />
                </td>
              )}
              <td className="px-3 py-2">
                <FieldSelect value={r.custom_field} onChange={(v) => onUpdate(i, { custom_field: v })} withSystem placeholder={ra("custom_field.select_custom_field")} />
              </td>
              <td className="px-2 py-2">
                <button type="button" className="p-2 text-red-500" onClick={() => onRemove(i)}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
