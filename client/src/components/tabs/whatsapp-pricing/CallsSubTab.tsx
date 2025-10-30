import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

// Utility function to abbreviate large numbers
const abbreviateNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-md p-2 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CallsSubTab() {
  // Mock KPI data
  const kpiData = {
    allCalls: {
      businessInitiated: 0,
      userInitiated: 0,
    },
    averageBillableCallDuration: {
      businessInitiated: 0,
      userInitiated: 0,
    },
    approximateTotalCharges: {
      businessInitiated: 0,
      userInitiated: 0,
    },
  };

  // Dummy data for charts
  const allCallsData = [
    { date: "Oct 24", businessInitiated: 5, userInitiated: 3 },
    { date: "Oct 25", businessInitiated: 4, userInitiated: 2 },
    { date: "Oct 26", businessInitiated: 8, userInitiated: 5 },
    { date: "Oct 27", businessInitiated: 6, userInitiated: 4 },
    { date: "Oct 28", businessInitiated: 12, userInitiated: 8 },
    { date: "Oct 29", businessInitiated: 10, userInitiated: 6 },
    { date: "Oct 30", businessInitiated: 7, userInitiated: 4 },
  ];

  const averageBillableCallDurationData = [
    { date: "Oct 24", businessInitiated: 45, userInitiated: 32 },
    { date: "Oct 25", businessInitiated: 38, userInitiated: 28 },
    { date: "Oct 26", businessInitiated: 52, userInitiated: 40 },
    { date: "Oct 27", businessInitiated: 48, userInitiated: 35 },
    { date: "Oct 28", businessInitiated: 58, userInitiated: 45 },
    { date: "Oct 29", businessInitiated: 55, userInitiated: 42 },
    { date: "Oct 30", businessInitiated: 50, userInitiated: 38 },
  ];

  const callsAndChargesData = [
    { date: "Oct 24", calls: 8, charges: 0.8 },
    { date: "Oct 25", calls: 6, charges: 0.6 },
    { date: "Oct 26", calls: 13, charges: 1.3 },
    { date: "Oct 27", calls: 10, charges: 1.0 },
    { date: "Oct 28", calls: 20, charges: 2.0 },
    { date: "Oct 29", calls: 16, charges: 1.6 },
    { date: "Oct 30", calls: 11, charges: 1.1 },
  ];

  return (
    <div className="space-y-4">
      {/* Alert Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> All insights data is approximate and may differ from what's shown on your invoices due to small variations in data processing.
        </p>
      </div>

      {/* Row 1: 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: All Calls */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">All Calls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Business-initiated</span>
              <span className="text-sm font-semibold">{kpiData.allCalls.businessInitiated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">User-initiated</span>
              <span className="text-sm font-semibold">{kpiData.allCalls.userInitiated}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Average Billable Call Duration */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Average Billable Call Duration (seconds)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Business-initiated</span>
              <span className="text-sm font-semibold">{kpiData.averageBillableCallDuration.businessInitiated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">User-initiated</span>
              <span className="text-sm font-semibold">{kpiData.averageBillableCallDuration.userInitiated}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Approximate Total Charges */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Approximate Total Charges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Business-initiated</span>
              <span className="text-sm font-semibold">${kpiData.approximateTotalCharges.businessInitiated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">User-initiated</span>
              <span className="text-sm font-semibold">${kpiData.approximateTotalCharges.userInitiated}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: All Calls Chart */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <CardTitle className="text-sm">All Calls</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-8">
              Customize
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={allCallsData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} iconType="circle" />
              <Line type="monotone" dataKey="businessInitiated" stroke="#22c55e" strokeWidth={2} dot={false} name="Business-initiated" />
              <Line type="monotone" dataKey="userInitiated" stroke="#3b82f6" strokeWidth={2} dot={false} name="User-initiated" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 3: Average Billable Call Duration Chart */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <CardTitle className="text-sm">Average Billable Call Duration (seconds)</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-8">
              Customize
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={averageBillableCallDurationData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} iconType="circle" />
              <Line type="monotone" dataKey="businessInitiated" stroke="#22c55e" strokeWidth={2} dot={false} name="Business-initiated" />
              <Line type="monotone" dataKey="userInitiated" stroke="#3b82f6" strokeWidth={2} dot={false} name="User-initiated" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 4: Calls & Approximate Charges Chart */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <CardTitle className="text-sm">Calls & Approximate Charges</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-8">
              Customize
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={callsAndChargesData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} iconType="circle" />
              <Line type="monotone" dataKey="calls" stroke="#22c55e" strokeWidth={2} dot={false} name="Calls" />
              <Line type="monotone" dataKey="charges" stroke="#ec4899" strokeWidth={2} dot={false} name="Charges ($)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

