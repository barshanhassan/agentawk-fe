import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ChevronRight,
  Copy,
  Info,
  ListChecks,
  Loader2,
  Pause,
  PhoneForwarded,
  Play,
  Phone,
  SprayCan,
  Trash2,
  UserCog,
  Wand2,
  Wrench,
  AppWindow,
  Check,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import VoiceFunctions from "./VoiceFunctions";
import { ColorInput, FieldSelect, GalleryBox, mediaKind, useActiveFlows } from "./voiceParts";
import { REALTIME_MODELS, REALTIME_VOICES, SUMMARY_MODELS, VOICE_PROVIDERS, VoiceAgent, WIDGET_IMAGES, voiceApi } from "./voiceApi";

/**
 * Voice assistant wizard — replyagent `AIVoice/Index.vue` EDIT view.
 * Incoming / Outgoing: Personality → Configurations → Call Transfer → Functions → Summary.
 * Widget: Personality → Configurations → Functions → Design → Install.
 */

export type VoiceStep = "personalize" | "behaviour" | "transfer" | "functions" | "summary" | "design" | "embed";

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

/** replyagent's range sliders with the primary-coloured fill. */
function Slider({ value, min, max, step, onChange }: { value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  const pct = ((Number(value) - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[hsl(var(--primary))]"
      style={{ background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${pct}%, #e1e1e1 ${pct}%, #e1e1e1 100%)` }}
    />
  );
}

export default function VoiceForm({
  agent: initial,
  initialStep = "personalize",
  checkPermission,
  onSaved,
  onCancel,
}: {
  agent: VoiceAgent;
  initialStep?: VoiceStep;
  /** replyagent `validateAssistantPermission()`. */
  checkPermission: () => boolean;
  onSaved: (saved: any, wasNew: boolean) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const { toast } = useToast();
  const [agent, setAgent] = useState<VoiceAgent>(initial);
  const [step, setStep] = useState<VoiceStep>(initialStep);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const set = (patch: Partial<VoiceAgent>) => setAgent((a) => ({ ...a, ...patch }));
  const setDesign = (patch: Record<string, any>) => setAgent((a) => ({ ...a, design: { ...a.design, ...patch } }));

  const isWidget = agent.type === "widget";
  const flows = useActiveFlows();

  const numbersQuery = useQuery({
    queryKey: ["/api/ai/voice-agent/numbers", agent.type, agent.id],
    queryFn: () => voiceApi.numbers(agent.type ?? "", agent.id),
    enabled: !!agent.type,
  });
  const phones: any[] = numbersQuery.data?.phones ?? [];
  const knowledgebases: any[] = numbersQuery.data?.knowledgebases ?? [];

  const membersQuery = useQuery({
    queryKey: ["/api/workspaces/members"],
    queryFn: async () => (await apiRequest("GET", "/api/workspaces/members")).json(),
    enabled: !isWidget,
  });
  /** replyagent `transferAgents` — active members with a mobile number. */
  const transferAgents = useMemo(() => {
    const d: any = membersQuery.data;
    const list: any[] = Array.isArray(d) ? d : d?.members ?? d?.data ?? [];
    return list.filter((m) => m.status === "ACTIVE" && m.mobile_number?.full_mobile_number);
  }, [membersQuery.data]);

  const voices = REALTIME_VOICES[agent.model_provider] ?? [];
  const models = REALTIME_MODELS[agent.model_provider] ?? [];
  const voiceFile = voices.find((v) => v.name === agent.voice)?.file;

  // A new voice stops the sample that was playing.
  useEffect(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, [agent.voice]);

  const steps: { key: VoiceStep; icon: any; label: string }[] = [
    { key: "personalize", icon: UserCog, label: ra("ai.personality") },
    { key: "behaviour", icon: Wrench, label: ra("ai.configurations") },
    ...(!isWidget ? [{ key: "transfer" as VoiceStep, icon: PhoneForwarded, label: ra("ai.call_transfer_label") }] : []),
    { key: "functions", icon: Wand2, label: ra("ai.assistants_functions") },
    ...(!isWidget ? [{ key: "summary" as VoiceStep, icon: ListChecks, label: ra("summary") }] : []),
    ...(isWidget
      ? [
          { key: "design" as VoiceStep, icon: SprayCan, label: ra("ai.assistants_design") },
          { key: "embed" as VoiceStep, icon: AppWindow, label: ra("ai.assistants_install") },
        ]
      : []),
  ];
  const stepIndex = steps.findIndex((s) => s.key === step);

  /** replyagent provider watcher — new provider clears the model and picks its first voice. */
  const changeProvider = (provider: string) => {
    setErrors((e) => ({ ...e, model_provider: "", model: "" }));
    set({ model_provider: provider, model: null, voice: REALTIME_VOICES[provider]?.[0]?.name ?? "" });
  };

  const toggleVoice = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.currentTime = 0;
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  /** replyagent `updateAssistant()` validation, in its order. */
  const validate = () => {
    const req = ra("validation.required_field");
    const next: Record<string, string> = {};
    const name = (agent.name ?? "").trim();
    if (!name) next.name = req;
    else if (name.length > 250) next.name = ra("max_characters", { character: 250 });
    else if (name.length < 5) next.name = ra("min_characters", { character: 5 });
    if (next.name) {
      setErrors(next);
      setStep("personalize");
      window.scrollTo(0, 0);
      return false;
    }
    if (!String(agent.instructions ?? "").trim()) next.instructions = req;
    else if (agent.instructions.length > 250000) next.instructions = ra("max_characters", { character: 250000 });
    if (next.instructions) {
      setErrors(next);
      setStep("personalize");
      window.scrollTo(0, 0);
      return false;
    }
    if (!isWidget && !agent.twilio_number_id) {
      setErrors({ twilio_number_id: ra("required") });
      setStep("behaviour");
      window.scrollTo(0, 0);
      return false;
    }
    if (!agent.model_provider) next.model_provider = req;
    if (!agent.model) next.model = req;
    if (next.model_provider || next.model) {
      setErrors(next);
      setStep("personalize");
      return false;
    }
    setErrors({});
    return true;
  };

  const publish = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!checkPermission()) return;
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await voiceApi.save(agent);
      if (res?.success && res.agent) onSaved(res.agent, agent.id == null);
    } catch (err: any) {
      const code = err?.body?.error_code;
      const message =
        code === "INTEGRATION_MISSING"
          ? ra("ai.integration_not_found")
          : code === "AGENT_NOT_FOUND"
            ? ra("error_codes.data_not_found")
            : code === "FAILED_TO_CREATE"
              ? ra("error_codes.request_failed")
              : err?.message || ra("error_codes.request_failed");
      toast({ title: ra("error"), description: message, variant: "destructive" });
      if (code === "NUMBER_IN_USE" || code === "MAX_OUTGOING_REACHED") {
        setErrors({ twilio_number_id: message });
        setStep("behaviour");
      }
    } finally {
      setSaving(false);
    }
  };

  const resetMinutes = async () => {
    setResetOpen(false);
    if (agent.id == null) return;
    try {
      const res = await voiceApi.resetAllowedMinutes(agent.id);
      if (res?.success) {
        set({ used_minutes: 0 });
        toast({ title: "Reset Successfully" });
      }
    } catch {
      /* the global handler already showed the error */
    }
  };

  const label = "block text-[12px] font-semibold mb-1.5";
  const card = "rounded-[2rem] border bg-white dark:bg-[#0f1829] dark:border-slate-800 overflow-hidden shadow-sm";
  const err = (k: string) => (errors[k] ? <span className="text-[11px] text-red-500">{errors[k]}</span> : null);
  const d = agent.design ?? {};

  const embedIframe = agent.embed_url
    ? `<center>\n    <iframe\n      src="${agent.embed_url}"\n      allow="camera *; microphone *"\n      width="250"\n      height="48"\n      frameborder="0"\n      scrolling="no"\n      style="overflow:hidden;">\n    </iframe>\n  </center>`
    : "";

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: ra("link_copied") });
    } catch {
      toast({ title: ra("error"), variant: "destructive" });
    }
  };

  return (
    <form onSubmit={publish} className={card}>
      {/* Header */}
      <div className="px-8 py-5 border-b dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src="/images/integrations/chat_gpt.svg" alt="" className="h-10 w-10" />
          <div>
            <h1 className="text-[16px] font-bold">{ra("acl.ai_voice_assistants")}</h1>
            <p className="text-[12px] text-slate-500">{ra("ai.ai_voice_subtitle")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="h-10 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
            {ra("cancel")}
          </button>
          <button type="submit" disabled={saving} className="h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold flex items-center gap-2 disabled:opacity-60">
            {saving && <Loader2 size={13} className="animate-spin" />}
            {ra("publish")}
          </button>
        </div>
      </div>

      {/* Step bar */}
      <div className="px-8 py-4 border-b dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-wrap items-center gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.key} className="flex items-center gap-2">
              {i > 0 && <ChevronRight size={14} className="text-slate-400" />}
              <button
                type="button"
                onClick={() => setStep(s.key)}
                className={cn("flex items-center gap-2 text-[13px] font-bold", step === s.key ? "text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
              >
                <Icon size={16} /> {s.label}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-8 space-y-6">
        {/* ── Personality ── */}
        {step === "personalize" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={label}>{ra("ai.assistant_name")}</label>
                <Input maxLength={250} value={agent.name} onChange={(e) => set({ name: e.target.value })} className="h-11 rounded-xl" />
                {err("name")}
              </div>
              <div>
                <label className={label}>{ra("ai_studio.select_provider")}</label>
                <Select value={agent.model_provider} onValueChange={changeProvider}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_PROVIDERS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <span className="flex items-center gap-2">
                          <img src={p.logo} alt="" className="h-5 w-5 object-contain" /> {p.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {err("model_provider")}
              </div>
              <div>
                <label className={label}>{ra("ai.select_model")}</label>
                <Select
                  value={agent.model ?? ""}
                  onValueChange={(m) => {
                    setErrors((e) => ({ ...e, model: "" }));
                    set({ model: m });
                  }}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder={ra("ai.select_model")} />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {err("model")}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={label}>{ra("ai.select_voice")}</label>
                <div className="flex items-center gap-2">
                  <Select value={agent.voice} onValueChange={(v) => set({ voice: v })}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((v) => (
                        <SelectItem key={v.name} value={v.name}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {voiceFile && (
                    <>
                      <button
                        type="button"
                        onClick={toggleVoice}
                        className="h-11 w-11 shrink-0 rounded-xl border flex items-center justify-center text-primary hover:bg-primary/5 dark:border-slate-800"
                      >
                        {playing ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <audio key={voiceFile} ref={audioRef} src={voiceFile} preload="none" onEnded={() => setPlaying(false)} />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={cn(label, "flex items-center gap-1.5")}>
                  {ra("ai.temperature")}
                  <Hint text={ra("ai.temperature_tt")}>
                    <Info size={12} className="cursor-help text-slate-400" />
                  </Hint>
                </label>
                <Slider value={agent.temperature} min={0} max={1} step={0.1} onChange={(v) => set({ temperature: v })} />
                <div className="mt-1.5 flex justify-between text-[11px] text-slate-500">
                  <span>{ra("ai.no_temperature")}</span>
                  <span className="font-bold text-primary">{agent.temperature}</span>
                  <span>{ra("ai.temperature_high")}</span>
                </div>
              </div>
            </div>

            <div>
              <label className={label}>{agent.type === "outgoing" ? ra("ai.outgoing_call_greeting") : ra("ai.incoming_call_greeting")}</label>
              <Textarea rows={6} maxLength={2500} value={agent.greeting ?? ""} onChange={(e) => set({ greeting: e.target.value })} />
              {err("greeting")}
            </div>
            <div>
              <label className={label}>{ra("ai.instructions")}</label>
              <Textarea rows={10} maxLength={250000} value={agent.instructions} onChange={(e) => set({ instructions: e.target.value })} />
              {err("instructions")}
            </div>
          </div>
        )}

        {/* ── Configurations ── */}
        {step === "behaviour" && (
          <div className="space-y-6">
            {!isWidget && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={label}>{ra("ai.select_phone_number")}</label>
                    <Select
                      value={agent.twilio_number_id != null ? String(agent.twilio_number_id) : ""}
                      onValueChange={(v) => {
                        setErrors((e) => ({ ...e, twilio_number_id: "" }));
                        set({ twilio_number_id: v });
                      }}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder={ra("ai.select_phone_number")} />
                      </SelectTrigger>
                      <SelectContent>
                        {phones.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            <span className="flex items-center gap-2">
                              <img src="/images/automations/twilio.webp" alt="" className="size-5" /> {p.twilio_phone_number}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {err("twilio_number_id")}
                  </div>
                </div>
                <label className="flex items-center gap-3 text-[13px]">
                  <Switch checked={agent.record_calls} onCheckedChange={(c) => set({ record_calls: c })} className="data-[state=checked]:bg-primary" />
                  {ra(`ai.record_${agent.type}_calls`)}
                </label>
                <hr className="dark:border-slate-800" />
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={label}>{ra("ai.call_duration_limit")}</label>
                <Input type="number" min={1} value={agent.call_limit ?? ""} onChange={(e) => set({ call_limit: Number(e.target.value) })} className="h-11 rounded-xl" />
              </div>
            </div>
            <div>
              <label className={label}>{ra("ai.call_ending_message")}</label>
              <Textarea rows={6} maxLength={2500} value={agent.call_ending_message ?? ""} onChange={(e) => set({ call_ending_message: e.target.value })} />
              {err("call_ending_message")}
            </div>
            <hr className="dark:border-slate-800" />

            <div className="space-y-3">
              <div>
                <h6 className="text-[13px] font-bold">{ra("ai.total_allowed_minutes")}</h6>
                <p className="text-[12px] text-slate-500">{ra("ai.total_allowed_minutes_desc")}</p>
              </div>
              <Switch checked={agent.allowed_minutes_enabled} onCheckedChange={(c) => set({ allowed_minutes_enabled: c })} className="data-[state=checked]:bg-primary" />
              {agent.allowed_minutes_enabled && (
                <div className="flex items-end gap-3 max-w-md">
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    value={agent.allowed_minutes ?? ""}
                    onChange={(e) => set({ allowed_minutes: Number(e.target.value) })}
                    className="h-11 rounded-xl"
                  />
                  {agent.id != null && (
                    <button type="button" onClick={() => setResetOpen(true)} className="h-11 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold">
                      {ra("reset")}
                    </button>
                  )}
                </div>
              )}
            </div>
            <hr className="dark:border-slate-800" />

            <div>
              <label className={label}>{ra("ai.select_knowledgebases")}</label>
              <KnowledgebaseMulti
                options={knowledgebases}
                value={agent.knowledgebase_ids ?? []}
                onChange={(ids) => set({ knowledgebase_ids: ids })}
                placeholder="Select knowledgebases"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={cn(label, "flex items-center gap-1.5")}>
                  {ra("ai.confidence_title")}
                  <Hint text={ra("ai.confidence_desc")}>
                    <Info size={12} className="cursor-help text-slate-400" />
                  </Hint>
                </label>
                <Slider value={agent.confidence} min={0.5} max={0.9} step={0.1} onChange={(v) => set({ confidence: v })} />
                <div className="mt-1.5 flex justify-between text-[11px] text-slate-500">
                  <span>0.5</span>
                  <span className="font-bold text-primary">{agent.confidence}</span>
                  <span>0.9</span>
                </div>
              </div>
            </div>

            {!isWidget && (
              <>
                <hr className="dark:border-slate-800" />
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-[13px] font-semibold">
                    <Switch checked={agent.automation_enabled} onCheckedChange={(c) => set({ automation_enabled: c })} className="data-[state=checked]:bg-primary" />
                    {ra("ai.voice_assistant.trigger_smartflow_label")}
                  </label>
                  {agent.automation_enabled && (
                    <div className="max-w-md">
                      <Select value={agent.automation_id != null ? String(agent.automation_id) : ""} onValueChange={(v) => set({ automation_id: v })}>
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder={ra("select_automation")} />
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
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Call transfer ── */}
        {step === "transfer" && !isWidget && (
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h6 className="text-[14px] font-bold">{ra("ai.call_transfer")}</h6>
                <p className="text-[12px] text-slate-500">{ra("ai.call_transfer_desc")}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  set({ call_transfer_config: [...(agent.call_transfer_config ?? []), { transfer_description: null, call_transfer_to_number: null }] })
                }
                className="h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold shrink-0"
              >
                {ra("ai.add_call_transfer")}
              </button>
            </div>
            <div className="flex gap-3 rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900 px-4 py-3">
              <AlertTriangle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold">{ra("attention_needed")}</p>
                <p className="text-[12px] text-slate-600 dark:text-slate-400">{ra("twilio_call_transfer_notification")}</p>
              </div>
            </div>
            {(agent.call_transfer_config ?? []).length > 0 && (
              <div className="rounded-2xl border dark:border-slate-800 overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] text-slate-500">
                    <tr>
                      <th className="text-left px-3 py-2 w-6/10">{ra("ai.call_transfer_description_label")}</th>
                      <th className="text-left px-3 py-2 w-3/10">{ra("ai.call_transfer_destination_label")}</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {agent.call_transfer_config.map((conf, i) => {
                      const update = (patch: any) =>
                        set({ call_transfer_config: agent.call_transfer_config.map((c, j) => (j === i ? { ...c, ...patch } : c)) });
                      return (
                        <tr key={i} className="border-t dark:border-slate-800 align-top">
                          <td className="px-3 py-2">
                            <Textarea rows={1} maxLength={200} value={conf.transfer_description ?? ""} onChange={(e) => update({ transfer_description: e.target.value })} />
                          </td>
                          <td className="px-3 py-2 min-w-[220px]">
                            <Select value={conf.call_transfer_to_number ?? ""} onValueChange={(v) => update({ call_transfer_to_number: v })}>
                              <SelectTrigger className="h-10 rounded-lg">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {transferAgents.map((m) => (
                                  <SelectItem key={m.id} value={m.mobile_number.full_mobile_number}>
                                    {m.full_name} - {m.mobile_number.national_mobile_number}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              className="p-2 text-red-500"
                              onClick={() => set({ call_transfer_config: agent.call_transfer_config.filter((_, j) => j !== i) })}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Functions ── */}
        {step === "functions" && (
          <VoiceFunctions agentType={agent.type} functions={agent.a_i_functions ?? []} onChange={(fns) => set({ a_i_functions: fns })} />
        )}

        {/* ── Summary ── */}
        {step === "summary" && !isWidget && (
          <div className="space-y-5">
            <label className="flex items-start gap-3">
              <Switch checked={agent.generate_summary} onCheckedChange={(c) => set({ generate_summary: c })} className="mt-1 data-[state=checked]:bg-primary" />
              <span>
                <span className="block text-[15px] font-bold">{ra("ai.call_summary_title")}</span>
                <span className="block text-[12px] text-slate-500">{ra("ai.call_summary_desc")}</span>
              </span>
            </label>
            {agent.generate_summary && (
              <div className="space-y-4">
                <label className={label}>{ra("ai.call_summary_prompt")}</label>
                <div className="max-w-md">
                  <Select value={agent.summary_model || ""} onValueChange={(v) => set({ summary_model: v })}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Select GPT model" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUMMARY_MODELS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea rows={10} maxLength={250000} value={agent.summary_prompt ?? ""} placeholder={ra("ai.instructions")} onChange={(e) => set({ summary_prompt: e.target.value })} />
                <div className="max-w-md">
                  <label className={label}>{ra("ai.call_summary_custom_field")}</label>
                  <FieldSelect value={agent.summary_custom_field} onChange={(v) => set({ summary_custom_field: v })} placeholder={ra("custom_field.select_custom_field")} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Design ── */}
        {step === "design" && isWidget && (
          <div className="space-y-6">
            <p className="text-[14px] font-semibold">{ra("ai.design_title")}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className={label}>{ra("ai.integration_type")}</label>
                  <div className="rounded-xl border dark:border-slate-800 divide-y dark:divide-slate-800">
                    {[
                      { v: "page", l: ra("page"), r: ra("generate_page_url") },
                      { v: "iframe", l: ra("iframe"), r: ra("generate_iframe_code") },
                    ].map((o) => (
                      <label key={o.v} className={cn("flex items-center justify-between gap-3 px-4 py-3 cursor-pointer", d.type === o.v && "bg-primary/10")}>
                        <span className="flex items-center gap-2 text-[13px] font-semibold">
                          <input type="radio" checked={d.type === o.v} onChange={() => setDesign({ type: o.v })} className="accent-[hsl(var(--primary))]" />
                          {o.l}
                        </span>
                        <span className="text-[12px] text-slate-500">{o.r}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {d.type === "page" && (
                  <>
                    <div>
                      <label className={label}>{ra("ai.background_type")}</label>
                      <div className="flex flex-wrap gap-4 text-[13px]">
                        {[
                          ["color", ra("solid_color")],
                          ["image", ra("image")],
                          ["video", ra("video")],
                          ["transparent", ra("transparent")],
                          ["custom", ra("custom")],
                        ].map(([v, l]) => (
                          <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" checked={d.bg_type === v} onChange={() => setDesign({ bg_type: v })} className="accent-[hsl(var(--primary))]" />
                            {l}
                          </label>
                        ))}
                      </div>
                    </div>
                    {d.bg_type === "color" && (
                      <div className="max-w-[240px]">
                        <label className={label}>{ra("ai.background_color")}</label>
                        <ColorInput value={d.bg_color} onChange={(v) => setDesign({ bg_color: v })} />
                      </div>
                    )}
                    {d.bg_type === "image" && (
                      <div>
                        <label className={label}>{ra("ai.background_image")}</label>
                        <div className="flex flex-wrap gap-4 text-[13px]">
                          {WIDGET_IMAGES.map((img) => {
                            const url = `${window.location.origin}/images/voice-widget/${img}.jpeg`;
                            return (
                              <label key={img} className="flex items-center gap-1.5 cursor-pointer">
                                <input type="radio" checked={d.bg_image === url} onChange={() => setDesign({ bg_image: url })} className="accent-[hsl(var(--primary))]" />
                                {img === "AI" ? ra("ai_label") : ra(img.toLowerCase())}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {d.bg_type === "custom" && (
                      <GalleryBox
                        url={d.bg_custom}
                        kind={d.bg_custom_type === "video" ? "video" : "image"}
                        accept="any"
                        label={ra("brand.select_from_gallery")}
                        onPick={(url) => {
                          const kind = mediaKind(url);
                          if (!kind) {
                            toast({
                              title: "Invalid file type",
                              description: "Please choose a valid file. Supported formats are PNG, JPG, JPEG, GIF, SVG, WEBP, MP4, WEBM, OGG.",
                              variant: "destructive",
                            });
                            return;
                          }
                          setDesign({ bg_custom: url, bg_custom_type: kind });
                        }}
                      />
                    )}
                    <div>
                      <label className={label}>{ra("select_logo")}</label>
                      <GalleryBox
                        url={d.logo_url}
                        label={ra("brand.select_from_gallery")}
                        onPick={(url) => {
                          if (mediaKind(url) !== "image") {
                            toast({
                              title: "Invalid file type",
                              description: "Please choose a valid image file. Supported formats are PNG, JPG, JPEG, GIF, SVG, WEBP.",
                              variant: "destructive",
                            });
                            return;
                          }
                          setDesign({ logo_url: url });
                        }}
                      />
                      <p className="mt-1 text-[11px] text-red-500">{ra("agency.logo_size", { size: "460px * 140px" })}</p>
                    </div>
                    <div className="grid grid-cols-[1fr_12rem] gap-4">
                      <div>
                        <label className={label}>{ra("select_title")}</label>
                        <Input maxLength={250} value={d.title ?? ""} onChange={(e) => setDesign({ title: e.target.value })} className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className={label}>{ra("ai.title_color")}</label>
                        <ColorInput value={d.titleColor} onChange={(v) => setDesign({ titleColor: v })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-[1fr_12rem] gap-4">
                      <div>
                        <label className={label}>{ra("select_subtitle")}</label>
                        <Input maxLength={500} value={d.subtitle ?? ""} onChange={(e) => setDesign({ subtitle: e.target.value })} className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className={label}>{ra("ai.subtitle_color")}</label>
                        <ColorInput value={d.subtitleColor} onChange={(v) => setDesign({ subtitleColor: v })} />
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-[1fr_12rem] gap-4">
                  <div>
                    <label className={label}>{ra("select_button_text")}</label>
                    <Input maxLength={500} value={d.buttonText ?? ""} onChange={(e) => setDesign({ buttonText: e.target.value })} className="h-10 rounded-xl" />
                  </div>
                  <div>
                    <label className={label}>{ra("ai.button_color")}</label>
                    <ColorInput value={d.buttonColor} onChange={(v) => setDesign({ buttonColor: v })} />
                  </div>
                </div>
                <div className="max-w-[240px]">
                  <label className={label}>{ra("ai.button_background_color")}</label>
                  <ColorInput value={d.buttonBgColor} onChange={(v) => setDesign({ buttonBgColor: v })} />
                </div>

                {d.type === "page" ? (
                  <>
                    <label className="flex items-center gap-3 text-[13px] font-semibold">
                      <Switch checked={!!d.hideTranscription} onCheckedChange={(c) => setDesign({ hideTranscription: c })} className="data-[state=checked]:bg-primary" />
                      {ra("hide_transcription_box")}
                    </label>
                    <div className="grid grid-cols-[1fr_12rem] gap-4">
                      <div>
                        <label className={label}>{ra("end_call_button_text")}</label>
                        <Input maxLength={500} value={d.endButtonText ?? ""} onChange={(e) => setDesign({ endButtonText: e.target.value })} className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className={label}>{ra("ai.button_color")}</label>
                        <ColorInput value={d.endButtonColor} onChange={(v) => setDesign({ endButtonColor: v })} />
                      </div>
                    </div>
                    <div className="max-w-[240px]">
                      <label className={label}>{ra("ai.end_button_background_color")}</label>
                      <ColorInput value={d.endButtonBgColor} onChange={(v) => setDesign({ endButtonBgColor: v })} />
                    </div>
                    <div className="space-y-4">
                      <h6 className="text-[16px] font-bold">{ra("page_details")}</h6>
                      <div>
                        <label className={label}>{ra("page_title")}</label>
                        <Input maxLength={500} value={d.pageTitle ?? ""} onChange={(e) => setDesign({ pageTitle: e.target.value })} className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className={label}>{ra("page_description")}</label>
                        <Input maxLength={500} value={d.pageDescription ?? ""} onChange={(e) => setDesign({ pageDescription: e.target.value })} className="h-10 rounded-xl" />
                      </div>
                      <div>
                        <label className={label}>{ra("brand.tab_favicon")}</label>
                        <GalleryBox
                          url={d.favicon}
                          className="h-14 w-14"
                          label={ra("brand.select_from_gallery")}
                          onPick={(url) => {
                            if (mediaKind(url) !== "image") {
                              toast({ title: "Invalid file type", variant: "destructive" });
                              return;
                            }
                            setDesign({ favicon: url });
                          }}
                        />
                        <p className="mt-1 text-[11px] text-red-500">{ra("agency.logo_size", { size: "64px * 64px" })}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <div>
                      <label className={label}>{ra("ai.end_button_color")}</label>
                      <ColorInput value={d.endButtonColor} onChange={(v) => setDesign({ endButtonColor: v })} />
                    </div>
                    <div>
                      <label className={label}>{ra("ai.end_button_background_color")}</label>
                      <ColorInput value={d.endButtonBgColor} onChange={(v) => setDesign({ endButtonBgColor: v })} />
                    </div>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div>
                {d.type === "page" ? (
                  <div
                    className="relative flex min-h-[420px] max-h-[600px] flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border bg-cover bg-center p-6 text-center dark:border-slate-800"
                    style={{
                      backgroundColor: d.bg_type === "color" ? d.bg_color : "transparent",
                      backgroundImage:
                        d.bg_type === "image"
                          ? `url(${d.bg_image})`
                          : d.bg_type === "custom" && d.bg_custom_type === "image" && d.bg_custom
                            ? `url(${d.bg_custom})`
                            : undefined,
                    }}
                  >
                    {d.bg_type === "video" && <video autoPlay muted loop src={d.bg_video} className="absolute inset-0 h-full w-full object-cover" />}
                    {d.bg_type === "custom" && d.bg_custom_type === "video" && d.bg_custom && (
                      <video autoPlay muted loop src={d.bg_custom} className="absolute inset-0 h-full w-full object-cover" />
                    )}
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      {d.logo_url && <img src={d.logo_url} alt="" className="h-10" />}
                      <h2 className="text-2xl font-bold" style={{ color: d.titleColor }}>
                        {d.title}
                      </h2>
                      <p style={{ color: d.subtitleColor }}>{d.subtitle}</p>
                      {!d.hideTranscription && (
                        <div className="flex h-52 w-52 items-center justify-center rounded-xl bg-slate-800/50 p-4 text-[12px] text-white">
                          {ra("transcription_preview")}
                        </div>
                      )}
                      <span className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold" style={{ background: d.buttonBgColor, color: d.buttonColor }}>
                        <Phone size={15} /> {d.buttonText}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[200px] items-center justify-center rounded-2xl border dark:border-slate-800">
                    <span className="inline-flex h-12 w-48 items-center justify-center gap-2 rounded-lg text-[14px] font-semibold" style={{ background: d.buttonBgColor, color: d.buttonColor }}>
                      <Phone size={15} /> {d.buttonText}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Install ── */}
        {step === "embed" && isWidget && (
          <div className="space-y-5">
            <div>
              <h6 className="text-[14px] font-bold">{ra("ai.embed")}</h6>
              <p className="text-[12px] text-slate-500">{ra("ai.embed_desc")}</p>
            </div>
            {!agent.embed_url ? (
              <div className="flex gap-3 rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900 px-4 py-3">
                <AlertTriangle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold">{ra("ai.embed_url")}</p>
                  <p className="text-[12px] text-slate-600 dark:text-slate-400">{ra("ai.embed_url_availability")}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className={label}>{d.type === "iframe" ? ra("ai.iframe_code") : ra("ai.embed_url")}</label>
                {d.type === "iframe" ? (
                  <Textarea readOnly rows={2} value={embedIframe} className="font-mono text-[12px]" />
                ) : (
                  <Input readOnly value={agent.embed_url} className="h-10 rounded-xl" />
                )}
                <button
                  type="button"
                  onClick={() => copy(d.type === "iframe" ? embedIframe : agent.embed_url ?? "")}
                  className="h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold flex items-center gap-2"
                >
                  <Copy size={13} /> {ra("copy_clipboard")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Back / Next */}
        <div className="flex justify-between border-t pt-5 dark:border-slate-800">
          {stepIndex > 0 ? (
            <button type="button" onClick={() => setStep(steps[stepIndex - 1].key)} className="h-10 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
              {ra("back")}
            </button>
          ) : (
            <span />
          )}
          {stepIndex < steps.length - 1 && (
            <button type="button" onClick={() => setStep(steps[stepIndex + 1].key)} className="h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold">
              {ra("pagination.next")}
            </button>
          )}
        </div>
      </div>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{ra("are_you_sure")}</AlertDialogTitle>
            <AlertDialogDescription>{ra("ai.voice_assistant.sure_to_reset_allowed_minutes")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={resetMinutes}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* replyagent shows a blocking "Please wait" dialog while publishing. */}
      <AlertDialog open={saving}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> {ra("please_wait")}
            </AlertDialogTitle>
            <AlertDialogDescription>{ra("ai.save_inprocess")}</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

/** replyagent multi vue-select of knowledge bases. */
function KnowledgebaseMulti({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: any[];
  value: any[];
  onChange: (ids: any[]) => void;
  placeholder: string;
}) {
  const selected = options.filter((o) => value.some((v) => String(v) === String(o.id)));
  const toggle = (id: any) =>
    onChange(value.some((v) => String(v) === String(id)) ? value.filter((v) => String(v) !== String(id)) : [...value, id]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="min-h-11 w-full rounded-xl border px-3 py-2 text-left text-[13px] flex flex-wrap gap-1.5 items-center dark:border-slate-800">
          {selected.length ? (
            selected.map((k) => (
              <span key={k.id} className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[12px] font-medium">
                {k.name}
              </span>
            ))
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-1">
        {options.length === 0 ? (
          <p className="px-3 py-2 text-[12px] text-slate-400">—</p>
        ) : (
          options.map((o) => {
            const on = value.some((v) => String(v) === String(o.id));
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => toggle(o.id)}
                className="w-full flex items-center justify-between rounded-md px-3 py-2 text-[13px] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {o.name}
                {on && <Check size={14} className="text-primary" />}
              </button>
            );
          })
        )}
      </PopoverContent>
    </Popover>
  );
}
