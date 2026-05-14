import { useState } from "react";
import { Search, MessageSquare, Zap, List, ThumbsUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const abbreviateNumber = (num: number) => num >= 1000000 ? (num/1000000).toFixed(1)+"M" : num >= 1000 ? (num/1000).toFixed(1)+"K" : num.toString();

const agentAvailabilityData = [
  { name: "John Smith",    team: "Sales Team",     loginTime: "09:30 AM", status: "Online", dot: "bg-emerald-500" },
  { name: "Sarah Johnson", team: "Support Team",   loginTime: "08:45 AM", status: "Busy",   dot: "bg-orange-500" },
  { name: "Mike Wilson",   team: "Technical Team", loginTime: "10:15 AM", status: "Online", dot: "bg-emerald-500" },
  { name: "Emma Davis",    team: "Sales Team",     loginTime: "09:00 AM", status: "Away",   dot: "bg-yellow-500" },
];

const agentMetricsData = [
  { name: "John Smith",    accepted: 45, solved: 42, date: "Oct 28, 2025", avgResponse: "1m 45s", avgResolution: "12m 30s" },
  { name: "Sarah Johnson", accepted: 38, solved: 35, date: "Oct 28, 2025", avgResponse: "2m 10s", avgResolution: "18m 45s" },
  { name: "Mike Wilson",   accepted: 52, solved: 48, date: "Oct 28, 2025", avgResponse: "1m 20s", avgResolution: "10m 15s" },
  { name: "Emma Davis",    accepted: 28, solved: 26, date: "Oct 28, 2025", avgResponse: "3m 05s", avgResolution: "22m 30s" },
];

const statusBars = [
  { label: "Online",  count: 8, pct: 80, color: "bg-emerald-500" },
  { label: "Busy",    count: 5, pct: 50, color: "bg-orange-500"  },
  { label: "Away",    count: 2, pct: 20, color: "bg-yellow-500"  },
  { label: "Offline", count: 0, pct: 0,  color: "bg-slate-400"   },
];

export default function AgentPerformanceMain() {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const card    = dark ? "bg-[#0f1829] border-slate-800" : "bg-white border-slate-200";
  const text    = dark ? "text-white"     : "text-slate-900";
  const sub     = dark ? "text-slate-400" : "text-slate-500";
  const divider = dark ? "border-slate-800" : "border-slate-100";
  const rowHover = dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50";
  const thCls   = dark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-100";
  const inputCls = dark ? "bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400";

  const [availSearch, setAvailSearch] = useState("");
  const [perfSearch,  setPerfSearch]  = useState("");

  const filteredAvail = agentAvailabilityData.filter(a =>
    a.name.toLowerCase().includes(availSearch.toLowerCase()) || a.team.toLowerCase().includes(availSearch.toLowerCase())
  );
  const filteredPerf = agentMetricsData.filter(a => a.name.toLowerCase().includes(perfSearch.toLowerCase()));

  const kpiCards = [
    { title: "Conversations", icon: <MessageSquare size={14} className="text-primary" />,
      rows: [{ l: "Total handled", v: abbreviateNumber(1250) }, { l: "Completed", v: abbreviateNumber(980) }, { l: "In progress", v: "45" }] },
    { title: "Performance", icon: <Zap size={14} className="text-primary" />,
      rows: [{ l: "Avg response time", v: "2m 15s" }, { l: "Avg resolution time", v: "15m 30s" }, { l: "Resolution rate", v: "92%" }] },
    { title: "Queue", icon: <List size={14} className="text-primary" />,
      rows: [{ l: "Active now", v: "12" }, { l: "Pending", v: "8" }, { l: "Forwarded", v: "3" }] },
    { title: "Feedback", icon: <ThumbsUp size={14} className="text-primary" />,
      rows: [{ l: "Great", v: "156", c: "text-emerald-500" }, { l: "Average", v: "42", c: "text-yellow-500" }, { l: "Poor", v: "8", c: "text-rose-500" }] },
  ];

  const tableHeaders = (cols: string[]) => (
    <tr className={cn("border-b text-left", divider)}>
      {cols.map(h => <th key={h} className={cn("pb-2 px-3 text-[10px] font-bold uppercase tracking-widest", thCls)}>{h}</th>)}
    </tr>
  );

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <div key={i} className={cn("rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1", card, dark ? "hover:border-primary/30" : "hover:border-primary/20")}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className={cn("p-2 rounded-xl", dark ? "bg-primary/15" : "bg-primary/10")}>{kpi.icon}</div>
              <h3 className={cn("text-[13px] font-bold", text)}>{kpi.title}</h3>
            </div>
            <div className="space-y-2">
              {kpi.rows.map((r: any, ri: number) => (
                <div key={ri} className="flex justify-between items-center">
                  <span className={cn("text-[11px]", sub)}>{r.l}</span>
                  <span className={cn("text-[13px] font-bold tabular-nums", r.c || text)}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Agent Availability Board */}
      <div className={cn("rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl", card)}>
        <div className="flex items-center justify-between mb-5">
          <h3 className={cn("text-[13px] font-bold", text)}>Agent Availability Board</h3>
          <div className="relative">
            <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5", sub)} />
            <input placeholder="Search agents..." value={availSearch} onChange={e => setAvailSearch(e.target.value)}
              className={cn("pl-9 pr-3 h-8 w-44 text-[11px] rounded-lg border outline-none", inputCls)} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Bars */}
          <div className="space-y-3">
            <div className="flex justify-between mb-2">
              <span className={cn("text-[11px] font-bold uppercase tracking-widest", sub)}>Agent Status</span>
              <span className={cn("text-[11px] font-bold", sub)}>Total: 15</span>
            </div>
            {statusBars.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className={cn("text-[11px]", sub)}>{s.label}</span>
                  <span className={cn("text-[11px] font-bold", text)}>{s.count}</span>
                </div>
                <div className={cn("w-full rounded-full h-1.5", dark ? "bg-slate-800" : "bg-slate-100")}>
                  <div className={cn("h-1.5 rounded-full", s.color)} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
            <div className={cn("pt-3 grid grid-cols-2 gap-1.5 border-t", divider)}>
              {statusBars.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className={cn("w-1.5 h-1.5 rounded-full", s.color)} />
                  <span className={cn("text-[10px]", sub)}>{s.label} ({s.count})</span>
                </div>
              ))}
            </div>
          </div>
          {/* Agents Table */}
          <div className="lg:col-span-2 overflow-x-auto">
            <table className="w-full">
              <thead>{tableHeaders(["Agent", "Team", "Login Time", "Status"])}</thead>
              <tbody>
                {filteredAvail.length > 0 ? filteredAvail.map((a, i) => (
                  <tr key={i} className={cn("border-b transition-colors", divider, rowHover)}>
                    <td className={cn("py-2.5 px-3 text-[12px] font-semibold", text)}>{a.name}</td>
                    <td className={cn("py-2.5 px-3 text-[11px]", sub)}>{a.team}</td>
                    <td className={cn("py-2.5 px-3 text-[11px] tabular-nums", sub)}>{a.loginTime}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full", a.dot)} />
                        <span className={cn("text-[11px] font-semibold", text)}>{a.status}</span>
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan={4} className={cn("py-6 text-center text-[11px]", sub)}>No agents found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Agent Performance Metrics */}
      <div className={cn("rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl", card)}>
        <div className="flex items-center justify-between mb-5">
          <h3 className={cn("text-[13px] font-bold", text)}>Agent Performance Metrics</h3>
          <div className="relative">
            <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5", sub)} />
            <input placeholder="Search by agent..." value={perfSearch} onChange={e => setPerfSearch(e.target.value)}
              className={cn("pl-9 pr-3 h-8 w-52 text-[11px] rounded-lg border outline-none", inputCls)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>{tableHeaders(["Agent", "Accepted", "Solved", "Date", "Avg Response", "Avg Resolution"])}</thead>
            <tbody>
              {filteredPerf.length > 0 ? filteredPerf.map((a, i) => (
                <tr key={i} className={cn("border-b transition-colors", divider, rowHover)}>
                  <td className={cn("py-2.5 px-3 text-[12px] font-semibold", text)}>{a.name}</td>
                  <td className="py-2.5 px-3 text-[12px] font-bold text-primary">{a.accepted}</td>
                  <td className="py-2.5 px-3 text-[12px] font-bold text-emerald-500">{a.solved}</td>
                  <td className={cn("py-2.5 px-3 text-[11px]", sub)}>{a.date}</td>
                  <td className={cn("py-2.5 px-3 text-[11px] tabular-nums", text)}>{a.avgResponse}</td>
                  <td className={cn("py-2.5 px-3 text-[11px] tabular-nums", text)}>{a.avgResolution}</td>
                </tr>
              )) : <tr><td colSpan={6} className={cn("py-6 text-center text-[11px]", sub)}>No records found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
