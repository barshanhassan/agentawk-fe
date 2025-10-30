import { useState } from "react";
import { Plus, BarChart2, Edit2, Copy, Trash2 } from "react-feather";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import KPICard from "@/components/KPICard";
import StatusBadge from "@/components/StatusBadge";
import Breadcrumb from "@/components/Breadcrumb";

export default function CampaignManager() {
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
  const [performanceOpen, setPerformanceOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

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

  const getStatusType = (status: string): "success" | "warning" | "danger" | "neutral" => {
    if (status === "delivered") return "success";
    if (status === "scheduled") return "warning";
    return "neutral";
  };

  return (
    <div className="p-6 space-y-6" data-testid="campaign-manager">
      <div>
        <h1 className="text-3xl font-bold">Campaign Manager</h1>
      </div>

      <div className="flex gap-6">
        <Card className="w-56 border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["All Campaigns", "Draft", "Scheduled", "Delivered", "Archived"].map((filter) => (
              <Button
                key={filter}
                variant="ghost"
                className={`w-full justify-start hover-elevate ${
                  activeFilter === filter.toLowerCase().replace(" ", "") ? "bg-accent" : ""
                }`}
                onClick={() => setActiveFilter(filter.toLowerCase().replace(" ", ""))}
                data-testid={`filter-${filter.toLowerCase().replace(" ", "-")}`}
              >
                {filter}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="flex-1 border-t-4 border-t-primary">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Campaigns</CardTitle>
            <Button className="gap-2" onClick={() => setCreateOpen(true)} data-testid="button-create-campaign">
              <Plus size={16} />
              Create Campaign
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCampaigns.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="destructive" size="sm" data-testid="button-bulk-delete">
                  <Trash2 size={16} className="mr-2" />
                  Delete ({selectedCampaigns.length})
                </Button>
              </div>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox data-testid="checkbox-select-all" />
                    </TableHead>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Message Type</TableHead>
                    <TableHead className="text-right">Sent</TableHead>
                    <TableHead className="text-right">Delivered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id} data-testid={`campaign-row-${campaign.id}`}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCampaigns.includes(campaign.id)}
                          onCheckedChange={() => toggleCampaign(campaign.id)}
                          data-testid={`checkbox-campaign-${campaign.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={campaign.type} type="neutral" />
                      </TableCell>
                      <TableCell>{campaign.channel}</TableCell>
                      <TableCell>{campaign.messageType}</TableCell>
                      <TableCell className="text-right">{campaign.sent.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{campaign.delivered.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover-elevate"
                            onClick={() => setPerformanceOpen(true)}
                            data-testid={`button-performance-${campaign.id}`}
                          >
                            <BarChart2 size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover-elevate" data-testid={`button-edit-${campaign.id}`}>
                            <Edit2 size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover-elevate" data-testid={`button-clone-${campaign.id}`}>
                            <Copy size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover-elevate" data-testid={`button-delete-${campaign.id}`}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent data-testid="dialog-create-campaign">
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Card className="cursor-pointer hover-elevate active-elevate-2" data-testid="card-api-triggered">
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap size={24} className="text-primary" />
                </div>
                <CardTitle className="text-base">API Triggered</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">Send messages based on API calls and user actions</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover-elevate active-elevate-2" data-testid="card-broadcast">
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                  <Send size={24} className="text-chart-2" />
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

      <Dialog open={performanceOpen} onOpenChange={setPerformanceOpen}>
        <DialogContent className="max-w-5xl" data-testid="dialog-performance">
          <DialogHeader>
            <DialogTitle>Campaign Performance - Summer Sale 2024</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="performance" className="w-full">
            <TabsList>
              <TabsTrigger value="performance" data-testid="tab-performance">Performance</TabsTrigger>
              <TabsTrigger value="recipients" data-testid="tab-recipients">Recipients</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Sent" value="15,420" change={0} comparison="Total messages" />
                <KPICard title="Delivered" value="14,892" change={96.6} comparison="Delivery rate" />
                <KPICard title="Failed" value="528" change={-3.4} comparison="Failure rate" />
                <KPICard title="Viewed" value="12,453" change={83.6} comparison="View rate" />
              </div>

              <Card className="border-t-4 border-t-primary">
                <CardHeader>
                  <CardTitle>Engagement Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
                      <Line type="monotone" dataKey="delivered" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="viewed" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recipients" className="space-y-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Search recipients..." className="max-w-sm" data-testid="input-search-recipients" />
              </div>
              <Card className="border-t-4 border-t-primary">
                <ScrollArea className="h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recipients.map((recipient) => (
                        <TableRow key={recipient.id} data-testid={`recipient-${recipient.id}`}>
                          <TableCell className="font-medium">{recipient.name}</TableCell>
                          <TableCell>{recipient.phone}</TableCell>
                          <TableCell>
                            <StatusBadge
                              status={recipient.status}
                              type={recipient.status === "Delivered" ? "success" : "danger"}
                            />
                          </TableCell>
                          <TableCell className="text-muted-foreground">{recipient.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Send, Zap } from "react-feather";
