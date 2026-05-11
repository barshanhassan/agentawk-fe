import React, { useState } from 'react';
import { getUserInfo } from "@/lib/auth";
import { 
  Calendar, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  ChevronDown
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { useTranslation } from 'react-i18next';

const AgencyLogs = () => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const userInfo = getUserInfo();
  const agencyId = userInfo.modelable_id;

  const [selectedDate, setSelectedDate] = useState(t("agency.logs.filters.today"));
  const [selectedAgent, setSelectedAgent] = useState(t("agency.logs.filters.all_agents"));
  const [page, setPage] = useState(1);

  const logCategories = [
    t("agency.logs.categories.workspace_created"), t("agency.logs.categories.workspace_deleted"), t("agency.logs.categories.contacts_limit_changed"),
    t("agency.logs.categories.contacts_limit_enabled"), t("agency.logs.categories.contacts_limit_disabled"), t("agency.logs.categories.subscription_upgraded"),
    t("agency.logs.categories.subscription_cancelled"), t("agency.logs.categories.whitelabel_purchased"), t("agency.logs.categories.whitelabel_cancelled"),
    t("agency.logs.categories.ai_assistants")
  ];

  const dateRanges = [
    t("agency.logs.filters.today"), 
    t("agency.logs.filters.yesterday"), 
    t("agency.logs.filters.last_7_days"), 
    t("agency.logs.filters.last_30_days")
  ];

  const { data: logsResponse, isLoading } = useQuery({
    queryKey: [`/api/agencies/${agencyId}/agency-logs`, selectedDate, page],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}/agency-logs`);
      return res.json();
    }
  });

  const { data: membersResponse } = useQuery({
    queryKey: [`/api/agencies/${agencyId}/members`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}/members`);
      return res.json();
    }
  });

  const agents = [t("agency.logs.filters.all_agents"), ...(membersResponse?.members || []).map((m: any) => m.email)];
  const logs = logsResponse?.logs || [];
  const total = logsResponse?.total || 0;
  const perPage = logsResponse?.per_page || 20;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className={cn("flex flex-col h-full font-sans transition-colors duration-300", 
      mode === "dark" ? "text-white" : "text-slate-900")}>


      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Filter Categories */}
        <div className={cn("w-72 border-r overflow-y-auto transition-colors flex flex-col", 
          mode === "dark" ? "border-slate-800" : "border-slate-300")}>
          <div className={cn("p-4 border-b h-14 flex items-center shrink-0", 
            mode === "dark" ? "border-slate-800" : "border-slate-300")}>
            <h1 className="text-sm font-bold tracking-tight">{t("agency.logs.title")}</h1>
          </div>
          <div className="flex flex-col flex-1">
            {logCategories.map((category, i) => (
              <div key={i} className={cn("flex items-center gap-3 p-4 border-b transition-colors cursor-pointer group", 
                mode === "dark" ? "hover:bg-[#1e293b] border-slate-800/50" : "hover:bg-slate-50 border-slate-200")}>
                <Checkbox id={`cat-${i}`} className="border-slate-300 data-[state=checked]:bg-green-500 shrink-0" />
                <label htmlFor={`cat-${i}`} className="text-sm font-medium text-slate-800 group-hover:text-green-600 cursor-pointer select-none transition-colors">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Filters */}
          <div className={cn("p-4 border-b h-14 flex items-center gap-8 transition-colors", 
            mode === "dark" ? "border-slate-800" : "border-slate-300")}>
            
            {/* Date Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:text-green-600 text-slate-900 transition-colors">
                  <Calendar size={18} className="text-slate-900" />
                  <span className="text-sm font-bold">{selectedDate}</span>
                  <ChevronDown size={14} className="opacity-50" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className={cn("w-48", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                {dateRanges.map((range) => (
                  <DropdownMenuItem key={range} onClick={() => { setSelectedDate(range); setPage(1); }} className="cursor-pointer hover:bg-green-50 text-green-700">
                    {range}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Agent Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:text-green-600 text-slate-900 transition-colors">
                  <Users size={18} className="text-slate-900" />
                  <span className="text-sm font-bold">{t("agency.logs.filters.select_agents")}</span>
                  <ChevronDown size={14} className="opacity-50" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className={cn("w-48", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                {agents.map((agent) => (
                  <DropdownMenuItem key={agent} onClick={() => setSelectedAgent(agent)} className="cursor-pointer hover:bg-green-50 text-green-700">
                    {agent}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table Headers */}
          <div className={cn("grid grid-cols-12 px-4 py-3 border-b transition-colors", 
            mode === "dark" ? "bg-[#1e293b]/50 border-slate-800" : "bg-white border-slate-300")}>
            <div className="col-span-3 text-[10px] font-bold text-slate-900 uppercase tracking-widest">{t("agency.logs.table.action_date")}</div>
            <div className="col-span-6 text-[10px] font-bold text-slate-900 uppercase tracking-widest text-center">{t("agency.logs.table.action")}</div>
            <div className="col-span-3 text-[10px] font-bold text-slate-900 uppercase tracking-widest text-right">{t("agency.logs.table.performed_by")}</div>
          </div>

          {/* Table Content */}
          <div className="flex-1 relative flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto flex flex-col">
              {!isLoading && logs.length > 0 && (
                <div className={cn("divide-y transition-colors", mode === "dark" ? "divide-slate-800/50" : "divide-slate-100")}>
                  {logs.map((log: any, i: number) => (
                    <div key={i} className={cn("grid grid-cols-12 px-4 py-4 transition-colors items-center", 
                      mode === "dark" ? "hover:bg-[#1e293b]/20" : "hover:bg-slate-50")}>
                      <div className="col-span-3 text-[13px] text-gray-400 font-medium">
                        {log.created_at ? format(new Date(log.created_at), "yyyy-MM-dd hh:mm a") : "N/A"}
                      </div>
                      <div className={cn("col-span-6 text-[13px] text-center font-bold", mode === "dark" ? "text-gray-300" : "text-slate-900")}>
                        {log.action || log.message}
                      </div>
                      <div className={cn("col-span-3 text-[13px] text-right font-bold", mode === "dark" ? "text-gray-300" : "text-slate-700")}>
                        {log.user?.name || log.user?.email || "System"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!isLoading && logs.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium">
                  {t("agency.logs.table.empty")}
                </div>
              )}

              {isLoading && (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium">
                  {t("agency.logs.table.loading")}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className={cn("flex items-center justify-between p-4 border-t transition-colors mt-auto", 
              mode === "dark" ? "bg-[#1e293b]/30 border-slate-800" : "bg-white border-slate-200")}>
              <span className="text-sm text-slate-500 font-medium">
                {t("agency.logs.pagination.showing", { start: logs.length === 0 ? 0 : 1, end: logs.length, total: total })}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={cn("p-1 transition-colors border rounded-md", page === 1 ? "text-slate-300 border-slate-100" : "text-slate-500 border-slate-200 hover:text-green-600 hover:border-green-600")}>
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 rounded-md bg-green-500 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                  {page}
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={cn("p-1 transition-colors border rounded-md", page >= totalPages ? "text-slate-300 border-slate-100" : "text-slate-500 border-slate-200 hover:text-green-600 hover:border-green-600")}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyLogs;
