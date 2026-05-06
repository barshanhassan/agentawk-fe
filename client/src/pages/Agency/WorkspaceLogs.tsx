import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  ChevronDown
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/avatar-utils";
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

const WorkspaceLogs = () => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const agencyId = userInfo.modelable_id || "1";

  const [selectedWorkspace, setSelectedWorkspace] = useState(t("agency.auditLogs.filters.all_workspaces"));
  const [selectedDate, setSelectedDate] = useState(t("agency.auditLogs.filters.today"));
  const [selectedAgent, setSelectedAgent] = useState(t("agency.logs.filters.all_agents"));
  const [page, setPage] = useState(1);

  const logCategories = [
    t("agency.auditLogs.categories.login"), t("agency.auditLogs.categories.logout"), t("agency.auditLogs.categories.add_agent"), t("agency.auditLogs.categories.agent_joined"), 
    t("agency.auditLogs.categories.create_team"), t("agency.auditLogs.categories.update_team"), t("agency.auditLogs.categories.delete_team"), 
    t("agency.auditLogs.categories.add_team_member"), t("agency.auditLogs.categories.delete_team_member"), t("agency.auditLogs.categories.add_channel"), 
    t("agency.auditLogs.categories.delete_channel"), t("agency.auditLogs.categories.flow_created"), t("agency.auditLogs.categories.flow_updated"), 
    t("agency.auditLogs.categories.flow_deleted"), t("agency.auditLogs.categories.flow_archived"), t("agency.auditLogs.categories.flow_activated"),
    t("agency.auditLogs.categories.call_forwarding"), t("agency.auditLogs.categories.add_domain"), t("agency.auditLogs.categories.pipeline_created"),
    t("agency.auditLogs.categories.pipeline_deleted"), t("agency.auditLogs.categories.field_created"), t("agency.auditLogs.categories.change_password"),
    t("agency.auditLogs.categories.ai_assistants"), t("agency.auditLogs.categories.whitelabel_purchased"), t("agency.auditLogs.categories.whitelabel_cancelled")
  ];

  const dateRanges = [
    t("agency.auditLogs.filters.today"), 
    t("agency.auditLogs.filters.yesterday"), 
    t("agency.auditLogs.filters.last_7_days"), 
    t("agency.auditLogs.filters.last_30_days")
  ];

  const { data: workspacesResponse } = useQuery({
    queryKey: [`/api/agencies/${agencyId}/workspaces`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}/workspaces`);
      return res.json();
    }
  });

  const { data: logsResponse, isLoading } = useQuery({
    queryKey: [`/api/agencies/${agencyId}/audit-logs`, selectedDate, selectedWorkspace, page],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}/audit-logs`);
      return res.json();
    }
  });

  const workspaces = [t("agency.auditLogs.filters.all_workspaces"), ...(workspacesResponse?.workspaces || []).map((ws: any) => ws.name)];
  const logs = logsResponse?.logs || [];
  const total = logsResponse?.total || 0;
  const perPage = logsResponse?.per_page || 20;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className={cn("flex flex-col h-full font-sans transition-colors duration-300", 
      mode === "dark" ? "text-white" : "text-slate-900")}>
      {/* Title Bar */}
      <div className={cn("p-4 border-b transition-colors", 
        mode === "dark" ? "border-slate-800" : "border-slate-200")}>
        <h1 className="text-lg font-bold uppercase tracking-tight">{t("agency.auditLogs.title")}</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className={cn("w-72 border-r overflow-y-auto transition-colors", 
          mode === "dark" ? "border-slate-800" : "border-slate-200")}>
          <div className="flex flex-col">
            {logCategories.map((category, i) => (
              <div key={i} className={cn("flex items-center gap-3 p-3 border-b transition-colors cursor-pointer group", 
                mode === "dark" ? "hover:bg-[#1e293b] border-slate-800/30" : "hover:bg-slate-50 border-slate-100")}>
                <Checkbox id={`cat-${i}`} className="border-slate-400 data-[state=checked]:bg-primary shrink-0" />
                <label htmlFor={`cat-${i}`} className="text-[12px] font-bold text-gray-500 group-hover:text-primary cursor-pointer select-none transition-colors">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Filters */}
          <div className={cn("p-4 border-b flex items-center gap-8 transition-colors", 
            mode === "dark" ? "border-slate-800" : "border-slate-200")}>
            
            {/* Workspace Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:text-primary text-gray-400 transition-colors">
                  <Layers size={18} />
                  <span className={cn("text-sm font-bold", selectedWorkspace !== "All Workspaces" && "text-slate-500/80")}>
                    {selectedWorkspace}
                  </span>
                  <ChevronDown size={14} className="opacity-50" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className={cn("w-64", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                {workspaces.map((ws) => (
                  <DropdownMenuItem key={ws} onClick={() => setSelectedWorkspace(ws)} className="cursor-pointer hover:bg-primary/10">
                    {ws}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:text-primary text-gray-400 transition-colors">
                  <Calendar size={18} />
                  <span className="text-sm font-bold">{selectedDate}</span>
                  <ChevronDown size={14} className="opacity-50" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className={cn("w-48", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                {dateRanges.map((range) => (
                  <DropdownMenuItem key={range} onClick={() => { setSelectedDate(range); setPage(1); }} className="cursor-pointer hover:bg-primary/10">
                    {range}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table Headers */}
          <div className={cn("grid grid-cols-12 px-4 py-3 border-b transition-colors", 
            mode === "dark" ? "bg-[#1e293b]/50 border-slate-800" : "bg-slate-50 border-slate-100")}>
            <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t("agency.auditLogs.table.workspace")}</div>
            <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t("agency.auditLogs.table.action_date")}</div>
            <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">{t("agency.auditLogs.table.action")}</div>
            <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">{t("agency.auditLogs.table.performed_by")}</div>
          </div>

          {/* Table Content */}
          <div className="flex-1 relative overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">{t("agency.auditLogs.table.loading")}</div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 opacity-20">
                <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">{t("agency.auditLogs.table.empty")}</span>
              </div>
            ) : (
              <div className={cn("divide-y transition-colors", mode === "dark" ? "divide-slate-800/50" : "divide-slate-100")}>
                {logs.map((log: any, i: number) => {
                  const performer = log.user?.name || log.user?.email || "System";
                  return (
                    <div key={i} className={cn("grid grid-cols-12 px-4 py-4 transition-colors items-center", 
                      mode === "dark" ? "hover:bg-[#1e293b]/20" : "hover:bg-slate-50")}>
                      <div className={cn("col-span-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-700")}>
                        {log.workspace?.name || "—"}
                      </div>
                      <div className="col-span-3 text-[13px] text-gray-400 font-medium">
                        {log.created_at ? format(new Date(log.created_at), "yyyy-MM-dd hh:mm a") : "N/A"}
                      </div>
                      <div className={cn("col-span-3 text-[13px] text-center font-bold", mode === "dark" ? "text-gray-300" : "text-slate-900")}>
                        {log.action || log.message}
                      </div>
                      <div className="col-span-3 flex justify-end items-center gap-2">
                        <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-gray-300" : "text-slate-700")}>{performer}</span>
                        <Avatar className="w-6 h-6 shrink-0">
                          <AvatarFallback className={`${getAvatarColor(performer)} text-[10px] font-bold text-white`}>
                            {performer.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className={cn("flex items-center justify-between p-4 border-t transition-colors", 
              mode === "dark" ? "bg-[#1e293b]/30 border-slate-800" : "bg-slate-50 border-slate-100")}>
              <span className="text-sm text-gray-400 font-medium">{t("agency.auditLogs.pagination.showing", { count: logs.length, total: total })}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={cn("p-1", page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-primary")}>
                  <ChevronLeft size={20} />
                </button>
                <button className="w-8 h-8 rounded bg-primary text-white text-sm font-bold flex items-center justify-center">{page}</button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={cn("p-1", page >= totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-primary")}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default WorkspaceLogs;
