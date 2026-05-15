import { useState, useRef, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ChevronDown, Check, Bot, MessageSquare, Send, BarChart3, Users, Clock } from "lucide-react";
import TimeHeatmap from "@/components/TimeHeatmap";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

// Top Filter Dropdown Component
interface TopFilterDropdownProps {
  topFilter: string;
  setTopFilter: (value: string) => void;
}

const TopFilterDropdown: React.FC<TopFilterDropdownProps> = ({ topFilter, setTopFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mode } = useTheme();
  const dark = mode === "dark";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const options = ["Top 5", "Top 10", "All"];

  return (
    <div className="relative w-32" ref={dropdownRef}>
      <button
        type="button"
        className={cn(
          "w-full flex items-center justify-between px-3 py-1.5 text-left border rounded-xl shadow-sm transition-all outline-none text-xs font-semibold",
          dark 
            ? "bg-slate-900/60 border-slate-700 text-white hover:border-slate-600" 
            : "bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{topFilter}</span>
        <ChevronDown className={cn("h-3.5 w-3.5", dark ? "text-slate-500" : "text-slate-400")} />
      </button>
      {isOpen && (
        <div className={cn(
          "absolute z-10 w-full mt-2 rounded-xl border shadow-2xl overflow-hidden animate-in fade-in-80 zoom-in-95",
          dark ? "bg-[#0f1829] border-slate-800" : "bg-white border-slate-200"
        )}>
          <ul className="py-1">
            {options.map(option => (
              <li
                key={option}
                className={cn(
                  "flex items-center px-3 py-2 text-xs cursor-pointer select-none transition-colors",
                  dark ? "hover:bg-slate-800 text-slate-300 hover:text-white" : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                )}
                onClick={() => {
                  setTopFilter(option);
                  setIsOpen(false);
                }}
              >
                <span className="flex items-center w-4 h-4 mr-2 justify-center flex-shrink-0">
                  {topFilter === option && <Check className="h-3.5 w-3.5 text-primary" />}
                </span>
                <span className="truncate">{option}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function BotDashboardContent() {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const [topFilter, setTopFilter] = useState("Top 10");

  const card    = dark ? "bg-[#0f1829] border-slate-800" : "bg-white border-slate-200";
  const text    = dark ? "text-white"     : "text-slate-900";
  const sub     = dark ? "text-slate-400" : "text-slate-500";
  const grid    = dark ? "#1e293b" : "#f1f5f9";
  const axis    = dark ? "#64748b" : "#94a3b8";
  const tooltip = dark ? "bg-[#0f1829] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800";

  const kpiData = {
    botTriggered: 7,
    respondedByBot: 26,
    receivedByBot: 33,
    totalMessages: 59,
    escalatedToHuman: 0,
    avgSessionDuration: "0 hrs 14 mins",
  };

  const kpiCards = [
    { title: "Bot Triggered", value: kpiData.botTriggered, unit: "Sessions", icon: <Bot size={14} />, color: "text-primary" },
    { title: "Responded by Bot", value: kpiData.respondedByBot, unit: "Messages", icon: <MessageSquare size={14} />, color: "text-emerald-500" },
    { title: "Received by Bot", value: kpiData.receivedByBot, unit: "Messages", icon: <Send size={14} />, color: "text-blue-500" },
    { title: "Total Messages", value: kpiData.totalMessages, unit: "All messages", icon: <BarChart3 size={14} />, color: "text-violet-500" },
    { title: "Escalated to Human", value: kpiData.escalatedToHuman, unit: "Escalations", icon: <Users size={14} />, color: "text-rose-500" },
    { title: "Avg Session Duration", value: kpiData.avgSessionDuration, unit: "Per session", icon: <Clock size={14} />, color: "text-orange-500" },
  ];

  const botVsHumanData = [
    { date: "Oct 24", triggered: 0.5, escalated: 0.2 },
    { date: "Oct 25", triggered: 0.8, escalated: 0.3 },
    { date: "Oct 26", triggered: 1.2, escalated: 0.4 },
    { date: "Oct 27", triggered: 1.5, escalated: 0.5 },
    { date: "Oct 28", triggered: 2.0, escalated: 0.6 },
    { date: "Oct 29", triggered: 2.3, escalated: 0.7 },
    { date: "Oct 30", triggered: 1.8, escalated: 0.5 },
  ];

  const popularityData = [
    { name: "Greeting", sentiment: 45 },
    { name: "Product Info", sentiment: 38 },
    { name: "Order Status", sentiment: 32 },
    { name: "Payment Help", sentiment: 28 },
    { name: "Returns", sentiment: 22 },
    { name: "Shipping", sentiment: 18 },
    { name: "Account", sentiment: 15 },
    { name: "Feedback", sentiment: 12 },
    { name: "Complaints", sentiment: 8 },
    { name: "Other", sentiment: 5 },
  ];

  const busiestPeriodData = [
    { time: "12 AM", Thu: 2, Fri: 2, Sat: 2, Sun: 2, Mon: 3, Tue: 3, Wed: 2 },
    { time: "2 AM", Thu: 2, Fri: 2, Sat: 2, Sun: 2, Mon: 2, Tue: 2, Wed: 2 },
    { time: "4 AM", Thu: 2, Fri: 2, Sat: 2, Sun: 2, Mon: 2, Tue: 2, Wed: 2 },
    { time: "6 AM", Thu: 2, Fri: 2, Sat: 2, Sun: 2, Mon: 2, Tue: 2, Wed: 2 },
    { time: "8 AM", Thu: 3, Fri: 4, Sat: 4, Sun: 3, Mon: 5, Tue: 5, Wed: 4 },
    { time: "10 AM", Thu: 5, Fri: 6, Sat: 6, Sun: 4, Mon: 7, Tue: 7, Wed: 6 },
    { time: "12 PM", Thu: 8, Fri: 9, Sat: 9, Sun: 7, Mon: 10, Tue: 10, Wed: 9 },
    { time: "2 PM", Thu: 6, Fri: 7, Sat: 7, Sun: 5, Mon: 8, Tue: 8, Wed: 7 },
    { time: "4 PM", Thu: 4, Fri: 5, Sat: 5, Sun: 3, Mon: 6, Tue: 6, Wed: 5 },
    { time: "6 PM", Thu: 3, Fri: 4, Sat: 4, Sun: 3, Mon: 5, Tue: 5, Wed: 4 },
    { time: "8 PM", Thu: 2, Fri: 3, Sat: 3, Sun: 2, Mon: 4, Tue: 3, Wed: 3 },
    { time: "10 PM", Thu: 2, Fri: 2, Sat: 2, Sun: 2, Mon: 3, Tue: 2, Wed: 2 },
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
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((kpi, i) => (
          <div key={i} className={cn("rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1", card, dark ? "hover:border-primary/30" : "hover:border-primary/20")}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className={cn("p-1.5 rounded-lg", dark ? "bg-slate-800" : "bg-slate-100", kpi.color)}>
                {kpi.icon}
              </div>
              <p className={cn("text-[11px] font-semibold truncate", sub)}>{kpi.title}</p>
            </div>
            <p className={cn("text-xl font-black tabular-nums", text)}>{kpi.value}</p>
            <p className={cn("text-[10px] font-medium opacity-60", sub)}>{kpi.unit}</p>
          </div>
        ))}
      </div>

      {/* Popularity of Interactions */}
      <div className={cn("rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl", card)}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={cn("text-[13px] font-bold", text)}>Popularity of Interactions</h3>
            <p className={cn("text-[11px]", sub)}>Most frequent bot conversation topics</p>
          </div>
          <TopFilterDropdown topFilter={topFilter} setTopFilter={setTopFilter} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={popularityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }} />
            <Bar dataKey="sentiment" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Interactions" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bot vs Human Performance */}
        <div className={cn("rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl", card)}>
          <h3 className={cn("text-[13px] font-bold mb-1", text)}>Bot vs Human Performance</h3>
          <p className={cn("text-[11px] mb-6", sub)}>Escalation rate comparison</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={botVsHumanData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} iconType="circle" />
              <Line type="monotone" dataKey="triggered" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} name="Triggered" activeDot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }} />
              <Line type="monotone" dataKey="escalated" stroke="#ef4444" strokeWidth={2.5} dot={false} name="Escalated to Human" activeDot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Busiest Period */}
        <div className={cn("rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl", card)}>
          <h3 className={cn("text-[13px] font-bold mb-1", text)}>Busiest Period</h3>
          <p className={cn("text-[11px] mb-6", sub)}>Bot activity heatmap by time and day</p>
          <div className="h-[300px] overflow-hidden">
             <TimeHeatmap
                data={busiestPeriodData}
                days={["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"]}
                rowsPerTimeSlot={2}
                cellHeight={12}
                startDay={4}
                valueLabel="Messages"
              />
          </div>
        </div>
      </div>
    </div>
  );
}
