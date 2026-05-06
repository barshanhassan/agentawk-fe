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
import { useTranslation } from 'react-i18next';

const AgencyDashboard = () => {
  const { mode } = useTheme();
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("agency.dashboard.greeting.morning");
    if (hour < 17) return t("agency.dashboard.greeting.afternoon");
    return t("agency.dashboard.greeting.evening");
  };

  const stats = [
    { label: t("agency.dashboard.stats.workspaces"), value: "13", icon: <Layers size={14} className="text-gray-400" /> },
    { label: t("agency.dashboard.stats.agents"), value: "7", icon: <Users size={14} className="text-gray-400" /> },
    { label: t("agency.dashboard.stats.support"), value: "0 of 0", icon: <ShieldCheck size={14} className="text-gray-400" /> },
  ];

  const featureCards = [
    { 
      title: t("agency.dashboard.features.whiteLabel.title"), 
      desc: t("agency.dashboard.features.whiteLabel.desc"),
      status: t("common.active"), 
      statusColor: "text-green-500",
      icon: <Layout className="w-6 h-6 text-teal-500" />, 
      action: t("common.manage"),
      href: "/agency/settings/white-label"
    },
    { 
      title: t("agency.dashboard.features.saas.title"), 
      desc: t("agency.dashboard.features.saas.desc"),
      status: t("common.comingSoon"), 
      statusColor: "text-orange-500",
      icon: <Cloud className="w-6 h-6 text-blue-500" />, 
      action: t("common.joinWaitlist"),
      href: "/agency/saas/plans"
    },
    { 
      title: t("agency.dashboard.features.marketplace.title"), 
      desc: t("agency.dashboard.features.marketplace.desc"),
      status: t("common.approved"), 
      statusColor: "text-green-500",
      icon: <ShoppingBag className="w-6 h-6 text-orange-500" />, 
      action: t("common.manageListing"),
      href: "/agency/workspaces"
    },
    { 
      title: t("agency.dashboard.features.community.title"), 
      desc: t("agency.dashboard.features.community.desc"),
      status: t("common.included"), 
      statusColor: "text-blue-500",
      icon: <Users2 className="w-6 h-6 text-pink-500" />, 
      action: t("common.openCommunity"),
      href: "/agency/help"
    },
    { 
      title: t("agency.dashboard.features.plan.title"), 
      desc: t("agency.dashboard.features.plan.desc"),
      status: t("common.enterprise"), 
      statusColor: "text-teal-500",
      icon: <Settings className="w-6 h-6 text-teal-500" />, 
      action: t("common.viewPlanDetails"),
      href: "/agency/billing/plans"
    },
  ];

  const quickActions = [
    { label: t("agency.dashboard.quickActions.createWorkspace.title"), sub: t("agency.dashboard.quickActions.createWorkspace.sub"), icon: <Plus size={18} className="text-blue-500" />, href: "/agency/workspaces" },
    { label: t("agency.dashboard.quickActions.inviteTeam.title"), sub: t("agency.dashboard.quickActions.inviteTeam.sub"), icon: <UserPlus size={18} className="text-teal-500" />, href: "/agency/team" },
    { label: t("nav.settings"), sub: t("agency.dashboard.quickActions.settings.sub"), icon: <Settings size={18} className="text-gray-500" />, href: "/agency/settings/general" },
    { label: t("agency.dashboard.quickActions.auditLogs.title"), sub: t("agency.dashboard.quickActions.auditLogs.sub"), icon: <Eye size={18} className="text-purple-500" />, href: "/agency/audit-logs/agency" },
  ];

  const activityLogs = [
    { name: "Haider Ali", action: t("agency.dashboard.activity.actions.createdWorkspace"), target: "Haider Workspace.", time: "2026-04-17 10:14 am", initials: "HA" },
    { name: "John Doe", action: t("agency.dashboard.activity.actions.createdWorkspace"), target: "Clonekit AI Studio Testes.", time: "2026-03-30 09:52 am", initials: "JD" },
    { name: "System", action: t("agency.dashboard.activity.actions.subscriptionUpgraded"), time: "2026-03-11 04:56 pm", isSystem: true },
    { name: "Jawad R", action: t("agency.dashboard.activity.actions.createdWorkspace"), target: "Test CSV Contacts.", time: "2026-02-02 09:40 am", initials: "JR" },
    { name: "Bharat Kat", action: t("agency.dashboard.activity.actions.createdWorkspace"), target: "Broadcaster.", time: "2026-01-30 04:37 pm", initials: "BK" },
  ];

  return (
    <div className={cn("p-8 font-sans transition-colors duration-500 min-h-screen", 
      mode === "dark" ? "bg-[#0f172a] text-white" : "bg-slate-50 text-slate-900")}>
      
      {/* Top Greeting & Date Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
             <span className="text-xl">👋</span>
             <h1 className="text-2xl font-black tracking-tight">{getGreeting()}, {userInfo.first_name || "User"}!</h1>
          </div>
          <p className="text-gray-400 text-sm font-medium mt-1">{t("agency.dashboard.summary")}</p>
        </div>
        <div className={cn("px-4 py-2 rounded-xl border flex items-center gap-3 shadow-sm transition-colors",
          mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-300")}>
          <Calendar size={16} className="text-teal-500" />
          <span className="text-xs font-bold tracking-tight">{new Date().toLocaleDateString(i18n.language, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Documentation Card */}
            <Card className={cn("border-none shadow-xl rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] duration-300", 
              mode === "dark" ? "bg-amber-500/10" : "bg-[#FFF9C4]")}>
              <CardContent className="p-6">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors", 
                  mode === "dark" ? "bg-amber-500/20" : "bg-white shadow-sm")}>
                  <FileText className="text-amber-600 w-5 h-5" />
                </div>
                <h3 className={cn("text-lg font-bold mb-2", mode === "dark" ? "text-amber-100" : "text-[#795548]")}>{t("common.documentation")}</h3>
                <p className={cn("text-sm mb-6 leading-relaxed opacity-80", mode === "dark" ? "text-amber-200/70" : "text-[#795548]/70")}>
                  {t("agency.dashboard.documentation.desc")}.
                </p>
                <button 
                  onClick={() => window.open('#', '_blank')}
                  className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95",
                  mode === "dark" ? "bg-amber-500 text-white" : "bg-amber-500 text-white")}>
                  {t("common.openDocs")} ↗
                </button>
              </CardContent>
            </Card>

            {/* Placeholder / Secondary Info Card */}
            <Card className={cn("border-none shadow-xl rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] duration-300", 
              mode === "dark" ? "bg-blue-500/10" : "bg-[#E3F2FD]")}>
              <CardContent className="p-6">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors", 
                  mode === "dark" ? "bg-blue-500/20" : "bg-white shadow-sm")}>
                  <Zap className="text-blue-600 w-5 h-5" />
                </div>
                <h3 className={cn("text-lg font-bold mb-2", mode === "dark" ? "text-blue-100" : "text-[#0D47A1]")}>{t("common.quickSetup")}</h3>
                <p className={cn("text-sm mb-6 leading-relaxed opacity-80", mode === "dark" ? "text-blue-200/70" : "text-[#0D47A1]/70")}>
                  {t("agency.dashboard.quickSetup.desc")}.
                </p>
                <button 
                  onClick={() => setLocation('/agency/workspaces')}
                  className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95",
                  mode === "dark" ? "bg-blue-600 text-white" : "bg-blue-600 text-white")}>
                  {t("common.startNow")} ↗
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Row (Navy Blue Banner) */}
          <div className={cn("rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-2xl transition-colors border",
            mode === "dark" ? "bg-[#0a192f] border-slate-800" : "bg-[#051139] border-blue-900")}>
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                   {stat.icon && React.cloneElement(stat.icon as React.ReactElement, { 
                     className: cn("w-4 h-4", mode === "dark" ? "text-slate-400" : "text-blue-300") 
                   })}
                   <span className={cn("text-[10px] font-bold uppercase tracking-wider", 
                     mode === "dark" ? "text-slate-400" : "text-blue-200/60")}>{stat.label}</span>
                </div>
                <span className={cn("text-3xl font-black tracking-tighter leading-none text-white")}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black tracking-tight">{t("agency.dashboard.features.title")}</h2>
              <button 
                onClick={() => setLocation('/agency/settings/general')}
                className="text-teal-500 text-xs font-bold hover:underline"
              >
                {t("agency.dashboard.features.manageAll")} ↗
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((feature, i) => (
                <Card 
                  key={i} 
                  onClick={() => setLocation(feature.href)}
                  className={cn("group border transition-all duration-500 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-teal-500/30 cursor-pointer",
                  mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-300 shadow-sm")}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn("p-2.5 rounded-xl transition-colors", mode === "dark" ? "bg-slate-800" : "bg-slate-50")}>
                        {feature.icon}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                          feature.status === t("common.active") || feature.status === t("common.approved") || feature.status === t("common.enterprise") ? "bg-green-500" : 
                          feature.status === t("common.comingSoon") ? "bg-orange-500" : "bg-gray-400")} />
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
          
          {/* Plan Summary Card (Navy Blue) */}
          <Card className={cn("border shadow-2xl rounded-2xl overflow-hidden transition-colors", 
            mode === "dark" ? "bg-[#0a192f] border-slate-800" : "bg-[#051139] border-blue-900 shadow-xl")}>
             <CardContent className="p-8">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                 <span className={cn("text-[10px] font-black uppercase tracking-widest", 
                   mode === "dark" ? "text-slate-400" : "text-blue-200/60")}>{t("agency.dashboard.plan_card.enterprise_title")}</span>
               </div>
               <h3 className={cn("text-2xl font-black mb-1 tracking-tighter leading-none text-white")}>{t("agency.dashboard.plan_card.enterprise")}</h3>
               <p className={cn("text-xs font-bold mb-6 italic", 
                 mode === "dark" ? "text-slate-500" : "text-blue-300/50")}>{t("agency.dashboard.plan_card.next_payment")}: 2026-05-11</p>
               
               <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-end">
                    <span className={cn("text-xs font-bold", mode === "dark" ? "text-slate-400" : "text-blue-200/60")}>{t("agency.dashboard.plan_card.workspaces_used")}</span>
                    <span className={cn("text-xs font-black text-white")}>13 / 999</span>
                  </div>
                  <Progress value={(13/999)*100} className={cn("h-1.5", mode === "dark" ? "bg-slate-800" : "bg-blue-900/50")} indicatorClassName="bg-blue-400" />
               </div>

               <div className="flex gap-2">
                 <button onClick={() => setLocation('/agency/billing/plans')} className={cn("flex-1 h-10 font-black text-[11px] uppercase tracking-wider rounded-lg transition-transform active:scale-95 shadow-lg", 
                   mode === "dark" ? "bg-white text-slate-900" : "bg-white text-blue-900 hover:bg-blue-50")}>{t("common.upgrade")}</button>
                 <button onClick={() => setLocation('/agency/billing/manage')} className={cn("flex-1 h-10 font-black text-[11px] uppercase tracking-wider rounded-lg transition-transform active:scale-95 border", 
                   mode === "dark" ? "bg-slate-800 text-white border-slate-700" : "bg-blue-900/40 text-blue-100 border-blue-800 hover:bg-blue-900/60")}>{t("nav.billing")}</button>
               </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
               <Zap className="text-orange-500 w-5 h-5 fill-orange-500/20" />
               <h2 className="text-lg font-black tracking-tight">{t("agency.dashboard.quickActions.title")}</h2>
            </div>
            <div className="space-y-3">
              {quickActions.map((action, i) => (
                <div 
                  key={i} 
                  onClick={() => setLocation(action.href)}
                  className={cn("p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group shadow-sm",
                  mode === "dark" ? "bg-[#1e293b] border-slate-800 hover:border-teal-500/30" : "bg-white border-slate-300 hover:border-teal-500/30")}>
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
                  <h2 className="text-lg font-black tracking-tight">{t("agency.dashboard.activity.title")}</h2>
               </div>
               <Badge className="bg-green-500/10 text-green-500 border-none font-bold text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                 <div className="w-1 h-1 rounded-full bg-green-500" /> {t("common.live")}
               </Badge>
            </div>
            
            <Card className={cn("shadow-xl rounded-2xl overflow-hidden border transition-colors", 
              mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-300")}>
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
                    {t("agency.dashboard.activity.viewAll")}
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
