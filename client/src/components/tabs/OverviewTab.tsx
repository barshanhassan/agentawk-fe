import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Users, UserPlus, BarChart2, Cpu } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

// Utility function to abbreviate large numbers
const abbreviateNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

// Utility function to format percentage
const formatPercentage = (num: number): string => num.toFixed(1) + "%";

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label, isStickinessChart, dark }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={cn(
        "px-2.5 py-1.5 rounded-lg border shadow-xl text-[10px] font-bold",
        dark ? "bg-[#0f1829] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
      )}>
        <p className="mb-0.5 opacity-60">{label}</p>
        <p className="text-blue-500">
          {isStickinessChart ? `${payload[0].value}%` : abbreviateNumber(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function OverviewTab() {
  const { mode } = useTheme();
  const dark = mode === "dark";

  const card   = dark ? "bg-[#0f1829] border-slate-800" : "bg-white border-slate-200";
  const text   = dark ? "text-white" : "text-slate-900";
  const sub    = dark ? "text-slate-400" : "text-slate-500";
  const divider = dark ? "border-slate-800" : "border-slate-100";
  const gridColor = dark ? "#1e293b" : "#f1f5f9";
  const axisColor = dark ? "#64748b" : "#94a3b8";

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["/api/statistics/statistics-v1"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/statistics/statistics-v1");
      return res.json();
    }
  });

  // Workspace-scoped time-series (DAU/MAU/WAU/Stickiness). Backend filters
  // by workspace_id so a fresh workspace returns zero-valued buckets — which
  // is the correct empty state, not the mock hump it used to show.
  const { data: chartsData } = useQuery({
    queryKey: ["/api/statistics/dashboard-charts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/statistics/dashboard-charts");
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = statsData || {};
  const contacts = stats.contacts || { by_status: {}, by_source: {}, total: 0 };
  const channels = stats.channels || {};

  const kpiData = {
    activeToday: contacts.by_status.active || 0,
    activeWeek: contacts.total || 0,
    activeMonth: contacts.total || 0,
    totalUsers: contacts.total || 0,
    stickiness: 0,
    dailyNewUsers: contacts.by_source.manual || 0,
    dailyNewUsersChange: 2.5,
    weeklyNewUsers: contacts.by_source.import || 0,
    weeklyNewUsersChange: -1.2,
    monthlyNewUsers: contacts.by_source.api || 0,
    monthlyNewUsersChange: 5.8,
    currentMAU: contacts.total || 0,
    mauLimit: 1000,
    activeAgents: 1,
    totalSeats: 5,
  };

  const mauUsagePercentage = (kpiData.currentMAU / kpiData.mauLimit) * 100;
  const agentUtilizationPercentage = (kpiData.activeAgents / kpiData.totalSeats) * 100;

  // All chart data now comes from the backend, scoped to the current
  // workspace via JWT. A brand-new workspace returns all-zero buckets.
  const dauData: Array<{ day: string; users: number }> = chartsData?.dauData ?? [];
  const mauData: Array<{ month: string; users: number }> = chartsData?.mauData ?? [];
  const wauData: Array<{ week: string; users: number }> = chartsData?.wauData ?? [];
  const stickinessData: Array<{ day: string; ratio: number }> = chartsData?.stickinessData ?? [];

  const kpiCards = [
    {
      title: "User Activity",
      icon: <Users size={15} className="text-primary" />,
      rows: [
        { label: "Active Today", value: abbreviateNumber(kpiData.activeToday) },
        { label: "Active Week",  value: abbreviateNumber(kpiData.activeWeek) },
        { label: "Active Month", value: abbreviateNumber(kpiData.activeMonth) },
        { label: "Total Users",  value: abbreviateNumber(kpiData.totalUsers) },
        { label: "Stickiness",   value: formatPercentage(kpiData.stickiness), border: true },
      ],
    },
    {
      title: "New Users",
      icon: <UserPlus size={15} className="text-primary" />,
      rows: [
        { label: "Daily",   badge: `+${kpiData.dailyNewUsersChange}%`,   value: abbreviateNumber(kpiData.dailyNewUsers) },
        { label: "Weekly",  badge: `${kpiData.weeklyNewUsersChange}%`,   value: abbreviateNumber(kpiData.weeklyNewUsers) },
        { label: "Monthly", badge: `+${kpiData.monthlyNewUsersChange}%`, value: abbreviateNumber(kpiData.monthlyNewUsers) },
      ],
    },
    {
      title: "Plan Usage",
      icon: <BarChart2 size={15} className="text-primary" />,
      rows: [
        { label: "Current MAU", value: abbreviateNumber(kpiData.currentMAU) },
        { label: "MAU Limit",   value: abbreviateNumber(kpiData.mauLimit) },
        { label: "Usage",       value: formatPercentage(mauUsagePercentage) },
      ],
      progress: mauUsagePercentage,
    },
    {
      title: "Agent Capacity",
      icon: <Cpu size={15} className="text-primary" />,
      rows: [
        { label: "Active Agents", value: abbreviateNumber(kpiData.activeAgents) },
        { label: "Total Seats",   value: abbreviateNumber(kpiData.totalSeats) },
        { label: "Utilization",   value: formatPercentage(agentUtilizationPercentage) },
      ],
      progress: agentUtilizationPercentage,
    },
  ];

  return (
    <div className="space-y-4">
      {/* ── Row 1: KPI Cards (Restored Detailed Version) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => (
          <div
            key={idx}
            className={cn(
              "rounded-xl border p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2",
              card
            )}
            style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
          >
            {/* Card Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                {kpi.icon}
              </div>
              <h3 className={cn("text-[13px] font-bold tracking-tight", text)}>{kpi.title}</h3>
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {kpi.rows.map((row: any, rIdx: number) => (
                <div
                  key={rIdx}
                  className={cn(
                    "flex items-center justify-between",
                    row.border && `pt-2 border-t ${divider}`
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={cn("text-[11px] font-medium opacity-70", sub)}>{row.label}</span>
                    {row.badge && (
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                        row.badge.startsWith('+') ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
                      )}>
                        {row.badge}
                      </span>
                    )}
                  </div>
                  <span className={cn("text-[12px] font-bold tabular-nums", text)}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            {kpi.progress !== undefined && (
              <div className="mt-4">
                <div className={cn("w-full rounded-full h-1.5", dark ? "bg-slate-800" : "bg-slate-100")}>
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all shadow-sm shadow-primary/30"
                    style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Row 2: Main Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { title: "Daily Active Users", data: dauData, xKey: "day", yKey: "users", color: "#3b82f6" },
          { title: "Monthly Active Users", data: mauData, xKey: "month", yKey: "users", color: "#8b5cf6" },
        ].map((chart, idx) => (
          <div key={idx} className={cn("rounded-xl border p-4 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2", card)}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn("text-[12px] font-bold tracking-tight", text)}>{chart.title}</h3>
              <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 opacity-60">Real-time</div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chart.data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chart.color} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={chart.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey={chart.xKey} tick={{ fontSize: 9, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: axisColor }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip dark={dark} />} />
                <Area 
                  type="monotone" 
                  dataKey={chart.yKey} 
                  stroke={chart.color} 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill={`url(#grad-${idx})`} 
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* ── Row 3: Secondary Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { title: "Weekly Growth", data: wauData, xKey: "week", yKey: "users", color: "#10b981" },
          { title: "Stickiness Ratio", data: stickinessData, xKey: "day", yKey: "ratio", color: "#f59e0b", isStickiness: true },
        ].map((chart, idx) => (
          <div key={idx} className={cn("rounded-xl border p-4 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2", card)}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn("text-[12px] font-bold tracking-tight", text)}>{chart.title}</h3>
              <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 opacity-60">Last 30 Days</div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chart.data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-sec-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chart.color} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={chart.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey={chart.xKey} tick={{ fontSize: 9, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: axisColor }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip dark={dark} isStickinessChart={chart.isStickiness} />} />
                <Area 
                  type="monotone" 
                  dataKey={chart.yKey} 
                  stroke={chart.color} 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill={`url(#grad-sec-${idx})`} 
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
