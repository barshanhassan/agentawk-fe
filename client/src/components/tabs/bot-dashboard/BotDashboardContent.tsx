import { useState, useRef, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Check } from "lucide-react";

// Top Filter Dropdown Component
interface TopFilterDropdownProps {
  topFilter: string;
  setTopFilter: (value: string) => void;
}

const TopFilterDropdown: React.FC<TopFilterDropdownProps> = ({ topFilter, setTopFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const options = ["Top 5", "Top 10", "All"];

  return (
    <div className="relative w-32" ref={dropdownRef}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 text-left bg-white border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate text-sm font-normal">
          {topFilter}
        </span>
        <span className="ml-2 text-muted-foreground">
          <ChevronDown className="h-4 w-4"/>
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] animate-in fade-in-80">
          <ul className="py-1">
            {options.map(option => (
              <li
                key={option}
                className={`flex items-center px-3 py-2 text-sm cursor-pointer select-none transition-colors rounded-md hover:bg-accent`}
                onClick={() => {
                  setTopFilter(option);
                  setIsOpen(false);
                }}
              >
                <span className="flex items-center w-5 h-5 mr-2 justify-center flex-shrink-0">
                  {topFilter === option && <Check className="h-4 w-4"/>}
                </span>
                <span className="truncate overflow-hidden">{option}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Utility function to format tooltip names
const formatTooltipName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-md p-2 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-sm">{formatTooltipName(entry.name)}:</span>
            <span className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function BotDashboardContent() {
  const [topFilter, setTopFilter] = useState("Top 10");

  // Mock KPI data
  const kpiData = {
    botTriggered: 7,
    respondedByBot: 26,
    receivedByBot: 33,
    totalMessages: 59,
    escalatedToHuman: 0,
    avgSessionDuration: "0 hrs 14 mins",
  };

  // Dummy data for Bot vs Human Performance
  const botVsHumanData = [
    { date: "Oct 24", triggered: 0.5, escalated: 0.2 },
    { date: "Oct 25", triggered: 0.8, escalated: 0.3 },
    { date: "Oct 26", triggered: 1.2, escalated: 0.4 },
    { date: "Oct 27", triggered: 1.5, escalated: 0.5 },
    { date: "Oct 28", triggered: 2.0, escalated: 0.6 },
    { date: "Oct 29", triggered: 2.3, escalated: 0.7 },
    { date: "Oct 30", triggered: 1.8, escalated: 0.5 },
  ];

  // Dummy data for Popularity of Interactions (Bar chart)
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

  // Dummy data for Busiest Period (Heatmap-like data)
  const busiestPeriodData = [
    { time: "12 AM", Thu: 0.1, Fri: 0.2, Sat: 0.15, Sun: 0.1, Mon: 0.3, Tue: 0.25, Wed: 0.2 },
    { time: "2 AM", Thu: 0.05, Fri: 0.1, Sat: 0.08, Sun: 0.05, Mon: 0.15, Tue: 0.12, Wed: 0.1 },
    { time: "4 AM", Thu: 0.02, Fri: 0.05, Sat: 0.03, Sun: 0.02, Mon: 0.08, Tue: 0.06, Wed: 0.05 },
    { time: "6 AM", Thu: 0.1, Fri: 0.15, Sat: 0.12, Sun: 0.1, Mon: 0.2, Tue: 0.18, Wed: 0.15 },
    { time: "8 AM", Thu: 0.3, Fri: 0.4, Sat: 0.35, Sun: 0.25, Mon: 0.5, Tue: 0.45, Wed: 0.4 },
    { time: "10 AM", Thu: 0.5, Fri: 0.6, Sat: 0.55, Sun: 0.4, Mon: 0.7, Tue: 0.65, Wed: 0.6 },
    { time: "12 PM", Thu: 0.8, Fri: 0.9, Sat: 0.85, Sun: 0.7, Mon: 1.0, Tue: 0.95, Wed: 0.9 },
    { time: "2 PM", Thu: 0.6, Fri: 0.7, Sat: 0.65, Sun: 0.5, Mon: 0.8, Tue: 0.75, Wed: 0.7 },
    { time: "4 PM", Thu: 0.4, Fri: 0.5, Sat: 0.45, Sun: 0.3, Mon: 0.6, Tue: 0.55, Wed: 0.5 },
    { time: "6 PM", Thu: 0.3, Fri: 0.4, Sat: 0.35, Sun: 0.25, Mon: 0.5, Tue: 0.45, Wed: 0.4 },
    { time: "8 PM", Thu: 0.2, Fri: 0.3, Sat: 0.25, Sun: 0.15, Mon: 0.35, Tue: 0.3, Wed: 0.25 },
    { time: "10 PM", Thu: 0.15, Fri: 0.2, Sat: 0.18, Sun: 0.1, Mon: 0.25, Tue: 0.22, Wed: 0.2 },
  ];

  const getHeatmapColor = (value: number) => {
    if (value >= 2.5) return "#1e40af";
    if (value >= 2.0) return "#1e3a8a";
    if (value >= 1.5) return "#3b82f6";
    if (value >= 1.0) return "#60a5fa";
    if (value >= 0.5) return "#93c5fd";
    return "#dbeafe";
  };

  return (
    <div className="space-y-4">
      {/* Row 1: 6 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Card 1: Bot Triggered */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Bot Triggered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpiData.botTriggered}</div>
          </CardContent>
        </Card>

        {/* Card 2: Responded by Bot */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Responded by Bot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpiData.respondedByBot}</div>
          </CardContent>
        </Card>

        {/* Card 3: Received by Bot */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Received by Bot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpiData.receivedByBot}</div>
          </CardContent>
        </Card>

        {/* Card 4: Total Messages */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpiData.totalMessages}</div>
          </CardContent>
        </Card>

        {/* Card 5: Escalated to Human */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Escalated to Human</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpiData.escalatedToHuman}</div>
          </CardContent>
        </Card>

        {/* Card 6: Avg Session Duration */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpiData.avgSessionDuration}</div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Popularity of Interactions */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Popularity of Interactions</CardTitle>
            <TopFilterDropdown topFilter={topFilter} setTopFilter={setTopFilter} />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularityData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="sentiment" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 3: Two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bot vs Human Performance */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm">Bot vs Human Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={botVsHumanData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} iconType="circle" />
                <Line type="monotone" dataKey="triggered" stroke="#3b82f6" strokeWidth={2} dot={false} name="Triggered" />
                <Line type="monotone" dataKey="escalated" stroke="#ef4444" strokeWidth={2} dot={false} name="Escalated to Human" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Busiest Period */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm">Busiest Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="space-y-2">
                {busiestPeriodData.map((row, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-12 text-xs font-medium text-muted-foreground">{row.time}</div>
                    <div className="flex gap-1 flex-1">
                      {["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"].map((day) => (
                        <div
                          key={day}
                          className="flex-1 h-6 rounded"
                          style={{ backgroundColor: getHeatmapColor((row as any)[day]) }}
                          title={`${day}: ${(row as any)[day]}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs">
                <span className="text-muted-foreground">Low</span>
                <div className="flex gap-1">
                  {["#dbeafe", "#93c5fd", "#60a5fa", "#3b82f6", "#1e3a8a", "#1e40af"].map((color, idx) => (
                    <div key={idx} className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <span className="text-muted-foreground">High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

