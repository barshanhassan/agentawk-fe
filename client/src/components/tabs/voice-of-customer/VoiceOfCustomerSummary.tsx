import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function VoiceOfCustomerSummary() {
  // Mock data for sentiment score
  const sentimentScore = 78;
  const totalConversations = 1250;

  // Mock data for sentiment distribution
  const sentimentDistribution = [
    { name: "Positive", percentage: 65 },
    { name: "Neutral", percentage: 25 },
    { name: "Negative", percentage: 10 },
  ];

  // Mock data for sentiment trend
  const sentimentTrendData = [
    { date: "Oct 24", positive: 45, neutral: 15, negative: 8 },
    { date: "Oct 25", positive: 52, neutral: 18, negative: 7 },
    { date: "Oct 26", positive: 58, neutral: 20, negative: 6 },
    { date: "Oct 27", positive: 62, neutral: 22, negative: 5 },
    { date: "Oct 28", positive: 68, neutral: 24, negative: 4 },
    { date: "Oct 29", positive: 72, neutral: 25, negative: 3 },
    { date: "Oct 30", positive: 78, neutral: 25, negative: 10 },
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
      {/* Row 1: Sentiment Score and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sentiment Score Card - 25% width */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Sentiment Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">{sentimentScore}%</div>
            <div className="text-xs text-muted-foreground">Total conversations</div>
          </CardContent>
        </Card>

        {/* Sentiment Distribution Card - 75% width */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sentimentDistribution.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16">{item.name}</span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    {item.name === "Positive" && (
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    )}
                    {item.name === "Neutral" && (
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    )}
                    {item.name === "Negative" && (
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    )}
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Sentiment Trend Analysis */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm">Sentiment Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={sentimentTrendData}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} iconType="circle" />
              <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} dot={false} name="Positive Sentiment" />
              <Line type="monotone" dataKey="neutral" stroke="#f97316" strokeWidth={2} dot={false} name="Neutral Sentiment" />
              <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} dot={false} name="Negative Sentiment" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

