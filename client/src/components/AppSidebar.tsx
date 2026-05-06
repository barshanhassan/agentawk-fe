"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import {
  Mail,
  BarChart2,
  MessageSquare,
  Cpu,
  FileText,
  Send,
  Users,
  Settings,
  UserPlus,
  Grid,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  GitMerge,
  Search,
  Sun,
  Moon,
  Circle,
  Phone,
  Check,
  User,
  Hash,
  Instagram,
  MessageCircle,

  LifeBuoy,
  Plus,
  LogOut
} from "react-feather";
import { LayoutGrid } from "lucide-react"; // Import for the new grid icon
import { useTheme } from "@/contexts/ThemeContext";
import { SiWhatsapp } from "react-icons/si";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import CustomDropdown from "@/components/CustomDropdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/avatar-utils";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const { t, i18n } = useTranslation();
  const [location, setLocation] = useLocation();

  // State for Theme and Online Status
  const { mode: theme, setMode: setTheme } = useTheme();
  const [status, setStatus] = useState<"available" | "unavailable">("available");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<string[]>(["en-us"]);
  const [workspace, setWorkspace] = useState<string[]>(["workspace-a"]);
  const [searchType, setSearchType] = useState(t('sidebar.WhatsApp Number'));

  const searchOptions = [
    { label: t('sidebar.WhatsApp Number'), icon: <SiWhatsapp size={14} /> },
    { label: t('sidebar.Email'), icon: <Mail size={14} /> },
    { label: t('sidebar.Phone Number'), icon: <Phone size={14} /> },
    { label: t('sidebar.First Name'), icon: <User size={14} /> },
    { label: t('sidebar.Last Name'), icon: <User size={14} /> },
    { label: t('sidebar.Full Name'), icon: <Users size={14} /> },
    { label: t('sidebar.Support Ticket'), icon: <LifeBuoy size={14} /> },
    { label: t('sidebar.Instagram Handle'), icon: <Instagram size={14} /> },
    { label: t('sidebar.Messenger Username'), icon: <MessageCircle size={14} /> },
    { label: t('sidebar.Contact ID'), icon: <Hash size={14} /> }
  ];

  const workspaceOptions = [
    { id: "workspace-a", name: t('sidebar.workspace_a', { defaultValue: "Workspace A" }) },
    { id: "workspace-b", name: t('sidebar.workspace_b') },
    { id: "workspace-c", name: t('sidebar.workspace_c') },
    { id: "create-workspace", name: t('sidebar.create_workspace'), icon: <Plus size={14} /> },
  ];

  const statusOptions = [
    { id: "available", name: t('sidebar.available'), icon: <div className="w-3 h-3 bg-green-500 rounded-full" /> },
    { id: "unavailable", name: t('sidebar.unavailable'), icon: <Circle size={12} className="text-gray-400" /> },
  ];

  const themeOptions = [
    { id: "light", name: "Light", icon: <Sun size={14} /> },
    { id: "dark", name: "Dark", icon: <Moon size={14} /> },
  ];

  const languageOptions = [
    {
      id: "en",
      name: "English (U.S)",
      icon: (
        <img
          src="https://flagcdn.com/w40/us.png"
          alt="US Flag"
          className="w-4 h-4 object-cover rounded-sm"
        />
      ),
    },
    {
      id: "pt",
      name: "Português do Brasil",
      icon: (
        <img
          src="https://flagcdn.com/w40/br.png"
          alt="Brazil Flag"
          className="w-4 h-4 object-cover rounded-sm"
        />
      ),
    },
    {
      id: "es",
      name: "Español",
      icon: (
        <img
          src="https://flagcdn.com/w40/es.png"
          alt="Spain Flag"
          className="w-4 h-4 object-cover rounded-sm"
        />
      ),
    },
  ];

  const handleLanguageChange = (val: string[]) => {
    const id = val[0];
    i18n.changeLanguage(id);
    localStorage.setItem('i18nextLng', id);
  };

  const currentLanguage = i18n.language ? i18n.language.split('-')[0] : 'en';

  const isActive = (path: string) => {
    if (path === "/insights") return location === "/" || location === "/insights" || location === "/workspace";
    return location.startsWith(path);
  };

  const hoverClass = "hover:bg-primary hover:text-white data-[highlighted]:bg-primary data-[highlighted]:text-white transition-all duration-200";
  const activeClass = "bg-primary text-white shadow-md scale-[1.02]";

  const subTriggerClass =
    "hover:bg-primary hover:text-white " +
    "data-[highlighted]:bg-primary data-[highlighted]:text-white " +
    "data-[state=open]:bg-primary data-[state=open]:text-white transition-all duration-200";

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Menu items for search filtering
  const menuItems = [
    { label: t('sidebar.insights'), href: "/insights", icon: BarChart2 },
    { label: t('sidebar.smart_flows'), href: "/automations", icon: GitMerge },
    { label: t('sidebar.bot_conversations'), href: "/conversations/bot", icon: Cpu },
    { label: t('sidebar.whatsapp_templates'), href: "/templates", icon: FileText },
    { label: t('sidebar.campaign_manager'), href: "/campaigns", icon: Send },
    { label: t('sidebar.contacts'), href: "/contacts", icon: Users },
    { label: t('sidebar.team_management'), href: "/teams", icon: UserPlus },
    { label: t('sidebar.workspace_management'), href: "/workspaces", icon: Grid },
    { label: t('sidebar.media_gallery'), href: "/settings?tab=Media gallery", icon: Grid },
    { label: t('sidebar.whatsapp_manager'), href: "/whatsapp-manager", icon: SiWhatsapp },
    { label: t('sidebar.inbox'), href: "/conversations/inbox", icon: Mail },
    { label: t('sidebar.conversation_logs'), href: "/conversations/conversation-logs", icon: FileText },
    { label: t('sidebar.call_logs'), href: "/conversations/call-logs", icon: Phone },
    { label: t('sidebar.billing'), href: "/billing", icon: Grid },
    { label: t('sidebar.settings'), href: "/settings", icon: Settings },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 border-b no-focus-outline",
      theme === "dark" 
        ? "bg-[#0f172a] border-slate-800 shadow-lg" 
        : "bg-white border-slate-200 shadow-sm"
    )}>
      <div className="flex items-center justify-between h-full px-5">
        {/* Left: Logo + EZCONN + Menu + Search */}
        <div className="flex items-center gap-6">
          {/* Logo + EZCONN - Premium Styling */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-md transition-all duration-300 group-hover:scale-110",
                theme === "dark" ? "bg-blue-600 shadow-blue-600/20" : "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-blue-500/20"
              )}>
                EC
              </div>
              <span className={cn(
                "font-black text-xl tracking-tighter uppercase hidden md:block transition-colors duration-300",
                theme === "dark" ? "text-white" : "text-slate-900"
              )}>
                EZCONN
              </span>
            </div>
          </Link>

          {/* Menu with Premium Styling */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 group shadow-sm",
                theme === "dark" 
                  ? "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" 
                  : "bg-blue-50/50 border-blue-100/50 text-slate-700 hover:bg-white hover:shadow-md hover:scale-[1.02] hover:text-blue-600"
              )}>
                <div className={cn("p-1 rounded-lg transition-colors", theme === "dark" ? "bg-slate-700" : "bg-white shadow-sm")}>
                  <LayoutGrid size={14} className={cn(theme === "dark" ? "text-blue-400" : "text-blue-500")} />
                </div>
                <span className="hidden md:block text-[14px] font-bold tracking-tight">{t('sidebar.menu')}</span>
                <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="start"
              sideOffset={8}
              className={cn(
                "w-64 p-2 transition-all duration-200 border rounded-2xl shadow-2xl no-focus-outline",
                theme === "dark" ? "bg-[#1e293b] border-slate-700 text-slate-300" : "bg-white border-slate-100 text-slate-600"
              )}
            >
              <DropdownMenuLabel className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t('sidebar.navigation')}</DropdownMenuLabel>
              <div className="space-y-1">
                {menuItems.slice(0, 8).map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
                        isActive(item.href) 
                          ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold" 
                          : theme === "dark" ? "hover:bg-slate-800 hover:text-white" : "hover:bg-slate-50 hover:text-blue-600"
                      )}
                    >
                      <item.icon size={18} className={isActive(item.href) ? "text-white" : "text-gray-400"} />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className={theme === "dark" ? "bg-slate-700 my-2" : "bg-slate-100 my-2"} />
              <div className="space-y-1">
                 {menuItems.slice(8).map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
                        isActive(item.href) 
                          ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold" 
                          : theme === "dark" ? "hover:bg-slate-800 hover:text-white" : "hover:bg-slate-50 hover:text-blue-600"
                      )}
                    >
                      <item.icon size={18} className={isActive(item.href) ? "text-white" : "text-gray-400"} />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Section Premium Styling */}
          <div className="relative flex items-center h-10">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                "p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center",
                isSearchOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100",
                theme === "dark" 
                  ? "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white" 
                  : "bg-blue-50/50 border-blue-100/50 text-slate-500 hover:bg-white hover:shadow-md hover:scale-[1.05] hover:text-blue-500"
              )}
            >
              <Search size={16} />
            </button>

            {/* Premium Expanding Search Bar */}
            <div
              className={cn(
                "absolute left-0 z-20 flex items-center h-11 border transition-all duration-500 ease-in-out shadow-xl rounded-xl px-3",
                theme === "dark" ? "bg-[#1e293b] border-slate-700 shadow-black/40" : "bg-white border-blue-100 shadow-blue-500/10",
                isSearchOpen ? "w-[500px] opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-4 pointer-events-none overflow-hidden"
              )}
            >
              <Search size={16} className="text-blue-500 mr-3 shrink-0" />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors",
                    theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
                  )}>
                    {searchType}
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className={cn(
                  "p-1 border shadow-2xl rounded-xl z-[60]",
                  theme === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-100"
                )}>
                  {searchOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.label}
                      onClick={() => setSearchType(option.label)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all",
                        searchType === option.label 
                          ? "bg-blue-500 text-white font-bold" 
                          : theme === "dark" ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                      )}
                    >
                      <div className="shrink-0">{option.icon}</div>
                      <span className="text-xs">{option.label}</span>
                      {searchType === option.label && <Check size={14} className="ml-auto text-white" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-3 shrink-0" />

              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t('sidebar.search_anything')}
                className="flex-1 bg-transparent text-sm font-medium outline-none border-none shadow-none focus:ring-0 placeholder-gray-400"
              />

              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchValue("");
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-400 hover:text-red-500 transition-all shrink-0 ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          {/* Notifications Premium Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center relative group",
                theme === "dark" 
                  ? "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800" 
                  : "bg-blue-50/50 border-blue-100/50 text-slate-500 hover:bg-white hover:shadow-md hover:text-blue-500"
              )}>
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0f172a]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12} className={cn(
              "w-80 p-0 border rounded-2xl shadow-2xl overflow-hidden",
              theme === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-100"
            )}>
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                <h3 className="font-bold text-sm">Notifications</h3>
                <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">3 NEW</span>
              </div>
              <div className="max-h-96 overflow-y-auto p-1">
                {[
                  { title: "New message from John Doe", time: "2m ago", icon: Mail, color: "text-blue-500" },
                  { title: "Campaign \"Summer Sale\" completed", time: "1h ago", icon: Send, color: "text-green-500" },
                  { title: "Template approved", time: "3h ago", icon: Check, color: "text-indigo-500" }
                ].map((n, i) => (
                  <DropdownMenuItem key={i} className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer mb-1 outline-none">
                    <div className="flex gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-700 shrink-0", n.color)}>
                        <n.icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{n.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => setLocation("/notifications")}
                  className="w-full py-2 text-[12px] font-bold text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors"
                >
                  View All Notifications
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Premium Styling */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-3 p-1.5 pr-3 rounded-2xl border transition-all duration-300 group shadow-sm",
                theme === "dark" 
                  ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800" 
                  : "bg-blue-50/50 border-blue-100/50 hover:bg-white hover:shadow-md hover:scale-[1.02]"
              )}>
                <Avatar className="w-8 h-8 ring-2 ring-white/50 shadow-sm transition-transform group-hover:scale-110">
                  <AvatarFallback className={cn("text-[10px] font-black text-white", getAvatarColor(user?.first_name || "User"))}>
                    {(user?.first_name?.[0] || "") + (user?.last_name?.[0] || "U")}
                  </AvatarFallback>
                </Avatar>

                <div className="text-left hidden sm:block">
                  <p className={cn("text-[13px] font-bold leading-none truncate max-w-[100px]", theme === "dark" ? "text-white" : "text-slate-900")}>
                    {user ? `${user.first_name} ${user.last_name || ""}` : "Profile"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className={cn("w-2 h-2 rounded-full", status === "available" ? "bg-green-500 animate-pulse" : "bg-slate-400")} />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                      {status === "available" ? "Online" : "Away"}
                    </span>
                  </div>
                </div>

                <ChevronDown size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={12} className={cn(
              "w-72 p-2 border rounded-2xl shadow-2xl no-focus-outline overflow-hidden",
              theme === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-100"
            )}>
              {/* Header */}
              <div 
                className="p-4 mb-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 flex items-center gap-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50"
                onClick={() => setLocation("/settings?tab=My%20Profile")}
              >
                <Avatar className="w-10 h-10 ring-2 ring-white shadow-md">
                  <AvatarFallback className={cn("text-xs font-black text-white", getAvatarColor(user?.first_name || "User"))}>
                    {(user?.first_name?.[0] || "") + (user?.last_name?.[0] || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate">{user ? `${user.first_name} ${user.last_name || ""}` : "Loading..."}</p>
                  <p className="text-[11px] text-gray-500 truncate">{user?.email || "admin@example.com"}</p>
                </div>
              </div>

              {/* Preferences Group */}
              <div className="space-y-0">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">{t('sidebar.status', { defaultValue: 'Your Online Status' })}</p>
                  <CustomDropdown
                    options={statusOptions}
                    selected={[status]}
                    onChange={(val) => setStatus(val[0] as "available" | "unavailable")}
                    placeholder={t('sidebar.status')}
                    width="100%"
                    showSelectedOption={true}
                    showSearch={false}
                  />
                </div>

                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">{t('sidebar.workspace')}</p>
                  <CustomDropdown
                    options={workspaceOptions}
                    selected={workspace}
                    onChange={(val) => setWorkspace(val)}
                    placeholder={t('sidebar.workspace')}
                    width="100%"
                    showSelectedOption={true}
                    showSearch={false}
                  />
                </div>

                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">{t('sidebar.theme')}</p>
                  <CustomDropdown
                    options={themeOptions}
                    selected={[theme]}
                    onChange={(val) => setTheme(val[0] as "light" | "dark")}
                    placeholder={t('sidebar.theme')}
                    width="100%"
                    showSelectedOption={true}
                    showSearch={false}
                  />
                </div>

                <div className="px-3 py-2">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">{t('sidebar.language')}</p>
                  <CustomDropdown
                    options={languageOptions}
                    selected={[currentLanguage]}
                    onChange={handleLanguageChange}
                    placeholder={t('sidebar.language')}
                    width="100%"
                    showSelectedOption={true}
                    showSearch={false}
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user_info");
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl px-3 py-2.5 text-sm font-bold transition-all"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}