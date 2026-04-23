import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  Settings, 
  Ticket,
  FileText,
  BarChart3
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const AgencyBillingManage = () => {
  const { mode } = useTheme();
  
  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", 
      mode === "dark" ? "text-white" : "text-slate-900")}>
      {/* Header Section */}
      <div className={cn("flex items-center justify-between mb-8 p-4 rounded-md border shadow-sm transition-colors", 
        mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded", mode === "dark" ? "bg-[#334155]" : "bg-slate-100")}>
            <FileText className={cn("w-6 h-6", mode === "dark" ? "text-white" : "text-primary")} />
          </div>
          <div>
            <h1 className="text-xl font-semibold uppercase tracking-tight">Billing Plan</h1>
            <p className="text-gray-400 text-sm font-medium">Manage your subscription</p>
          </div>
        </div>
      </div>

      {/* Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Coupons Card */}
        <Card className={cn("shadow-lg min-h-[220px] flex flex-col p-6 transition-colors", 
          mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
          <div className="flex items-start gap-3 mb-6">
            <Ticket className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className={cn("font-bold uppercase tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>Coupons</h3>
              <p className="text-xs text-gray-500 font-medium">Add discount coupon</p>
            </div>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-bold", mode === "dark" ? "text-gray-300" : "text-slate-700")}>Applied:</span>
              <div className="flex gap-2">
                <Badge variant="secondary" className={cn("hover:bg-primary/20 px-3 py-1 rounded-full text-[11px] font-bold border transition-colors", 
                  mode === "dark" ? "bg-[#334155] text-gray-300 border-slate-600" : "bg-primary/10 text-primary border-primary/20")}>10PERCENT</Badge>
                <Badge variant="secondary" className={cn("hover:bg-primary/20 px-3 py-1 rounded-full text-[11px] font-bold border transition-colors", 
                  mode === "dark" ? "bg-[#334155] text-gray-300 border-slate-600" : "bg-primary/10 text-primary border-primary/20")}>15PERCENT</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className={cn("text-sm font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-200" : "text-slate-500")}>Add a coupon</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="FREECOUPON" 
                  className={cn("text-xs h-10 transition-colors", 
                    mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")}
                />
                <button className={cn("px-4 py-2 rounded text-sm font-bold transition-colors border shadow-sm",
                  mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Manage billing & credit card Card */}
        <Card className={cn("shadow-lg min-h-[220px] flex flex-col p-6 transition-colors", 
          mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
          <div className="flex items-start gap-3 mb-4 flex-1">
            <CreditCard className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className={cn("font-bold uppercase tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>Billing & Card</h3>
              <p className="text-xs text-gray-500 font-medium">Manage invoices and credit card information on file.</p>
            </div>
          </div>
          
          <div className="flex justify-end mt-auto">
            <button className={cn("px-6 py-2 rounded text-sm font-bold transition-colors border shadow-sm",
              mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
              Manage
            </button>
          </div>
        </Card>

        {/* Current Usage Card */}
        <Card className={cn("shadow-lg min-h-[220px] flex flex-col p-6 transition-colors", 
          mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
          <div className="flex items-start gap-3 mb-4 flex-1">
            <BarChart3 className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className={cn("font-bold uppercase tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>Current Usage</h3>
              <p className="text-xs text-gray-500 font-medium">View your account costs and resources.</p>
            </div>
          </div>
          
          <div className="flex justify-end mt-auto">
            <button className={cn("px-6 py-2 rounded text-sm font-bold transition-colors border shadow-sm",
              mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
              Show current usage
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default AgencyBillingManage;
