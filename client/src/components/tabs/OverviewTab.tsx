import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  // Mock data for charts
  const dauData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    users: Math.floor(Math.random() * 1000) + 500,
  }));

  const mauData = Array.from({ length: 6 }, (_, i) => ({
    month: `Month ${i + 1}`,
    users: Math.floor(Math.random() * 8000) + 5000,
  }));

  const wauData = Array.from({ length: 5 }, (_, i) => ({
    week: `Week ${i + 1}`,
    users: Math.floor(Math.random() * 3000) + 2000,
  }));

  const stickinessData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    ratio: Math.floor(Math.random() * 30) + 10,
  }));

  // Mock KPI data
  const kpiData = {
    activeToday: 2845,
    activeWeek: 12458,
    activeMonth: 28932,
    totalUsers: 156842,
    stickiness: 34.2,
    dailyNewUsers: 1234,
    dailyNewUsersChange: 15,
    weeklyNewUsers: 5678,
    weeklyNewUsersChange: 10,
    monthlyNewUsers: 9012,
    monthlyNewUsersChange: 8,
    currentMAU: 21100,
    mauLimit: 100000,
    activeAgents: 45,
    totalSeats: 100,
  };

  const mauUsagePercentage = (kpiData.currentMAU / kpiData.mauLimit) * 100;
  const agentUtilizationPercentage = (kpiData.activeAgents / kpiData.totalSeats) * 100;

  return (
    <div className="space-y-4">
      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: User Activity */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
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
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">New Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Daily</span>
              <span className="text-xs text-green-600 pl-1">+{kpiData.dailyNewUsersChange}%</span>
              <div className="flex items-center justify-end flex-1 ml-4">
                <span className="text-sm font-semibold ml-auto">{abbreviateNumber(kpiData.dailyNewUsers)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Weekly</span>
              <span className="text-xs text-green-600 pl-1">+{kpiData.weeklyNewUsersChange}%</span>
              <div className="flex items-center justify-end flex-1 ml-4">
                <span className="text-sm font-semibold ml-auto">{abbreviateNumber(kpiData.weeklyNewUsers)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Monthly</span>
              <span className="text-xs text-green-600 pl-1">+{kpiData.monthlyNewUsersChange}%</span>
              <div className="flex items-center justify-end flex-1 ml-4">
                <span className="text-sm font-semibold ml-auto">{abbreviateNumber(kpiData.monthlyNewUsers)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Plan Usage */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
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
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
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
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
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

        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
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
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
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

        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
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
