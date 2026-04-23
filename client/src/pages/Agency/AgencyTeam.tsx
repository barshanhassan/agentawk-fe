import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Plus, 
  User,
  MoreHorizontal
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const AgencyTeam = () => {
  const { mode } = useTheme();
  
  const agents = [
    { email: "admin@connectagroupcorp.com", name: "John Doe", role: "Agency Owner", status: "ACTIVE" },
    { email: "ana.benini.reply@gmail.com", name: "Ana Benini", role: "new role", status: "ACTIVE" },
    { email: "dev.3@connectagroupcorp.com", name: "Jawad R", role: "Super User", status: "ACTIVE" },
    { email: "suporte.agent2@replyagent.com", name: "Jaderson Olle", role: "Super User", status: "ACTIVE" },
    { email: "developer5@replyagent.com", name: "Hassan Barshan", role: "Super User", status: "ACTIVE" },
    { email: "developer6@replyagent.com", name: "Haider Ali", role: "Super User", status: "ACTIVE" },
    { email: "bharat@replyagent.com", name: "Bharat Kat", role: "Super User", status: "ACTIVE" },
  ];

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", mode === "dark" ? "text-white" : "text-slate-900")}>
      {/* Header Section */}
      <div className={cn("flex items-center justify-between mb-8 p-4 rounded-md border shadow-sm transition-colors",
        mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded", mode === "dark" ? "bg-[#334155]" : "bg-slate-100")}>
            <Users className={cn("w-6 h-6", mode === "dark" ? "text-white" : "text-primary")} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Team agents</h1>
            <p className="text-gray-400 text-sm">Manage team agents</p>
          </div>
        </div>
        <button className={cn("px-4 py-2 rounded font-bold text-sm transition-colors flex items-center gap-2 border shadow-sm",
          mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
           Add agent
        </button>
      </div>

      {/* Agents List Card */}
      <Card className={cn("shadow-lg overflow-hidden transition-colors", 
        mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <CardContent className="p-0">
          <div className={cn("divide-y", mode === "dark" ? "divide-slate-700" : "divide-slate-100")}>
            {agents.map((agent, i) => (
              <div key={i} className={cn("flex items-center justify-between p-6 transition-colors",
                mode === "dark" ? "hover:bg-[#334155]/20" : "hover:bg-slate-50")}>
                <div className="flex items-center gap-4">
                  <Avatar className={cn("w-12 h-12 border transition-colors", 
                    mode === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100")}>
                    <AvatarFallback className="bg-transparent text-gray-400">
                      <User size={24} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={cn("text-sm font-bold", mode === "dark" ? "text-gray-100" : "text-slate-800")}>{agent.email}</p>
                    <p className="text-sm text-gray-500 font-medium">{agent.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className={cn("min-w-[120px] text-center px-4 py-1.5 rounded border text-xs font-bold transition-colors",
                    mode === "dark" ? "bg-[#1e293b] border-slate-600 text-gray-300" : "bg-slate-50 border-slate-200 text-slate-600")}>
                    {agent.role}
                  </div>
                  <div className={cn("min-w-[80px] text-center px-4 py-1.5 rounded bg-transparent border text-[10px] font-bold tracking-wider uppercase",
                    mode === "dark" ? "border-green-900/50 text-green-500" : "border-green-200 text-green-600 bg-green-50/50")}>
                    {agent.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyTeam;
