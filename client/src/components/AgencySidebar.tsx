import React from 'react';
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  ShieldCheck, 
  History, 
  Cloud, 
  CreditCard, 
  Gavel, 
  HelpCircle,
  ChevronDown,
  Settings,
  Bell,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

const AgencySidebar = () => {
  const [location] = useLocation();
  const [expanded, setExpanded] = React.useState<string | null>("Audit Logs");
  const [settingsExpanded, setSettingsExpanded] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { mode } = useTheme();

  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/agency" },
    { label: "Workspaces", icon: <Layers size={20} />, href: "/agency/workspaces" },
    { label: "Team", icon: <Users size={20} />, href: "/agency/team" },
    { label: "Roles & Permissions", icon: <ShieldCheck size={20} />, href: "/agency/roles" },
    { 
      label: "Audit Logs", 
      icon: <History size={20} />, 
      href: "/agency/audit-logs/agency", 
      hasSubmenu: true,
      subItems: [
        { label: "Agency", href: "/agency/audit-logs/agency" },
        { label: "Workspace", href: "/agency/audit-logs/workspace" },
      ]
    },
    { 
      label: "SaaS", 
      icon: <Cloud size={20} />, 
      href: "/agency/saas/plans", 
      hasSubmenu: true,
      subItems: [
        { label: "Plans", href: "/agency/saas/plans", status: "Soon..." },
        { label: "API", href: "/agency/saas/api" },
      ]
    },
    { 
      label: "Billing", 
      icon: <CreditCard size={20} />, 
      href: "/agency/billing/plans", 
      hasSubmenu: true,
      subItems: [
        { label: "Plans", href: "/agency/billing/plans" },
        { label: "Manage", href: "/agency/billing/manage" },
      ]
    },
    { label: "Legal", icon: <Star size={20} />, href: "/agency/legal" },
    { label: "Help", icon: <HelpCircle size={20} />, href: "/agency/help" },
  ];

  const settingSubItems = [
    { label: "General settings", icon: <Settings size={18} />, href: "/agency/settings/general" },
    { label: "Notifications", icon: <Bell size={18} />, href: "/agency/settings/notifications" },
    { label: "White Label", icon: <Monitor size={18} />, href: "/agency/settings/white-label" },
  ];

  const isActive = (href: string) => location === href;
  const isParentActive = (label: string) => {
    const item = menuItems.find(i => i.label === label);
    if (!item) return false;
    if (isActive(item.href)) return true;
    return item.subItems?.some(sub => isActive(sub.href));
  };

  const renderMenuItem = (item: any) => {
    const active = isActive(item.href) || (item.hasSubmenu && isParentActive(item.label));

    return (
      <div key={item.label} className="relative group">
        <div 
          onClick={() => {
            if (isCollapsed) {
              setIsCollapsed(false);
              if (item.hasSubmenu) setExpanded(item.label);
            } else if (item.hasSubmenu) {
              setExpanded(expanded === item.label ? null : item.label);
            }
          }}
          className={cn(
            "flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer relative",
            active
              ? "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/15 scale-[1.02]"
              : (mode === "dark" 
                  ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" 
                  : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-md hover:scale-[1.02]")
          )}
        >
          <div className={cn("flex items-center gap-3 w-full", isCollapsed && "justify-center")}>
            <span className={cn("shrink-0 transition-colors duration-200", 
              active 
                ? "text-white" 
                : (mode === "dark" ? "text-slate-500" : "text-slate-400")
            )}>
              {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
            </span>
            {!isCollapsed && (
              <Link href={item.href} className="flex-1 flex items-center justify-between overflow-hidden">
                <span className={cn("text-[13px] font-semibold whitespace-nowrap",
                  active 
                    ? "text-white" 
                    : (mode === "dark" ? "text-slate-300" : "text-slate-700")
                )}>
                  {item.label}
                </span>
                {item.hasSubmenu && (
                  <ChevronDown 
                    size={14} 
                    className={cn("transition-transform duration-200", 
                      expanded === item.label ? "rotate-180" : "",
                      active ? "text-white/70" : (mode === "dark" ? "text-slate-500" : "text-slate-400")
                    )} 
                  />
                )}
              </Link>
            )}
            
            {/* Active dot indicator */}
            {active && !isCollapsed && (
              <div className="w-2 h-2 rounded-full shrink-0 bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            )}
          </div>
          
          {/* Tooltip for Collapsed State */}
          {isCollapsed && (
            <div className={cn(
              "absolute left-full ml-3 px-3 py-1.5 text-[11px] font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[100] shadow-lg",
              mode === "dark" ? "bg-slate-800 text-white border border-slate-700" : "bg-slate-900 text-white"
            )}>
              {item.label}
            </div>
          )}
        </div>

        {/* Submenu */}
        {!isCollapsed && item.hasSubmenu && expanded === item.label && item.subItems && (
          <div className="mt-1 space-y-1 animate-in slide-in-from-top-1 duration-200">
            {item.subItems.map((sub: any) => (
              <Link key={sub.label} href={sub.href}>
                <div className={cn(
                  "flex items-center justify-between ml-10 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                  isActive(sub.href) 
                    ? (mode === "dark" ? "text-blue-400" : "text-blue-600 font-bold") 
                    : (mode === "dark" ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-800 hover:bg-white hover:shadow-sm")
                )}>
                  <span className="text-[12px] font-medium">{sub.label}</span>
                  {sub.status && (
                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full",
                      mode === "dark" ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-500"
                    )}>
                      {sub.status}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "relative h-screen flex flex-col border-r transition-all duration-300 ease-in-out z-50", 
      isCollapsed ? "w-20" : "w-64",
      mode === "dark" 
        ? "bg-[#0f172a] text-slate-300 border-slate-800" 
        : "bg-blue-50/50 text-slate-600 border-blue-100/50"
    )}>
      
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-3.5 top-[72px] w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md z-[100]",
          mode === "dark" 
            ? "bg-slate-800 border-slate-700 text-blue-400 hover:bg-slate-700" 
            : "bg-white border-blue-100 text-blue-500 hover:border-blue-300"
        )}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Section */}
      <div className={cn(
        "px-5 py-5 flex items-center transition-all duration-300 overflow-hidden border-b",
        isCollapsed ? "justify-center" : "gap-3",
        mode === "dark" ? "border-slate-800" : "border-blue-100/50"
      )}>
        <div className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-md",
          mode === "dark" ? "bg-blue-600 shadow-blue-600/20" : "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-blue-500/20"
        )}>
          EC
        </div>
        {!isCollapsed && (
          <span className={cn(
            "font-black text-xl tracking-tighter uppercase animate-in fade-in slide-in-from-left-3 duration-200", 
            mode === "dark" ? "text-white" : "text-slate-900"
          )}>
            EZCONN
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Footer / Agency Settings */}
      <div className={cn(
        "p-3 border-t transition-all duration-200",
        mode === "dark" ? "border-slate-800 bg-slate-900/50" : "border-blue-100/50 bg-white/50"
      )}>
        {!isCollapsed && settingsExpanded && (
          <div className="mb-2 space-y-0.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {settingSubItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer",
                  isActive(item.href) 
                    ? "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white shadow-lg"
                    : (mode === "dark" ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm")
                )}>
                  <span className={cn("transition-colors duration-200", 
                    isActive(item.href) 
                      ? "text-white" 
                      : (mode === "dark" ? "text-slate-500" : "text-slate-400")
                  )}>
                    {item.icon}
                  </span>
                  <span className={cn("text-[12px] font-medium",
                    isActive(item.href) ? "text-white" : (mode === "dark" ? "text-slate-300" : "text-slate-600")
                  )}>
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div 
          onClick={() => isCollapsed ? setIsCollapsed(false) : setSettingsExpanded(!settingsExpanded)}
          className={cn(
            "flex items-center rounded-lg transition-all duration-200 cursor-pointer p-3 group relative",
            isCollapsed ? "justify-center" : "gap-3",
            settingsExpanded && !isCollapsed 
              ? (mode === "dark" ? "bg-slate-800 text-white shadow-sm" : "bg-white text-blue-600 shadow-md border border-blue-50") 
              : (mode === "dark" ? "text-slate-400 hover:text-blue-400 hover:bg-slate-800" : "text-slate-500 hover:text-blue-600 hover:bg-white hover:shadow-sm")
          )}
        >
           <Settings size={20} className={cn(
             "shrink-0 transition-all duration-200",
             settingsExpanded && !isCollapsed
               ? "rotate-90 text-blue-500"
               : (mode === "dark" ? "text-slate-500" : "text-slate-400")
           )} />
           {!isCollapsed && (
             <span className={cn(
               "flex-1 text-[13px] font-semibold whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200",
               settingsExpanded
                 ? (mode === "dark" ? "text-white" : "text-blue-600")
                 : (mode === "dark" ? "text-slate-300" : "text-slate-700")
             )}>
               Agency Settings
             </span>
           )}
           {!isCollapsed && (
             <ChevronRight size={14} className={cn(
               "transition-transform duration-200",
               settingsExpanded ? "rotate-90" : "",
               mode === "dark" ? "text-slate-500" : "text-slate-400")
             } />
           )}
           {isCollapsed && (
             <div className={cn(
               "absolute left-full ml-3 px-3 py-1.5 text-[11px] font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[100] shadow-lg",
               mode === "dark" ? "bg-slate-800 text-white border border-slate-700" : "bg-slate-900 text-white"
             )}>
               Agency Settings
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AgencySidebar;
