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
  Menu,
  Briefcase,
  Plug,
  ShoppingCart,
  Settings,
  Bell,
  Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

const AgencySidebar = () => {
  const [location] = useLocation();
  const [expanded, setExpanded] = React.useState<string | null>("Audit Logs");
  const [settingsExpanded, setSettingsExpanded] = React.useState(false);
  const { mode } = useTheme();

  const menuItems = [
    // ... items (same as before)
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
        { label: "Agency", href: "/agency/audit-logs/agency", icon: <Briefcase size={16} /> },
        { label: "Workspace", href: "/agency/audit-logs/workspace", icon: <Layers size={16} /> },
      ]
    },
    { 
      label: "SaaS", 
      icon: <Cloud size={20} />, 
      href: "/agency/saas/plans", 
      hasSubmenu: true,
      subItems: [
        { label: "Plans", href: "/agency/saas/plans", icon: <Briefcase size={16} />, status: "Soon..." },
        { label: "API", href: "/agency/saas/api", icon: <Plug size={16} /> },
      ]
    },
    { 
      label: "Billing", 
      icon: <CreditCard size={20} />, 
      href: "/agency/billing/plans", 
      hasSubmenu: true,
      subItems: [
        { label: "Plans", href: "/agency/billing/plans", icon: <ShoppingCart size={16} /> },
        { label: "Manage", href: "/agency/billing/manage", icon: <Settings size={16} /> },
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

  return (
    <div className={cn("w-64 h-screen flex flex-col border-r transition-colors duration-300", 
      mode === "dark" ? "bg-[#1e293b] text-slate-300 border-slate-700" : "bg-white text-slate-600 border-slate-200 shadow-sm")}>
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
          R
        </div>
        <span className={cn("font-black text-xl tracking-tighter uppercase", mode === "dark" ? "text-white" : "text-slate-900")}>
          REPLYAGENT
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.label}>
            <div 
              onClick={() => item.hasSubmenu ? setExpanded(expanded === item.label ? null : item.label) : null}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-md transition-all cursor-pointer text-[14px] font-bold group",
                isActive(item.href) || (item.hasSubmenu && isParentActive(item.label))
                  ? (mode === "dark" ? "bg-primary/20 text-white" : "bg-primary/10 text-primary") 
                  : (mode === "dark" ? "hover:bg-[#334155] hover:text-white" : "hover:bg-slate-50 hover:text-slate-900")
              )}
            >
              <Link href={item.href} className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={cn("transition-colors", isActive(item.href) || (item.hasSubmenu && isParentActive(item.label)) ? "text-primary" : "text-gray-400 group-hover:text-primary")}>
                    {item.icon}
                  </span>
                  <span className="uppercase tracking-wide text-[12px]">{item.label}</span>
                </div>
              </Link>
              {item.hasSubmenu && (
                <ChevronDown 
                  size={14} 
                  className={cn("text-gray-500 transition-transform", expanded === item.label ? "rotate-180" : "")} 
                />
              )}
            </div>

            {/* Submenu */}
            {item.hasSubmenu && expanded === item.label && item.subItems && (
              <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                {item.subItems.map((sub) => (
                  <Link key={sub.label} href={sub.href}>
                    <div className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer text-[13px] font-bold group",
                      isActive(sub.href) 
                        ? (mode === "dark" ? "bg-primary/10 text-primary" : "bg-primary/5 text-primary") 
                        : (mode === "dark" ? "hover:bg-[#334155] hover:text-white" : "hover:bg-slate-50 hover:text-slate-900")
                    )}>
                      <span className={cn("transition-colors", isActive(sub.href) ? "text-primary" : "text-gray-400 group-hover:text-primary")}>
                        {sub.icon}
                      </span>
                      <span className="uppercase tracking-wider text-[11px]">{sub.label}</span>
                      {sub.status && (
                        <span className={cn("ml-auto text-[9px] font-black uppercase px-1.5 py-0.5 rounded transition-colors", 
                          mode === "dark" ? "bg-slate-800 text-gray-500" : "bg-slate-100 text-slate-400")}>
                          {sub.status}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer / Agency Settings Dropdown */}
      <div className={cn("border-t p-2 transition-colors", mode === "dark" ? "border-slate-700" : "border-slate-100")}>
        {settingsExpanded && (
          <div className="mb-2 space-y-1 animate-in fade-in slide-in-from-bottom-2">
            {settingSubItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-md transition-all cursor-pointer text-[14px] font-bold group",
                  isActive(item.href) 
                    ? (mode === "dark" ? "bg-primary/20 text-white" : "bg-primary/10 text-primary") 
                    : (mode === "dark" ? "hover:bg-[#334155] hover:text-white" : "hover:bg-slate-50 hover:text-slate-900")
                )}>
                  <span className={cn("transition-colors", isActive(item.href) ? "text-primary" : "text-gray-400 group-hover:text-primary")}>
                    {item.icon}
                  </span>
                  <span className="uppercase tracking-wide text-[12px]">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div 
          onClick={() => setSettingsExpanded(!settingsExpanded)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-md transition-all cursor-pointer text-[12px] font-black uppercase tracking-widest",
            settingsExpanded 
              ? (mode === "dark" ? "text-white" : "text-slate-900") 
              : "text-gray-400 hover:text-primary"
          )}
        >
           <Settings size={18} className={cn("transition-transform duration-300", settingsExpanded ? "rotate-90 text-primary" : "")} />
           <span className="flex-1">Agency settings</span>
        </div>
      </div>
    </div>
  );
};

export default AgencySidebar;
