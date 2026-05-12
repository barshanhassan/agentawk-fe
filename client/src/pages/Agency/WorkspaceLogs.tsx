import React, { useState, useEffect } from 'react';
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
  const userInfo = getUserInfo();
  const agencyId = userInfo.modelable_id;

  const [selectedWorkspace, setSelectedWorkspace] = useState(t("agency.auditLogs.filters.all_workspaces"));
  const [selectedDate, setSelectedDate] = useState(t("agency.auditLogs.filters.today"));
  const [selectedAgent, setSelectedAgent] = useState(t("agency.logs.filters.all_agents"));
  const [page, setPage] = useState(1);

  // Force hide all scrollbars for this page
  useEffect(() => {
    const targets: { el: HTMLElement; orig: string }[] = [];

    const hide = (el: HTMLElement | null) => {
      if (!el) return;
      targets.push({ el, orig: el.style.overflowY });
      el.style.overflowY = 'hidden';
    };

    hide(document.documentElement as HTMLElement);
    hide(document.body);

    let node = document.querySelector('main') as HTMLElement | null;
    while (node) {
      hide(node);
      node = node.parentElement as HTMLElement | null;
    }

    return () => {
      targets.forEach(({ el, orig }) => { el.style.overflowY = orig; });
    };
  }, []);

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
  const dark = mode === 'dark';

  const bg     = dark ? 'bg-[#0b1120]'  : 'bg-slate-50/80';
  const card   = dark ? 'bg-[#0f1829]'  : 'bg-white';
  const border = dark ? 'border-slate-800' : 'border-slate-200';
  const text   = dark ? 'text-white'    : 'text-slate-900';
  const sub    = dark ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={cn("h-screen overflow-hidden transition-colors flex flex-col font-sans", bg)}>
      
      {/* ── Header Card ── */}
      <div className={cn('px-8 py-5 border-b flex items-center justify-between', card, border)}>
        <div className="flex items-center gap-4">
          <div className={cn('p-2.5 rounded-xl shadow-sm', dark ? 'bg-primary/15' : 'bg-primary/10')}>
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className={cn('text-[15px] font-bold', text)}>Workspace Logs</h1>
            <p className={cn('text-[11px] mt-0.5', sub)}>
              {total} total workspace activities recorded
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-8">
        {/* Unified Main Card - Restricted height to match viewport and made compact */}
        <div className={cn("flex rounded-2xl border overflow-hidden shadow-sm h-full max-h-[calc(100vh-220px)]", card, border)}>
          
          {/* Left Sidebar: Filter Categories */}
          <div className={cn("w-72 border-r flex flex-col shrink-0 h-full", border)}>
            <div className={cn("p-4 border-b bg-slate-50/50 dark:bg-slate-900/30", border)}>
              <h2 className={cn("text-[11px] font-bold uppercase tracking-widest", sub)}>Categories</h2>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
              {logCategories.map((category, i) => (
                <div key={i} className={cn("flex items-center gap-3 p-3.5 border-b last:border-0 transition-colors cursor-pointer group", 
                  dark ? "hover:bg-slate-800/25 border-slate-800/50" : "hover:bg-slate-50 border-slate-100")}>
                  <Checkbox id={`cat-${i}`} className="border-slate-300 data-[state=checked]:bg-primary shrink-0" />
                  <label htmlFor={`cat-${i}`} className={cn("text-[12px] font-medium group-hover:text-primary cursor-pointer select-none transition-colors", 
                    dark ? "text-slate-400" : "text-slate-600")}>
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Filters + Logs Table */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            
            {/* Integrated Top Filters Bar */}
            <div className={cn("px-6 py-3 border-b flex items-center gap-8 transition-colors bg-slate-50/30 dark:bg-slate-900/10", border)}>
              
              {/* Workspace Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className={cn("flex items-center gap-2 cursor-pointer hover:text-primary transition-colors", text)}>
                    <Layers size={16} className="text-primary opacity-70" />
                    <span className="text-[12px] font-bold">{selectedWorkspace}</span>
                    <ChevronDown size={14} className="opacity-40" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className={cn("w-64", dark ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                  {workspaces.map((ws) => (
                    <DropdownMenuItem key={ws} onClick={() => setSelectedWorkspace(ws)} className="cursor-pointer text-[12px]">
                      {ws}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Date Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className={cn("flex items-center gap-2 cursor-pointer hover:text-primary transition-colors", text)}>
                    <Calendar size={16} className="text-primary opacity-70" />
                    <span className="text-[12px] font-bold">{selectedDate}</span>
                    <ChevronDown size={14} className="opacity-40" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className={cn("w-48", dark ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                  {dateRanges.map((range) => (
                    <DropdownMenuItem key={range} onClick={() => { setSelectedDate(range); setPage(1); }} className="cursor-pointer text-[12px]">
                      {range}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Logs Table Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Table Headers */}
              <div className={cn("grid grid-cols-12 px-6 py-2.5 border-b transition-colors", 
                dark ? "bg-slate-900/30 border-slate-800 text-slate-600" : "bg-slate-50/60 border-slate-100 text-slate-400")}>
                <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest">{t("agency.auditLogs.table.workspace")}</div>
                <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest">{t("agency.auditLogs.table.action_date")}</div>
                <div className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-center">{t("agency.auditLogs.table.action")}</div>
                <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-right">{t("agency.auditLogs.table.performed_by")}</div>
              </div>

              {/* Table Content */}
              <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
                {!isLoading && logs.length > 0 && (
                  <div className={cn("divide-y transition-colors", dark ? "divide-slate-800/50" : "divide-slate-50")}>
                    {logs.map((log: any, i: number) => {
                      const performer = log.user?.name || log.user?.email || "System";
                      return (
                        <div key={i} className={cn("group grid grid-cols-12 px-6 py-3.5 border-b last:border-0 transition-colors items-center", 
                          dark ? "border-slate-800 hover:bg-slate-800/25" : "border-slate-100 hover:bg-slate-50/70")}>
                          
                          <div className={cn("col-span-2 text-[13px] font-bold truncate pr-4", text)}>
                            {log.workspace?.name || "—"}
                          </div>

                          <div className="col-span-3 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 opacity-60" />
                            <div className={cn("text-[13px] font-medium truncate", sub)}>
                              {log.created_at ? format(new Date(log.created_at), "yyyy-MM-dd hh:mm a") : "N/A"}
                            </div>
                          </div>

                          <div className={cn("col-span-4 text-[13px] text-center font-bold px-4", text)}>
                            {log.action || log.message}
                          </div>

                          <div className="col-span-3 text-right flex items-center justify-end gap-2 pr-1">
                            <div className={cn("text-[13px] font-bold truncate max-w-[120px]", dark ? "text-slate-400" : "text-slate-700")}>
                              {performer}
                            </div>
                            <Avatar className="w-7 h-7 shrink-0 border border-slate-100 dark:border-slate-800">
                              <AvatarFallback className={`${getAvatarColor(performer)} text-[10px] font-black text-white`}>
                                {performer.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {!isLoading && logs.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3", dark ? "bg-slate-800" : "bg-slate-50")}>
                      <Layers className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className={cn("text-[13px] font-bold", text)}>{t("agency.logs.table.empty")}</p>
                  </div>
                )}

                {isLoading && (
                  <div className="flex-1 flex items-center justify-center py-10">
                    <div className="flex items-center gap-2 text-slate-400 text-[13px] font-medium">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      {t("agency.auditLogs.table.loading")}
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination Footer */}
              <div className={cn("flex items-center justify-between px-6 py-4 border-t transition-colors mt-auto", 
                dark ? "bg-slate-900/20 border-slate-800" : "bg-slate-50/30 border-slate-100")}>
                <span className={cn("text-[11px] font-medium", sub)}>
                   {t("agency.auditLogs.pagination.showing", { count: logs.length, total: total })}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={cn("p-1.5 transition-colors border rounded-lg", 
                      page === 1 ? "text-slate-300 border-slate-100 dark:border-slate-800" : "text-slate-500 border-slate-200 hover:text-primary hover:border-primary dark:border-slate-700")}>
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white text-[12px] font-bold shadow-sm">
                    {page}
                  </div>
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className={cn("p-1.5 transition-colors border rounded-lg", 
                      page >= totalPages ? "text-slate-300 border-slate-100 dark:border-slate-800" : "text-slate-500 border-slate-200 hover:text-primary hover:border-primary dark:border-slate-700")}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLogs;
