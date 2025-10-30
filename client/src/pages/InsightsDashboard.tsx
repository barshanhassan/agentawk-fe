import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import KPICard from "@/components/KPICard";
import { Download } from "react-feather";
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import CustomDropdown from "@/components/CustomDropdown";
import { DateRange } from "react-day-picker";

export default function InsightsDashboard() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // New state for active tab
  const [activeSubTab, setActiveSubTab] = useState({
    agentPerformance: "agent-performance-main",
    whatsapp: "whatsapp-messages",
    voiceOfCustomer: "voice-of-customer-summary",
    csatDashboard: "csat-dashboard-summary",
  });
  const [exportOptions, setExportOptions] = useState({
    overview: {
      totalCustomers: false,
      newCustomers: false,
      messageDetails: false,
      monthlyActiveUsers: false,
    },
    agentPerformance: {
      "agent-performance-main": {
        agentBoardSummary: false,
        agentBoardDetails: false,
        agentAwayLogs: false,
        agentLoginLogs: false,
      },
      "agent-conversion": {
        initiated: false,
        open: false,
        inProgress: false,
        closed: false,
        pending: false,
        exited: false,
        conversationsInitiatedVsInProgressVsSolved: false,
        conversationTagsStats: false,
      },
    },
    whatsapp: {
      "whatsapp-messages": {
        messageDetails: false,
        callDetails: false,
      },
      "whatsapp-calls": {
        messageDetails: false,
        callDetails: false,
      },
    },
    botDashboard: {
      popularityOfInteractionsDetailed: false,
      popularityOfInteractionsSummary: false,
      busiestPeriod: false,
      botVsHuman: false,
      exportChatData: false,
    },
    voiceOfCustomer: {
      "voice-of-customer-summary": {
        customerSentimentsExport: false,
      },
      "voice-of-customer-details": {
        customerSentimentsExport: false,
      },
    },
    csatDashboard: {
      "csat-dashboard-summary": {
        feedbackDetails: false,
        feedbackChart: false,
      },
      "csat-dashboard-details": {
        feedbackDetails: false,
        feedbackChart: false,
      },
    },
  });
  
  // Global Date Range State
  const [dateRange, setDateRange] = useState("last-7-days");
  const [customDate, setCustomDate] = useState<DateRange | undefined>(undefined);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);

  // Agent Performance Tab State
  const [agentPerformanceTab, setAgentPerformanceTab] = useState("agent-performance-main");
  const [selectedAgentPerformanceTeams, setSelectedAgentPerformanceTeams] = useState<string[]>([]);
  const [selectedAgentPerformanceAgents, setSelectedAgentPerformanceAgents] = useState<string[]>([]);
  
  // Voice of Customer Tab State
  const [voiceOfCustomerTab, setVoiceOfCustomerTab] = useState("summary");
  const [selectedVoiceOfCustomerTeams, setSelectedVoiceOfCustomerTeams] = useState<string[]>([]);
  const [selectedVoiceOfCustomerAgents, setSelectedVoiceOfCustomerAgents] = useState<string[]>([]);

  // CSAT Dashboard Tab State
  const [csatDashboardTab, setCsatDashboardTab] = useState("summary");
  const [selectedCsatDashboardTeams, setSelectedCsatDashboardTeams] = useState<string[]>([]);
  const [selectedCsatDashboardAgents, setSelectedCsatDashboardAgents] = useState<string[]>([]);
  
  // WhatsApp Pricing Tab State
  const [whatsappPricingTab, setWhatsappPricingTab] = useState("messages");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  
  // Mock data for teams and agents
  const teams = [
    { id: "team-1", name: "Sales Team" },
    { id: "team-2", name: "Support Team" },
    { id: "team-3", name: "Technical Team" },
    { id: "team-4", name: "Marketing Team" },
  ];
  
  const agents = [
    { id: "agent-1", name: "John Smith" },
    { id: "agent-2", name: "Sarah Johnson" },
    { id: "agent-3", name: "Mike Wilson" },
    { id: "agent-4", name: "Emma Davis" },
    { id: "agent-5", name: "Chris Brown" },
    { id: "agent-6", name: "Lisa Anderson" },
  ];
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
    <div className="p-6 space-y-6" data-testid="insights-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Insights Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] hover-elevate">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-14-days">Last 14 Days</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {dateRange === "custom" && (
            <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 hover-elevate">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {customDate
                      ? customDate.to
                        ? `${customDate.from?.toLocaleDateString() || ""} - ${customDate.to?.toLocaleDateString() || ""}`
                        : customDate.from?.toLocaleDateString() || ""
                      : "Select Date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={customDate?.from}
                  selected={customDate}
                  onSelect={setCustomDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          )}

          <Button 
            variant="outline" 
            onClick={() => setIsExportModalOpen(true)}
            className="gap-2 hover-elevate"
            data-testid="export-button"
          >
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2">
          <TabsTrigger value="overview" data-testid="tab-overview" className="relative" onClick={() => setActiveTab("overview")}>
            <div className="flex items-center gap-2">
              Overview
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Platform metrics and user analytics</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="agent-performance" data-testid="tab-agent-performance" className="relative" onClick={() => {
            setActiveTab("agentPerformance");
          }}>
            <div className="flex items-center gap-2">
              Agent Performance
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Team productivity and availability metrics</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="whatsapp-pricing" data-testid="tab-whatsapp-pricing" className="relative" onClick={() => {
            setActiveTab("whatsapp");
          }}>
            <div className="flex items-center gap-2">
              WhatsApp Pricing
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Message and call costs with detailed breakdowns</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="bot-dashboard" data-testid="tab-bot-dashboard" className="relative" onClick={() => setActiveTab("botDashboard")}>
            <div className="flex items-center gap-2">
              Bot Dashboard
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bot performance analytics and interaction insights</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="voice-of-customer" data-testid="tab-voice-of-customer" className="relative" onClick={() => {
            setActiveTab("voiceOfCustomer");
          }}>
            <div className="flex items-center gap-2">
              Voice of Customer
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Customer sentiment, feedback, and satisfaction insights</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="csat-dashboard" data-testid="tab-csat-dashboard" className="relative" onClick={() => {
            setActiveTab("csatDashboard");
          }}>
            <div className="flex items-center gap-2">
              CSAT Dashboard
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Customer satisfaction scores and agent performance metrics</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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

          {/* Row 2: DAU, WAU, COLX (MAU Tier Usage, Agent Seats Usage) */}
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
                    <Tooltip/>
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
                    <Tooltip/>
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
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground font-bold text-lg">
                        {`${gaugeData[0].value}%`}
                      </text>
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
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground font-bold text-lg">
                        {`${seatsData[0].value}%`}
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground mt-2">45 / 100 Agent Seats</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Row 3: MAU, DAU/MAU Ratio, COLY (Daily New Users, Weekly New Users, Monthly New Users) */}
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
                    <Tooltip/>
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
                    <Tooltip/>
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

          {/* Row 4: Messages Delivered */}
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
                    <Tooltip/>
                    <Line type="monotone" dataKey="delivered" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Row 5: Messages Received */}
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
                    <Tooltip/>
                    <Line type="monotone" dataKey="received" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agent-performance" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            {/* Left side - Tabs */}
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => {
                  setAgentPerformanceTab("agent-performance-main");
                  setActiveSubTab(prev => ({...prev, agentPerformance: "agent-performance-main"}));
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  agentPerformanceTab === "agent-performance-main"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Agent Performance
              </button>
              <button
                onClick={() => {
                  setAgentPerformanceTab("agent-conversion");
                  setActiveSubTab(prev => ({...prev, agentPerformance: "agent-conversion"}));
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  agentPerformanceTab === "agent-conversion"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Agent Conversion
              </button>
            </div>
            
            {/* Right side - Dropdowns and Export */}
            <div className="flex items-center gap-3">             
              {/* Teams Dropdown */}
              <CustomDropdown
                options={teams}
                selected={selectedAgentPerformanceTeams}
                onChange={setSelectedAgentPerformanceTeams}
                placeholder="Teams"
              />
              {/* Agents Dropdown */}
              <CustomDropdown
                options={agents}
                selected={selectedAgentPerformanceAgents}
                onChange={setSelectedAgentPerformanceAgents}
                placeholder="Agents"
              />
            </div>
          </div>
          
          {/* Filter Summary */}
          {(selectedAgentPerformanceTeams.length > 0 || selectedAgentPerformanceAgents.length > 0) && (
            <div className="bg-muted/50 rounded-lg p-3 mb-6">
              <p className="text-sm text-muted-foreground">
                Filtered by:&nbsp;
                {selectedAgentPerformanceTeams.length > 0 && (
                  <span className="text-foreground font-medium">
                    {selectedAgentPerformanceTeams.map(teamId => teams.find(t => t.id === teamId)?.name).join(", ")}
                  </span>
                )}
                {selectedAgentPerformanceTeams.length > 0 && selectedAgentPerformanceAgents.length > 0 && " and "}
                {selectedAgentPerformanceAgents.length > 0 && (
                  <span className="text-foreground font-medium">
                    {selectedAgentPerformanceAgents.map(agentId => agents.find(a => a.id === agentId)?.name).join(", ")}
                  </span>
                )}
              </p>
            </div>
          )}
          
          {/* Tab Content */}
          {agentPerformanceTab === "agent-performance-main" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Agent Performance Dashboard</h3>
              <p className="text-muted-foreground">Agent performance metrics and analytics will be displayed here.</p>
            </div>
          )}
          
          {agentPerformanceTab === "agent-conversion" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Agent Conversion Dashboard</h3>
              <p className="text-muted-foreground">Agent conversion metrics and analytics will be displayed here.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="whatsapp-pricing" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            {/* Left side - Tabs */}
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => {
                  setWhatsappPricingTab("messages");
                  setActiveSubTab(prev => ({...prev, whatsapp: "whatsapp-messages"}));
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  whatsappPricingTab === "messages"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => {
                  setWhatsappPricingTab("calls");
                  setActiveSubTab(prev => ({...prev, whatsapp: "whatsapp-calls"}));
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  whatsappPricingTab === "calls"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Calls
              </button>
            </div>

            {/* Right side - Date Range and Country Select */}
            <div className="flex items-center space-x-4">


              <CustomDropdown
                options={[
                  { id: "us", name: "United States" },
                  { id: "in", name: "India" },
                  { id: "br", name: "Brazil" },
                  { id: "id", name: "Indonesia" },
                  { id: "uk", name: "United Kingdom" },
                ]}
                selected={selectedCountries}
                onChange={setSelectedCountries}
                placeholder="Countries"
              />
            </div>
          </div>

          {whatsappPricingTab === "messages" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Messages Dashboard</h3>
              <p className="text-muted-foreground">WhatsApp message pricing analysis will be displayed here.</p>
            </div>
          )}

          {whatsappPricingTab === "calls" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Calls Dashboard</h3>
              <p className="text-muted-foreground">WhatsApp call pricing analysis will be displayed here.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bot-dashboard" className="space-y-6">


          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Bot Summary Dashboard</h3>
            <p className="text-muted-foreground">Bot performance metrics and conversation analytics will be displayed here.</p>
          </div>
        </TabsContent>

        <TabsContent value="voice-of-customer" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            {/* Left side - Tabs */}
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => {
                  setVoiceOfCustomerTab("summary");
                  setActiveSubTab(prev => ({...prev, voiceOfCustomer: "voice-of-customer-summary"}));
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  voiceOfCustomerTab === "summary"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => {
                  setVoiceOfCustomerTab("details");
                  setActiveSubTab(prev => ({...prev, voiceOfCustomer: "voice-of-customer-details"}));
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  voiceOfCustomerTab === "details"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Details
              </button>
            </div>

            {/* Right side - Date Range, Teams, and Agents */}
            <div className="flex items-center space-x-4">
              {/* Teams Dropdown */}
              <CustomDropdown
                options={teams}
                selected={selectedVoiceOfCustomerTeams}
                onChange={setSelectedVoiceOfCustomerTeams}
                placeholder="Teams"
              />
              {/* Agents Dropdown */}
              <CustomDropdown
                options={agents}
                selected={selectedVoiceOfCustomerAgents}
                onChange={setSelectedVoiceOfCustomerAgents} 
                placeholder="Agents"
              />
            </div>
          </div>

          {voiceOfCustomerTab === "summary" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Voice of Customer Summary Dashboard</h3>
              <p className="text-muted-foreground">Customer feedback analysis and sentiment tracking will be displayed here.</p>
            </div>
          )}

          {voiceOfCustomerTab === "details" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Voice of Customer Details Dashboard</h3>
              <p className="text-muted-foreground">Detailed customer feedback analysis will be displayed here.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="csat-dashboard" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            {/* Left side - Tabs */}
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => {
                  setCsatDashboardTab("summary");
                  setActiveSubTab(prev => ({...prev, csatDashboard: "csat-dashboard-summary"}));
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  csatDashboardTab === "summary"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => {
                  setCsatDashboardTab("details");
                  setActiveSubTab(prev => ({...prev, csatDashboard: "csat-dashboard-details"}));
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  csatDashboardTab === "details"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Details
              </button>
            </div>

            {/* Right side - Date Range, Teams, and Agents */}
            <div className="flex items-center space-x-4">
              <CustomDropdown
                options={teams}
                selected={selectedCsatDashboardTeams}
                onChange={setSelectedCsatDashboardTeams}
                placeholder="Teams"
              />
              <CustomDropdown
                options={agents}
                selected={selectedCsatDashboardAgents}
                onChange={setSelectedCsatDashboardAgents}
                placeholder="Agents"
              />
            </div>
          </div>

          {csatDashboardTab === "summary" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">CSAT Summary Dashboard</h3>
              <p className="text-muted-foreground">Customer satisfaction scores and CSAT analytics will be displayed here.</p>
            </div>
          )}

          {csatDashboardTab === "details" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">CSAT Details Dashboard</h3>
              <p className="text-muted-foreground">Detailed customer satisfaction scores and CSAT analytics will be displayed here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Export Modal */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="sm:max-w-md" data-testid="export-modal">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Export Insights</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-3">Include Breakdown By:</p>
              <div className="space-y-3">
                {activeTab === "overview" &&
                  Object.entries(exportOptions.overview).map(([key, value]) => (
                    <div className="flex items-center space-x-2" key={key}>
                      <Checkbox
                        id={key}
                        checked={value as boolean}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            overview: { ...prev.overview, [key]: checked as boolean },
                          }))
                        }
                        data-testid={`checkbox-${key}`}
                      />
                      <label
                        htmlFor={key}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                    </div>
                  ))}

                {activeTab === "agentPerformance" &&
                  Object.entries(exportOptions.agentPerformance[activeSubTab.agentPerformance as keyof typeof exportOptions.agentPerformance]).map(([key, value]) => (
                    <div className="flex items-center space-x-2" key={key}>
                      <Checkbox
                        id={key}
                        checked={value as boolean}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            agentPerformance: {
                              ...prev.agentPerformance,
                              [activeSubTab.agentPerformance]: {
                                ...prev.agentPerformance[activeSubTab.agentPerformance as keyof typeof prev.agentPerformance],
                                [key]: checked as boolean,
                              },
                            },
                          }))
                        }
                        data-testid={`checkbox-${key}`}
                      />
                      <label
                        htmlFor={key}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                    </div>
                  ))}

                {activeTab === "whatsapp" &&
                  Object.entries(exportOptions.whatsapp[activeSubTab.whatsapp as keyof typeof exportOptions.whatsapp]).map(([key, value]) => (
                    <div className="flex items-center space-x-2" key={key}>
                      <Checkbox
                        id={key}
                        checked={value as boolean}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            whatsapp: {
                              ...prev.whatsapp,
                              [activeSubTab.whatsapp]: {
                                ...prev.whatsapp[activeSubTab.whatsapp as keyof typeof prev.whatsapp],
                                [key]: checked as boolean,
                              },
                            },
                          }))
                        }
                        data-testid={`checkbox-${key}`}
                      />
                      <label
                        htmlFor={key}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                    </div>
                  ))}

                {activeTab === "botDashboard" &&
                  Object.entries(exportOptions.botDashboard).map(([key, value]) => (
                    <div className="flex items-center space-x-2" key={key}>
                      <Checkbox
                        id={key}
                        checked={value as boolean}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            botDashboard: { ...prev.botDashboard, [key]: checked as boolean },
                          }))
                        }
                        data-testid={`checkbox-${key}`}
                      />
                      <label
                        htmlFor={key}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                    </div>
                  ))}

                {activeTab === "voiceOfCustomer" &&
                  Object.entries(exportOptions.voiceOfCustomer[activeSubTab.voiceOfCustomer as keyof typeof exportOptions.voiceOfCustomer]).map(([key, value]) => (
                    <div className="flex items-center space-x-2" key={key}>
                      <Checkbox
                        id={key}
                        checked={value as boolean}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            voiceOfCustomer: {
                              ...prev.voiceOfCustomer,
                              [activeSubTab.voiceOfCustomer]: {
                                ...prev.voiceOfCustomer[activeSubTab.voiceOfCustomer as keyof typeof prev.voiceOfCustomer],
                                [key]: checked as boolean,
                              },
                            },
                          }))
                        }
                        data-testid={`checkbox-${key}`}
                      />
                      <label
                        htmlFor={key}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                    </div>
                  ))}

                {activeTab === "csatDashboard" &&
                  Object.entries(exportOptions.csatDashboard[activeSubTab.csatDashboard as keyof typeof exportOptions.csatDashboard]).map(([key, value]) => (
                    <div className="flex items-center space-x-2" key={key}>
                      <Checkbox
                        id={key}
                        checked={value as boolean}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            csatDashboard: {
                              ...prev.csatDashboard,
                              [activeSubTab.csatDashboard]: {
                                ...prev.csatDashboard[activeSubTab.csatDashboard as keyof typeof prev.csatDashboard],
                                [key]: checked as boolean,
                              },
                            },
                          }))
                        }
                        data-testid={`checkbox-${key}`}
                      />
                      <label
                        htmlFor={key}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsExportModalOpen(false)}
              data-testid="close-button"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                // Handle export logic here
                console.log(`Export options for ${activeTab}:`, exportOptions[activeTab as keyof typeof exportOptions]);
                // Reset all checkboxes for all tabs and subtabs
                setExportOptions((prev) => {
                  const newExportOptions = { ...prev };
                  for (const tabKey in newExportOptions) {
                    const tabOptions = newExportOptions[tabKey as keyof typeof newExportOptions];
                    if (typeof tabOptions === 'object' && tabOptions !== null && !Array.isArray(tabOptions)) {
                      for (const subTabKey in tabOptions) {
                        const subTabOptions = tabOptions[subTabKey as keyof typeof tabOptions];
                        if (typeof subTabOptions === 'object' && subTabOptions !== null && !Array.isArray(subTabOptions)) {
                          for (const checkboxKey in (subTabOptions as Record<string, boolean>)) {
                            (subTabOptions as Record<string, boolean>)[checkboxKey] = false;
                          }
                        } else {
                          (tabOptions as Record<string, boolean>)[subTabKey] = false;
                        }
                      }
                    }
                  }
                  return newExportOptions;
                });
                setIsExportModalOpen(false);
              }}
              data-testid="export-button-modal"
            >
              Export
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
