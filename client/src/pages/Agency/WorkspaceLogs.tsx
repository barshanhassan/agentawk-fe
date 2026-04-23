import React from 'react';
import { 
  Calendar, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Layers
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/avatar-utils";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const WorkspaceLogs = () => {
  const { mode } = useTheme();
  const logCategories = [
    "Agent logged in", "Logged out", "Added agent", "Agent joined", 
    "Created a team", "Updated a team", "Deleted a team", 
    "Added team member", "Deleted team member", "Added a channel", 
    "Deleted a channel", "Smart Flow created", "Smart Flow updated", 
    "Smart Flow deleted", "Smart Flow archived", "Smart Flow activated",
    "Changed call forwarding", "Added a domain", "pipeline created",
    "pipeline deleted", "Custom field created", "Changed password",
    "AI Chat assistants", "Purchased White Label", "Cancelled white label"
  ];

  const logs = [
    { workspace: "Byte Digital Internet & Marketing", date: "2026-04-23 03:41 am", action: "Logged in", performer: "Hassan Barshan" },
    { workspace: "Byte Digital Internet & Marketing", date: "2026-04-23 03:40 am", action: "Logged in", performer: "Hassan Barshan" },
    { workspace: "Byte Digital Internet & Marketing", date: "2026-04-23 03:10 am", action: "Logged out", performer: "Hassan Barshan" },
  ];

  return (
    <div className={cn("flex flex-col h-full font-sans transition-colors duration-300", 
      mode === "dark" ? "text-white" : "text-slate-900")}>
      {/* Title Bar */}
      <div className={cn("p-4 border-b transition-colors", 
        mode === "dark" ? "border-slate-800" : "border-slate-200")}>
        <h1 className="text-lg font-bold uppercase tracking-tight">Audit Logs</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Filter Categories */}
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

        {/* Right Main Content: Logs Table */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Table Filters */}
          <div className={cn("p-4 border-b flex items-center gap-8 transition-colors", 
            mode === "dark" ? "border-slate-800" : "border-slate-200")}>
            <div className="flex items-center gap-2 cursor-pointer hover:text-primary text-gray-400 transition-colors">
              <Layers size={18} />
              <span className="text-sm font-bold">Byte Digital Internet & Marketing</span>
              <ChevronRight size={14} className="rotate-90" />
            </div>

            <div className="flex items-center gap-2 cursor-pointer hover:text-primary text-gray-400 transition-colors">
              <Calendar size={18} />
              <span className="text-sm font-bold">Today</span>
              <ChevronRight size={14} className="rotate-90" />
            </div>

            <div className="flex items-center gap-2 cursor-pointer hover:text-primary text-gray-400 transition-colors">
              <Users size={18} />
              <span className="text-sm font-bold">Select agents</span>
              <ChevronRight size={14} className="rotate-90" />
            </div>
          </div>

          {/* Table Headers */}
          <div className={cn("grid grid-cols-12 px-4 py-3 border-b transition-colors", 
            mode === "dark" ? "bg-[#1e293b]/50 border-slate-800" : "bg-slate-50 border-slate-100")}>
            <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Workspace</div>
            <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Action Date</div>
            <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Action</div>
            <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Performed By</div>
          </div>

          {/* Table Content */}
          <div className="flex-1 relative overflow-auto">
            <div className={cn("divide-y transition-colors", mode === "dark" ? "divide-slate-800/50" : "divide-slate-100")}>
              {logs.map((log, i) => (
                <div key={i} className={cn("grid grid-cols-12 px-4 py-4 transition-colors items-center", 
                  mode === "dark" ? "hover:bg-[#1e293b]/20" : "hover:bg-slate-50")}>
                  <div className={cn("col-span-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-700")}>{log.workspace}</div>
                  <div className="col-span-3 text-[13px] text-gray-400 font-medium">{log.date}</div>
                  <div className={cn("col-span-3 text-[13px] text-center font-bold", mode === "dark" ? "text-gray-300" : "text-slate-900")}>{log.action}</div>
                  <div className="col-span-3 flex justify-end items-center gap-2">
                    <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-gray-300" : "text-slate-700")}>{log.performer}</span>
                    <Avatar className="w-6 h-6 shrink-0">
                      <AvatarFallback className={`${getAvatarColor(log.performer)} text-[10px] font-bold text-white`}>
                        {log.performer.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Info */}
            <div className={cn("flex items-center justify-between p-4 border-t transition-colors", 
              mode === "dark" ? "bg-[#1e293b]/30 border-slate-800" : "bg-slate-50 border-slate-100")}>
               <span className="text-sm text-gray-400 font-medium">Showing 1 to 3 of 3 rows</span>
               <div className="flex items-center gap-2">
                 <button className="p-1 text-gray-300 cursor-not-allowed"><ChevronLeft size={20} /></button>
                 <button className="w-8 h-8 rounded bg-primary text-white text-sm font-bold flex items-center justify-center">1</button>
                 <button className="p-1 text-gray-300 cursor-not-allowed"><ChevronRight size={20} /></button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default WorkspaceLogs;
