/**
 * Custom ReactFlow node renderers — visual representation of each step
 * type on the builder canvas. Replyagent parity for the Drawflow node
 * templates.
 *
 * Each node renderer is responsible for:
 *   - its own colored header (channel-coloured for channel nodes)
 *   - icon + label
 *   - a short summary of the configured properties (e.g. WhatsApp text
 *     truncated to first 40 chars)
 *   - handles (input on top, output on bottom)
 *   - quick action buttons (delete + duplicate) on hover
 *
 * The `data` prop passed by ReactFlow is the node's `data` field from the
 * store — we read the action-slug / value / channel from there.
 */
import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Badge } from "@/components/ui/badge";
import { CHANNEL_LABELS } from "./channel-schemas";
import { getTriggerSchema } from "./trigger-schemas";
import { ACTION_SCHEMAS } from "./action-schemas";
import {
  Zap,
  MessageSquare,
  Clock,
  Shuffle,
  GitBranch,
  Cog,
  Bot,
  Bell,
  MousePointerClick,
  Image as ImageIcon,
  Mic,
  FileText,
  ListChecks,
  Brain,
  HelpCircle,
} from "lucide-react";

const NODE_WIDTH = 240;

// ─── Trigger node ──────────────────────────────────────────────────────

/**
 * Replyagent's "Start" card is intentionally minimal — a thin white card
 * with green left accent showing only the trigger title + a tiny start
 * indicator. The detailed properties live in the right sidebar, not on
 * the canvas. Match that compactness.
 */
/**
 * Replyagent's "Start" canvas card is a thin white card with a green
 * border, the trigger title at the top, and one row per activity below
 * (so multi-trigger Start nodes render as a stacked list). Match that
 * exactly:
 *
 *   ┌────────────────────────────┐
 *   │  ◉ Start                   │
 *   ├────────────────────────────┤
 *   │  Default                   │
 *   │  Tag applied: <tag>        │
 *   │  …                         │
 *   └────────────────────────────┘
 *           Start ↓
 */
export const TriggerNode = memo(({ data }: NodeProps<any>) => {
  const activities: any[] = data?.activities ?? [];
  const items = activities.length
    ? activities
    : [{ event: data?.activity_properties?.event ?? data?.event ?? "default_url", label: "Default" }];

  const renderActivitySummary = (act: any): string => {
    const schema = getTriggerSchema(act.event);
    const label = schema?.label ?? act.label ?? "Default";
    const payload = act.payload ?? {};
    // Lightweight per-event summary for readability on the canvas card.
    switch (act.event) {
      case "default_url":
        return "Default";
      case "tag_applied":
      case "tag_removed":
        return `${label}: ${payload.tag_id ? `tag #${payload.tag_id}` : "Tag not selected"}`;
      case "custom_field_changed":
      case "system_field_changed":
      case "date_field_changed":
        return `${label}: ${payload.field_id ?? payload.field ?? "(field)"}`;
      case "wa_keyword":
      case "tg_keyword":
      case "ig_keyword":
      case "fb_keyword":
      case "wc_keyword":
      case "twilio_keyword":
      case "evolution_keyword":
      case "zapi_keyword":
        return `${label}: ${(payload.keywords ?? []).join(", ") || "(no keywords)"}`;
      default:
        return label;
    }
  };

  return (
    <div
      className="rounded bg-white shadow-sm border-2 border-emerald-300"
      style={{ width: 260 }}
    >
      <div className="px-3 py-2 flex items-center gap-2 border-b border-emerald-200">
        <span className="h-4 w-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-800">
          Start
        </span>
      </div>
      <div className="bg-white">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="px-3 py-1.5 text-[11px] border-b border-emerald-50 last:border-b-0 truncate"
          >
            {renderActivitySummary(it)}
          </div>
        ))}
      </div>
      <div className="px-3 py-1 text-[10px] text-emerald-700 flex items-center gap-1">
        Start <span>↓</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});
TriggerNode.displayName = "TriggerNode";

// ─── Channel node (WhatsApp/Telegram/IG/Messenger/Webchat/SMS/Call/Zapi/Evolution) ──

function makeChannelNode(channel: string) {
  const meta = CHANNEL_LABELS[channel] ?? { label: channel, icon: "fa-comment", color: "text-muted-foreground" };
  const Component = memo(({ data }: NodeProps<any>) => {
    const value = data?.value ?? {};
    const summary = channelSummary(channel, value);
    return (
      <div
        className="rounded-md border-2 bg-white shadow-sm"
        style={{ width: NODE_WIDTH, borderColor: borderForChannel(channel) }}
      >
        <Handle type="target" position={Position.Top} />
        <div
          className={`border-b px-3 py-2 flex items-center gap-2 rounded-t-md ${bgForChannel(channel)}`}
        >
          <ChannelIcon channel={channel} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${meta.color}`}>
            {meta.label}
          </span>
        </div>
        <div className="px-3 py-2 text-sm">
          <p className="font-medium truncate">
            {data?.label ?? "Configure message"}
          </p>
          <p className="text-[10px] text-muted-foreground truncate" title={summary}>
            {summary || "—"}
          </p>
        </div>
        <StatsOverlay data={data} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  });
  Component.displayName = `${meta.label}Node`;
  return Component;
}

/**
 * Replyagent's published / preview-mode canvas overlays per-node statistics:
 * total messages sent + click-through % (uniqueClicks / totalSent). We read
 * those from `data.stats` which the hydrate path populates from
 * `automation_step_statistics`. Hidden when mode === 'draft' OR no stats.
 */
function StatsOverlay({ data }: { data: any }) {
  if (!data || data.mode === "draft") return null;
  const s = data.stats ?? data.statistics?.stats;
  if (!s) return null;
  const sent = Number(s.total_sent ?? s.totalSent ?? 0);
  const clicks = Number(s.unique_clicks ?? s.uniqueClicks ?? 0);
  const ctr = sent > 0 ? Math.round((clicks / sent) * 100) : 0;
  if (sent === 0 && clicks === 0) return null;
  return (
    <div className="px-3 py-1 text-[10px] border-t bg-muted/30 flex items-center justify-between font-mono">
      <span title="Total messages sent">📤 {sent.toLocaleString()}</span>
      <span title="Click-through rate (unique clicks / sent)">
        {ctr}% CTR
      </span>
    </div>
  );
}

function channelSummary(channel: string, value: any): string {
  const type = value?.type ?? "text";
  if (type === "text") return (value?.message ?? "").slice(0, 60);
  if (type === "input") return `Ask: ${(value?.message ?? "").slice(0, 50)}`;
  if (type === "button") return `Buttons: ${(value?.choices ?? []).length}`;
  if (type === "image_url") return "Image";
  if (type === "audio") return "Audio";
  if (type === "message_list") return `List: ${value?.button ?? "(button)"}`;
  if (type === "message_template") return `Template: ${value?.template_id ?? "?"}`;
  if (type === "chatgpt_question") return `AI: ${(value?.question ?? "").slice(0, 40)}`;
  if (type === "dify_question") return `Dify: ${(value?.question ?? "").slice(0, 40)}`;
  if (type === "cta_button") return `CTA: ${value?.button_text ?? "?"}`;
  if (type === "call") return "Call";
  return type;
}

function ChannelIcon({ channel }: { channel: string }) {
  switch (channel) {
    case "whatsapp":
    case "zapi":
    case "evolution":
      return <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />;
    case "telegram":
      return <MessageSquare className="h-3.5 w-3.5 text-sky-600" />;
    case "messenger":
      return <MessageSquare className="h-3.5 w-3.5 text-blue-600" />;
    case "instagram":
      return <MessageSquare className="h-3.5 w-3.5 text-fuchsia-600" />;
    case "webchat":
      return <MessageSquare className="h-3.5 w-3.5 text-orange-600" />;
    case "twilio_sms":
      return <MessageSquare className="h-3.5 w-3.5 text-amber-600" />;
    case "twilio_call":
      return <MessageSquare className="h-3.5 w-3.5 text-rose-600" />;
    default:
      return <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />;
  }
}

function borderForChannel(channel: string): string {
  switch (channel) {
    case "whatsapp":
    case "evolution":
      return "rgb(167 243 208)"; // emerald-200
    case "zapi":
      return "rgb(110 231 183)"; // emerald-300
    case "telegram":
      return "rgb(186 230 253)"; // sky-200
    case "messenger":
      return "rgb(191 219 254)"; // blue-200
    case "instagram":
      return "rgb(245 208 254)"; // fuchsia-200
    case "webchat":
      return "rgb(254 215 170)"; // orange-200
    case "twilio_sms":
      return "rgb(253 230 138)"; // amber-200
    case "twilio_call":
      return "rgb(254 205 211)"; // rose-200
    default:
      return "rgb(228 228 231)";
  }
}

function bgForChannel(channel: string): string {
  switch (channel) {
    case "whatsapp":
    case "evolution":
    case "zapi":
      return "bg-emerald-50 border-emerald-200";
    case "telegram":
      return "bg-sky-50 border-sky-200";
    case "messenger":
      return "bg-blue-50 border-blue-200";
    case "instagram":
      return "bg-fuchsia-50 border-fuchsia-200";
    case "webchat":
      return "bg-orange-50 border-orange-200";
    case "twilio_sms":
      return "bg-amber-50 border-amber-200";
    case "twilio_call":
      return "bg-rose-50 border-rose-200";
    default:
      return "bg-muted/40";
  }
}

export const WhatsAppNode = makeChannelNode("whatsapp");
export const TelegramNode = makeChannelNode("telegram");
export const MessengerNode = makeChannelNode("messenger");
export const InstagramNode = makeChannelNode("instagram");
export const WebchatNode = makeChannelNode("webchat");
export const TwilioSmsNode = makeChannelNode("twilio_sms");
export const TwilioCallNode = makeChannelNode("twilio_call");
export const ZapiNode = makeChannelNode("zapi");
export const EvolutionNode = makeChannelNode("evolution");

// ─── DelayNode ────────────────────────────────────────────────────────

export const DelayNode = memo(({ data }: NodeProps<any>) => {
  const v = data?.value ?? {};
  const summary =
    v.mode === "date"
      ? `Until ${v.until ?? "?"}`
      : `${v.amount ?? "?"} ${v.unit ?? "minutes"}`;
  return (
    <div
      className="rounded-md border-2 border-amber-200 bg-white shadow-sm"
      style={{ width: NODE_WIDTH }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="bg-amber-50 border-b border-amber-200 px-3 py-2 flex items-center gap-2 rounded-t-md">
        <Clock className="h-3.5 w-3.5 text-amber-600" />
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
          Delay
        </span>
      </div>
      <div className="px-3 py-2 text-sm">
        <p className="font-medium truncate">{summary}</p>
        {v.time_window_enabled && (
          <p className="text-[10px] text-muted-foreground truncate">
            {v.window_from ?? "?"} – {v.window_to ?? "?"} on {(v.days ?? []).join(", ") || "any day"}
          </p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});
DelayNode.displayName = "DelayNode";

// ─── RandomizerNode ───────────────────────────────────────────────────

export const RandomizerNode = memo(({ data }: NodeProps<any>) => {
  const weights: number[] = data?.value?.weights ?? [50, 50];
  return (
    <div
      className="rounded-md border-2 border-indigo-200 bg-white shadow-sm"
      style={{ width: NODE_WIDTH }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="bg-indigo-50 border-b border-indigo-200 px-3 py-2 flex items-center gap-2 rounded-t-md">
        <Shuffle className="h-3.5 w-3.5 text-indigo-600" />
        <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
          Randomizer
        </span>
      </div>
      <div className="px-3 py-2 text-xs flex flex-wrap gap-1">
        {weights.map((w, i) => (
          <Badge key={i} variant="outline" className="text-[10px]">
            {String.fromCharCode(65 + i)} {w}%
          </Badge>
        ))}
      </div>
      {/* One source handle per branch */}
      {weights.map((_, i) => (
        <Handle
          key={i}
          type="source"
          position={Position.Bottom}
          id={`branch-${i}`}
          style={{ left: `${((i + 1) * 100) / (weights.length + 1)}%` }}
        />
      ))}
    </div>
  );
});
RandomizerNode.displayName = "RandomizerNode";

// ─── ConditionNode ────────────────────────────────────────────────────

export const ConditionNode = memo(({ data }: NodeProps<any>) => {
  const conditions = data?.value?.conditions ?? [];
  const mode = data?.value?.match_mode ?? "all";
  return (
    <div
      className="rounded-md border-2 border-teal-200 bg-white shadow-sm"
      style={{ width: NODE_WIDTH }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="bg-teal-50 border-b border-teal-200 px-3 py-2 flex items-center gap-2 rounded-t-md">
        <GitBranch className="h-3.5 w-3.5 text-teal-600" />
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
          Condition
        </span>
      </div>
      <div className="px-3 py-2 text-sm">
        <p className="font-medium truncate">
          {conditions.length === 0
            ? "Add a condition"
            : `${conditions.length} condition${conditions.length === 1 ? "" : "s"} (${mode})`}
        </p>
      </div>
      {/* Yes / No branches */}
      <Handle type="source" position={Position.Bottom} id="yes" style={{ left: "30%" }} />
      <Handle type="source" position={Position.Bottom} id="no" style={{ left: "70%" }} />
    </div>
  );
});
ConditionNode.displayName = "ConditionNode";

// ─── ActionNode (50+ action types) ────────────────────────────────────

export const ActionNode = memo(({ data }: NodeProps<any>) => {
  const slug = data?.value?.slug ?? data?.actionSlug ?? "";
  const schema = ACTION_SCHEMAS[slug];
  return (
    <div
      className="rounded-md border-2 border-slate-300 bg-white shadow-sm"
      style={{ width: NODE_WIDTH }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-2 rounded-t-md">
        <Cog className="h-3.5 w-3.5 text-slate-600" />
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Action
        </span>
      </div>
      <div className="px-3 py-2 text-sm">
        <p className="font-medium truncate">{schema?.label ?? "Pick an action"}</p>
        <p className="text-[10px] text-muted-foreground truncate">
          {schema?.group ?? slug}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});
ActionNode.displayName = "ActionNode";

// ─── Combined node-types map (export to ReactFlow) ────────────────────

export const AUTOMATION_NODE_TYPES = {
  trigger: TriggerNode,
  whatsapp: WhatsAppNode,
  telegram: TelegramNode,
  messenger: MessengerNode,
  instagram: InstagramNode,
  webchat: WebchatNode,
  twilio_sms: TwilioSmsNode,
  twilio_call: TwilioCallNode,
  zapi: ZapiNode,
  evolution: EvolutionNode,
  delay: DelayNode,
  randomizer: RandomizerNode,
  condition: ConditionNode,
  action: ActionNode,
} as const;
