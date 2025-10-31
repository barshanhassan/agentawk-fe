import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function CSATSummary() {
  // Mock data for satisfaction score
  const satisfactionScore = 78;
  const totalResponses = 245;
  const basedOnConversations = 1250;

  // Mock data for response rate
  const feedbackRate = 19.6;
  const responded = 245;
  const totalConversations = 1250;

  // Mock data for distribution
  const distributionData = [
    { name: "Great", percentage: 65 },
    { name: "Average", percentage: 22 },
    { name: "Poor", percentage: 13 },
  ];

  // Mock data for agent rankings
  const agentRankings = [
    { name: "Most Great", count: 52, label: "52 great ratings" },
    { name: "Fewest Great", count: 18, label: "18 great ratings" },
  ];

  // Mock data for CSAT distribution chart
  const csatDistributionData = [
    { date: "Oct 24", great: 42, average: 15, poor: 8 },
    { date: "Oct 25", great: 48, average: 14, poor: 7 },
    { date: "Oct 26", great: 52, average: 13, poor: 6 },
    { date: "Oct 27", great: 58, average: 12, poor: 5 },
    { date: "Oct 28", great: 62, average: 11, poor: 4 },
    { date: "Oct 29", great: 68, average: 10, poor: 3 },
    { date: "Oct 30", great: 75, average: 9, poor: 2 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-md p-2 shadow-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs">{entry.name}:</span>
              <span className="text-xs font-medium" style={{ color: entry.color }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Satisfaction Score Card */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Satisfaction Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-red-500">{satisfactionScore}%</div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Total responses</div>
              <div className="text-sm font-medium">{totalResponses}</div>
            </div>
            <div className="text-xs text-muted-foreground">Based on</div>
            <div className="text-sm font-medium">{basedOnConversations} conversations</div>
          </CardContent>
        </Card>

        {/* Response Rate Card */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Response Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Feedback rate</div>
              <div className="text-sm font-medium">{feedbackRate}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Responded</div>
              <div className="text-sm font-medium">{responded}</div>
            </div>
            <div className="text-xs text-muted-foreground">Total conversations</div>
            <div className="text-sm font-medium">{totalConversations}</div>
          </CardContent>
        </Card>

        {/* Distribution Card */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        item.name === "Great"
                          ? "#22c55e"
                          : item.name === "Average"
                          ? "#f97316"
                          : "#ef4444",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-xs font-medium">{item.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Agent Rankings Card */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Agent Rankings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agentRankings.map((agent, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {agent.name === "Most Great" ? (
                    <TrendingUp size={16} className="text-green-500" />
                  ) : (
                    <TrendingDown size={16} className="text-red-500" />
                  )}
                  <div>
                    <div className="text-xs font-medium">{agent.name}</div>
                    <div className="text-xs text-muted-foreground">{agent.label}</div>
                  </div>
                </div>
                <span className={`text-xs font-medium ${agent.name === "Most Great" ? "text-green-500" : "text-red-500"}`}>
                  {agent.count} {agent.name === "Most Great" ? "great ratings" : "great ratings"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: CSAT Distribution Chart */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">CSAT Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs font-medium">Great</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs font-medium">Average</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs font-medium">Poor</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={csatDistributionData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
              <Line type="monotone" dataKey="great" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="average" stroke="#f97316" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="poor" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

