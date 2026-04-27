"use client";

import { useState, useEffect, useRef } from "react";
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
  Plus
} from "react-feather";
import { useTheme } from "@/contexts/ThemeContext";
import { BsGrid3X3GapFill } from "react-icons/bs";

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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import CustomDropdown from "@/components/CustomDropdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/avatar-utils";

export default function AppSidebar() {
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
  const [searchType, setSearchType] = useState("WhatsApp Number");

  const searchOptions = [
    { label: "WhatsApp Number", icon: <SiWhatsapp size={14} /> },
    { label: "Email", icon: <Mail size={14} /> },
    { label: "Phone Number", icon: <Phone size={14} /> },
    { label: "First Name", icon: <User size={14} /> },
    { label: "Last Name", icon: <User size={14} /> },
    { label: "Full Name", icon: <Users size={14} /> },
    { label: "Support Ticket", icon: <LifeBuoy size={14} /> },
    { label: "Instagram Handle", icon: <Instagram size={14} /> },
    { label: "Messenger Username", icon: <MessageCircle size={14} /> },
    { label: "Contact ID", icon: <Hash size={14} /> }
  ];

  const workspaceOptions = [
    { id: "workspace-a", name: "Workspace A" },
    { id: "workspace-b", name: "Workspace B" },
    { id: "workspace-c", name: "Workspace C" },
    { id: "create-workspace", name: "+ Create Workspace", icon: <Plus size={14} /> },
  ];

  const statusOptions = [
    { id: "available", name: "Available", icon: <div className="w-3 h-3 bg-green-500 rounded-full" /> },
    { id: "unavailable", name: "Unavailable", icon: <Circle size={12} className="text-gray-400" /> },
  ];

  const themeOptions = [
    { id: "light", name: "Light", icon: <Sun size={14} /> },
    { id: "dark", name: "Dark", icon: <Moon size={14} /> },
  ];

  const languageOptions = [
    {
      id: "en-us",
      name: "English (U.S)",
      icon: (
        <img
          src="https://flagcdn.com/w40/us.png"
          alt="US Flag"
          className="w-4 h-4 object-cover rounded-sm"
        />
      ),
    },
  ];

  // ... (keeping existing functions)

  const isActive = (path: string) => {
    if (path === "/insights") return location === "/" || location === "/insights";
    return location.startsWith(path);
  };

  const hoverClass = "hover:bg-primary hover:text-white data-[highlighted]:bg-primary data-[highlighted]:text-white";
  const activeClass = "bg-primary text-white";

  const subTriggerClass =
    "hover:bg-primary hover:text-white " +
    "data-[highlighted]:bg-primary data-[highlighted]:text-white " +
    "data-[state=open]:bg-primary data-[state=open]:text-white";

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const isConversationsParentActive =
    location.startsWith("/conversations/inbox") ||
    location.startsWith("/conversations/conversation-logs") ||
    location.startsWith("/conversations/call-logs");

  // Removed local theme effect as it's handled in ThemeContext
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Menu items for search filtering
  const menuItems = [
    { label: "Insights", href: "/insights", icon: BarChart2 },
    { label: "Smart Flows", href: "/automations", icon: GitMerge },
    { label: "Bot Conversations", href: "/conversations/bot", icon: Cpu },
    { label: "WhatsApp Templates", href: "/templates", icon: FileText },
    { label: "Campaign Manager", href: "/campaigns", icon: Send },
    { label: "Contacts", href: "/contacts", icon: Users },
    { label: "Team Management", href: "/teams", icon: UserPlus },
    { label: "Workspace Management", href: "/workspaces", icon: Grid },
    { label: "Media Gallery", href: "/settings?tab=Media gallery", icon: Grid },
    { label: "WhatsApp Manager", href: "/whatsapp-manager", icon: SiWhatsapp },
    { label: "Inbox", href: "/conversations/inbox", icon: Mail },
    { label: "Conversation Logs", href: "/conversations/conversation-logs", icon: FileText },
    { label: "Call Logs", href: "/conversations/call-logs", icon: Phone },
    { label: "Billing", href: "/billing", icon: Grid },
    { label: "Settings", href: "/settings", icon: Settings },

  ];

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-[0_-3px_6px_rgba(0,0,0,0.03),-3px_0_6px_rgba(0,0,0,0.03),3px_0_6px_rgba(0,0,0,0.03),0_4px_6px_rgba(0,0,0,0.07)] border-b border-slate-200 dark:border-slate-800 no-focus-outline">
      <div className="flex items-center justify-between h-full px-5">
        {/* Left: Logo + EZCONN + Menu + Search */}
        <div className="flex items-center gap-6">
          {/* Logo + EZCONN - Updated font style like REPLYAGENT */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                EC
              </div>
              <span className="font-bold text-xl tracking-wide uppercase hidden md:block" style={{ fontFamily: 'Poppins, sans-serif' }}>
                EZCONN
              </span>
            </div>
          </Link>

          {/* Menu with "Menu" text */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* Custom 3x3 Grid Menu Icon */}
              <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md shadow-sm transition text-sm">
                <BsGrid3X3GapFill size={14} className="text-slate-700 dark:text-white" />
                <span className="hidden md:block text-[14px] font-[500] font-[Roboto, sans-serif]">Menu</span>
              </button>


            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="start"
              sideOffset={6}
              className="w-60 bg-white dark:bg-background border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-[14px] font-[Roboto, sans-serif] mt-2 rounded-md shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] no-focus-outline"
            >
              <DropdownMenuItem asChild>
                <Link
                  href="/insights"
                  className={`flex items-center gap-3 px-2 py-1  ${hoverClass} ${isActive("/insights") ? activeClass : ""}`}
                >
                  <BarChart2 size={18} /> Insights
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/automations"
                  className={`flex items-center gap-3 px-2 py-1  ${hoverClass} ${isActive("/automations") ? activeClass : ""}`}
                >
                  <GitMerge size={18} /> Smart Flows
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/conversations/inbox"
                  className={`flex items-center gap-3 px-2 py-1 text-slate-900 dark:text-white ${hoverClass} ${isActive("/conversations/inbox") ? activeClass : ""}`}
                >
                  <Mail size={18} />
                  Inbox
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className={`flex items-center gap-3 px-2 py-1 ${subTriggerClass} ${isActive("/conversations/conversation-logs") || isActive("/conversations/call-logs") ? activeClass : ""}`}
                >
                  <MessageSquare size={18} /> Logs
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/conversations/conversation-logs"
                      className={`px-2 py-1 text-slate-900 dark:text-white ${hoverClass} ${isActive("/conversations/conversation-logs") ? activeClass : ""}`}
                    >
                      <FileText size={18} />
                      Conversation Logs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/conversations/call-logs"
                      className={`px-2 py-1 text-slate-900 dark:text-white ${hoverClass} ${isActive("/conversations/call-logs") ? activeClass : ""}`}
                    >
                      <Phone size={18} />
                      Call Logs
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>




              <DropdownMenuItem asChild>
                <Link
                  href="/templates"
                  className={`flex items-center gap-3 px-2 py-1 ${hoverClass} ${isActive("/templates") ? activeClass : ""}`}
                >
                  <FileText size={18} /> WhatsApp Templates
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/campaigns"
                  className={`flex items-center gap-3 px-2 py-1 ${hoverClass} ${isActive("/campaigns") ? activeClass : ""}`}
                >
                  {/* ... */}
                  <Send size={18} /> Campaign Manager
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/contacts"
                  className={`flex items-center gap-3 px-2 py-1 ${hoverClass} ${isActive("/contacts") ? activeClass : ""}`}
                >
                  <Users size={18} /> Contacts
                </Link>
              </DropdownMenuItem>



              <DropdownMenuItem asChild>
                <Link
                  href="/teams"
                  className={`flex items-center gap-3 px-2 py-1 ${hoverClass} ${isActive("/teams") ? activeClass : ""}`}
                >
                  <UserPlus size={18} /> Team Management
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/workspaces"
                  className={`flex items-center gap-3 px-2 py-1 ${hoverClass} ${isActive("/workspaces") ? activeClass : ""}`}
                >
                  <Grid size={18} /> Workspace Management
                </Link>
              </DropdownMenuItem>



              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

              <DropdownMenuItem asChild>
                <Link
                  href="/whatsapp-manager"
                  className={`flex items-center gap-3 px-2 py-1 ${hoverClass} ${isActive("/whatsapp-manager") ? activeClass : ""}`}
                >
                  <SiWhatsapp size={18} /> WhatsApp Manager
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/billing"
                  className={`flex items-center gap-3 px-2 py-1 ${hoverClass} ${isActive("/billing") ? activeClass : ""}`}
                >
                  <Grid size={18} /> Billing
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className={`flex items-center gap-3 px-2 py-1 ${hoverClass} ${isActive("/settings") ? activeClass : ""}`}
                >
                  <Settings size={18} /> Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Bar Dropdown */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>

              {/* Search Bar */}
              <div className="relative flex items-center">
                {/* Search Icon */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition
      ${isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                >
                  <Search size={16} />
                </button>

                {/* Expanding Search Bar (to the RIGHT) */}
                <div
                  className={`
                    absolute left-0 z-20 flex items-center
                    bg-card border border-input
                    rounded-md px-3 py-2 text-sm
                    overflow-hidden
                    transition-[width,opacity] duration-300 ease-out
                    ${isSearchOpen ? "w-[550px] opacity-100" : "w-0 opacity-0 pointer-events-none"}

                  `}
                >
                  {/* Search Icon */}
                  <Search size={16} className="text-gray-400 mr-2 ml-[-0.25rem] shrink-0" />

                  {/* Dropdown Label */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 text-slate-700 dark:text-white font-medium mr-3 whitespace-nowrap outline-none">
                        {searchType}
                        <ChevronDown size={14} className="text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="mt-2 ml-[-2.2rem] bg-card border-slate-200 dark:border-[#2c3a4f] no-focus-outline">
                      {searchOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.label}
                          onClick={() => setSearchType(option.label)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <div className="w-4 flex items-center justify-center shrink-0">
                            {searchType === option.label && <Check size={14} className="text-primary" />}
                          </div>
                          <div className="text-muted-foreground flex items-center justify-center w-5">
                            {option.icon}
                          </div>
                          <span>{option.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Divider */}
                  <span className="h-4 w-px bg-gray-500/40 mr-3 shrink-0"></span>

                  {/* REAL INPUT */}
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search..."
                    className="
        flex-1 bg-transparent text-slate-900 dark:text-white placeholder-gray-400
        outline-none !border-none !shadow-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 text-sm
      "
                  />

                  {/* Close */}
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchValue("");
                    }}
                    className="ml-2 text-gray-400 hover:text-slate-900 dark:hover:text-white shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>


            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
        {/* Right Section */}
        <div className="flex items-center gap-6">



          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative hover:text-primary transition">
                <Bell size={20} />

              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end"
              sideOffset={6}
              className="w-80 bg-card text-card-foreground border-slate-200 dark:border-slate-700 mt-5 shadow-xl no-focus-outline">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem
                  onSelect={() => setLocation("/conversations/inbox")}
                  className="p-4 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <div>
                    <p className="font-medium">New message from John Doe</p>
                    <p className="text-sm text-muted-foreground">2 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setLocation("/campaigns")}
                  className="p-4 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <div>
                    <p className="font-medium">Campaign "Summer Sale" completed</p>
                    <p className="text-sm text-muted-foreground">1 hour ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setLocation("/templates")}
                  className="p-4 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <div>
                    <p className="font-medium">Template approved</p>
                    <p className="text-sm text-muted-foreground">3 hours ago</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
              <DropdownMenuItem
                onSelect={() => setLocation("/notifications")}
                className="justify-center text-primary py-2 cursor-pointer"
              >
                View All Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown - Avatar + Name + Status Below */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:opacity-80 transition">
                {/* Avatar */}
                <Avatar className="w-7 h-7">
                  <AvatarFallback className={`${getAvatarColor(user?.first_name || "User")} text-[10px] font-[600]`}>
                    {(user?.first_name?.[0] || "") + (user?.last_name?.[0] || "U")}
                  </AvatarFallback>
                </Avatar>

                {/* Name + Status Below */}
                <div className="text-left">
                  <p className="font-[400] text-[12px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                    {user ? `${user.first_name} ${user.last_name || ""}` : "Loading..."}
                  </p>
                  <div className="flex items-center gap-1.5 -mt-0.5">
                    {status === "available" ? (
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                    )}
                    <span className={`text-[12px] ${status === "available" ? "text-green-500" : "text-gray-400"}`}>
                      {status === "available" ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                {/* Down Arrow */}
                <ChevronDown size={16} className="text-gray-400 ml-2" />
              </button>
            </DropdownMenuTrigger>

            {/* Dropdown Content */}
            <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-xl rounded-lg mt-4 no-focus-outline">
              {/* Header */}
              <DropdownMenuItem asChild>
                <div
                  className="flex items-center gap-3 p-5 border-b border-gray-200 dark:border-slate-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-800 transition"
                  onClick={() => setLocation("/settings?tab=My%20Profile")}
                >
                  <Avatar className="w-8 h-8 my-1">
                    <AvatarFallback className={`${getAvatarColor(user?.first_name || "User")} text-xs font-bold`}>
                      {(user?.first_name?.[0] || "") + (user?.last_name?.[0] || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {user ? `${user.first_name} ${user.last_name || ""}` : "Profile"}
                    </p>
                    <div className="flex items-center gap-2 text-sm">

                    </div>
                  </div>
                </div>
              </DropdownMenuItem>

              {/* Online Status Selector */}
              <div className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Online Status</p>
                <CustomDropdown
                  options={statusOptions}
                  selected={[status]}
                  onChange={(val) => setStatus(val[0] as "available" | "unavailable")}
                  placeholder="Select Status"
                  width="100%"
                  showSelectedOption={true}
                  showSearch={false}
                />
              </div>

              {/* Workspace Selector */}
              <div className="px-4 pb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workspace</p>
                <CustomDropdown
                  options={workspaceOptions}
                  selected={workspace}
                  onChange={(val) => setWorkspace(val)}
                  placeholder="Select Workspace"
                  width="100%"
                  showSelectedOption={true}
                  showSearch={false}
                />
              </div>

              {/* Theme Selector */}
              <div className="px-4 pb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</p>
                <CustomDropdown
                  options={themeOptions}
                  selected={[theme]}
                  onChange={(val) => setTheme(val[0] as "light" | "dark")}
                  placeholder="Select Theme"
                  width="100%"
                  showSelectedOption={true}
                  showSearch={false}
                />
              </div>

              {/* Language */}
              <div className="px-4 pb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</p>
                <CustomDropdown
                  options={languageOptions}
                  selected={language}
                  onChange={(val) => setLanguage(val)}
                  placeholder="Select Language"
                  width="100%"
                  showSelectedOption={true}
                  showSearch={false}
                />
              </div>

              {/* Sign Out */}
              <div className="border-t border-gray-200 dark:border-slate-700 px-4 py-1">
                <button
                  onClick={() => {
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user_info");
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg px-3 py-2 font-medium transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
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