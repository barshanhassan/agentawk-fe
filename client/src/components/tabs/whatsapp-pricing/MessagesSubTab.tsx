import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function MessagesSubTab() {
  // Mock KPI data
  const kpiData = {
    allMessages: {
      messageSent: 0,
      messageDelivered: 0,
      messageReceived: 0,
    },
    allDeliveries: {
      marketing: 0,
      marketingLite: 0,
      utility: 0,
      authentication: 0,
      authenticationIntl: 0,
      service: 43,
    },
    freeDeliveries: {
      freeCustomerService: 43,
      freeEntryPoint: 0,
    },
    paidDeliveries: {
      marketing: 0,
      marketingLite: 0,
      utility: 0,
      authentication: 0,
      authenticationIntl: 0,
    },
    approximateCharges: {
      marketing: 0,
      marketingLite: 0,
      utility: 0,
      authentication: 0,
      authenticationIntl: 0,
    },
  };

  // Dummy data for charts
  const allDeliveriesData = [
    { date: "Oct 24", marketing: 5, marketingLite: 3, utility: 2, authentication: 1, authenticationIntl: 0, service: 8 },
    { date: "Oct 25", marketing: 4, marketingLite: 2, utility: 3, authentication: 1, authenticationIntl: 0, service: 7 },
    { date: "Oct 26", marketing: 8, marketingLite: 5, utility: 4, authentication: 2, authenticationIntl: 1, service: 12 },
    { date: "Oct 27", marketing: 6, marketingLite: 4, utility: 3, authentication: 2, authenticationIntl: 1, service: 10 },
    { date: "Oct 28", marketing: 12, marketingLite: 8, utility: 6, authentication: 3, authenticationIntl: 2, service: 18 },
    { date: "Oct 29", marketing: 10, marketingLite: 6, utility: 5, authentication: 2, authenticationIntl: 1, service: 15 },
    { date: "Oct 30", marketing: 7, marketingLite: 4, utility: 3, authentication: 1, authenticationIntl: 0, service: 9 },
  ];

  const freeDeliveriesData = [
    { date: "Oct 24", freeEntryPoint: 0, freeCustomerService: 8 },
    { date: "Oct 25", freeEntryPoint: 0, freeCustomerService: 7 },
    { date: "Oct 26", freeEntryPoint: 1, freeCustomerService: 12 },
    { date: "Oct 27", freeEntryPoint: 0, freeCustomerService: 10 },
    { date: "Oct 28", freeEntryPoint: 2, freeCustomerService: 18 },
    { date: "Oct 29", freeEntryPoint: 1, freeCustomerService: 15 },
    { date: "Oct 30", freeEntryPoint: 0, freeCustomerService: 9 },
  ];

  const paidDeliveriesData = [
    { date: "Oct 24", marketing: 5, marketingLite: 3, utility: 2, authentication: 1, authenticationIntl: 0 },
    { date: "Oct 25", marketing: 4, marketingLite: 2, utility: 3, authentication: 1, authenticationIntl: 0 },
    { date: "Oct 26", marketing: 8, marketingLite: 5, utility: 4, authentication: 2, authenticationIntl: 1 },
    { date: "Oct 27", marketing: 6, marketingLite: 4, utility: 3, authentication: 2, authenticationIntl: 1 },
    { date: "Oct 28", marketing: 12, marketingLite: 8, utility: 6, authentication: 3, authenticationIntl: 2 },
    { date: "Oct 29", marketing: 10, marketingLite: 6, utility: 5, authentication: 2, authenticationIntl: 1 },
    { date: "Oct 30", marketing: 7, marketingLite: 4, utility: 3, authentication: 1, authenticationIntl: 0 },
  ];

  const approximateChargesData = [
    { date: "Oct 24", marketing: 0.5, marketingLite: 0.3, utility: 0.2, authentication: 0.1, authenticationIntl: 0 },
    { date: "Oct 25", marketing: 0.4, marketingLite: 0.2, utility: 0.3, authentication: 0.1, authenticationIntl: 0 },
    { date: "Oct 26", marketing: 0.8, marketingLite: 0.5, utility: 0.4, authentication: 0.2, authenticationIntl: 0.1 },
    { date: "Oct 27", marketing: 0.6, marketingLite: 0.4, utility: 0.3, authentication: 0.2, authenticationIntl: 0.1 },
    { date: "Oct 28", marketing: 1.2, marketingLite: 0.8, utility: 0.6, authentication: 0.3, authenticationIntl: 0.2 },
    { date: "Oct 29", marketing: 1.0, marketingLite: 0.6, utility: 0.5, authentication: 0.2, authenticationIntl: 0.1 },
    { date: "Oct 30", marketing: 0.7, marketingLite: 0.4, utility: 0.3, authentication: 0.1, authenticationIntl: 0 },
  ];

  return (
    <div className="space-y-4">
      {/* Row 1: 5 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: All Messages */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">All Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Message Sent</span>
              <span className="text-sm font-semibold">{kpiData.allMessages.messageSent}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Message Delivered</span>
              <span className="text-sm font-semibold">{kpiData.allMessages.messageDelivered}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Message Received</span>
              <span className="text-sm font-semibold">{kpiData.allMessages.messageReceived}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: All Deliveries */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">All Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Marketing</span>
              <span className="text-sm font-semibold">{kpiData.allDeliveries.marketing}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Marketing Lite</span>
              <span className="text-sm font-semibold">{kpiData.allDeliveries.marketingLite}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Utility</span>
              <span className="text-sm font-semibold">{kpiData.allDeliveries.utility}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Authentication</span>
              <span className="text-sm font-semibold">{kpiData.allDeliveries.authentication}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Authentication Intl</span>
              <span className="text-sm font-semibold">{kpiData.allDeliveries.authenticationIntl}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Service</span>
              <span className="text-sm font-semibold">{kpiData.allDeliveries.service}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Free Deliveries */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Free Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Free Customer Service</span>
              <span className="text-sm font-semibold">{kpiData.freeDeliveries.freeCustomerService}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Free Entry Point</span>
              <span className="text-sm font-semibold">{kpiData.freeDeliveries.freeEntryPoint}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Paid Deliveries */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Paid Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Marketing</span>
              <span className="text-sm font-semibold">{kpiData.paidDeliveries.marketing}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Marketing Lite</span>
              <span className="text-sm font-semibold">{kpiData.paidDeliveries.marketingLite}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Utility</span>
              <span className="text-sm font-semibold">{kpiData.paidDeliveries.utility}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Authentication</span>
              <span className="text-sm font-semibold">{kpiData.paidDeliveries.authentication}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Authentication Intl</span>
              <span className="text-sm font-semibold">{kpiData.paidDeliveries.authenticationIntl}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Approximate Charges */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Approximate Charges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Marketing</span>
              <span className="text-sm font-semibold">${kpiData.approximateCharges.marketing}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Marketing Lite</span>
              <span className="text-sm font-semibold">${kpiData.approximateCharges.marketingLite}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Utility</span>
              <span className="text-sm font-semibold">${kpiData.approximateCharges.utility}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Authentication</span>
              <span className="text-sm font-semibold">${kpiData.approximateCharges.authentication}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Authentication Intl</span>
              <span className="text-sm font-semibold">${kpiData.approximateCharges.authenticationIntl}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: All Deliveries Chart */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm">All Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={allDeliveriesData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} iconType="circle" />
              <Line type="monotone" dataKey="marketing" stroke="#22c55e" strokeWidth={2} dot={false} name="Marketing" />
              <Line type="monotone" dataKey="marketingLite" stroke="#3b82f6" strokeWidth={2} dot={false} name="Marketing Lite" />
              <Line type="monotone" dataKey="utility" stroke="#f59e0b" strokeWidth={2} dot={false} name="Utility" />
              <Line type="monotone" dataKey="authentication" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Authentication" />
              <Line type="monotone" dataKey="authenticationIntl" stroke="#ec4899" strokeWidth={2} dot={false} name="Authentication Intl" />
              <Line type="monotone" dataKey="service" stroke="#6366f1" strokeWidth={2} dot={false} name="Service" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 3: Free Deliveries Chart */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm">Free Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={freeDeliveriesData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} iconType="circle" />
              <Line type="monotone" dataKey="freeEntryPoint" stroke="#9ca3af" strokeWidth={2} dot={false} name="Free Entry Point" />
              <Line type="monotone" dataKey="freeCustomerService" stroke="#22c55e" strokeWidth={2} dot={false} name="Free Customer Service" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 4: Paid Deliveries Chart */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm">Paid Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paidDeliveriesData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} iconType="circle" />
              <Line type="monotone" dataKey="marketing" stroke="#22c55e" strokeWidth={2} dot={false} name="Marketing" />
              <Line type="monotone" dataKey="marketingLite" stroke="#3b82f6" strokeWidth={2} dot={false} name="Marketing Lite" />
              <Line type="monotone" dataKey="utility" stroke="#f59e0b" strokeWidth={2} dot={false} name="Utility" />
              <Line type="monotone" dataKey="authentication" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Authentication" />
              <Line type="monotone" dataKey="authenticationIntl" stroke="#ec4899" strokeWidth={2} dot={false} name="Authentication Intl" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 5: Approximate Charges Chart */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm">Approximate Charges</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={approximateChargesData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} iconType="circle" />
              <Line type="monotone" dataKey="marketing" stroke="#22c55e" strokeWidth={2} dot={false} name="Marketing" />
              <Line type="monotone" dataKey="marketingLite" stroke="#3b82f6" strokeWidth={2} dot={false} name="Marketing Lite" />
              <Line type="monotone" dataKey="utility" stroke="#f59e0b" strokeWidth={2} dot={false} name="Utility" />
              <Line type="monotone" dataKey="authentication" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Authentication" />
              <Line type="monotone" dataKey="authenticationIntl" stroke="#ec4899" strokeWidth={2} dot={false} name="Authentication Intl" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

