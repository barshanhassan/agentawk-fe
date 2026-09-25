/**
 * AI Studio providers and models — replyagent `services/ProviderService.js`.
 * The model list is static on the client, exactly as replyagent ships it.
 */

export type ProviderValue = "openai" | "anthropic" | "google" | "deepseek";

export interface ProviderInfo {
  value: ProviderValue;
  label: string;
  logo: string;
}

export const AI_PROVIDERS: ProviderInfo[] = [
  { value: "openai", label: "OpenAI ChatGPT", logo: "/images/ai-providers/openai.svg" },
  { value: "anthropic", label: "Anthropic Claude", logo: "/images/ai-providers/anthropic.svg" },
  { value: "google", label: "Google Gemini", logo: "/images/ai-providers/google.svg" },
  { value: "deepseek", label: "DeepSeek", logo: "/images/ai-providers/deepseek.svg" },
];

export const SUPPORTED_MODELS: Record<ProviderValue, Record<string, string>> = {
  openai: {
    "gpt-5.4": "GPT-5.4",
    "gpt-5.4-mini": "GPT-5.4 Mini",
    "gpt-5.4-nano": "GPT-5.4 Nano",
    "gpt-5.3-chat-latest": "GPT-5.3 Chat",
    "gpt-5.2": "GPT-5.2",
    "gpt-5.1": "GPT-5.1",
    "gpt-5": "GPT-5",
    "gpt-5-mini": "GPT-5 Mini",
    "gpt-5-nano": "GPT-5 Nano",
    "gpt-4.1": "GPT-4.1",
    "gpt-4.1-mini": "GPT-4.1 Mini",
    "gpt-4.1-nano": "GPT-4.1 Nano",
    "gpt-4o": "GPT-4o",
    "gpt-4o-mini": "GPT-4o Mini",
  },
  google: {
    "gemini-2.5-flash": "Gemini 2.5 Flash",
    "gemini-2.5-pro": "Gemini 2.5 Pro",
    "gemini-2.0-flash": "Gemini 2.0 Flash",
    "gemini-2.0-flash-001": "Gemini 2.0 Flash 001",
    "gemini-2.0-flash-lite": "Gemini 2.0 Flash Lite",
    "gemini-2.5-flash-lite": "Gemini 2.5 Flash Lite",
    "gemini-flash-latest": "Gemini Flash Latest",
    "gemini-flash-lite-latest": "Gemini Flash Lite Latest",
    "gemini-pro-latest": "Gemini Pro Latest",
    "gemini-3-pro-preview": "Gemini 3 Pro Preview",
    "gemini-3-flash-preview": "Gemini 3 Flash Preview",
    "gemini-3.1-pro-preview": "Gemini 3.1 Pro Preview",
    "gemini-3.1-flash-lite-preview": "Gemini 3.1 Flash Lite Preview",
  },
  anthropic: {
    "claude-opus-4-7": "Claude Opus 4.7",
    "claude-sonnet-4-6": "Claude Sonnet 4.6",
    "claude-opus-4-6": "Claude Opus 4.6",
    "claude-opus-4-5-20251101": "Claude Opus 4.5",
    "claude-haiku-4-5-20251001": "Claude Haiku 4.5",
    "claude-sonnet-4-5-20250929": "Claude Sonnet 4.5",
    "claude-opus-4-1-20250805": "Claude Opus 4.1",
    "claude-opus-4-20250514": "Claude Opus 4",
    "claude-sonnet-4-20250514": "Claude Sonnet 4",
    "claude-3-haiku-20240307": "Claude Haiku 3",
  },
  deepseek: {
    "deepseek-chat": "DeepSeek Chat",
    "deepseek-reasoner": "DeepSeek Reasoner",
  },
};

/** replyagent `providerToIntegrationMap`. */
export const PROVIDER_INTEGRATION_TYPE: Record<ProviderValue, string> = {
  openai: "CHATGPT",
  anthropic: "ANTHROPIC",
  google: "GOOGLE",
  deepseek: "DEEPSEEK",
};

export function getProvider(value?: string | null): ProviderInfo | undefined {
  return AI_PROVIDERS.find((p) => p.value === value);
}

export function modelsFor(provider?: string | null): { value: string; label: string }[] {
  const models = SUPPORTED_MODELS[provider as ProviderValue];
  if (!models) return [];
  return Object.entries(models).map(([value, label]) => ({ value, label }));
}

export function modelName(model?: string | null, provider?: string | null): string {
  if (!model) return "";
  return SUPPORTED_MODELS[provider as ProviderValue]?.[model] ?? model;
}

/**
 * replyagent ProviderDropdown: a provider is offered only once the workspace
 * has an integration of its type (status is ignored, as there).
 */
export function connectedProviders(integrations: any[] | undefined): ProviderInfo[] {
  const types = new Set((integrations ?? []).map((i: any) => i.type));
  return AI_PROVIDERS.filter((p) => types.has(PROVIDER_INTEGRATION_TYPE[p.value]));
}
