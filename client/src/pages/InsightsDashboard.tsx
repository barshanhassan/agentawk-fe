import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
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

import { DateRangeProvider, useDateRange } from "@/contexts/DateRangeContext";
import { TabProvider, useTab } from "@/contexts/TabContext";
import { ExportProvider, useExport } from "@/contexts/ExportContext";

import OverviewTab from "@/components/tabs/OverviewTab";
import AgentPerformanceTab from "@/components/tabs/agent-performance/AgentPerformanceTab";
import WhatsAppPricingTab from "@/components/tabs/whatsapp-pricing/WhatsAppPricingTab";
import BotDashboardTab from "@/components/tabs/BotDashboardTab";
import VoiceOfCustomerTab from "@/components/tabs/voice-of-customer/VoiceOfCustomerTab";
import CSATDashboardTab from "@/components/tabs/csat-dashboard/CSATDashboardTab";
import ExportModal from "@/components/ExportModal";

function InsightsDashboardContent() {
  const { dateRange, setDateRange, customDate, setCustomDate, isCustomDateOpen, setIsCustomDateOpen } = useDateRange();
  const { activeTab, setActiveTab } = useTab();
  const { isExportModalOpen, setIsExportModalOpen } = useExport();

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
            <SelectContent className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)]">
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
            className="gap-2 hover-elevate [border-color:hsl(var(--input))]"
            data-testid="export-button"
          >
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2 bg-slate-200/75">
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

          <TabsTrigger value="agent-performance" data-testid="tab-agent-performance" className="relative" onClick={() => setActiveTab("agentPerformance")}>
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

          <TabsTrigger value="whatsapp-pricing" data-testid="tab-whatsapp-pricing" className="relative" onClick={() => setActiveTab("whatsapp")}>
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

          <TabsTrigger value="voice-of-customer" data-testid="tab-voice-of-customer" className="relative" onClick={() => setActiveTab("voiceOfCustomer")}>
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

          <TabsTrigger value="csat-dashboard" data-testid="tab-csat-dashboard" className="relative" onClick={() => setActiveTab("csatDashboard")}>
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
          <OverviewTab />
        </TabsContent>

        <TabsContent value="agent-performance" className="space-y-6">
          <AgentPerformanceTab />
        </TabsContent>

        <TabsContent value="whatsapp-pricing" className="space-y-6">
          <WhatsAppPricingTab />
        </TabsContent>

        <TabsContent value="bot-dashboard" className="space-y-6">
          <BotDashboardTab />
        </TabsContent>

        <TabsContent value="voice-of-customer" className="space-y-6">
          <VoiceOfCustomerTab />
        </TabsContent>

        <TabsContent value="csat-dashboard" className="space-y-6">
          <CSATDashboardTab />
        </TabsContent>
      </Tabs>
      <ExportModal />
    </div>
  );
}

export default function InsightsDashboard() {
  return (
    <DateRangeProvider>
      <TabProvider>
        <ExportProvider>
          <InsightsDashboardContent />
        </ExportProvider>
      </TabProvider>
    </DateRangeProvider>
  );
}
