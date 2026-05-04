import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

// Utility function to abbreviate large numbers
const abbreviateNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

// Utility function to format percentage
const formatPercentage = (num: number): string => {
  return num.toFixed(1) + "%";
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label, isStickinessChart }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-md p-2 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        {isStickinessChart ? (
          <span>
            <span className="text-sm">Stickiness:</span>
            <span className="text-sm text-primary pl-2">{`${payload[0].value}%`}</span>
          </span>
        ) : (
          <span>
            <span className="text-sm">Users:</span>
            <span className="text-sm text-primary pl-2">{`${abbreviateNumber(payload[0].value)}`}</span>
          </span>
        )}
      </div>
    );
  }
  return null;
};

export default function OverviewTab() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["/api/statistics/statistics-v1"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/statistics/statistics-v1");
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = statsData || {};
  const contacts = stats.contacts || { by_status: {}, by_source: {}, total: 0 };
  const channels = stats.channels || {};

  // Map backend stats to KPI structure
  const kpiData = {
    activeToday: contacts.by_status.active || 0,
    activeWeek: contacts.total || 0, // Fallback
    activeMonth: contacts.total || 0, // Fallback
    totalUsers: contacts.total || 0,
    stickiness: 0,
    dailyNewUsers: contacts.by_source.manual || 0,
    dailyNewUsersChange: 0,
    weeklyNewUsers: contacts.by_source.import || 0,
    weeklyNewUsersChange: 0,
    monthlyNewUsers: contacts.by_source.api || 0,
    monthlyNewUsersChange: 0,
    currentMAU: contacts.total || 0,
    mauLimit: 1000, // Hardcoded limit for now
    activeAgents: 1, // Fallback
    totalSeats: 5,   // Fallback
  };

  const mauUsagePercentage = (kpiData.currentMAU / kpiData.mauLimit) * 100;
  const agentUtilizationPercentage = (kpiData.activeAgents / kpiData.totalSeats) * 100;

  // Transform channel stats for chart display (simulation)
  const dauData = [
    { day: "Whatsapp", users: channels.whatsapp?.incoming || 0 },
    { day: "Messenger", users: channels.messenger?.incoming || 0 },
    { day: "Telegram", users: channels.telegram?.incoming || 0 },
    { day: "Instagram", users: channels.instagram?.incoming || 0 },
  ];

  const stickinessData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    ratio: Math.floor(Math.random() * 30) + 10,
  }));

  const mauData = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 210 },
    { month: "Mar", users: 450 },
    { month: "Apr", users: 600 },
    { month: "May", users: 800 },
    { month: "Jun", users: kpiData.currentMAU },
  ];

  const wauData = [
    { week: "Week 1", users: 400 },
    { week: "Week 2", users: 550 },
    { week: "Week 3", users: 700 },
    { week: "Week 4", users: 650 },
    { week: "Week 5", users: kpiData.activeWeek },
  ];

  return (
    <div className="space-y-4">
      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: User Activity */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] hover:border hover:border-blue-100 dark:hover:border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">User Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Active Today</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.activeToday)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Active Week</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.activeWeek)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Active Month</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.activeMonth)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total Users</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.totalUsers)}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t">
              <span className="text-xs text-muted-foreground">Stickiness</span>
              <span className="text-sm font-semibold">{formatPercentage(kpiData.stickiness)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: New Users */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] hover:border hover:border-blue-100 dark:hover:border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">New Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Daily</span>
              <span className="text-xs text-green-500 pl-1">+{kpiData.dailyNewUsersChange}%</span>
              <div className="flex items-center justify-end flex-1 ml-4">
                <span className="text-sm font-semibold ml-auto">{abbreviateNumber(kpiData.dailyNewUsers)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Weekly</span>
              <span className="text-xs text-green-500 pl-1">+{kpiData.weeklyNewUsersChange}%</span>
              <div className="flex items-center justify-end flex-1 ml-4">
                <span className="text-sm font-semibold ml-auto">{abbreviateNumber(kpiData.weeklyNewUsers)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Monthly</span>
              <span className="text-xs text-green-500 pl-1">+{kpiData.monthlyNewUsersChange}%</span>
              <div className="flex items-center justify-end flex-1 ml-4">
                <span className="text-sm font-semibold ml-auto">{abbreviateNumber(kpiData.monthlyNewUsers)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Plan Usage */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] hover:border hover:border-blue-100 dark:hover:border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Plan Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Current MAU</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.currentMAU)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">MAU Limit</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.mauLimit)}</span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="text-xs text-muted-foreground">Usage</span>
              <span className="text-sm font-semibold">{formatPercentage(mauUsagePercentage)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(mauUsagePercentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Agent Capacity */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] hover:border hover:border-blue-100 dark:hover:border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Agent Capacity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Active Agents</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.activeAgents)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total Seats</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.totalSeats)}</span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="text-xs text-muted-foreground">Utilization</span>
              <span className="text-sm font-semibold">{formatPercentage(agentUtilizationPercentage)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(agentUtilizationPercentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Daily Active Users & Monthly Active Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] hover:border hover:border-blue-100 dark:hover:border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Daily Active Users (DAU)</CardTitle>
            <p className="text-xs text-muted-foreground">Last 30 Days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dauData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] hover:border hover:border-blue-100 dark:hover:border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly Active Users (MAU)</CardTitle>
            <p className="text-xs text-muted-foreground">Last 6 Months</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mauData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Weekly Active Users & Stickiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] hover:border hover:border-blue-100 dark:hover:border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Weekly Active Users (WAU)</CardTitle>
            <p className="text-xs text-muted-foreground">Last 5 Weeks</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={wauData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] hover:border hover:border-blue-100 dark:hover:border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Stickiness (DAU/MAU)</CardTitle>
            <p className="text-xs text-muted-foreground">Last 30 Days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stickinessData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip isStickinessChart={true} />} cursor={{ strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="ratio" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
