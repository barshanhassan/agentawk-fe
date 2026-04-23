import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Layout, 
  Settings, 
  BarChart3, 
  ExternalLink, 
  Cloud, 
  Smartphone, 
  ShoppingBag, 
  Users2, 
  CreditCard,
  FileText,
  ShieldCheck,
  ClipboardList,
  Layers,
  HelpCircle,
  Gavel,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/avatar-utils";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const AgencyDashboard = () => {
  const { mode } = useTheme();
  
  const stats = [
    { label: "Total of Workspaces", value: "12" },
    { label: "Agents in the Agency", value: "7" },
    { label: "Premium Support Seats", value: "0" },
  ];

  const cards = [
    // ... cards definition
    { 
      title: "Agency White Label", 
      status: "On", 
      icon: <Layout className="w-8 h-8 text-gray-400" />, 
      color: "text-green-500",
      hasExternalLink: true 
    },
    { 
      title: "SaaS", 
      status: "Off", 
      subStatus: "Coming Soon",
      icon: <Cloud className="w-8 h-8 text-gray-400" />, 
      color: "text-gray-400",
      hasExternalLink: true 
    },
    { 
      title: "Mobile App White Label", 
      status: "Off", 
      icon: <Smartphone className="w-8 h-8 text-gray-400" />, 
      color: "text-gray-400",
      hasExternalLink: true 
    },
    { 
      title: "Marketplace", 
      status: "Approved", 
      subLink: "Manage your listing",
      icon: <ShoppingBag className="w-8 h-8 text-gray-400" />, 
      color: "text-green-500",
      hasExternalLink: true 
    },
    { 
      title: "Community Access", 
      status: "Included", 
      icon: <Users2 className="w-8 h-8 text-gray-400" />, 
      color: mode === "dark" ? "text-white font-medium" : "text-slate-900 font-medium",
      hasExternalLink: true 
    },
    { 
      title: "Your Plan", 
      status: "Enterprise", 
      subStatus: "Next Payment: 2025-05-11",
      icon: <CreditCard className="w-8 h-8 text-gray-400" />, 
      color: mode === "dark" ? "text-white font-medium" : "text-slate-900 font-medium",
      hasExternalLink: true 
    },
  ];

  const activityLogs = [
    { name: "John Doe", action: "created a workspace", target: "Clonekit AI Studio Testes.", time: "2026-03-30 09:52 am", initials: "JD" },
    { name: "System", action: "Subscription upgraded from ignite-plan to enterprise-plan.", time: "2026-03-11 04:56 pm", isSystem: true },
    { name: "Jawad R", action: "created a workspace", target: "Test CSV Contacts.", time: "2026-02-02 09:40 am", initials: "JR" },
    { name: "Bharat Kat", action: "created a workspace", target: "Broadcaster.", time: "2026-01-30 04:37 pm", initials: "BK" },
    { name: "John Doe", action: "created a workspace", target: "MM Lite.", time: "2026-01-28 02:57 pm", initials: "JD" },
    { name: "Haider Ali", action: "created a workspace", target: "Workspace One testing.", time: "2025-12-22 06:17 am", initials: "HA" },
    { name: "Hassan Barshan", action: "created a workspace", target: "workspace2.", time: "2025-12-04 04:54 am", initials: "HB" },
    { name: "Hassan Barshan", action: "created a workspace", target: "Workspace1.", time: "2025-12-04 04:48 am", initials: "HB" },
    { name: "John Doe", action: "deleted a workspace", target: "Workspace.", time: "2025-11-25 11:22 pm", initials: "JD" },
    { name: "John Doe", action: "deleted a workspace", target: "Workspace Jaderson5.", time: "2025-11-25 11:18 pm", initials: "JD" },
  ];

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", mode === "dark" ? "text-white" : "text-slate-900")}>
      {/* Header Section */}
      <div className={cn("flex items-center gap-4 mb-8 p-4 rounded-md border shadow-sm transition-colors", 
        mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <div className={cn("p-2 rounded", mode === "dark" ? "bg-[#334155]" : "bg-slate-100")}>
          <FileText className={cn("w-6 h-6", mode === "dark" ? "text-white" : "text-primary")} />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome to your agency account!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Stats + Cards */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className={cn("text-4xl font-bold", mode === "dark" ? "text-white" : "text-slate-900")}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, i) => (
              <Card key={i} className={cn("shadow-lg min-h-[160px] flex flex-col justify-between p-4 transition-colors",
                mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
                <div className="flex justify-between items-start">
                  <span className={cn("text-sm font-medium", mode === "dark" ? "text-gray-300" : "text-slate-600")}>{card.title}</span>
                  {card.hasExternalLink && <ExternalLink className="w-4 h-4 text-gray-500 cursor-pointer hover:text-primary transition-colors" />}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className={cn("p-3 rounded-lg transition-colors", mode === "dark" ? "bg-[#334155]" : "bg-slate-50")}>
                    {card.icon}
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${card.color}`}>{card.status}</p>
                    {card.subStatus && <p className="text-xs text-gray-400 mt-1">{card.subStatus}</p>}
                    {card.subLink && <p className="text-xs text-blue-500 mt-1 cursor-pointer hover:underline">{card.subLink} <ExternalLink className="inline w-3 h-3" /></p>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Activity Log */}
        <div className="xl:col-span-4">
          <Card className={cn("shadow-lg h-full transition-colors", 
            mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
            <CardHeader className={cn("border-b pb-4", mode === "dark" ? "border-slate-700" : "border-slate-100")}>
              <CardTitle className={cn("text-lg font-semibold", mode === "dark" ? "text-white" : "text-slate-900")}>Latest 10 Activity logs from your Agency</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 px-4">
              <div className="space-y-6">
                {activityLogs.map((log, i) => (
                  <div key={i} className={cn("flex flex-col gap-2 pb-4 border-b last:border-0 last:pb-0", 
                    mode === "dark" ? "border-slate-700" : "border-slate-100")}>
                    {log.isSystem ? (
                      <div className="flex flex-col">
                        <p className={cn("text-sm leading-snug", mode === "dark" ? "text-gray-300" : "text-slate-700")}>{log.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{log.time}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <p className={cn("text-sm leading-snug", mode === "dark" ? "text-gray-300" : "text-slate-700")}>
                            <span className="font-bold">{log.name}</span> {log.action} <span className="font-bold">{log.target}</span>
                          </p>
                          <Avatar className="w-6 h-6 shrink-0 ml-2">
                            <AvatarFallback className={`${getAvatarColor(log.name)} text-[10px] font-bold text-white`}>
                              {log.initials}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-xs text-gray-500">{log.time}</span>
                           <span className="text-xs text-gray-400 font-medium">● {log.name}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;
