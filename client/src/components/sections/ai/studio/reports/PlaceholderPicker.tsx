import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Search, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * The ⚡ placeholder picker of the Report Builder prompt — replyagent
 * `FieldPlaceholder.vue` + `FieldPickerMenu.vue` with the groups
 * `report, system, custom, more, ads` (`variables/ReportFields.js`,
 * `AdsFields.js`). A leaf emits its token value; the prompt wraps it in {{ }}.
 */

export interface PickerNode {
  label: string;
  sub?: string;
  value?: string;
  children?: PickerNode[];
}

const INTERVALS: [string, string][] = [
  ["today", "today"],
  ["yesterday", "yesterday"],
  ["last_seven_days", "last_7_days"],
  ["current_week", "this_week"],
  ["last_thirty_days", "last_30_days"],
  ["current_month", "this_month"],
];

const AGENT_METRICS: [string, string][] = [
  ["stats.number_of_conversations", "conversations"],
  ["stats.conversations_marked_as_done", "conversations_marked_as_done"],
  ["stats.number_of_tasks_created", "tasks_created"],
  ["stats.number_of_tasks_completed", "tasks_completed"],
  ["stats.messages_sent_per_day", "messages_sent_per_day"],
  ["stats.messages_sent_per_hour", "messages_sent_per_hour"],
  ["stats.average_time_to_conclude_a_conversation", "average_time_to_conclude_a_conversation"],
];
const SUPERVISOR_METRICS: [string, string][] = [
  ["stats.conversations_per_agent", "conversations_per_agent"],
  ["stats.conversations_marked_as_done_per_agent", "conversations_marked_as_done_per_agent"],
  ["stats.messages_per_agent", "messages_per_agent"],
  ["stats.tasks_created_per_agent", "tasks_created_per_agent"],
  ["stats.tasks_completed_per_agent", "tasks_completed_per_agent"],
  ["stats.conversations_assigned_to_a_team", "conversations_assigned_to_a_team"],
  ["stats.contacts_per_channel", "contacts_per_channel"],
  ["stats.conversations_per_channel", "conversations_per_channel"],
  ["stats.messages_per_channel", "messages_per_channel"],
  ["stats.average_time_to_conclude_a_conversation_per_agent", "average_time_to_conclude_a_conversation_per_agent"],
];
const AI_METRICS: [string, string][] = [
  ["stats.number_of_ai_queries", "ai_number_of_queries"],
  ["stats.incoming_voice_calls_credits", "ai_incoming_voice_calls_credits"],
  ["stats.outgoing_voice_calls_credits", "ai_outgoing_voice_calls_credits"],
];
const PIPELINE_METRICS: [string, string][] = [
  ["stats.conversion_rate", "conversion_rate"],
  ["stats.sales_velocity", "sales_velocity"],
  ["stats.sales_cycle", "sales_cycle"],
  ["stats.win_rate", "win_rate"],
];
/** replyagent `state.data.contact_fields` (the ones EZCONN resolves). */
const SYSTEM_FIELDS: [string, string][] = [
  ["first_name", "First name"],
  ["last_name", "Last name"],
  ["full_name", "Full name"],
  ["title", "Title"],
  ["primary_mobile", "Mobile number"],
  ["primary_whatsapp", "WhatsApp number"],
  ["primary_email", "Email address"],
  ["instagram_handler", "Instagram handler"],
  ["gender", "Gender"],
  ["language", "Language"],
  ["timezone", "Timezone"],
];
const ADS_FRAMES: [string, string][] = [
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["past_week", "PastWeek"],
  ["current_week", "CurrentWeek"],
  ["current_month", "CurrentMonth"],
  ["past_month", "PastMonth"],
];

async function getJson(url: string) {
  return (await apiRequest("GET", url)).json();
}
const asList = (d: any, key: string): any[] => (Array.isArray(d) ? d : Array.isArray(d?.[key]) ? d[key] : Array.isArray(d?.data) ? d.data : []);

export function usePlaceholderTree(): PickerNode[] {
  const { t } = useTranslation();
  const ra = (k: string) => t(`ai_studio.ra.${k}`) as string;
  const members = useQuery({ queryKey: ["/api/workspaces/members"], queryFn: () => getJson("/api/workspaces/members").catch(() => []) });
  const pipelines = useQuery({ queryKey: ["/api/pipelines"], queryFn: () => getJson("/api/pipelines").catch(() => ({})) });
  const fields = useQuery({ queryKey: ["/api/custom-fields"], queryFn: () => getJson("/api/custom-fields").catch(() => ({})) });
  const ads = useQuery({ queryKey: ["/api/reports/referral-ads"], queryFn: () => getJson("/api/reports/referral-ads").catch(() => ({ ads: [] })) });

  return useMemo(() => {
    const intervals = (key: string): PickerNode[] => INTERVALS.map(([label, iv]) => ({ label: ra(label), value: `${key}|${iv}` }));
    const metrics = (list: [string, string][], prefix: string) =>
      list.map(([label, key]) => ({ label: ra(label), children: intervals(`${prefix}${key}`) }));

    const report: PickerNode = {
      label: ra("report_fields"),
      children: [
        {
          label: ra("stats.agents_data"),
          children: asList(members.data, "members").map((m: any) => ({
            label: m.full_name || m.email || `#${m.id}`,
            sub: m.email,
            children: metrics(AGENT_METRICS, `agent_${m.id}_`),
          })),
        },
        { label: ra("stats.supervisor_data"), children: metrics(SUPERVISOR_METRICS, "supervisor_") },
        { label: ra("stats.voice_ai_data"), children: metrics(AI_METRICS, "") },
        {
          label: ra("stats.pipeline_data"),
          children: asList(pipelines.data, "pipelines").map((p: any) => ({
            label: p.name,
            children: metrics(PIPELINE_METRICS, `pipeline_${p.id}_`),
          })),
        },
      ],
    };
    const system: PickerNode = { label: ra("system_fields"), children: SYSTEM_FIELDS.map(([value, label]) => ({ label, value })) };
    const customList = asList(fields.data, "fields");
    const custom: PickerNode | null = customList.length
      ? { label: ra("custom_fields"), children: customList.map((f: any) => ({ label: f.label ?? f.name ?? f.slug, value: f.slug ?? String(f.id) })) }
      : null;
    const more: PickerNode = {
      label: ra("general_fields.more_fields"),
      children: [
        { label: ra("general_fields.day_of_week"), value: "day__of__week" },
        { label: ra("general_fields.current_date"), value: "current__date" },
        { label: ra("general_fields.current_time"), value: "current__time" },
        { label: ra("general_fields.current_hour"), value: "current__hour" },
        { label: ra("general_fields.current_minute"), value: "current__minute" },
      ],
    };
    const adNode = (label: string, id: string): PickerNode => ({
      label,
      children: ADS_FRAMES.map(([k, frame]) => ({ label: ra(k), value: `RefClicks_${frame}_${id}` })),
    });
    const adsGroup: PickerNode = {
      label: "Meta CAPI Ads Data",
      children: [adNode("All ads", "All"), ...(ads.data?.ads ?? []).map((a: any) => adNode(a.title, a.ad_id))],
    };
    return [report, system, ...(custom ? [custom] : []), more, adsGroup];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members.data, pipelines.data, fields.data, ads.data, t]);
}

/** Keep a node if it matches, or keep only its matching descendants. */
function filterTree(nodes: PickerNode[], q: string): PickerNode[] {
  if (!q) return nodes;
  const out: PickerNode[] = [];
  for (const n of nodes) {
    if (n.label.toLowerCase().includes(q)) out.push(n);
    else if (n.children) {
      const kids = filterTree(n.children, q);
      if (kids.length) out.push({ ...n, children: kids });
    }
  }
  return out;
}

export default function PlaceholderPicker({ onPick }: { onPick: (value: string) => void }) {
  const { t } = useTranslation();
  const ra = (k: string) => t(`ai_studio.ra.${k}`) as string;
  const tree = usePlaceholderTree();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [path, setPath] = useState<number[]>([0]);

  const nodes = useMemo(() => filterTree(tree, search.trim().toLowerCase()), [tree, search]);
  const columns: PickerNode[][] = [nodes];
  for (const idx of path) {
    const next = columns[columns.length - 1]?.[idx]?.children;
    if (!next) break;
    columns.push(next);
  }

  const choose = (level: number, idx: number, node: PickerNode) => {
    if (node.children) {
      setPath([...path.slice(0, level), idx]);
      return;
    }
    if (node.value) {
      onPick(node.value);
      setOpen(false);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setSearch("");
          setPath([0]);
        }
      }}
    >
      <PopoverTrigger asChild>
        <button type="button" title="Placeholders" className="h-8 w-8 rounded-full border-2 border-slate-400 text-slate-500 flex items-center justify-center hover:border-primary hover:text-primary">
          <Zap size={14} className="fill-current" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto max-w-[95vw] p-0">
        <div className="p-2 border-b dark:border-slate-800">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPath([0]);
              }}
              placeholder={ra("search")}
              className="w-full h-8 rounded-lg border pl-8 pr-2 text-[12px] bg-white dark:bg-slate-950 dark:border-slate-800 outline-none"
            />
          </div>
        </div>
        {nodes.length === 0 ? (
          <p className="px-4 py-3 text-[12px] text-slate-400">{ra("no_match_found")}</p>
        ) : (
          <div className="flex overflow-x-auto">
            {columns.map((col, level) => (
              <ul key={level} className="min-w-56 max-h-56 overflow-y-auto border-r last:border-r-0 dark:border-slate-800 py-1">
                {col.map((node, idx) => (
                  <li key={`${level}-${idx}-${node.value ?? node.label}`}>
                    <button
                      type="button"
                      onClick={() => choose(level, idx, node)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-3 py-1.5 text-left text-[12px] hover:bg-slate-100 dark:hover:bg-slate-800",
                        path[level] === idx && node.children && "bg-slate-100 dark:bg-slate-800 font-semibold",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate">{node.label}</span>
                        {node.sub && <span className="block truncate text-[10px] text-slate-400">{node.sub}</span>}
                      </span>
                      {node.children && <ChevronRight size={12} className="shrink-0 text-slate-400" />}
                    </button>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
