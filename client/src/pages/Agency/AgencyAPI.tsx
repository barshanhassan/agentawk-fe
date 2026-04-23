import React from 'react';
import { Plug, Eye } from "lucide-react";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const AgencyAPI = () => {
  const { mode } = useTheme();
  
  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", 
      mode === "dark" ? "text-white" : "text-slate-900")}>
      {/* Header Section */}
      <div className={cn("flex items-center justify-between mb-8 p-4 rounded-md border shadow-sm transition-colors", 
        mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded", mode === "dark" ? "bg-[#334155]" : "bg-slate-100")}>
            <Plug className={cn("w-6 h-6", mode === "dark" ? "text-white" : "text-primary")} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">API</h1>
            <p className="text-gray-400 text-sm">Manage your API credential</p>
          </div>
        </div>
        <button className={cn("px-4 py-2 rounded font-bold text-sm transition-colors border shadow-sm",
          mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
           View instructions
        </button>
      </div>

      {/* Main Content Area */}
      <div className={cn("border rounded-lg shadow-xl min-h-[400px] flex flex-col items-center justify-center text-center p-12 transition-colors", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
        <div className="mb-6">
          <Plug className={cn("w-20 h-20 opacity-90 mx-auto", mode === "dark" ? "text-white" : "text-primary")} strokeWidth={1.5} />
        </div>
        <h2 className={cn("text-xl font-bold mb-2 uppercase tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>API key</h2>
        <p className="text-gray-400 text-sm mb-8 font-medium">
          Generate your API key to connect with external application
        </p>
        <button className={cn("px-6 py-2.5 rounded font-bold text-sm transition-colors border shadow-sm",
          mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
          Generate key
        </button>
      </div>
    </div>
  );
};

export default AgencyAPI;
