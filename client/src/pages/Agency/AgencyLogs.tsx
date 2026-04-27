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

const AgencyLogs = () => {
  const { mode } = useTheme();
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const agencyId = userInfo.modelable_id || "1";

  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedAgent, setSelectedAgent] = useState("All Agents");
  const [page, setPage] = useState(1);

  const logCategories = [
    "Workspace created", "Workspace deleted", "Contacts limit changed",
    "Contacts limit enabled", "Contacts limit disabled", "Subscription Upgraded",
    "Subscription cancelled", "Whitelabel purchased", "White label cancelled",
    "AI Chat assistants", "Mobile app subscription purchased", "Mobile app subscription cancelled"
  ];

  const dateRanges = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days"];

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

  const agents = ["All Agents", ...(membersResponse?.members || []).map((m: any) => m.email)];
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
        <h1 className="text-lg font-bold uppercase tracking-tight">Agency Logs</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Filter Categories */}
        <div className={cn("w-72 border-r overflow-y-auto transition-colors", 
          mode === "dark" ? "border-slate-800" : "border-slate-200")}>
          <div className="flex flex-col">
            {logCategories.map((category, i) => (
              <div key={i} className={cn("flex items-center gap-3 p-4 border-b transition-colors cursor-pointer group", 
                mode === "dark" ? "hover:bg-[#1e293b] border-slate-800/50" : "hover:bg-slate-50 border-slate-100")}>
                <Checkbox id={`cat-${i}`} className="border-slate-400 data-[state=checked]:bg-primary shrink-0" />
                <label htmlFor={`cat-${i}`} className="text-sm font-bold text-gray-500 group-hover:text-primary cursor-pointer select-none transition-colors">
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

            {/* Agent Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:text-primary text-gray-400 transition-colors">
                  <Users size={18} />
                  <span className="text-sm font-bold">{selectedAgent}</span>
                  <ChevronDown size={14} className="opacity-50" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className={cn("w-48", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                {agents.map((agent) => (
                  <DropdownMenuItem key={agent} onClick={() => setSelectedAgent(agent)} className="cursor-pointer hover:bg-primary/10">
                    {agent}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table Headers */}
          <div className={cn("grid grid-cols-12 px-4 py-3 border-b transition-colors", 
            mode === "dark" ? "bg-[#1e293b]/50 border-slate-800" : "bg-slate-50 border-slate-100")}>
            <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Action Date</div>
            <div className="col-span-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Action</div>
            <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Performed By</div>
          </div>

          {/* Table Content */}
          <div className="flex-1 relative overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading logs...</div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 opacity-20">
                <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">No logs found for selected filters</span>
              </div>
            ) : (
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

            {/* Pagination */}
            <div className={cn("flex items-center justify-between p-4 border-t transition-colors", 
              mode === "dark" ? "bg-[#1e293b]/30 border-slate-800" : "bg-slate-50 border-slate-100")}>
              <span className="text-sm text-gray-400 font-medium">
                Showing {logs.length} of {total} rows
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={cn("p-1 transition-colors", page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-primary")}>
                  <ChevronLeft size={20} />
                </button>
                <button className="w-8 h-8 rounded bg-primary text-white text-sm font-bold flex items-center justify-center">{page}</button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={cn("p-1 transition-colors", page >= totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-primary")}>
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

export default AgencyLogs;
