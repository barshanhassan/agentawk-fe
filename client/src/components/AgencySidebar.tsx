import React from 'react';
import { Link, useLocation } from "wouter";
import { 
  Gauge, 
  Layers, 
  Users, 
  ShieldCheck, 
  Cloud, 
  Gavel, 
  HelpCircle,
  ChevronDown,
  Settings,
  Bell,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Network,
  ScrollText,
  FileText,
  Briefcase,
  Plug,
  ShoppingCart,
  CircleDollarSign
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
    { label: "Dashboard", icon: <Gauge size={20} />, href: "/agency" },
    { label: "Workspaces", icon: <Network size={20} />, href: "/agency/workspaces" },
    { label: "Team", icon: <Users size={20} />, href: "/agency/team" },
    { label: "Roles & Permissions", icon: <ShieldCheck size={20} />, href: "/agency/roles" },
    { 
      label: "Audit Logs", 
      icon: <ScrollText size={20} />, 
      href: "#", 
      hasSubmenu: true,
      subItems: [
        { label: "Agency", icon: <Briefcase size={16} />, href: "/agency/audit-logs/agency" },
      ]
    },
    { 
      label: "SaaS", 
      icon: <Cloud size={20} />, 
      href: "#", 
      hasSubmenu: true,
      subItems: [
        { label: "Plans", icon: <Briefcase size={16} />, href: "/agency/saas/plans", status: "Soon..." },
        { label: "API", icon: <Plug size={16} />, href: "/agency/saas/api" },
      ]
    },
    { 
      label: "Billing", 
      icon: <FileText size={20} />, 
      href: "#", 
      hasSubmenu: true,
      subItems: [
        { label: "Plans", icon: <ShoppingCart size={16} />, href: "/agency/billing/plans" },
        { label: "Manage", icon: <CircleDollarSign size={16} />, href: "/agency/billing/manage" },
      ]
    },
    { label: "Legal", icon: <Gavel size={20} />, href: "/agency/legal" },
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
              ? (mode === "dark" 
                  ? "bg-green-900/30 text-green-400 shadow-sm" 
                  : "bg-[#e8f5e9] text-slate-900 shadow-sm font-bold scale-[1.01]")
              : (mode === "dark" 
                  ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" 
                  : "text-slate-900 hover:bg-slate-50 hover:text-black hover:scale-[1.01]")
          )}
        >
          <div className={cn("flex items-center gap-3 w-full", isCollapsed && "justify-center")}>
            <span className={cn("shrink-0 transition-colors duration-200", 
              active 
                ? (mode === "dark" ? "text-green-400" : "text-[#2e7d32]") 
                : (mode === "dark" ? "text-slate-500" : "text-slate-900")
            )}>
              {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
            </span>
            {!isCollapsed && (
              item.hasSubmenu ? (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className={cn("text-[13px] font-semibold whitespace-nowrap",
                    active 
                      ? (mode === "dark" ? "text-green-400" : "text-[#1b5e20]") 
                      : (mode === "dark" ? "text-slate-300" : "text-slate-900")
                  )}>
                    {item.label}
                  </span>
                  <ChevronDown 
                    size={14} 
                    className={cn("transition-transform duration-200", 
                      expanded === item.label ? "rotate-180" : "",
                      active ? (mode === "dark" ? "text-green-400/70" : "text-green-500/70") : (mode === "dark" ? "text-slate-500" : "text-slate-400")
                    )} 
                  />
                </div>
              ) : (
                <Link href={item.href} className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className={cn("text-[13px] font-semibold whitespace-nowrap",
                    active 
                      ? (mode === "dark" ? "text-green-400" : "text-[#1b5e20]") 
                      : (mode === "dark" ? "text-slate-300" : "text-slate-900")
                  )}>
                    {item.label}
                  </span>
                </Link>
              )
            )}
            
            {/* Active dot indicator */}
            {/* Active dot indicator removed */}
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
                    ? (mode === "dark" ? "text-green-400" : "text-[#1b5e20] font-bold") 
                    : (mode === "dark" ? "text-slate-500 hover:text-slate-300" : "text-slate-900 hover:bg-slate-50")
                )}>
                  <div className="flex items-center gap-3">
                    <span className={cn("transition-colors", isActive(sub.href) ? "text-[#1b5e20]" : "text-slate-500")}>
                      {React.cloneElement(sub.icon as React.ReactElement, { size: 16 })}
                    </span>
                    <span className="text-[13px] font-semibold">{sub.label}</span>
                  </div>
                  {sub.status && (
                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full",
                      mode === "dark" ? "bg-slate-800 text-green-400" : "bg-white text-green-500 border border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.2)]"
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
        : "bg-white text-slate-600 border-slate-200 shadow-sm"
    )}>
      
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-3.5 top-[72px] w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md z-[100]",
          mode === "dark" 
            ? "bg-green-600 border-green-500 text-white hover:bg-green-500 shadow-green-900/40" 
            : "bg-green-500 border-transparent text-white hover:bg-green-600 shadow-green-500/30"
        )}>
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Section */}
      <div className={cn(
        "px-5 py-5 flex items-center transition-all duration-300 overflow-hidden border-b",
        isCollapsed ? "justify-center" : "gap-3",
        mode === "dark" ? "border-slate-800" : "border-slate-200"
      )}>
        <div className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-md",
          mode === "dark" ? "bg-green-600 shadow-green-600/20" : "bg-green-600 shadow-green-500/20"
        )}>
          EC
        </div>
        {!isCollapsed && (
          <span className={cn(
            "font-black text-xl tracking-tighter uppercase animate-in fade-in slide-in-from-left-3 duration-200", 
            mode === "dark" ? "text-white" : "text-[#1a1a1a]"
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
        mode === "dark" ? "border-slate-800 bg-slate-900/50" : "border-slate-300 bg-white/50"
      )}>
        {!isCollapsed && settingsExpanded && (
          <div className={cn("mb-3 rounded-lg border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200",
             mode === "dark" ? "border-slate-800 bg-[#0f172a]" : "border-slate-200 bg-white"
          )}>
            {settingSubItems.map((item, i) => (
              <Link key={item.label} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-all duration-200 cursor-pointer group",
                  i !== settingSubItems.length - 1 && (mode === "dark" ? "border-b border-slate-800" : "border-b border-slate-200"),
                  isActive(item.href) 
                    ? (mode === "dark" ? "bg-[#00e55e]/15 text-[#00e55e]" : "bg-[#00e55e]/10 text-[#00e55e]")
                    : (mode === "dark" ? "hover:bg-slate-800 text-slate-300 hover:text-white" : "hover:bg-slate-50 text-slate-900 hover:text-black")
                )}>
                  <span className={cn("transition-colors duration-200", 
                    isActive(item.href) 
                      ? "text-[#00e55e]" 
                      : (mode === "dark" ? "text-slate-500 group-hover:text-slate-300" : "text-slate-600 group-hover:text-slate-900")
                  )}>
                    {React.cloneElement(item.icon as React.ReactElement, { size: 16 })}
                  </span>
                  <span className={cn("text-[13px] font-bold transition-colors",
                    isActive(item.href) ? "text-[#00e55e]" : (mode === "dark" ? "text-slate-300 group-hover:text-white" : "text-slate-900 group-hover:text-black")
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
              ? (mode === "dark" ? "bg-slate-800 text-white shadow-sm" : "bg-white text-green-600 shadow-md border border-slate-50") 
              : (mode === "dark" ? "text-slate-400 hover:text-green-400 hover:bg-slate-800" : "text-slate-500 hover:text-green-600 hover:bg-slate-50")
          )}
        >
           <Settings size={20} className={cn(
             "shrink-0 transition-all duration-200",
             settingsExpanded && !isCollapsed
               ? "rotate-90 text-green-500"
               : (mode === "dark" ? "text-slate-500" : "text-slate-400")
           )} />
           {!isCollapsed && (
             <span className={cn(
               "flex-1 text-[13px] font-semibold whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200",
               settingsExpanded
                 ? (mode === "dark" ? "text-white" : "text-[#2e7d32]")
                 : (mode === "dark" ? "text-slate-300" : "text-slate-900")
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
