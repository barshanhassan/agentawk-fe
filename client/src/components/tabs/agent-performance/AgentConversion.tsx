import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Conversion Volume Trend */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Conversion Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No data available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call Engagement Trend */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Call Engagement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No data available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Tags */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 bg-muted/30 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">No tags found</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

