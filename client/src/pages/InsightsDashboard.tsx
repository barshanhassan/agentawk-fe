"use client";

import React, { useState } from "react";
import { Download, Calendar } from "react-feather";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

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
  const [localActiveTab, setLocalActiveTab] = useState(activeTab);

  return (
    <div className="p-6 space-y-6" data-testid="insights-dashboard">
      {/* Header with Title on left and everything else on right */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Insights Dashboard</h1>

        <div className="flex items-center gap-4">
          {/* Date Range Selector */}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]" style={{ height: "38px" }}>
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)]">
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-14-days">Last 14 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {/* Custom Date Picker */}
          {dateRange === "custom" && (
            <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 font-normal h-10 hover-elevate [border-color:hsl(var(--input))] bg-white dark:bg-background">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {customDate
                      ? customDate.to
                        ? `${customDate.from ? format(customDate.from, 'dd/MMM/yyyy') : ""} - ${customDate.to ? format(customDate.to, 'dd/MMM/yyyy') : ""}`
                        : customDate.from ? format(customDate.from, 'dd/MMM/yyyy') : ""
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

          {/* Export Button */}
          <Button
            variant="outline"
            onClick={() => setIsExportModalOpen(true)}
            className="gap-2 hover-elevate font-normal btn-outline-primary"
            data-testid="export-button"
          >
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs moved to top-right - now placed directly under the header, aligned right */}
      <div className="flex justify-start">
        <div className="bg-slate-200/75 dark:bg-slate-800 rounded-lg p-1 flex gap-0 overflow-x-auto max-w-full">
          <button
            onClick={() => {
              setLocalActiveTab("overview");
              setActiveTab("overview");
            }}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 min-w-fit ${localActiveTab === "overview"
              ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
              : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            data-testid="tab-overview"
          >
            Overview
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Platform metrics and user analytics</p>
              </TooltipContent>
            </Tooltip>
          </button>

          <button
            onClick={() => {
              setLocalActiveTab("agent-performance");
              setActiveTab("agentPerformance");
            }}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 min-w-fit ${localActiveTab === "agent-performance"
              ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
              : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            data-testid="tab-agent-performance"
          >
            Agent Performance
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Team productivity and availability metrics</p>
              </TooltipContent>
            </Tooltip>
          </button>

          <button
            onClick={() => {
              setLocalActiveTab("whatsapp-pricing");
              setActiveTab("whatsapp");
            }}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 min-w-fit ${localActiveTab === "whatsapp-pricing"
              ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
              : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            data-testid="tab-whatsapp-pricing"
          >
            WhatsApp Pricing
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Message and call costs with detailed breakdowns</p>
              </TooltipContent>
            </Tooltip>
          </button>

          <button
            onClick={() => {
              setLocalActiveTab("bot-dashboard");
              setActiveTab("botDashboard");
            }}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 min-w-fit ${localActiveTab === "bot-dashboard"
              ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
              : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            data-testid="tab-bot-dashboard"
          >
            Bot Dashboard
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Bot performance analytics and interaction insights</p>
              </TooltipContent>
            </Tooltip>
          </button>

          <button
            onClick={() => {
              setLocalActiveTab("voice-of-customer");
              setActiveTab("voiceOfCustomer");
            }}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 min-w-fit ${localActiveTab === "voice-of-customer"
              ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
              : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            data-testid="tab-voice-of-customer"
          >
            Voice of Customer
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Customer sentiment, feedback, and satisfaction insights</p>
              </TooltipContent>
            </Tooltip>
          </button>

          <button
            onClick={() => {
              setLocalActiveTab("csat-dashboard");
              setActiveTab("csatDashboard");
            }}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 min-w-fit ${localActiveTab === "csat-dashboard"
              ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
              : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            data-testid="tab-csat-dashboard"
          >
            CSAT Dashboard
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Customer satisfaction scores and agent performance metrics</p>
              </TooltipContent>
            </Tooltip>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {localActiveTab === "overview" && <OverviewTab />}
        {localActiveTab === "agent-performance" && <AgentPerformanceTab />}
        {localActiveTab === "whatsapp-pricing" && <WhatsAppPricingTab />}
        {localActiveTab === "bot-dashboard" && <BotDashboardTab />}
        {localActiveTab === "voice-of-customer" && <VoiceOfCustomerTab />}
        {localActiveTab === "csat-dashboard" && <CSATDashboardTab />}
      </div>

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