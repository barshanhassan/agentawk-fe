import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, BarChart3 } from "lucide-react";

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

// Custom tooltip for Conversion Volume Trend
const ConversionVolumeTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-md p-2 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-sm">{entry.name}:</span>
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

// Custom tooltip for Call Engagement Trend
const CallEngagementTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-md p-2 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-sm">{entry.name}:</span>
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

export default function AgentConversion() {
  // Mock KPI data
  const kpiData = {
    conversionStatus: {
      queued: 24,
      active: 18,
      pending: 12,
      exited: 5,
    },
    performance: {
      avgResponseTime: "1m 45s",
      resolutionRate: "88%",
      customerSatisfaction: "92%",
    },
    callStatistics: {
      totalCalls: 342,
      inboundCalls: 245,
      outboundCalls: 97,
    },
  };

  // Dummy data for Conversion Volume Trend
  const conversionVolumeTrendData = [
    { date: "Oct 24", queued: 8, active: 12, pending: 5, resolved: 6 },
    { date: "Oct 25", queued: 5, active: 8, pending: 3, resolved: 4 },
    { date: "Oct 26", queued: 15, active: 20, pending: 10, resolved: 12 },
    { date: "Oct 27", queued: 6, active: 9, pending: 4, resolved: 5 },
  ];

  // Dummy data for Call Engagement Trend
  const callEngagementTrendData = [
    { date: "Oct 24", inbound: 15, outbound: 8, messagesReceived: 6, messagesSent: 4 },
    { date: "Oct 25", inbound: 12, outbound: 6, messagesReceived: 5, messagesSent: 3 },
    { date: "Oct 26", inbound: 28, outbound: 15, messagesReceived: 12, messagesSent: 8 },
    { date: "Oct 27", inbound: 20, outbound: 10, messagesReceived: 8, messagesSent: 5 },
  ];

  // Dummy data for Tags
  const tagsData = [
    { name: "Urgent", count: 24, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800" },
    { name: "Follow-up", count: 18, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" },
    { name: "Resolved", count: 156, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" },
    { name: "Pending", count: 42, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800" },
  ];

  return (
    <div className="space-y-4">
      {/* Row 1: 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Conversion Status */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Conversion Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Queued</span>
              <span className="text-sm font-semibold">{kpiData.conversionStatus.queued}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Active</span>
              <span className="text-sm font-semibold">{kpiData.conversionStatus.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Pending</span>
              <span className="text-sm font-semibold">{kpiData.conversionStatus.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Exited</span>
              <span className="text-sm font-semibold">{kpiData.conversionStatus.exited}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Performance */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Avg response time</span>
              <span className="text-sm font-semibold">{kpiData.performance.avgResponseTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Resolution rate</span>
              <span className="text-sm font-semibold">{kpiData.performance.resolutionRate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Customer satisfaction</span>
              <span className="text-sm font-semibold">{kpiData.performance.customerSatisfaction}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Call Statistics */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Call Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total calls</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.callStatistics.totalCalls)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Inbound calls</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.callStatistics.inboundCalls)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Outbound calls</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.callStatistics.outboundCalls)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Conversion Volume Trend - Full Width */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Conversion Volume Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionVolumeTrendData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
              <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
              <Tooltip content={<ConversionVolumeTooltip />} cursor={false} />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                iconType="circle"
              />
              <Bar dataKey="queued" stackId="a" fill="#f87171" name="Queued" />
              <Bar dataKey="active" stackId="a" fill="#fb923c" name="Active" />
              <Bar dataKey="pending" stackId="a" fill="#c084fc" name="Pending" />
              <Bar dataKey="resolved" stackId="a" fill="#60a5fa" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 3: Call Engagement Trend (75%) and Tags (25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Call Engagement Trend - 75% width (3 cols) */}
        <div className="lg:col-span-3">
          <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Call Engagement Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={callEngagementTrendData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
                  <Tooltip content={<CallEngagementTooltip />} cursor={false} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                    iconType="circle"
                  />
                  <Bar dataKey="inbound" stackId="a" fill="#f87171" name="Inbound Calls" />
                  <Bar dataKey="outbound" stackId="a" fill="#fb923c" name="Outbound Calls" />
                  <Bar dataKey="messagesReceived" stackId="a" fill="#c084fc" name="Messages Received" />
                  <Bar dataKey="messagesSent" stackId="a" fill="#60a5fa" name="Messages Sent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tags - 25% width (1 col) */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {tagsData.map((tag, idx) => (
                <Badge variant="outline" key={idx} className={`font-medium ${tag.color}`}>
                  {tag.name} ({tag.count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

