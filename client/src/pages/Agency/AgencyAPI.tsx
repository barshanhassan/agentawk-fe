import React, { useState } from 'react';
import { Plug, Copy, RefreshCw, CheckCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const AgencyAPI = () => {
  const { mode } = useTheme();
  const { toast } = useToast();
  const [hasKey, setHasKey] = useState(true); // Default to true for demo as in the screenshot
  const [apiKey, setApiKey] = useState("2261IDKiMz3mBVbmEzs7rLizVbwkicjcCPiyVnaQXfQxRcc839b80");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    // Simulate generation
    const newKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    setHasKey(true);
    toast({
      title: "API Key Generated",
      description: "Your new API key has been generated successfully.",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300 min-h-screen", 
      mode === "dark" ? "bg-[#0f172a] text-white" : "bg-slate-50 text-slate-900")}>
      
      <div className={cn("rounded-xl border shadow-sm transition-all duration-300 w-full", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
        
        {/* Header Section */}
        <div className={cn("flex items-center justify-between p-6 border-b",
          mode === "dark" ? "border-slate-800" : "border-slate-200")}>
          <div className="flex items-center gap-4">
            <Plug className={cn("w-6 h-6", mode === "dark" ? "text-slate-300" : "text-slate-800")} fill="currentColor" />
            <div>
              <h1 className="text-[20px] font-bold tracking-tight">API</h1>
              <p className={cn("text-[13px] font-medium", mode === "dark" ? "text-slate-400" : "text-slate-600")}>
                Manage your API credential
              </p>
            </div>
          </div>
          <button className={cn("px-5 py-2 rounded font-medium text-[13px] transition-all border",
            mode === "dark" 
              ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" 
              : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>
             View instructions
          </button>
        </div>

        {/* Main Content Area */}
        <div className="min-h-[350px] flex flex-col items-center justify-center text-center py-10 px-6 transition-all duration-500">
          
          <Plug className="w-16 h-16 mb-4 text-[#00e55e]" fill="currentColor" strokeWidth={1} />

          {!hasKey ? (
            <>
              <h2 className={cn("text-[22px] font-bold mb-1 tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>
                API Key
              </h2>
              <p className={cn("text-[13px] mb-6 font-medium max-w-md mx-auto leading-relaxed", 
                mode === "dark" ? "text-slate-400" : "text-slate-600")}>
                Generate your API key to connect with external applications and automate your workflow.
              </p>
              <button 
                onClick={handleGenerate}
                className={cn("px-8 py-2.5 rounded font-medium text-[13px] transition-all border",
                  "bg-white hover:bg-slate-50 text-[#00e55e] border-[#00e55e]")}>
                Generate key
              </button>
            </>
          ) : (
            <div className="w-full max-w-3xl animate-in fade-in zoom-in duration-500">
              <h2 className={cn("text-[22px] font-bold mb-1 tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>
                Your API Key
              </h2>
              <p className={cn("text-[13px] mb-6 font-medium mx-auto", 
                mode === "dark" ? "text-slate-400" : "text-slate-600")}>
                Here is your API key for connecting with external applications
              </p>
              
              <div className="relative mb-5 group w-full max-w-[650px] mx-auto">
                <input 
                  type="text" 
                  readOnly 
                  value={apiKey}
                  className={cn("w-full px-4 py-3 rounded border text-center font-mono text-[13px] transition-all focus:outline-none",
                    mode === "dark" 
                      ? "bg-[#0f172a] border-slate-700 text-slate-300" 
                      : "bg-white border-slate-200 text-slate-500")}
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button 
                  onClick={handleGenerate}
                  className={cn("px-4 py-2 rounded font-medium text-[13px] transition-all border flex items-center gap-2",
                    mode === "dark" 
                      ? "bg-[#1e293b] hover:bg-slate-800 text-slate-300 border-slate-700" 
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
                  <RefreshCw size={14} />
                  Regenerate Key
                </button>
                
                <button 
                  onClick={handleCopy}
                  className={cn("px-6 py-2 rounded font-medium text-[13px] transition-all border flex items-center gap-2",
                    copied 
                      ? "bg-green-500 text-white border-green-500" 
                      : mode === "dark" 
                        ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" 
                        : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyAPI;
