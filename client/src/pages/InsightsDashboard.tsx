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
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            Insights <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Dashboard</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Date Range Selector */}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger 
              className="w-[180px] h-[46px] rounded-xl bg-blue-50/70 dark:bg-slate-800/60 border-blue-100/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 font-semibold shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white dark:hover:bg-slate-700 hover:shadow-md no-focus-outline"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl no-focus-outline">
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
                <Button 
                  variant="outline" 
                  className="h-[46px] rounded-xl px-4 gap-2 font-semibold bg-blue-50/70 dark:bg-slate-800/60 border-blue-100/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 transition-all duration-300 hover:scale-[1.02] hover:bg-white dark:hover:bg-slate-700 hover:shadow-md"
                >
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>
                    {customDate
                      ? customDate.to
                        ? `${customDate.from ? format(customDate.from, 'dd/MMM/yyyy') : ""} - ${customDate.to ? format(customDate.to, 'dd/MMM/yyyy') : ""}`
                        : customDate.from ? format(customDate.from, 'dd/MMM/yyyy') : ""
                      : "Select Date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl" align="end">
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
            onClick={() => setIsExportModalOpen(true)}
            className="h-[46px] px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 dark:shadow-blue-500/15 transition-all duration-300 hover:scale-[1.05] hover:shadow-blue-500/40 active:scale-100 flex items-center gap-2 border-0"
            data-testid="export-button"
          >
            <Download size={18} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Tabs - Premium Design */}
      <div className="flex justify-start">
        <div className="bg-blue-50/70 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-2 flex gap-1.5 overflow-x-auto border border-blue-100/50 dark:border-slate-700/50 shadow-sm">
          {[
            { id: "overview", label: "Overview", ctx: "overview" },
            { id: "agent-performance", label: "Agent Performance", ctx: "agentPerformance" },
            { id: "whatsapp-pricing", label: "WhatsApp Pricing", ctx: "whatsapp" },
            { id: "bot-dashboard", label: "Bot Dashboard", ctx: "botDashboard" },
            { id: "voice-of-customer", label: "Voice of Customer", ctx: "voiceOfCustomer" },
            { id: "csat-dashboard", label: "CSAT Dashboard", ctx: "csatDashboard" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setLocalActiveTab(tab.id);
                setActiveTab(tab.ctx);
              }}
              className={`relative px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 flex items-center justify-center min-w-fit whitespace-nowrap ${
                localActiveTab === tab.id
                  ? "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/15 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700/60 hover:shadow-md hover:scale-[1.02] active:scale-100"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
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