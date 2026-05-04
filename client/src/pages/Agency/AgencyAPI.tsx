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
      
      {/* Header Section */}
      <div className={cn("flex items-center justify-between mb-8 p-6 rounded-xl border shadow-sm transition-all duration-300", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-lg shadow-inner", mode === "dark" ? "bg-slate-800" : "bg-slate-100")}>
            <Plug className={cn("w-6 h-6", mode === "dark" ? "text-teal-400" : "text-teal-600")} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">API</h1>
            <p className={cn("text-sm font-medium", mode === "dark" ? "text-slate-400" : "text-slate-500")}>
              Manage your API credential
            </p>
          </div>
        </div>
        <button className={cn("px-5 py-2.5 rounded-lg font-bold text-sm transition-all border shadow-sm flex items-center gap-2",
          mode === "dark" 
            ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700" 
            : "bg-white hover:bg-slate-50 text-teal-600 border-teal-100")}>
           View instructions
        </button>
      </div>

      {/* Main Content Area */}
      <div className={cn("border rounded-2xl shadow-xl min-h-[500px] flex flex-col items-center justify-center text-center p-12 transition-all duration-500", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
        
        <div className={cn("mb-8 p-6 rounded-full transition-colors", mode === "dark" ? "bg-teal-500/10" : "bg-teal-50")}>
          <Plug className={cn("w-24 h-24 stroke-[1.5]", mode === "dark" ? "text-teal-400" : "text-teal-500")} />
        </div>

        {!hasKey ? (
          <>
            <h2 className={cn("text-2xl font-bold mb-3 tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>
              API Key
            </h2>
            <p className={cn("text-sm mb-10 font-medium max-w-md mx-auto leading-relaxed", 
              mode === "dark" ? "text-slate-400" : "text-slate-500")}>
              Generate your API key to connect with external applications and automate your workflow.
            </p>
            <button 
              onClick={handleGenerate}
              className={cn("px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-teal-500/20 active:scale-95",
                "bg-teal-500 hover:bg-teal-600 text-white")}>
              Generate key
            </button>
          </>
        ) : (
          <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-500">
            <h2 className={cn("text-2xl font-bold mb-3 tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>
              Your API Key
            </h2>
            <p className={cn("text-sm mb-8 font-medium mx-auto leading-relaxed", 
              mode === "dark" ? "text-slate-400" : "text-slate-500")}>
              Here is your API key for connecting with external applications
            </p>
            
            <div className="relative mb-8 group">
              <input 
                type="text" 
                readOnly 
                value={apiKey}
                className={cn("w-full px-6 py-4 rounded-xl border text-center font-mono text-sm transition-all focus:outline-none",
                  mode === "dark" 
                    ? "bg-[#0f172a] border-slate-700 text-slate-300 group-hover:border-slate-500" 
                    : "bg-slate-50 border-slate-200 text-slate-600 group-hover:border-teal-200")}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={handleGenerate}
                className={cn("px-6 py-3 rounded-xl font-bold text-sm transition-all border shadow-sm flex items-center gap-2 active:scale-95",
                  mode === "dark" 
                    ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700" 
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
                <RefreshCw size={16} />
                Regenerate Key
              </button>
              
              <button 
                onClick={handleCopy}
                className={cn("px-10 py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center gap-2 active:scale-95",
                  copied 
                    ? "bg-green-500 text-white" 
                    : "bg-teal-500 hover:bg-teal-600 text-white")}>
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyAPI;
