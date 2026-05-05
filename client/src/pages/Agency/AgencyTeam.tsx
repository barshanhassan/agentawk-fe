import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Plus, 
  User,
  MoreHorizontal
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";


import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import AddAgentForm from "./AddAgentForm";

const AgencyTeam = () => {
  const { mode } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const agencyId = userInfo.modelable_id || "7";

  const { data: membersResponse, isLoading } = useQuery({
    queryKey: [`/api/agencies/${agencyId}/members`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}/members`);
      return res.json();
    }
  });

  const agents = (membersResponse?.members || []).map((m: any) => ({
    id: m.id,
    email: m.email,
    name: `${m.first_name || ''} ${m.last_name || ''}`.trim() || m.email,
    role: m.role || "Agent",
    status: m.status?.toUpperCase() || "ACTIVE"
  }));


  if (showAddForm) {
    return <AddAgentForm onCancel={() => setShowAddForm(false)} />;
  }

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", mode === "dark" ? "text-white" : "text-slate-900")}>
      <div className={cn("rounded-lg border overflow-hidden shadow-sm transition-colors flex flex-col w-full",
        mode === "dark" ? "bg-[#1e293b] border-slate-600" : "bg-white border-slate-300")}>
        
        {/* Header Section Inside Card */}
        <div className="flex items-center justify-between p-5 pb-3 transition-colors">
          <div className="flex items-center gap-3">
            <div className={cn("p-1 rounded-lg transition-colors")}>
              <Users className={cn("w-6 h-6", mode === "dark" ? "text-slate-300" : "text-slate-800")} />
            </div>
            <div>
              <h1 className={cn("text-[15px] font-bold tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>Team agents</h1>
              <p className={cn("text-[12px] font-bold mt-0.5", mode === "dark" ? "text-slate-300" : "text-slate-700")}>Manage the people who have access to your agency dashboard.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className={cn("px-5 py-1.5 rounded text-[12px] font-medium transition-colors border flex items-center gap-2",
              mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}
          >
             <Plus size={14} /> Add Agent
          </button>
        </div>

        {/* Filter Bar Inside Card */}
        <div className="px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-3 transition-colors border-t border-slate-300 dark:border-slate-600">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                placeholder="Search" 
                className={cn("pl-10 h-9 w-full text-[12px] font-bold focus-visible:ring-1 focus-visible:ring-green-500 transition-colors rounded border outline-none",
                  mode === "dark" ? "bg-[#0f172a] border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900")} 
              />
            </div>
            <button className={cn("px-4 h-8 rounded text-[11px] font-bold transition-all border",
              mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>Search</button>
          </div>
        </div>

        {/* List Content */}
        <div className={cn("flex flex-col min-h-[300px]", mode === "dark" ? "divide-slate-700" : "divide-slate-100")}>
          {agents.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {agents.map((agent: any, i: number) => (
                <div key={i} className={cn("flex items-center justify-between px-6 py-4 transition-colors",
                  mode === "dark" ? "hover:bg-[#334155]/20" : "hover:bg-slate-50/50")}>
                  <div className="flex items-center gap-4">
                    <Avatar className={cn("w-10 h-10 border transition-colors", 
                      mode === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200")}>
                      <AvatarFallback className="bg-transparent text-slate-300">
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className={cn("text-[14px] font-bold tracking-tight", mode === "dark" ? "text-gray-100" : "text-slate-900")}>{agent.email}</p>
                      <p className="text-[12px] text-gray-400 font-medium">{agent.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className={cn("px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors",
                      mode === "dark" ? "bg-[#1e293b] border-slate-600 text-gray-300" : "bg-slate-50 border-slate-200 text-slate-700")}>
                      {agent.role}
                    </div>
                    <div className={cn("min-w-[80px] text-center px-4 py-1 rounded bg-transparent border text-[10px] font-bold tracking-wider uppercase",
                      mode === "dark" ? "border-green-900/50 text-green-500" : "border-green-500/20 text-green-600 bg-green-50/50")}>
                      {agent.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors border-2",
                mode === "dark" ? "bg-slate-800 border-slate-700" : "bg-green-50 border-green-100")}>
                <Users size={32} className="text-green-500 opacity-40" />
              </div>
              <h3 className={cn("text-[15px] font-bold mb-1", mode === "dark" ? "text-white" : "text-slate-900")}>No agents found</h3>
              <p className={cn("text-[12px] text-center max-w-sm mb-6 font-bold", mode === "dark" ? "text-slate-300" : "text-slate-700")}>
                You haven't added any team agents yet. Add agents to help you manage your agency.
              </p>
              <button 
                onClick={() => setShowAddForm(true)}
                className={cn("px-6 py-2 rounded text-[12px] font-bold transition-colors border flex items-center gap-2 shadow-sm",
                  mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}
              >
                 Add Agent
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyTeam;
