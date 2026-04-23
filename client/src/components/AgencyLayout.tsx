import React from 'react';
import AgencySidebar from './AgencySidebar';
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  Moon, 
  Sun, 
  Globe, 
  User,
  ChevronRight,
  Circle
} from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/avatar-utils";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";

const AgencyLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<any>(null);
  const [status, setStatus] = React.useState("Available");
  const [language, setLanguage] = React.useState("English (U.S)");
  const [openStatus, setOpenStatus] = React.useState(false);
  const [openTheme, setOpenTheme] = React.useState(false);
  const [openLang, setOpenLang] = React.useState(false);
  const { mode, setMode } = useTheme();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_info");
    setLocation("/login");
  };

  return (
    <div className={cn("flex h-screen overflow-hidden transition-colors duration-300", mode === "dark" ? "bg-[#0f172a]" : "bg-slate-50")}>
      {/* Sidebar */}
      <AgencySidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className={cn("h-16 flex items-center justify-end px-8 border-b transition-colors duration-300", 
          mode === "dark" ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-200")}>
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <button className={cn("transition-colors", mode === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-slate-900")}>
              <Bell size={20} />
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu onOpenChange={() => {
              setOpenStatus(false);
              setOpenTheme(false);
              setOpenLang(false);
            }}>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity outline-none group">
                  <Avatar className={cn("w-8 h-8 ring-2", mode === "dark" ? "ring-slate-800" : "ring-slate-100")}>
                    <AvatarFallback className={`${getAvatarColor(user?.first_name || "User")} text-[10px] font-bold text-white`}>
                      {(user?.first_name?.[0] || "") + (user?.last_name?.[0] || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-right hidden sm:block leading-tight">
                    <p className={cn("text-sm font-medium transition-colors group-hover:text-primary", 
                      mode === "dark" ? "text-white" : "text-slate-900")}>
                      {user ? `${user.first_name} ${user.last_name || ""}` : "Loading..."}
                    </p>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-[11px] text-gray-400">{status}</span>
                    </div>
                  </div>
                  <ChevronDown size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={cn("w-64 border-slate-700 p-2 shadow-2xl transition-colors duration-200", 
                mode === "dark" ? "bg-[#1e293b] text-slate-300" : "bg-white text-slate-600 border-slate-200")} align="end">
                {/* Profile Link */}
                <DropdownMenuItem className={cn("flex items-center justify-between p-3 rounded-md cursor-pointer group outline-none",
                  mode === "dark" ? "hover:bg-[#334155] focus:bg-[#334155] focus:text-white" : "hover:bg-slate-100 focus:bg-slate-100 focus:text-slate-900")}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">
                       {(user?.first_name?.[0] || "H") + (user?.last_name?.[0] || "B")}
                    </div>
                    <span className={cn("font-semibold text-[14px]", mode === "dark" ? "text-white" : "text-slate-900")}>Profile</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                </DropdownMenuItem>

                <DropdownMenuSeparator className={mode === "dark" ? "bg-slate-700 my-2" : "bg-slate-100 my-2"} />

                {/* Online Status Section */}
                <div className="px-2 py-1">
                  <p className="text-[11px] font-bold text-gray-500 uppercase mb-2 px-1">Your Online Status</p>
                  <div 
                    onClick={(e) => { e.stopPropagation(); setOpenStatus(!openStatus); }}
                    className={cn("border rounded p-2 flex items-center justify-between cursor-pointer transition-colors group",
                      mode === "dark" ? "bg-[#0f172a]/50 border-slate-700 hover:border-slate-500" : "bg-slate-50 border-slate-200 hover:border-slate-300")}
                  >
                     <div className="flex items-center gap-2">
                        <div className={cn("w-2.5 h-2.5 rounded-full", 
                          status === "Available" ? (mode === "dark" ? "bg-white" : "bg-green-500") : (mode === "dark" ? "border-2 border-white" : "border-2 border-slate-400"))}></div>
                        <span className={cn("text-sm font-medium", mode === "dark" ? "text-white" : "text-slate-900")}>{status}</span>
                     </div>
                     <ChevronDown size={14} className={cn("text-gray-500 transition-transform", openStatus ? "rotate-180" : "")} />
                  </div>
                  {openStatus && (
                    <div className={cn("mt-1 border rounded overflow-hidden shadow-sm", 
                      mode === "dark" ? "bg-[#0f172a]/30 border-slate-800" : "bg-white border-slate-100")}>
                      <div 
                        onClick={() => { setStatus("Available"); setOpenStatus(false); }}
                        className={cn("flex items-center gap-2 p-2 cursor-pointer text-sm transition-colors",
                          mode === "dark" ? "hover:bg-[#334155]" : "hover:bg-slate-50")}
                      >
                         <div className={mode === "dark" ? "w-2.5 h-2.5 bg-white rounded-full" : "w-2.5 h-2.5 bg-green-500 rounded-full"}></div>
                         <span className={mode === "dark" ? "text-white" : "text-slate-700"}>Available</span>
                      </div>
                      <div 
                        onClick={() => { setStatus("Unavailable"); setOpenStatus(false); }}
                        className={cn("flex items-center gap-2 p-2 cursor-pointer text-sm transition-colors",
                          mode === "dark" ? "hover:bg-[#334155]" : "hover:bg-slate-50")}
                      >
                         <Circle size={10} className={mode === "dark" ? "text-white" : "text-slate-400"} />
                         <span className={mode === "dark" ? "text-white" : "text-slate-700"}>Unavailable</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme Switcher Section */}
                <div className="px-2 py-1">
                  <p className="text-[11px] font-bold text-gray-500 uppercase mb-2 px-1">Theme</p>
                  <div 
                    onClick={(e) => { e.stopPropagation(); setOpenTheme(!openTheme); }}
                    className={cn("border rounded p-2 flex items-center justify-between cursor-pointer transition-colors group",
                      mode === "dark" ? "bg-[#0f172a]/50 border-slate-700 hover:border-slate-500" : "bg-slate-50 border-slate-200 hover:border-slate-300")}
                  >
                     <div className="flex items-center gap-2">
                        {mode === "dark" ? <Moon size={16} className="text-white" /> : <Sun size={16} className="text-slate-900" />}
                        <span className={cn("text-sm font-medium capitalize", mode === "dark" ? "text-white" : "text-slate-900")}>{mode}</span>
                     </div>
                     <ChevronDown size={14} className={cn("text-gray-500 transition-transform", openTheme ? "rotate-180" : "")} />
                  </div>
                  {openTheme && (
                    <div className={cn("mt-1 border rounded overflow-hidden shadow-sm", 
                      mode === "dark" ? "bg-[#0f172a]/30 border-slate-800" : "bg-white border-slate-100")}>
                      <div 
                        onClick={() => { setMode("light"); setOpenTheme(false); }}
                        className={cn("flex items-center gap-2 p-2 cursor-pointer text-sm transition-colors",
                          mode === "dark" ? "hover:bg-[#334155]" : "hover:bg-slate-50")}
                      >
                         <Sun size={16} className={mode === "dark" ? "text-white" : "text-slate-600"} />
                         <span className={mode === "dark" ? "text-white" : "text-slate-700"}>Light</span>
                      </div>
                      <div 
                        onClick={() => { setMode("dark"); setOpenTheme(false); }}
                        className={cn("flex items-center gap-2 p-2 cursor-pointer text-sm transition-colors",
                          mode === "dark" ? "hover:bg-[#334155]" : "hover:bg-slate-50")}
                      >
                         <Moon size={16} className={mode === "dark" ? "text-white" : "text-slate-600"} />
                         <span className={mode === "dark" ? "text-white" : "text-slate-700"}>Dark</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Language Section */}
                <div className="px-2 py-1">
                  <p className="text-[11px] font-bold text-gray-500 uppercase mb-2 px-1">Language</p>
                  <div 
                    onClick={(e) => { e.stopPropagation(); setOpenLang(!openLang); }}
                    className={cn("border rounded p-2 flex items-center justify-between cursor-pointer transition-colors group",
                      mode === "dark" ? "bg-[#0f172a]/50 border-slate-700 hover:border-slate-500" : "bg-slate-50 border-slate-200 hover:border-slate-300")}
                  >
                     <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {language === "English (U.S)" ? "🇺🇸" : language === "Português do Brasil" ? "🇧🇷" : "🇪🇸"}
                        </span>
                        <span className={cn("text-sm font-medium", mode === "dark" ? "text-white" : "text-slate-900")}>{language}</span>
                     </div>
                     <ChevronDown size={14} className={cn("text-gray-500 transition-transform", openLang ? "rotate-180" : "")} />
                  </div>
                  {openLang && (
                    <div className={cn("mt-1 border rounded overflow-hidden shadow-sm", 
                      mode === "dark" ? "bg-[#0f172a]/30 border-slate-800" : "bg-white border-slate-100")}>
                      <div 
                        onClick={() => { setLanguage("English (U.S)"); setOpenLang(false); }}
                        className={cn("flex items-center gap-2 p-2 cursor-pointer text-sm transition-colors",
                          mode === "dark" ? "hover:bg-[#334155]" : "hover:bg-slate-50")}
                      >
                         <span className="text-lg">🇺🇸</span>
                         <span className={mode === "dark" ? "text-white" : "text-slate-700"}>English (U.S)</span>
                      </div>
                      <div 
                        onClick={() => { setLanguage("Português do Brasil"); setOpenLang(false); }}
                        className={cn("flex items-center gap-2 p-2 cursor-pointer text-sm transition-colors",
                          mode === "dark" ? "hover:bg-[#334155]" : "hover:bg-slate-50")}
                      >
                         <span className="text-lg">🇧🇷</span>
                         <span className={mode === "dark" ? "text-white" : "text-slate-700"}>Português do Brasil</span>
                      </div>
                      <div 
                        onClick={() => { setLanguage("Español"); setOpenLang(false); }}
                        className={cn("flex items-center gap-2 p-2 cursor-pointer text-sm transition-colors",
                          mode === "dark" ? "hover:bg-[#334155]" : "hover:bg-slate-50")}
                      >
                         <span className="text-lg">🇪🇸</span>
                         <span className={mode === "dark" ? "text-white" : "text-slate-700"}>Español</span>
                      </div>
                    </div>
                  )}
                </div>

                <DropdownMenuSeparator className={mode === "dark" ? "bg-slate-700 my-2" : "bg-slate-100 my-2"} />

                {/* Sign Out */}
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className={cn("flex items-center gap-3 p-3 rounded-md cursor-pointer text-slate-300 hover:text-red-400 group transition-colors outline-none",
                    mode === "dark" ? "hover:bg-red-500/10 focus:bg-red-500/10" : "hover:bg-red-50 focus:bg-red-50 focus:text-red-600")}
                >
                  <LogOut size={18} className="group-hover:text-red-400" />
                  <span className={cn("font-semibold text-[14px]", mode === "dark" ? "" : "text-slate-600")}>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className={cn("flex-1 overflow-auto transition-colors duration-300", 
          mode === "dark" ? "bg-[#0f172a]" : "bg-slate-50")}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;
