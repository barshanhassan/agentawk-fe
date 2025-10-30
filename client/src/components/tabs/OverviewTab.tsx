import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
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
    <div className="space-y-6">
      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: User Activity */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">User Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Today</span>
              <span className="font-semibold">{abbreviateNumber(kpiData.activeToday)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Week</span>
              <span className="font-semibold">{abbreviateNumber(kpiData.activeWeek)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Month</span>
              <span className="font-semibold">{abbreviateNumber(kpiData.activeMonth)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Users</span>
              <span className="font-semibold">{abbreviateNumber(kpiData.totalUsers)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-muted-foreground">Stickiness</span>
              <span className="font-semibold">{formatPercentage(kpiData.stickiness)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: New Users */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Daily</span>
                <span className="font-semibold">{abbreviateNumber(kpiData.dailyNewUsers)}</span>
              </div>
              <span className="text-xs text-green-600">+{kpiData.dailyNewUsersChange}%</span>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Weekly</span>
                <span className="font-semibold">{abbreviateNumber(kpiData.weeklyNewUsers)}</span>
              </div>
              <span className="text-xs text-green-600">+{kpiData.weeklyNewUsersChange}%</span>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Monthly</span>
                <span className="font-semibold">{abbreviateNumber(kpiData.monthlyNewUsers)}</span>
              </div>
              <span className="text-xs text-green-600">+{kpiData.monthlyNewUsersChange}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Plan Usage */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Plan Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current MAU</span>
              <span className="font-semibold">{abbreviateNumber(kpiData.currentMAU)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">MAU Limit</span>
              <span className="font-semibold">{abbreviateNumber(kpiData.mauLimit)}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-sm text-muted-foreground">Usage</span>
              <span className="font-semibold">{formatPercentage(mauUsagePercentage)}</span>
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
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Agent Capacity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Agents</span>
              <span className="font-semibold">{abbreviateNumber(kpiData.activeAgents)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Seats</span>
              <span className="font-semibold">{abbreviateNumber(kpiData.totalSeats)}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-sm text-muted-foreground">Utilization</span>
              <span className="font-semibold">{formatPercentage(agentUtilizationPercentage)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-chart-3 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(agentUtilizationPercentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Daily Active Users & Monthly Active Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader>
            <CardTitle>Daily Active Users (DAU)</CardTitle>
            <p className="text-sm text-muted-foreground">Last 30 Days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dauData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader>
            <CardTitle>Monthly Active Users (MAU)</CardTitle>
            <p className="text-sm text-muted-foreground">Last 6 Months</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mauData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Weekly Active Users & Stickiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader>
            <CardTitle>Weekly Active Users (WAU)</CardTitle>
            <p className="text-sm text-muted-foreground">Last 5 Weeks</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={wauData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader>
            <CardTitle>Stickiness (DAU/MAU)</CardTitle>
            <p className="text-sm text-muted-foreground">Last 30 Days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stickinessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Line type="monotone" dataKey="ratio" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

