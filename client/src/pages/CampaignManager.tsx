import { useState } from "react";
import { Plus, BarChart2, Edit2, Copy, Trash2, Send, Zap, Search } from "react-feather";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function CampaignManager() {
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
  const [performanceOpen, setPerformanceOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activePerformanceTab, setActivePerformanceTab] = useState("performance");
  const [searchQuery, setSearchQuery] = useState("");

  const campaigns = [
    {
      id: 1,
      name: "Summer Sale 2024",
      type: "Broadcast",
      channel: "WhatsApp",
      messageType: "Immediate",
      sent: 15420,
      delivered: 14892,
      status: "delivered",
    },
    {
      id: 2,
      name: "Cart Abandonment",
      type: "API Triggered",
      channel: "WhatsApp",
      messageType: "Recurring",
      sent: 8923,
      delivered: 8654,
      status: "delivered",
    },
    {
      id: 3,
      name: "Product Launch",
      type: "Broadcast",
      channel: "WhatsApp",
      messageType: "Scheduled",
      sent: 0,
      delivered: 0,
      status: "scheduled",
    },
  ];

  const engagementData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    delivered: Math.floor(Math.random() * 1000) + 500,
    viewed: Math.floor(Math.random() * 800) + 300,
  }));

  const recipients = [
    { id: 1, name: "John Doe", phone: "+1234567890", status: "Delivered", time: "10:30 AM" },
    { id: 2, name: "Jane Smith", phone: "+1234567891", status: "Delivered", time: "10:32 AM" },
    { id: 3, name: "Bob Johnson", phone: "+1234567892", status: "Failed", time: "10:35 AM" },
  ];

  const toggleCampaign = (id: number) => {
    setSelectedCampaigns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedCampaigns.length === campaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map((c) => c.id));
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    if (status === "delivered") return "bg-green-100 text-green-700";
    if (status === "scheduled") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const getTypeBadgeClasses = () => {
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="p-6 space-y-6" data-testid="campaign-manager">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Campaign Manager</h1>
        <Button className="gap-2 font-normal" onClick={() => setCreateOpen(true)} data-testid="button-create-campaign">
          <Plus size={16} />
          Create Campaign
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-1 bg-slate-200/75 rounded-lg p-1 w-fit">
        {["All Campaigns", "Draft", "Scheduled", "Delivered", "Archived"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter.toLowerCase().replace(" ", ""))}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeFilter === filter.toLowerCase().replace(" ", "")
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`filter-${filter.toLowerCase().replace(" ", "-")}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardContent className="pt-2">
          {/* Bulk Actions Toolbar */}
          {selectedCampaigns.length > 0 && (
            <div className="flex items-center gap-3 mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
              <span className="text-sm text-foreground">{selectedCampaigns.length} selected</span>
              <div className="flex gap-2 ml-auto">
                <button className="p-1 hover:bg-blue-100 rounded" title="Delete">
                  <Trash2 size={14} className="text-blue-600" />
                </button>
              </div>
            </div>
          )}

          <div className={`overflow-x-auto ${selectedCampaigns.length > 0 ? 'mt-3' : 'mt-6'}`}>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                    <Checkbox
                      checked={selectedCampaigns.length === campaigns.length}
                      onCheckedChange={toggleAll}
                      data-testid="checkbox-select-all"
                    />
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Campaign Name</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Channel</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Message Type</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Sent</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Delivered</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-muted/50" data-testid={`campaign-row-${campaign.id}`}>
                    <td className="py-2 px-3">
                      <Checkbox
                        checked={selectedCampaigns.includes(campaign.id)}
                        onCheckedChange={() => toggleCampaign(campaign.id)}
                        data-testid={`checkbox-campaign-${campaign.id}`}
                      />
                    </td>
                    <td className="py-2 px-3 font-medium">{campaign.name}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadgeClasses()}`}>
                        {campaign.type}
                      </span>
                    </td>
                    <td className="py-2 px-3">{campaign.channel}</td>
                    <td className="py-2 px-3">{campaign.messageType}</td>
                    <td className="py-2 px-3 text-right">{campaign.sent.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right">{campaign.delivered.toLocaleString()}</td>
                    <td className="py-2 px-3 flex justify-start">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-muted rounded">
                            <MoreVertical size={14} className="text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPerformanceOpen(true)} data-testid={`button-performance-${campaign.id}`}>
                            <BarChart2 size={14} className="mr-2" />
                            View Performance
                          </DropdownMenuItem>
                          <DropdownMenuItem data-testid={`button-edit-${campaign.id}`}>
                            <Edit2 size={14} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem data-testid={`button-clone-${campaign.id}`}>
                            <Copy size={14} className="mr-2" />
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" data-testid={`button-delete-${campaign.id}`}>
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Campaign Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent data-testid="dialog-create-campaign">
          <DialogHeader className="mb-2">
            <DialogTitle>Create Campaign</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Card className="cursor-pointer hover-elevate active-elevate-2 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0" data-testid="card-api-triggered">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap size={24} className="text-primary" />
                </div>
                <CardTitle className="text-base">API Triggered</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">Send messages based on API calls and user actions</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover-elevate active-elevate-2 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0" data-testid="card-broadcast">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Send size={24} className="text-blue-600" />
                </div>
                <CardTitle className="text-base">Broadcast</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">Send bulk messages to a list of contacts</p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Performance Dialog */}
      <Dialog open={performanceOpen} onOpenChange={setPerformanceOpen}>
        <DialogContent className="max-w-5xl" data-testid="dialog-performance">
          <DialogHeader className="mb-2">
            <DialogTitle>Campaign Performance - Summer Sale 2024</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center space-x-1 bg-slate-200/75 rounded-lg p-1 w-fit">
              <button
                onClick={() => setActivePerformanceTab("performance")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activePerformanceTab === "performance"
                    ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="tab-performance"
              >
                Performance
              </button>
              <button
                onClick={() => setActivePerformanceTab("recipients")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activePerformanceTab === "recipients"
                    ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="tab-recipients"
              >
                Recipients
              </button>
            </div>

            {/* Performance Tab */}
            {activePerformanceTab === "performance" && (
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Sent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">15,420</div>
                      <p className="text-xs text-muted-foreground mt-1">Total messages</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Delivered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">14,892</div>
                      <p className="text-xs text-muted-foreground mt-1">96.6% delivery rate</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Failed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">528</div>
                      <p className="text-xs text-muted-foreground mt-1">3.4% failure rate</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Viewed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">12,453</div>
                      <p className="text-xs text-muted-foreground mt-1">83.6% view rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Chart */}
                <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm">Engagement Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        delivered: {
                          label: "Delivered",
                          color: "hsl(var(--primary))",
                        },
                        viewed: {
                          label: "Viewed",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <AreaChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="delivered" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                        <Area type="monotone" dataKey="viewed" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.2} strokeWidth={2} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recipients Tab */}
            {activePerformanceTab === "recipients" && (
              <div className="space-y-4">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search recipients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-sm w-full border border-input rounded-md bg-background focus:outline-none transition-color"
                    data-testid="input-search-recipients"
                  />
                </div>
                <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                  <CardContent className="pt-2">
                    <ScrollArea className="h-96">
                      <div className="overflow-x-auto mt-6">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Phone</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recipients.map((recipient) => (
                              <tr key={recipient.id} className="border-b hover:bg-muted/50" data-testid={`recipient-${recipient.id}`}>
                                <td className="py-2 px-3 font-medium">{recipient.name}</td>
                                <td className="py-2 px-3">{recipient.phone}</td>
                                <td className="py-2 px-3">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    recipient.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                  }`}>
                                    {recipient.status}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-muted-foreground">{recipient.time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
