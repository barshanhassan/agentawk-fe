import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Smile, Meh, Frown, TrendingUp } from "lucide-react";

export default function VoiceOfCustomerSummary() {
  const { mode } = useTheme();
  const dark = mode === "dark";

  const card    = dark ? "bg-[#0f1829] border-slate-800" : "bg-white border-slate-200";
  const text    = dark ? "text-white"     : "text-slate-900";
  const sub     = dark ? "text-slate-400" : "text-slate-500";
  const grid    = dark ? "#1e293b" : "#f1f5f9";
  const axis    = dark ? "#64748b" : "#94a3b8";
  const tooltip = dark ? "bg-[#0f1829] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800";

  const sentimentScore = 78;

  const sentimentDistribution = [
    { name: "Positive", percentage: 65, color: "bg-emerald-500", icon: <Smile size={14} className="text-emerald-500" /> },
    { name: "Neutral",  percentage: 25, color: "bg-orange-500",  icon: <Meh size={14} className="text-orange-500" /> },
    { name: "Negative", percentage: 10, color: "bg-rose-500",    icon: <Frown size={14} className="text-rose-500" /> },
  ];

  const sentimentTrendData = [
    { date: "Oct 24", positive: 45, neutral: 15, negative: 8 },
    { date: "Oct 25", positive: 52, neutral: 18, negative: 7 },
    { date: "Oct 26", positive: 58, neutral: 20, negative: 6 },
    { date: "Oct 27", positive: 62, neutral: 22, negative: 5 },
    { date: "Oct 28", positive: 68, neutral: 24, negative: 4 },
    { date: "Oct 29", positive: 72, neutral: 25, negative: 3 },
    { date: "Oct 30", positive: 78, neutral: 25, negative: 10 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={cn("px-3 py-2 rounded-xl border shadow-2xl text-[11px]", tooltip)}>
        <p className="font-semibold mb-1 opacity-60">{label}</p>
        {payload.map((e: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: e.color || e.stroke || e.fill }} />
            <span className="opacity-70">{e.name}:</span>
            <span className="font-bold">{e.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sentiment Score Card */}
        <div className={cn("rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl", card)}>
          <div className="flex items-center gap-2.5 mb-6">
            <div className={cn("p-2 rounded-xl", dark ? "bg-primary/15" : "bg-primary/10")}>
              <TrendingUp size={16} className="text-primary" />
            </div>
            <h3 className={cn("text-[13px] font-bold", text)}>Sentiment Score</h3>
          </div>
          <div className="space-y-1">
            <div className={cn("text-4xl font-black tabular-nums", text)}>{sentimentScore}%</div>
            <p className={cn("text-[11px] font-medium opacity-60", sub)}>Total conversations: 1,250</p>
          </div>
        </div>

        {/* Sentiment Distribution Card */}
        <div className={cn("rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl lg:col-span-3", card)}>
          <h3 className={cn("text-[13px] font-bold mb-6", text)}>Sentiment Distribution</h3>
          <div className="grid grid-cols-1 gap-6">
            {sentimentDistribution.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className={cn("text-[11px] font-bold uppercase tracking-widest opacity-60", sub)}>{item.name}</span>
                  </div>
                  <span className={cn("text-[11px] font-black", text)}>{item.percentage}%</span>
                </div>
                <div className={cn("w-full rounded-full h-2", dark ? "bg-slate-800" : "bg-slate-100")}>
                  <div
                    className={cn("h-2 rounded-full transition-all duration-1000", item.color)}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sentiment Trend Analysis */}
      <div className={cn("rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl", card)}>
        <h3 className={cn("text-[13px] font-bold mb-1", text)}>Sentiment Trend Analysis</h3>
        <p className={cn("text-[11px] mb-6", sub)}>Analysis over time based on conversation volume</p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={sentimentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} iconType="circle" />
            <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2.5} dot={false} name="Positive Sentiment" activeDot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }} />
            <Line type="monotone" dataKey="neutral"  stroke="#f97316" strokeWidth={2.5} dot={false} name="Neutral Sentiment" activeDot={{ r: 4, fill: "#f97316", strokeWidth: 0 }} />
            <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2.5} dot={false} name="Negative Sentiment" activeDot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
