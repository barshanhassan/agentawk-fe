import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KPICard from "@/components/KPICard";

export default function OverviewTab() {
  const dauData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    users: Math.floor(Math.random() * 1000) + 500,
  }));

  const wauData = Array.from({ length: 5 }, (_, i) => ({
    week: `Week ${i + 1}`,
    users: Math.floor(Math.random() * 3000) + 2000,
  }));

  const mauData = Array.from({ length: 6 }, (_, i) => ({
    month: `Month ${i + 1}`,
    users: Math.floor(Math.random() * 8000) + 5000,
  }));

  const ratioData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    ratio: Math.floor(Math.random() * 30) + 10,
  }));

  const messagesData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    delivered: Math.floor(Math.random() * 5000) + 2000,
    received: Math.floor(Math.random() * 4000) + 1500,
  }));

  const gaugeData = [
    { name: "Used", value: 21.12, fill: "hsl(var(--primary))" },
    { name: "Available", value: 78.88, fill: "hsl(var(--muted))" },
  ];

  const seatsData = [
    { name: "Used", value: 45, fill: "hsl(var(--chart-2))" },
    { name: "Available", value: 55, fill: "hsl(var(--muted))" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
        <KPICard
          title="Active Today"
          value="2,845"
          change={12.5}
          comparison="vs previous period"
          tooltip="Number of unique active users today"
        />
        <KPICard
          title="Active This Week"
          value="12,458"
          change={8.2}
          comparison="vs previous period"
          tooltip="Number of unique active users this week"
        />
        <KPICard
          title="Active This Month"
          value="28,932"
          change={4.7}
          comparison="vs previous month"
          tooltip="Number of unique active users this month"
        />
        <KPICard
          title="User Stickiness (DAU/MAU)"
          value="34.2%"
          change={5.3}
          comparison="vs last month"
          tooltip="DAU/MAU ratio indicating user engagement"
        />
        <KPICard
          title="Total Users"
          value="156,842"
          change={2.8}
          comparison="vs previous month"
          tooltip="Total number of registered users"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <Card className="border-t-4 border-t-primary lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Active Users (DAU)</CardTitle>
            <p className="text-sm text-muted-foreground">Last 30 Days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={dauData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-primary lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Active Users (WAU)</CardTitle>
            <p className="text-sm text-muted-foreground">Last 5 Weeks</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={wauData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Bar dataKey="users" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <CardTitle>MAU Tier Usage</CardTitle>
              <p className="text-sm text-muted-foreground">Current Month</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-0">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    {gaugeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground mt-2">2,112 / 10,000 Monthly Active Users</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <CardTitle>Agent Seats Usage</CardTitle>
              <p className="text-sm text-muted-foreground">Active Agents</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-0">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={seatsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    {seatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground mt-2">45 / 100 Agent Seats</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <Card className="border-t-4 border-t-primary lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Active Users (MAU)</CardTitle>
            <p className="text-sm text-muted-foreground">Last 6 Months</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={mauData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Bar dataKey="users" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-primary lg:col-span-2">
          <CardHeader>
            <CardTitle>DAU/MAU Ratio (%)</CardTitle>
            <p className="text-sm text-muted-foreground">Last 30 Days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={ratioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Bar dataKey="ratio" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <CardTitle>Daily New Users</CardTitle>
              <p className="text-sm text-muted-foreground">Last 30 Days</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <CardTitle>Weekly New Users</CardTitle>
              <p className="text-sm text-muted-foreground">Last 5 Weeks</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">5,678</div>
              <p className="text-xs text-muted-foreground">+10% from last period</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <CardTitle>Monthly New Users</CardTitle>
              <p className="text-sm text-muted-foreground">Last 6 Months</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">9,012</div>
              <p className="text-xs text-muted-foreground">+8% from last period</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-4">
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle>Messages Delivered</CardTitle>
            <p className="text-sm text-muted-foreground">Last 30 Days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={messagesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Line type="monotone" dataKey="delivered" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle>Messages Received</CardTitle>
            <p className="text-sm text-muted-foreground">Last 30 Days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={messagesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Line type="monotone" dataKey="received" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

