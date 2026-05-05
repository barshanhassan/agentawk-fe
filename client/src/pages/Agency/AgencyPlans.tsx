import React from 'react';
import { Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const AgencyPlans = () => {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  
  return (
    <div className={cn("p-6 font-sans transition-colors duration-300 w-full h-[80vh] flex flex-col items-center justify-center", 
      isDark ? "text-white" : "text-slate-900")}>
      
      <div className={cn("relative p-10 rounded-3xl shadow-xl border flex flex-col items-center justify-center max-w-md w-full text-center overflow-hidden transition-all",
        isDark ? "border-[#00e55e]/20 bg-[#00e55e]/10" : "border-[#00e55e]/30 bg-[#f2fdf5]")}>
        
        {/* Decorative Background Blurs */}
        <div className={cn("absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none", 
          isDark ? "bg-[#00e55e]" : "bg-[#00e55e]")} />
        <div className={cn("absolute -bottom-24 -left-24 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none", 
          isDark ? "bg-blue-500" : "bg-blue-400")} />

        {/* Icon Container */}
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 z-10 shadow-sm transition-transform hover:scale-105",
          isDark ? "bg-slate-800 border border-slate-700" : "bg-slate-50 border border-slate-100")}>
          <Sparkles className={cn("w-8 h-8", isDark ? "text-[#00e55e]" : "text-[#00e55e]")} strokeWidth={1.5} />
        </div>
        
        {/* Text Content */}
        <h1 className={cn("text-3xl font-black mb-3 z-10 tracking-tight", 
          isDark ? "text-white" : "text-slate-900")}>
          Coming Soon...
        </h1>
        
        <p className={cn("font-medium text-[15px] z-10 leading-relaxed px-2", 
          isDark ? "text-slate-400" : "text-slate-500")}>
          We're crafting something amazing for your SaaS plans. Stay tuned, this feature is currently under active development.
        </p>


      </div>
      
    </div>
  );
};

export default AgencyPlans;
