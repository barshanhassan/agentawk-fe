"use client";

import { useState, useEffect } from "react";
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
  Search,
  Sun,
  Moon,
  Circle,
} from "react-feather";
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
import { Input } from "@/components/ui/input";

export default function AppSidebar() {
  const [location] = useLocation();

  // State for Theme and Online Status
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [status, setStatus] = useState<"available" | "unavailable">("available");
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => {
    if (path === "/insights") return location === "/" || location === "/insights";
    return location.startsWith(path);
  };

 const hoverClass ="hover:bg-blue-500 hover:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white";
 const activeClass = "bg-blue-500 text-white";

 const subTriggerClass =
  "hover:bg-blue-500 hover:text-white " +
  "data-[highlighted]:bg-blue-500 data-[highlighted]:text-white " +
  "data-[state=open]:bg-blue-500 data-[state=open]:text-white";

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");



  const isConversationsParentActive =
    location.startsWith("/conversations/inbox") ||
    location.startsWith("/conversations/logs");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Menu items for search filtering
  const menuItems = [
    { label: "Insights", href: "/insights", icon: BarChart2 },
    { label: "Bot Conversations", href: "/conversations/bot", icon: Cpu },
    { label: "WhatsApp Templates", href: "/templates", icon: FileText },
    { label: "Campaign Manager", href: "/campaigns", icon: Send },
    { label: "Contacts", href: "/contacts", icon: Users },
    { label: "User Management", href: "/users", icon: Settings },
    { label: "Team Management", href: "/teams", icon: UserPlus },
    { label: "Workspace Management", href: "/workspaces", icon: Grid },
    { label: "WhatsApp Manager", href: "/whatsapp-manager", icon: SiWhatsapp },
    { label: "Billing", href: "/billing", icon: Grid },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-900 text-white shadow-lg border-b border-slate-800">
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
<button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-md transition text-sm">
  <BsGrid3X3GapFill size={14} className="text-white" />
  <span className="hidden md:block text-[14px] font-[500] font-[Roboto, sans-serif]">Menu</span>
</button>


            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="start"
              sideOffset={6}
              className="w-60  bg-slate-800 border-slate-700 text-white text-[14px] font-[Roboto, sans-serif] mt-2 rounded-md shadow-lg"
            >
              <DropdownMenuItem asChild>
                <Link
                  href="/insights"
                  className={`flex items-center gap-3 px-2 py-1  ${hoverClass} ${isActive("/insights") ? activeClass : ""}`}
                >
                  <BarChart2 size={18} /> Insights
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className={`flex items-center gap-3 px-2 py-1 ${subTriggerClass} ${isConversationsParentActive ? activeClass : ""}`}
                >
                  <MessageSquare size={18} /> Conversations
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/conversations/inbox"
                      className={`px-2 py-1 text-white ${hoverClass} ${isActive("/conversations/inbox") ? activeClass : ""}`}
                    >
                      <Mail size={18} /> 
                      Inbox
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/conversations/logs"
                      className={`px-2 py-1 text-white ${hoverClass} ${isActive("/conversations/logs") ? activeClass : ""}`}
                    >
                      <FileText size={18} /> 
                      Logs
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem asChild>
                <Link
                  href="/conversations/bot"
                  className={`flex items-center gap-3 px-2 py-1 ${hoverClass} ${isActive("/conversations/bot") ? activeClass : ""}`}
                >
                  <Cpu size={18} /> Bot Conversations
                </Link>
              </DropdownMenuItem>

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
                  href="/users"
                  className={`flex items-center gap-3 px-2 py-1 ${hoverClass} ${isActive("/users") ? activeClass : ""}`}
                >
                  <Settings size={18} /> User Management
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

              <DropdownMenuSeparator className="bg-slate-700" />

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
    className={`p-2 hover:bg-slate-800 rounded-md transition
      ${isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
  >
    <Search size={16} />
  </button>

  {/* Expanding Search Bar (to the RIGHT) */}
  <div
    className={`
      ml-2 flex items-center
      bg-[#1f2a3a] border border-[#2c3a4f]
      rounded-md px-3 py-2 text-sm
      overflow-hidden
      transition-all duration-300 ease-out
     ${isSearchOpen ? "w-[420px] opacity-100" : "w-0 opacity-0"}

    `}
  >
    {/* Search Icon */}
    <Search size={14} className="text-gray-400 mr-2 shrink-0" />

    {/* Dropdown Label */}
    <span className="flex items-center gap-1 text-white font-medium mr-3 whitespace-nowrap">
      WhatsApp number
      <ChevronDown size={14} className="text-gray-400" />
    </span>

    {/* Divider */}
    <span className="h-4 w-px bg-gray-500/40 mr-3 shrink-0"></span>

    {/* REAL INPUT */}
    <input
      type="text"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="Search..."
      autoFocus
      className="
        flex-1 bg-transparent text-white placeholder-gray-400
        outline-none border-none text-sm
      "
    />

    {/* Close */}
    <button
      onClick={() => {
        setIsSearchOpen(false);
        setSearchValue("");
      }}
      className="ml-2 text-gray-400 hover:text-white shrink-0"
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
              <button className="relative hover:text-teal-400 transition">
                <Bell size={20} />
                
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end"
            sideOffset={6}
            className="w-80  bg-slate-800 border-slate-700 text-white mt-5">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem
                  onSelect={() => window.location.href = "/conversations/inbox"}
                  className="p-4 hover:bg-slate-700 cursor-pointer"
                >
                  <div>
                    <p className="font-medium">New message from John Doe</p>
                    <p className="text-sm text-gray-400">2 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => window.location.href = "/campaigns"}
                  className="p-4 hover:bg-slate-700 cursor-pointer"
                >
                  <div>
                    <p className="font-medium">Campaign "Summer Sale" completed</p>
                    <p className="text-sm text-gray-400">1 hour ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => window.location.href = "/templates"}
                  className="p-4 hover:bg-slate-700 cursor-pointer"
                >
                  <div>
                    <p className="font-medium">Template approved</p>
                    <p className="text-sm text-gray-400">3 hours ago</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                onSelect={() => window.location.href = "/notifications"}
                className="justify-center text-teal-400 py-2 cursor-pointer"
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
                <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white font-[400] text-[10px] shadow-md">
                AD
                </div>

                {/* Name + Status Below */}
                <div className="text-left">
                  <p className="font-[400] text-[12px]">Admin User</p>
                  <div className="flex items-center gap-1.5 -mt-0.5">
                    {status === "available" ? (
                      <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                    ) : (
                      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                    )}
                    <span className={`text-[12px] ${status === "available" ? "text-green-400" : "text-gray-400"}`}>
                      {status === "available" ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                {/* Down Arrow */}
                <ChevronDown size={16} className="text-gray-400 ml-2" />
              </button>
            </DropdownMenuTrigger>

            {/* Dropdown Content */}
            <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-xl rounded-lg mt-4">
              {/* Header */}
              <DropdownMenuItem asChild>
                <div
                  className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-blue-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-800 transition"
                  onClick={() => window.location.href = "/profile"}
                >
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-[80%] uppercase leading-none">
                AD
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">Profile</p>
                    <div className="flex items-center gap-2 text-sm">
                     
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>

              {/* Online Status Selector */}
              <div className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Your Online Status</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-between bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-2 text-left">
                      <div className="flex items-center gap-2">
                        {status === "available" ? (
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        ) : (
                          <Circle size={12} className="text-gray-400" />
                        )}
                        <span className="text-sm font-medium capitalize">{status}</span>
                      </div>
                      <ChevronDown size={16} className="text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuRadioGroup value={status} onValueChange={(value) => setStatus(value as "available" | "unavailable")}>
                      <DropdownMenuRadioItem value="available" className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        Available
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="unavailable" className="flex items-center gap-2">
                        <Circle size={12} className="text-gray-400" />
                        Unavailable
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Theme Selector */}
              <div className="px-4 pb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-between bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-2 text-left">
                      <div className="flex items-center gap-2">
                        {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
                        <span className="text-sm font-medium capitalize">{theme}</span>
                      </div>
                      <ChevronDown size={16} className="text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as "light" | "dark")}>
                      <DropdownMenuRadioItem value="light" className="flex items-center gap-2">
                        <Sun size={18} /> Light
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark" className="flex items-center gap-2">
                        <Moon size={18} /> Dark
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Language */}
              <div className="px-4 pb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Language</p>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-3">
                    {/* US Flag Image */}
                    <img
                      src="https://flagcdn.com/w40/us.png"
                      alt="US Flag"
                      className="w-4 h-4 object-cover rounded-sm"
                    />
                    {/* Text: English (U.S) */}
                    <span className="text-sm font-medium">English (U.S)</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>

              {/* Sign Out */}
              <div className="border-t border-gray-200 dark:border-slate-700 px-4 py-3">
                <button
                  onClick={() => {
                    document.cookie = "demoLogin=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
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