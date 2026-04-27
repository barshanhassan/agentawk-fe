import React from 'react';
import { 
  Calendar, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Search,
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

const AgencyLogs = () => {
  const { mode } = useTheme();
  
  const logCategories = [
    "Workspace created",
    "Workspace deleted",
    "Contacts limit changed",
    "Contacts limit enabled",
    "Contacts limit disabled",
    "Subscription Upgraded",
    "Subscription cancelled",
    "Whitelabel purchased",
    "White label cancelled",
    "AI Chat assistants",
    "Mobile app subscription purchased",
    "Mobile app subscription cancelled"
  ];
  
  const [selectedWorkspace, setSelectedWorkspace] = React.useState("Byte Digital Internet & Marketing");
  const [selectedDate, setSelectedDate] = React.useState("Today");
  const [selectedAgent, setSelectedAgent] = React.useState("Select agents");

  const workspaces = [
    "Byte Digital Internet & Marketing",
    "Agency Main Workspace",
    "Client Alpha Workspace",
    "Global Partners"
  ];

  const dateRanges = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Custom Range"];
  const agents = ["All Agents", "Admin User", "Support Staff", "Marketing Lead"];

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

        {/* Right Main Content: Logs Table */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Table Filters */}
          <div className={cn("p-4 border-b flex items-center gap-8 transition-colors", 
            mode === "dark" ? "border-slate-800" : "border-slate-200")}>
            
            {/* Workspace Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:text-primary text-gray-400 transition-colors">
                  <Layers size={18} />
                  <span className={cn("text-sm font-bold", selectedWorkspace !== "All" && "text-slate-500/80")}>
                    {selectedWorkspace}
                  </span>
                  <ChevronDown size={14} className="opacity-50" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className={cn("w-64", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                {workspaces.map((ws) => (
                  <DropdownMenuItem 
                    key={ws} 
                    onClick={() => setSelectedWorkspace(ws)}
                    className="cursor-pointer hover:bg-primary/10"
                  >
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
                  <DropdownMenuItem 
                    key={range} 
                    onClick={() => setSelectedDate(range)}
                    className="cursor-pointer hover:bg-primary/10"
                  >
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
                  <DropdownMenuItem 
                    key={agent} 
                    onClick={() => setSelectedAgent(agent)}
                    className="cursor-pointer hover:bg-primary/10"
                  >
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

          {/* Empty State / Table Content */}
          <div className="flex-1 relative overflow-auto">
            <div className={cn("flex items-center justify-between p-4 transition-colors", 
              mode === "dark" ? "bg-[#1e293b]/30" : "bg-slate-50/50")}>
               <span className="text-sm text-gray-400 font-medium">Showing 0 to 0 of 0 rows</span>
               <div className="flex items-center gap-2">
                 <button className="p-1 text-gray-300 cursor-not-allowed"><ChevronLeft size={20} /></button>
                 <button className="w-8 h-8 rounded bg-primary text-white text-sm font-bold flex items-center justify-center">1</button>
                 <button className="p-1 text-gray-300 cursor-not-allowed"><ChevronRight size={20} /></button>
               </div>
            </div>
            
            {/* No Data Placeholder */}
            <div className="flex flex-col items-center justify-center h-64 opacity-20">
               <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">No logs found for selected filters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyLogs;
