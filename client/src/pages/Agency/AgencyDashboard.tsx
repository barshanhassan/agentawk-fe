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
  MessageSquare,
  BookOpen,
  Apple,
  Play,
  Zap,
  Plus,
  UserPlus,
  Eye,
  Calendar,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/avatar-utils";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";

const AgencyDashboard = () => {
  const { mode } = useTheme();
  const [, setLocation] = useLocation();
  
  const stats = [
    { label: "Total of Workspaces", value: "13", icon: <Layers size={14} className="text-gray-400" /> },
    { label: "Agents in the Agency", value: "7", icon: <Users size={14} className="text-gray-400" /> },
    { label: "Premium Support Seats", value: "0 of 5", icon: <ShieldCheck size={14} className="text-gray-400" /> },
  ];

  const featureCards = [
    { 
      title: "Agency White Label", 
      desc: "Your brand, your domain, your agency.",
      status: "ACTIVE", 
      statusColor: "text-green-500",
      icon: <Layout className="w-6 h-6 text-teal-500" />, 
      action: "Configure",
      href: "/agency/settings/white-label"
    },
    { 
      title: "SaaS Mode", 
      desc: "Offer ReplyAgent as a subscription product.",
      status: "COMING SOON", 
      statusColor: "text-orange-500",
      icon: <Cloud className="w-6 h-6 text-blue-500" />, 
      action: "Join waitlist",
      href: "/agency/saas/api"
    },
    { 
      title: "Mobile App White Label", 
      desc: "Publish a branded mobile app for clients.",
      status: "INACTIVE", 
      statusColor: "text-gray-400",
      icon: <Smartphone className="w-6 h-6 text-purple-500" />, 
      action: "Enable",
      href: "/agency/settings/white-label"
    },
    { 
      title: "Marketplace", 
      desc: "List your services and integrations for users.",
      status: "APPROVED", 
      statusColor: "text-green-500",
      icon: <ShoppingBag className="w-6 h-6 text-orange-500" />, 
      action: "Manage listing",
      href: "/agency/workspaces"
    },
    { 
      title: "Community Access", 
      desc: "Network with 10,000+ agency operators.",
      status: "INCLUDED", 
      statusColor: "text-blue-500",
      icon: <Users2 className="w-6 h-6 text-pink-500" />, 
      action: "Open community",
      href: "/agency/help"
    },
    { 
      title: "Your Plan", 
      desc: "Enterprise — Next billing: 2026-05-11.",
      status: "ENTERPRISE", 
      statusColor: "text-teal-500",
      icon: <Settings className="w-6 h-6 text-teal-500" />, 
      action: "View plan details",
      href: "/agency/billing/plans"
    },
  ];

  const quickActions = [
    { label: "Create workspace", sub: "Set up a new client workspace.", icon: <Plus size={18} className="text-blue-500" />, href: "/agency/workspaces" },
    { label: "Invite team member", sub: "Add agents to your agency.", icon: <UserPlus size={18} className="text-teal-500" />, href: "/agency/team" },
    { label: "Agency settings", sub: "Branding, domains, billing.", icon: <Settings size={18} className="text-gray-500" />, href: "/agency/settings/general" },
    { label: "View audit logs", sub: "Track every change in real time.", icon: <Eye size={18} className="text-purple-500" />, href: "/agency/audit-logs/agency" },
  ];

  const activityLogs = [
    { name: "Haider Ali", action: "created a workspace", target: "Haider Workspace.", time: "2026-04-17 10:14 am", initials: "HA" },
    { name: "John Doe", action: "created a workspace", target: "Clonekit AI Studio Testes.", time: "2026-03-30 09:52 am", initials: "JD" },
    { name: "System", action: "Subscription upgraded from ignite-plan to enterprise-plan.", time: "2026-03-11 04:56 pm", isSystem: true },
    { name: "Jawad R", action: "created a workspace", target: "Test CSV Contacts.", time: "2026-02-02 09:40 am", initials: "JR" },
    { name: "Bharat Kat", action: "created a workspace", target: "Broadcaster.", time: "2026-01-30 04:37 pm", initials: "BK" },
  ];

  return (
    <div className={cn("p-8 font-sans transition-colors duration-500 min-h-screen", 
      mode === "dark" ? "bg-[#0f172a] text-white" : "bg-slate-50 text-slate-900")}>
      
      {/* Top Greeting & Date Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
             <span className="text-xl">👋</span>
             <h1 className="text-2xl font-black tracking-tight">Good afternoon, EZCONN team!</h1>
          </div>
          <p className="text-gray-400 text-sm font-medium mt-1">Here's what's happening across your agency today.</p>
        </div>
        <div className={cn("px-4 py-2 rounded-xl border flex items-center gap-3 shadow-sm transition-colors",
          mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
          <Calendar size={16} className="text-teal-500" />
          <span className="text-xs font-bold tracking-tight">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Documentation Card */}
            <Card className={cn("border-none shadow-xl rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] duration-300", 
              mode === "dark" ? "bg-amber-500/10" : "bg-amber-50")}>
              <CardContent className="p-6">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors", 
                  mode === "dark" ? "bg-amber-500/20" : "bg-white shadow-sm")}>
                  <BookOpen className="text-amber-500 w-5 h-5" />
                </div>
                <h3 className={cn("text-lg font-bold mb-2", mode === "dark" ? "text-amber-100" : "text-amber-900")}>Documentation</h3>
                <p className={cn("text-sm mb-6 leading-relaxed opacity-80", mode === "dark" ? "text-amber-200/70" : "text-amber-800/70")}>
                  Explore ReplyAgent features, APIs, and integrations in one place.
                </p>
                <button 
                  onClick={() => window.open('https://docs.replyagent.com', '_blank')}
                  className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95",
                  mode === "dark" ? "bg-amber-500 text-white" : "bg-amber-500 text-white")}>
                  Open docs ↗
                </button>
              </CardContent>
            </Card>

            {/* Mobile App Card */}
            <Card className={cn("border-none shadow-xl rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] duration-300", 
              mode === "dark" ? "bg-blue-500/10" : "bg-blue-50")}>
              <CardContent className="p-6">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors", 
                  mode === "dark" ? "bg-blue-500/20" : "bg-white shadow-sm")}>
                  <Smartphone className="text-blue-500 w-5 h-5" />
                </div>
                <h3 className={cn("text-lg font-bold mb-2", mode === "dark" ? "text-blue-100" : "text-blue-900")}>ReplyAgent Mobile</h3>
                <p className={cn("text-sm mb-6 leading-relaxed opacity-80", mode === "dark" ? "text-blue-200/70" : "text-blue-800/70")}>
                  Manage conversations on the go — available for iOS and Android.
                </p>
                <div className="flex gap-2">
                  <button onClick={() => window.open('#', '_blank')} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold shadow-sm active:scale-95">iOS</button>
                  <button onClick={() => window.open('#', '_blank')} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold shadow-sm active:scale-95">Android</button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Row (Dark Banner) */}
          <div className={cn("rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-2xl transition-colors",
            mode === "dark" ? "bg-[#1e293b] border border-slate-800" : "bg-[#0f172a]")}>
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                   {stat.icon}
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
                </div>
                <span className="text-3xl font-black text-white tracking-tighter leading-none">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tight">Agency features</h2>
              <button 
                onClick={() => setLocation('/agency/settings/general')}
                className="text-teal-500 text-xs font-bold hover:underline"
              >
                Manage all ↗
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((feature, i) => (
                <Card 
                  key={i} 
                  onClick={() => setLocation(feature.href)}
                  className={cn("group border transition-all duration-500 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-teal-500/30 cursor-pointer",
                  mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-100 shadow-sm")}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn("p-2.5 rounded-xl transition-colors", mode === "dark" ? "bg-slate-800" : "bg-slate-50")}>
                        {feature.icon}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                          feature.status === "ACTIVE" || feature.status === "APPROVED" || feature.status === "ENTERPRISE" ? "bg-green-500" : 
                          feature.status === "COMING SOON" ? "bg-orange-500" : "bg-gray-400")} />
                        <span className={cn("text-[9px] font-black tracking-widest uppercase", feature.statusColor)}>
                          {feature.status}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-black text-[15px] mb-2 tracking-tight group-hover:text-teal-500 transition-colors">{feature.title}</h4>
                    <p className="text-[11px] text-gray-500 font-medium mb-6 leading-relaxed line-clamp-2">{feature.desc}</p>
                    <button className={cn("mt-auto text-[11px] font-bold text-left hover:underline w-fit", 
                      mode === "dark" ? "text-teal-400" : "text-teal-600")}>
                      {feature.action}
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Plan Summary Card (Dark) */}
          <Card className={cn("border-none shadow-2xl rounded-2xl overflow-hidden bg-[#0f172a] text-white")}>
            <CardContent className="p-8">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">ENTEPRISE PLAN</span>
               </div>
               <h3 className="text-2xl font-black mb-1 tracking-tighter leading-none">Enterprise</h3>
               <p className="text-gray-500 text-xs font-bold mb-6 italic">Next Payment: 2026-05-11</p>
               
               <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-gray-400">Workspaces used</span>
                    <span className="text-xs font-black">13 / 999</span>
                  </div>
                  <Progress value={(13/999)*100} className="h-1.5 bg-slate-800" indicatorClassName="bg-teal-500" />
               </div>

               <div className="flex gap-2">
                 <button onClick={() => setLocation('/agency/billing/plans')} className="flex-1 h-10 bg-white text-slate-900 font-black text-[11px] uppercase tracking-wider rounded-lg transition-transform active:scale-95">Upgrade</button>
                 <button onClick={() => setLocation('/agency/billing/manage')} className="flex-1 h-10 bg-slate-800 text-white font-black text-[11px] uppercase tracking-wider rounded-lg transition-transform active:scale-95">Billing</button>
               </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
               <Zap className="text-orange-500 w-5 h-5 fill-orange-500/20" />
               <h2 className="text-lg font-black tracking-tight">Quick actions</h2>
            </div>
            <div className="space-y-3">
              {quickActions.map((action, i) => (
                <div 
                  key={i} 
                  onClick={() => setLocation(action.href)}
                  className={cn("p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group shadow-sm",
                  mode === "dark" ? "bg-[#1e293b] border-slate-800 hover:border-teal-500/30" : "bg-white border-slate-100 hover:border-teal-500/30")}>
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:bg-teal-500/10",
                      mode === "dark" ? "bg-slate-800" : "bg-slate-50")}>
                      {action.icon}
                    </div>
                    <div>
                       <p className="text-sm font-black tracking-tight leading-tight mb-0.5">{action.label}</p>
                       <p className="text-[10px] text-gray-500 font-medium">{action.sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-teal-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-2">
                  <Clock className="text-blue-500 w-5 h-5" />
                  <h2 className="text-lg font-black tracking-tight">Recent activity</h2>
               </div>
               <Badge className="bg-green-500/10 text-green-500 border-none font-black text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                 <div className="w-1 h-1 rounded-full bg-green-500" /> LIVE
               </Badge>
            </div>
            
            <Card className={cn("shadow-xl rounded-2xl overflow-hidden border transition-colors", 
              mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-100")}>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {activityLogs.map((log, i) => (
                    <div key={i} className="flex gap-4 group">
                      <Avatar className="w-9 h-9 border-2 border-transparent group-hover:border-teal-500/30 transition-all">
                        <AvatarFallback className={cn("text-[11px] font-black text-white shadow-lg", getAvatarColor(log.name))}>
                          {log.initials || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className={cn("text-[13px] leading-snug font-medium", mode === "dark" ? "text-gray-300" : "text-slate-700")}>
                           <span className="font-black text-white dark:text-white transition-colors group-hover:text-teal-500">{log.name}</span> {log.action} <span className="font-black italic">{log.target}</span>
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium mt-1 flex items-center gap-2">
                           {log.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-teal-500 hover:border-teal-500/30 transition-all">
                    View all activity
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;
