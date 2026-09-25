import { apiRequest } from "@/lib/queryClient";
import { AI_PROVIDERS } from "../providers";

/**
 * AI Studio → Voice Assistants — API + constants from replyagent
 * `Settings/AIVoice/Index.vue` and `services/ProviderService.js`.
 */

const BASE = "/api/ai/voice-agent";

export type VoiceType = "incoming" | "outgoing" | "widget";
export type VoiceFunctionType = "CURL" | "API" | "SAVE_DATA" | "TRIGGER_SMARTFLOW";

/** replyagent `ProviderService.realtimeModels`. */
export const REALTIME_MODELS: Record<string, string[]> = {
  openai: [
    "gpt-4o-realtime-preview",
    "gpt-4o-realtime-preview-2024-10-01",
    "gpt-4o-realtime-preview-2024-12-17",
    "gpt-4o-realtime-preview-2025-06-03",
    "gpt-4o-mini-realtime-preview",
    "gpt-4o-mini-realtime-preview-2024-12-17",
  ],
  google: ["gemini-2.5-flash", "gemini-2.5-flash-native-audio-preview-12-2025", "gemini-2.0-flash-exp"],
};

/** replyagent `ProviderService.realtimeVoices`. */
export const REALTIME_VOICES: Record<string, { name: string; file: string }[]> = {
  openai: ["Alloy", "Ash", "Ballad", "Coral", "Echo", "Sage", "Shimmer", "Verse"].map((name) => ({
    name,
    file: `/audios/assistant-voices/openai-fm-${name.toLowerCase()}-friendly.wav`,
  })),
  google: ["Puck", "Charon", "Kore", "Fenrir", "Aoede", "Leda", "Orus", "Zephyr"].map((name) => ({
    name,
    file: `/audios/assistant-voices/chirp3-hd-${name.toLowerCase()}.mp3`,
  })),
};

/** replyagent `getVoiceAIProviders()` — providers with realtime models (OpenAI, Google). */
export const VOICE_PROVIDERS = AI_PROVIDERS.filter((p) => Object.keys(REALTIME_MODELS).includes(p.value));

/** replyagent summary model list (Summary step). */
export const SUMMARY_MODELS = ["gpt-4o-2024-08-06", "gpt-4o-mini", "gpt-4o-2024-05-13", "gpt-4-turbo", "gpt-4-0125-preview"];

/** replyagent `state.data.contact_fields` for the field pickers (minus avatar / created_at / source / id). */
export const SYSTEM_FIELDS = [
  { value: "first_name", label: "First name" },
  { value: "last_name", label: "Last name" },
  { value: "title", label: "Title" },
  { value: "primary_mobile", label: "Mobile number" },
  { value: "primary_whatsapp", label: "WhatsApp number" },
  { value: "primary_email", label: "Email address" },
  { value: "instagram_handler", label: "Instagram handler" },
];
export const PRIMARY_FIELDS = ["primary_email", "primary_mobile", "primary_whatsapp"];

export const WIDGET_IMAGES = ["Standard", "Futuristic", "Light", "AI"] as const;

export interface VoiceFunction {
  id?: any;
  name: string;
  description: string;
  type: VoiceFunctionType;
  is_active: boolean | number;
  data: any;
  status?: string;
  api?: string;
  parameters?: any[];
}

export interface VoiceAgent {
  id: any;
  type: VoiceType | null;
  name: string;
  instructions: string;
  model: string | null;
  model_provider: string;
  language: string;
  greeting: string | null;
  twilio_number_id: any;
  record_calls: boolean;
  knowledgebase_ids: any[];
  voice: string;
  confidence: number;
  temperature: number;
  allowed_minutes_enabled: boolean;
  allowed_minutes: number;
  automation_enabled: boolean;
  automation_id: any;
  call_limit: number;
  call_ending_message: string;
  generate_summary: boolean;
  summary_model: string;
  summary_prompt: string;
  summary_custom_field: any;
  call_transfer_config: { transfer_description: string | null; call_transfer_to_number: string | null }[];
  a_i_functions: VoiceFunction[];
  design: Record<string, any>;
  status?: string;
  embed_url?: string | null;
  used_minutes?: number;
}

/** replyagent default `design` — branding colour, logo and favicon fill in. */
export function defaultDesign(branding: any): Record<string, any> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const favicon = branding?.favicon_url || "/favicon.ico";
  return {
    type: "page",
    bg_type: "color",
    bg_color: branding?.color || "#3b82f6",
    bg_image: `${origin}/images/voice-widget/Standard.jpeg`,
    bg_video: `${origin}/images/voice-widget/Video.mp4`,
    logo_url: branding?.logo_light_url || null,
    title: "Voice Assistant",
    titleColor: "#000000",
    subtitle: "Call us from web",
    subtitleColor: "#ffffff",
    buttonText: "Call now",
    buttonBgColor: "#00c951",
    buttonColor: "#ffffff",
    bg_custom: null,
    bg_custom_type: "image",
    endButtonText: "End Call",
    endButtonBgColor: "#fb2c36",
    endButtonColor: "#ffffff",
    pageTitle: "Voice Assistant",
    pageDescription: "Call us from web",
    favicon: /^https?:\/\//.test(favicon) ? favicon : `${origin}${favicon.startsWith("/") ? "" : "/"}${favicon}`,
    hideTranscription: false,
  };
}

/** replyagent `getAgentModel()`. */
export function emptyVoiceAgent(instructions: string, branding: any): VoiceAgent {
  return {
    id: null,
    type: null,
    name: "",
    instructions,
    model: "gpt-4o-realtime-preview",
    model_provider: "openai",
    language: "en",
    greeting: null,
    twilio_number_id: null,
    record_calls: false,
    knowledgebase_ids: [],
    voice: "Alloy",
    confidence: 0.7,
    temperature: 0.7,
    allowed_minutes_enabled: false,
    allowed_minutes: 5,
    automation_enabled: false,
    automation_id: null,
    call_limit: 5,
    call_ending_message: "Thank you! Good bye",
    generate_summary: false,
    summary_model: "",
    summary_prompt: "",
    summary_custom_field: null,
    call_transfer_config: [],
    a_i_functions: [],
    design: defaultDesign(branding),
  };
}

/** replyagent `editAssistant(agent)` — server row → form model. */
export function fromServer(raw: any, branding: any): VoiceAgent {
  const a: any = { ...raw };
  a.model_provider = a.model_provider || "openai";
  a.knowledgebase_ids = Array.isArray(a.knowledgebases) ? a.knowledgebases.map((k: any) => k.id) : [];
  a.call_transfer_config = Array.isArray(a.call_transfer_config) ? a.call_transfer_config : [];
  a.a_i_functions = Array.isArray(a.a_i_functions) ? a.a_i_functions : [];
  a.design = { ...defaultDesign(branding), ...(a.design_config ?? {}) };
  a.temperature = a.temperature ?? 0.7;
  a.confidence = a.confidence ?? 0.7;
  a.call_limit = a.call_limit ?? 5;
  a.allowed_minutes = a.allowed_minutes ?? 5;
  a.language = a.language || "en";
  a.summary_model = a.summary_model ?? "";
  a.summary_prompt = a.summary_prompt ?? "";
  return a as VoiceAgent;
}

async function json(method: string, url: string, body?: any, silent?: number[]) {
  const res = await apiRequest(method, url, body, silent ? { silentStatuses: silent } : undefined);
  return res.json();
}

export const voiceApi = {
  list: (params: { search?: string; status_filter?: string; provider_filter?: string }) => {
    const qs = new URLSearchParams();
    if (params.search?.trim()) qs.set("search", params.search.trim());
    if (params.status_filter && params.status_filter !== "all") qs.set("status_filter", params.status_filter);
    if (params.provider_filter) qs.set("provider_filter", params.provider_filter);
    const q = qs.toString();
    return json("GET", `${BASE}${q ? `?${q}` : ""}`);
  },
  numbers: (type: string, agentId?: any) =>
    json("GET", `${BASE}/numbers?type=${encodeURIComponent(type)}${agentId != null ? `&agent_id=${agentId}` : ""}`),
  /** Create / update — errors come back with `error_code`, surfaced by the caller. */
  save: (a: VoiceAgent) => json("POST", a.id != null ? `${BASE}/${a.id}` : BASE, a, [400, 404, 422]),
  remove: (id: any) => json("POST", `${BASE}/delete/${id}`),
  resetAllowedMinutes: (id: any) => json("POST", `${BASE}/reset-allowed-minutes/${id}`),
  deleteFunction: (id: any) => json("POST", `${BASE}/delete-function/${id}`),
  logs: (id: any, page = 1) => json("GET", `${BASE}/${id}/logs?page=${page}`),
  functionLogs: (id: any, page = 1) => json("GET", `${BASE}/${id}/function-logs?page=${page}`),
};

/** replyagent `formatSeconds` — HH:MM:SS. */
export function formatSeconds(total: number): string {
  const s = Math.max(0, Math.floor(Number(total) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

/** replyagent AnimatedCredits display — seconds as M:SS. */
export function formatCredits(seconds: number): string {
  const s = Math.floor(Number(seconds) || 0);
  const sign = s < 0 ? "-" : "";
  const abs = Math.abs(s);
  return `${sign}${Math.floor(abs / 60)}:${String(abs % 60).padStart(2, "0")}`;
}
