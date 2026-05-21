import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Mail, Truck, Gift, CreditCard, DollarSign } from "lucide-react";

const LINES = [
  { key: "marketing", name: "Marketing", stroke: "#22c55e" },
  { key: "marketingLite", name: "Marketing Lite", stroke: "#3b82f6" },
  { key: "utility", name: "Utility", stroke: "#f59e0b" },
  { key: "authentication", name: "Authentication", stroke: "#8b5cf6" },
  { key: "authenticationIntl", name: "Authentication Intl", stroke: "#ec4899" },
  { key: "service", name: "Service", stroke: "#6366f1" },
];
const LINES_FREE = [
  { key: "freeEntryPoint", name: "Free Entry Point", stroke: "#94a3b8" },
  { key: "freeCustomerService", name: "Free Customer Service", stroke: "#22c55e" },
];
const LINES_PAID = LINES.filter(l => l.key !== "service");

export default function MessagesSubTab() {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const card = dark ? "bg-[#0f1829] border-slate-800" : "bg-white border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const sub = dark ? "text-slate-400" : "text-slate-500";
  const grid = dark ? "#1e293b" : "#f1f5f9";
  const axis = dark ? "#64748b" : "#94a3b8";
  const tip = dark ? "bg-[#0f1829] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800";

  const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={cn("px-3 py-2 rounded-xl border shadow-2xl text-[11px]", tip)}>
        <p className="font-semibold mb-1 opacity-60">{label}</p>
        {payload.map((e: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: e.stroke || e.color }} />
            <span className="opacity-70">{e.name}:</span>
            <span className="font-bold">{e.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const kpi = {
    allMessages: [{ l: "Message Sent", v: 0 }, { l: "Message Delivered", v: 0 }, { l: "Message Received", v: 0 }],
    allDeliv: [{ l: "Marketing", v: 0 }, { l: "Marketing Lite", v: 0 }, { l: "Utility", v: 0 }, { l: "Authentication", v: 0 }, { l: "Auth Intl", v: 0 }, { l: "Service", v: 0 }],
    freeDeliv: [{ l: "Free Customer Service", v: 0 }, { l: "Free Entry Point", v: 0 }],
    paidDeliv: [{ l: "Marketing", v: 0 }, { l: "Marketing Lite", v: 0 }, { l: "Utility", v: 0 }, { l: "Authentication", v: 0 }, { l: "Auth Intl", v: 0 }],
    approxCharge: [{ l: "Marketing", v: "$0" }, { l: "Marketing Lite", v: "$0" }, { l: "Utility", v: "$0" }, { l: "Authentication", v: "$0" }, { l: "Auth Intl", v: "$0" }],
  };

  const kpiCards = [
    { title: "All Messages", icon: <Mail size={14} className="text-primary" />, rows: kpi.allMessages },
    { title: "All Deliveries", icon: <Truck size={14} className="text-primary" />, rows: kpi.allDeliv },
    { title: "Free Deliveries", icon: <Gift size={14} className="text-primary" />, rows: kpi.freeDeliv },
    { title: "Paid Deliveries", icon: <CreditCard size={14} className="text-primary" />, rows: kpi.paidDeliv },
    { title: "Approximate Charges", icon: <DollarSign size={14} className="text-primary" />, rows: kpi.approxCharge },
  ];

  // Message analytics series — empty until backend whatsapp-messages-analytics endpoint exists.
  const allDelData: Array<any> = [];
  const freeData: Array<any> = [];
  const paidData: Array<any> = [];
  const chargesData: Array<any> = [];

  const charts = [
    { title: "All Deliveries", data: allDelData, lines: LINES },
    { title: "Free Deliveries", data: freeData, lines: LINES_FREE },
    { title: "Paid Deliveries", data: paidData, lines: LINES_PAID },
    { title: "Approximate Charges", data: chargesData, lines: LINES_PAID },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  <span className={cn("text-[13px] font-bold tabular-nums", text)}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {charts.map((ch, i) => (
        <div key={i} className={cn("rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl", card)}>
          <h3 className={cn("text-[13px] font-bold mb-1", text)}>{ch.title}</h3>
          <p className={cn("text-[11px] mb-4", sub)}>Trend over time</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={ch.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} iconType="circle" />
              {ch.lines.map(l => <Line key={l.key} type="monotone" dataKey={l.key} stroke={l.stroke} strokeWidth={2.5} dot={false} name={l.name} activeDot={{ r: 4, fill: l.stroke, strokeWidth: 0 }} />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
