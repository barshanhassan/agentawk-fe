import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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

const agentAvailabilityData = [
  { name: "John Smith", team: "Sales Team", loginTime: "09:30 AM", status: "Online", statusColor: "bg-green-500" },
  { name: "Sarah Johnson", team: "Support Team", loginTime: "08:45 AM", status: "Busy", statusColor: "bg-orange-500" },
  { name: "Mike Wilson", team: "Technical Team", loginTime: "10:15 AM", status: "Online", statusColor: "bg-green-500" },
  { name: "Emma Davis", team: "Sales Team", loginTime: "09:00 AM", status: "Away", statusColor: "bg-yellow-500" },
];

const agentPerformanceMetricsData = [
  { name: "John Smith", accepted: 45, solved: 42, date: "Oct 28, 2025", avgResponse: "1m 45s", avgResolution: "12m 30s" },
  { name: "Sarah Johnson", accepted: 38, solved: 35, date: "Oct 28, 2025", avgResponse: "2m 10s", avgResolution: "18m 45s" },
  { name: "Mike Wilson", accepted: 52, solved: 48, date: "Oct 28, 2025", avgResponse: "1m 20s", avgResolution: "10m 15s" },
  { name: "Emma Davis", accepted: 28, solved: 26, date: "Oct 28, 2025", avgResponse: "3m 05s", avgResolution: "22m 30s" },
];

export default function AgentPerformanceMain() {
  const [availabilitySearch, setAvailabilitySearch] = useState("");
  const [performanceSearch, setPerformanceSearch] = useState("");

  // Filter Availability Data
  const filteredAvailability = agentAvailabilityData.filter(agent =>
    agent.name.toLowerCase().includes(availabilitySearch.toLowerCase()) ||
    agent.team.toLowerCase().includes(availabilitySearch.toLowerCase())
  );

  // Filter Performance Data
  const filteredPerformance = agentPerformanceMetricsData.filter(agent =>
    agent.name.toLowerCase().includes(performanceSearch.toLowerCase())
  );

  // Mock KPI data
  const kpiData = {
    conversations: {
      handled: 1250,
      completed: 980,
      inProgress: 45,
    },
    performance: {
      avgResponseTime: "2m 15s",
      avgResolutionTime: "15m 30s",
      resolutionRate: "92%",
    },
    queue: {
      activeNow: 12,
      pending: 8,
      forwarded: 3,
    },
    feedback: {
      great: 156,
      average: 42,
      poor: 8,
    },
  };

  return (
    <div className="space-y-4">
      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Conversations */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total handled</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.conversations.handled)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Completed</span>
              <span className="text-sm font-semibold">{abbreviateNumber(kpiData.conversations.completed)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">In progress</span>
              <span className="text-sm font-semibold">{kpiData.conversations.inProgress}</span>
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
              <span className="text-xs text-muted-foreground">Avg resolution time</span>
              <span className="text-sm font-semibold">{kpiData.performance.avgResolutionTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Resolution rate</span>
              <span className="text-sm font-semibold">{kpiData.performance.resolutionRate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Queue */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Active now</span>
              <span className="text-sm font-semibold">{kpiData.queue.activeNow}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Pending</span>
              <span className="text-sm font-semibold">{kpiData.queue.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Forwarded</span>
              <span className="text-sm font-semibold">{kpiData.queue.forwarded}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Feedback */}
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Great</span>
              <span className="text-sm font-semibold">{kpiData.feedback.great}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Average</span>
              <span className="text-sm font-semibold">{kpiData.feedback.average}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Poor</span>
              <span className="text-sm font-semibold">{kpiData.feedback.poor}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Agent Availability Board */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Agent Availability Board</CardTitle>
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search agents..."
                className="pl-10 h-8 text-xs border-input"
                value={availabilitySearch}
                onChange={(e) => setAvailabilitySearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Agent Status Overview */}
            <div className="space-y-4">
              <div className="w-full flex justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground">Agent Status Overview</h3>
                <h3 className="text-xs text-muted-foreground">Total: 15</h3>
              </div>

              {/* Status Items with Progress Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Online</span>
                    <span className="text-xs font-semibold">8</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Busy</span>
                    <span className="text-xs font-semibold">5</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: "50%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Away</span>
                    <span className="text-xs font-semibold">2</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "20%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Offline</span>
                    <span className="text-xs font-semibold">0</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="pt-2 space-y-2 grid grid-cols-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">Online (8)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-xs text-muted-foreground">Busy (5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-xs text-muted-foreground">Away (2)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-xs text-muted-foreground">Offline (0)</span>
                </div>
              </div>
            </div>

            {/* Right: Agents Table */}
            <div className="lg:col-span-2">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="select-none">
                    <tr className="border-b">
                      <th className="text-left pt-0 pb-2 px-3 font-medium text-muted-foreground">Agent</th>
                      <th className="text-left pt-0 pb-2 px-3 font-medium text-muted-foreground">Team</th>
                      <th className="text-left pt-0 pb-2 px-3 font-medium text-muted-foreground">Login Time</th>
                      <th className="text-left pt-0 pb-2 px-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAvailability.length > 0 ? (
                      filteredAvailability.map((agent, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-3">{agent.name}</td>
                          <td className="py-2 px-3">{agent.team}</td>
                          <td className="py-2 px-3">{agent.loginTime}</td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${agent.statusColor}`}></div>
                              <span>{agent.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-muted-foreground">
                          No agents found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Row 3: Agent Performance Metrics */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Agent Performance Metrics</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by agent..."
                className="pl-10 h-8 text-xs border-input"
                value={performanceSearch}
                onChange={(e) => setPerformanceSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="select-none">
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Agent</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Accepted</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Solved</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Avg Response Time</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Avg Resolution Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerformance.length > 0 ? (
                  filteredPerformance.map((agent, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3">{agent.name}</td>
                      <td className="py-2 px-3">{agent.accepted}</td>
                      <td className="py-2 px-3">{agent.solved}</td>
                      <td className="py-2 px-3">{agent.date}</td>
                      <td className="py-2 px-3">{agent.avgResponse}</td>
                      <td className="py-2 px-3">{agent.avgResolution}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-muted-foreground">
                      No agent records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

