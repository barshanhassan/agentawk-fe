import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Kanban, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspaceIntegrations } from "../parts";
import { connectedProviders, modelsFor } from "../providers";
import PlaceholderPicker from "./PlaceholderPicker";

/**
 * Report create / edit — replyagent `ReportBuilder/Form.vue`. replyagent
 * never ran its validation on Publish (the server caught empty fields); here
 * the required fields are checked first.
 */

export interface ReportModel {
  id: any;
  name: string;
  provider: string;
  model: string;
  type: "text" | "graph";
  save_pdf: boolean;
  prompt: string;
}

export const emptyReport = (): ReportModel => ({ id: null, name: "", provider: "openai", model: "gpt-5.4", type: "text", save_pdf: false, prompt: "" });

export function ReportHeader({ right }: { right?: React.ReactNode }) {
  const { t } = useTranslation();
  const ra = (k: string) => t(`ai_studio.ra.${k}`) as string;
  return (
    <div className="px-8 py-5 border-b dark:border-slate-800 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="h-11 w-11 rounded-full bg-red-400 text-white flex items-center justify-center shrink-0">
          <Kanban size={20} />
        </span>
        <div>
          <h1 className="text-[16px] font-bold">{ra("report_builder.title")}</h1>
          <p className="text-[12px] text-slate-500">{ra("report_builder.subtitle")}</p>
        </div>
      </div>
      {right}
    </div>
  );
}

export default function ReportForm({
  report: initial,
  onSaved,
  onCancel,
}: {
  report: ReportModel;
  onSaved: (report: any) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const { toast } = useToast();
  const [report, setReport] = useState<ReportModel>(initial);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const set = (patch: Partial<ReportModel>) => setReport((r) => ({ ...r, ...patch }));

  const { data: integrationsData } = useWorkspaceIntegrations();
  // replyagent ModelSelector with exclude-provider="deepseek": connected providers only.
  const providers = useMemo(
    () => connectedProviders(integrationsData?.integrations).filter((p) => p.value !== "deepseek"),
    [integrationsData],
  );
  const models = modelsFor(report.provider);

  /** replyagent `addPlaceholderToPrompt()` — insert {{value}} at the cursor (replacing a selection). */
  const insert = (value: string) => {
    const el = promptRef.current;
    const token = `{{${value}}}`;
    const start = el?.selectionStart ?? report.prompt.length;
    const end = el?.selectionEnd ?? start;
    const next = report.prompt.slice(0, start) + token + report.prompt.slice(end);
    set({ prompt: next });
    setErrors((e) => ({ ...e, prompt: false }));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = {
      name: !report.name.trim(),
      provider: !report.provider,
      model: !report.model,
      type: !report.type,
      prompt: !report.prompt.trim(),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    setSaving(true);
    try {
      const body = { name: report.name, provider: report.provider, model: report.model, type: report.type, save_pdf: report.save_pdf, prompt: report.prompt };
      const res = await (await apiRequest(report.id != null ? "PATCH" : "POST", report.id != null ? `/api/reports/${report.id}` : "/api/reports", body)).json();
      toast({ title: ra("success"), description: ra("report_builder.response_successful") });
      onSaved(res.report);
    } catch {
      /* the global handler shows the server's message */
    } finally {
      setSaving(false);
    }
  };

  const req = <span className="text-[11px] italic text-red-500">{ra("validation.required_field")}</span>;
  const label = "block text-[13px] font-semibold mb-1.5";

  return (
    <form onSubmit={save} className="rounded-[2rem] border bg-white dark:bg-[#0f1829] dark:border-slate-800 overflow-hidden shadow-sm">
      <ReportHeader
        right={
          <button type="button" onClick={onCancel} className="h-10 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
            {ra("back")}
          </button>
        }
      />
      <div className="p-8 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
        <div>
          <label className={label}>{ra("name")}</label>
          <Input
            value={report.name}
            maxLength={255}
            onChange={(e) => {
              set({ name: e.target.value });
              setErrors((x) => ({ ...x, name: false }));
            }}
            className="h-11 rounded-xl"
          />
          {errors.name && req}
        </div>

        <div className="md:col-span-1 2xl:col-span-2 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className={label}>{ra("report_builder.provider_label")}</label>
            <Select
              value={providers.some((p) => p.value === report.provider) ? report.provider : ""}
              onValueChange={(p) => {
                set({ provider: p, model: "" });
                setErrors((x) => ({ ...x, provider: false }));
              }}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder={ra("ai_studio.select_provider")} />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span className="flex items-center gap-2">
                      <img src={p.logo} alt="" className="h-4 w-4 object-contain" /> {p.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.provider && req}
          </div>
          <div className="flex-1">
            <label className={label}>{ra("report_builder.model_label")}</label>
            <Select
              value={report.model || ""}
              disabled={!report.provider}
              onValueChange={(m) => {
                set({ model: m });
                setErrors((x) => ({ ...x, model: false }));
              }}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder={report.provider ? ra("ai_studio.select_model") : ra("ai_studio.select_provider_first")} />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.model && req}
          </div>
        </div>

        <div className="col-start-1">
          <label className={label}>{ra("report_builder.type_label")}</label>
          <Select value={report.type} onValueChange={(v) => set({ type: v as ReportModel["type"] })}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">{ra("report_builder.type_text")}</SelectItem>
              <SelectItem value="graph">{ra("report_builder.type_graph")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && req}
        </div>

        <label className="flex items-center gap-3 text-[13px] font-semibold md:mt-7">
          <Switch checked={report.save_pdf} onCheckedChange={(c) => set({ save_pdf: c })} className="data-[state=checked]:bg-primary" />
          {ra("report_builder.save_pdf_label")}
        </label>

        <div className="col-span-full">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-semibold">{ra("report_builder.prompt_label")}</label>
            <PlaceholderPicker onPick={insert} />
          </div>
          <Textarea
            ref={promptRef}
            rows={25}
            value={report.prompt}
            onChange={(e) => {
              set({ prompt: e.target.value });
              setErrors((x) => ({ ...x, prompt: false }));
            }}
            className="font-mono text-[12px]"
          />
          {errors.prompt && req}
        </div>
      </div>
      <div className="px-8 py-5 border-t dark:border-slate-800 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="h-10 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
          {ra("cancel")}
        </button>
        <button type="submit" disabled={saving} className="h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold flex items-center gap-2 disabled:opacity-60">
          {saving && <Loader2 size={13} className="animate-spin" />}
          {ra("publish")}
        </button>
      </div>
    </form>
  );
}
