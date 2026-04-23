import React from 'react';
import { Cloud } from "lucide-react";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const AgencyPlans = () => {
  const { mode } = useTheme();
  
  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", 
      mode === "dark" ? "text-white" : "text-slate-900")}>
      {/* Header Section */}
      <div className={cn("flex items-center justify-between mb-8 p-4 rounded-md border shadow-sm transition-colors", 
        mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded", mode === "dark" ? "bg-[#334155]" : "bg-slate-100")}>
            <Cloud className={cn("w-6 h-6", mode === "dark" ? "text-white" : "text-primary")} />
          </div>
          <div>
            <h1 className="text-xl font-semibold uppercase tracking-tight">Plans</h1>
            <p className="text-gray-400 text-sm font-medium">Manage your SaaS plans</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className={cn("p-8 rounded-lg border shadow-xl max-w-md w-full transition-colors", 
          mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
           <Cloud className={cn("w-16 h-16 mx-auto mb-4 opacity-20", mode === "dark" ? "text-white" : "text-primary")} />
           <h2 className={cn("text-2xl font-bold uppercase tracking-tight", mode === "dark" ? "text-gray-400" : "text-slate-400")}>Coming Soon</h2>
           <p className="text-gray-500 mt-2 font-medium">We are currently working on the SaaS Plans feature. Please check back later!</p>
        </div>
      </div>
    </div>
  );
};

export default AgencyPlans;
