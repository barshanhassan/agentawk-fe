import { apiRequest } from "@/lib/queryClient";

/**
 * AI Studio → Chat Assistants API — replyagent `services/PortkeyApiService.js`
 * + `services/PortKeyService.js`.
 */

const BASE = "/api/ai-studio/chat-assistants";

export type FunctionType = "CURL" | "API" | "SAVE_DATA" | "TRIGGER_SF" | "ADD_TAG" | "BASEROW";

export interface HttpRequestShape {
  method: string;
  url: string;
  headers: { key: string; value: string }[];
  mapping: { json_path: string; field_id: string }[];
  body: string;
  body_type: "json" | "form";
  body_fields: { key: string; value: string }[];
}

export interface AssistantFunction {
  id?: any;
  name: string;
  description: string;
  type: FunctionType;
  is_active: boolean;
  curl: string;
  parameters: any[];
  http_request: HttpRequestShape;
  data: any;
  remove_from_sf: boolean;
}

export interface McpServer {
  id?: any;
  name: string;
  type: "baserow" | "supabase" | "calcom" | string;
  mcp_url?: string;
  tools: string[];
  enabled?: boolean;
  read_only?: boolean;
  account_id?: any;
  cal_account_id?: any;
}

export interface Assistant {
  id: any;
  name: string;
  instructions: string;
  prompt_strategy: "fixed" | "dynamic";
  model: string;
  provider: string;
  fallback_model: string;
  fallback_provider: string;
  fallback_allowed: boolean;
  history_limit: number;
  creativity: number;
  diversity: number;
  chunk_overlap_tokens: number;
  max_tokens: number;
  a_i_functions: AssistantFunction[];
  knowledgebase_ids: any[];
  knowledgebases?: any[];
  mcp_servers: McpServer[];
  delete_threads: boolean;
  status?: string;
  total_queries?: any;
  user_ids?: any[];
}

export function emptyHttpRequest(): HttpRequestShape {
  return { method: "GET", url: "", headers: [], mapping: [], body: "", body_type: "json", body_fields: [] };
}

/** replyagent `AI_Functions.getFunctionModel()`. */
export function emptyFunction(type: FunctionType): AssistantFunction {
  return {
    id: null,
    name: "",
    description: "",
    type,
    is_active: true,
    curl: "",
    parameters: [],
    http_request: emptyHttpRequest(),
    data:
      type === "BASEROW"
        ? { spreadsheet: null, strategy: "column", strategies: [{ column: "", description: "" }], rows: 1, customField: null }
        : type === "TRIGGER_SF"
          ? { id: null, name: "" }
          : null,
    remove_from_sf: false,
  };
}

/** replyagent `PortKeyService.getAgentModel()`. */
export function emptyAssistant(defaultInstructions: string): Assistant {
  return {
    id: null,
    name: "",
    instructions: defaultInstructions,
    prompt_strategy: "fixed",
    model: "",
    provider: "",
    fallback_model: "",
    fallback_provider: "",
    fallback_allowed: false,
    history_limit: 10,
    creativity: 1,
    diversity: 1,
    chunk_overlap_tokens: 50,
    max_tokens: 2048,
    a_i_functions: [],
    knowledgebase_ids: [],
    mcp_servers: [],
    delete_threads: false,
  };
}

/** replyagent `transformRequest()` — type-specific data packed into `parameters`. */
export function toPayload(a: Assistant) {
  return {
    id: a.id,
    name: a.name,
    instructions: a.instructions,
    prompt_strategy: a.prompt_strategy,
    model: a.model,
    provider: a.provider,
    fallback_model: a.fallback_model || "",
    fallback_provider: a.fallback_provider || "",
    fallback_allowed: a.fallback_allowed || false,
    history_limit: a.history_limit,
    creativity: a.creativity,
    diversity: a.diversity,
    chunk_overlap_tokens: a.chunk_overlap_tokens,
    max_tokens: a.max_tokens,
    knowledgebase_ids: a.knowledgebase_ids || [],
    delete_threads: a.delete_threads || false,
    mcp_servers: a.mcp_servers || [],
    functions: (a.a_i_functions || []).map((fn) => {
      const base: any = {
        name: fn.name,
        description: fn.description,
        type: fn.type,
        is_active: fn.is_active ?? true,
      };
      switch (fn.type) {
        case "CURL":
          base.parameters = { curl: fn.curl || "", parameters: fn.parameters || [] };
          break;
        case "API":
          base.parameters = {
            http_request: {
              method: fn.http_request?.method || "GET",
              url: fn.http_request?.url || "",
              headers: fn.http_request?.headers || [],
              mapping: fn.http_request?.mapping || [],
              body: fn.http_request?.body || "",
              body_type: fn.http_request?.body_type || "json",
              body_fields: fn.http_request?.body_fields || [],
            },
          };
          break;
        case "SAVE_DATA":
          base.parameters = { parameters: fn.parameters || [] };
          break;
        case "TRIGGER_SF":
          base.parameters = { remove_from_sf: fn.remove_from_sf || false, data: fn.data || null };
          break;
        case "ADD_TAG":
          base.parameters = { data: fn.data || null };
          break;
        case "BASEROW":
          base.parameters = {
            data: fn.data || { spreadsheet: null, strategy: "column", strategies: [], rows: 1, customField: null },
          };
          break;
        default:
          base.parameters = {};
      }
      return base;
    }),
  };
}

/** replyagent `transformResponse()` — prompt → instructions, functions → a_i_functions, defaults. */
export function normalizeAssistant(raw: any): Assistant {
  const a: any = { ...raw };
  if (a.prompt !== undefined) a.instructions = a.prompt ?? "";
  const fns = Array.isArray(a.functions) ? a.functions : [];
  a.a_i_functions = fns.map((fn: any) => ({
    id: fn.id,
    name: fn.name || "",
    description: fn.description || "",
    type: fn.type || "CURL",
    is_active: fn.is_active ?? true,
    curl: fn.curl || "",
    parameters: fn.parameters || [],
    http_request: fn.http_request
      ? { ...emptyHttpRequest(), ...fn.http_request, body_type: fn.http_request.body_type || "json", body_fields: fn.http_request.body_fields || [] }
      : emptyHttpRequest(),
    data: fn.data ?? null,
    remove_from_sf: fn.remove_from_sf || false,
  }));
  a.creativity = a.creativity == null ? 0.1 : Number(a.creativity);
  a.diversity = a.diversity == null ? 0.1 : Number(a.diversity);
  a.chunk_overlap_tokens = a.chunk_overlap_tokens ?? 50;
  a.max_tokens = a.max_tokens ?? 400;
  a.history_limit = a.history_limit ?? 10;
  a.fallback_allowed = !!a.fallback_allowed;
  a.fallback_model = a.fallback_model ?? "";
  a.fallback_provider = a.fallback_provider ?? "";
  a.knowledgebase_ids = Array.isArray(a.knowledgebases) ? a.knowledgebases.map((k: any) => k.id) : a.knowledgebase_ids ?? [];
  a.mcp_servers = Array.isArray(a.mcp_servers) ? a.mcp_servers : [];
  a.delete_threads = !!a.delete_threads;
  return a as Assistant;
}

async function json(method: string, url: string, body?: any) {
  const res = await apiRequest(method, url, body);
  return res.json();
}

export const studioApi = {
  list: (page = 1) => json("GET", `${BASE}?page=${page}`),
  search: (params: { search?: string; status?: string; provider?: string; page?: number }) => json("POST", `${BASE}/search`, params),
  get: (id: any) => json("GET", `${BASE}/${id}`),
  create: (a: Assistant) => json("POST", BASE, toPayload(a)),
  update: (id: any, a: Assistant) => json("POST", `${BASE}/${id}`, toPayload(a)),
  remove: (id: any) => json("POST", `${BASE}/delete/${id}`),
  setStatus: (id: any, status: string) => json("PUT", `${BASE}/status/${id}`, { status }),
  logs: (id: any, filters: Record<string, any>) => {
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    return json("GET", `${BASE}/logs/${id}?${qs.toString()}`);
  },
  statistics: (id: any) => json("GET", `${BASE}/statistics/${id}`),
  test: (id: any, payload: { message: string; thread_id: any; history: any[]; contact_id: any; image_url?: string | null }) =>
    json("POST", `${BASE}/test/${id}`, payload),
  clearTestThreads: (id: any) => json("DELETE", `${BASE}/${id}/test-threads`),
  syncUsers: (id: any, userIds: number[]) => json("POST", `${BASE}/${id}/users`, { user_ids: userIds }),
  knowledgebases: () => json("GET", "/api/ai-studio/knowledgebases"),
};
