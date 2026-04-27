import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  Settings, 
  Ticket,
  FileText,
  BarChart3,
  ChevronLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import WorkspaceUsageView from "./WorkspaceUsageView";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const AgencyBillingManage = () => {
  const { mode } = useTheme();
  const { toast } = useToast();
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const agencyId = userInfo.modelable_id || "1";
  const [showUsageModal, setShowUsageModal] = React.useState(false);
  const [showManageModal, setShowManageModal] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState("");
  const [email, setEmail] = React.useState("");

  const usageItems = [
    { label: "Whatsapp QR", count: "4", type: "Chargeable", amount: "60.00" },
    { label: "Channels", count: "4", type: "Chargeable", amount: "40.00" },
    { label: "AI Agent Addon", count: "7", type: "Chargeable", amount: "28.00" },
    { label: "VIP Pass", count: "1", type: "Chargeable", amount: "20.00" },
    { label: "Enterprise Addon", count: "1", type: "Chargeable", amount: "499.00" },
    { label: "Contacts", count: "51515", type: "Total contacts", amount: "0.00" },
  ];
  const subtotal = 647.00;
  const discount = 152.05;
  const total = 494.95;

  const applyCoupon = () => {
    toast({ title: "Coupon Applied", description: "Coupon has been applied to your account." });
    setCouponCode("");
  };


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
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className={cn("text-xs h-10 transition-colors", 
                    mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")}
                />
                <button 
                  onClick={applyCoupon}
                  disabled={!couponCode}
                  className={cn("px-4 py-2 rounded text-sm font-bold transition-colors border shadow-sm",
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
            <button 
              onClick={() => setShowManageModal(true)}
              className={cn("px-6 py-2 rounded text-sm font-bold transition-colors border shadow-sm",
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
            <button 
              onClick={() => setShowUsageModal(true)}
              className={cn("px-6 py-2 rounded text-sm font-bold transition-colors border shadow-sm",
                mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
              Show current usage
            </button>
          </div>
        </Card>

      </div>

      {/* Manage Subscriptions Modal */}
      <Dialog open={showManageModal} onOpenChange={setShowManageModal}>
        <DialogContent hideClose className={cn("max-w-[450px] p-0 overflow-hidden border-none shadow-2xl", mode === 'dark' ? "bg-[#1e293b]" : "bg-white")}>
          <div className="relative">
            <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors z-50">
               <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                 <X size={18} />
               </div>
            </DialogClose>
            
            <div className="p-8 text-center space-y-6">
              <div className="flex flex-col items-center gap-3">
                 <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white text-xl">R</div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">REPLYAGENT</span>
              </div>
              
              <h2 className="text-2xl font-bold text-[#4ade80] tracking-tight">Manage Your Subscriptions</h2>
              
              <div className={cn("p-12 space-y-8 rounded-xl", mode === 'dark' ? "bg-slate-900/30" : "bg-slate-50/50")}>
                 <div className="space-y-4">
                    <p className="text-sm font-bold text-[#4ade80]">Enter your email address to login</p>
                    <Input 
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn("h-12 text-center text-sm border-slate-300 focus-visible:ring-0 shadow-sm", 
                        mode === 'dark' ? "bg-white text-slate-900" : "bg-white text-slate-900")}
                    />
                 </div>
                 
                 <button className="w-full h-12 bg-[#4ade80] hover:bg-[#22c55e] text-white font-bold text-lg rounded transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                   Continue <span className="text-xl">→</span>
                 </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Current Usage Modal */}
      <Dialog open={showUsageModal} onOpenChange={setShowUsageModal}>
        <DialogContent hideClose className={cn("max-w-3xl p-0 overflow-hidden", mode === 'dark' ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
          <DialogHeader className={cn("px-6 py-4 border-b", mode === 'dark' ? "border-slate-700" : "border-slate-100")}>
            <DialogTitle className={cn("text-lg font-bold", mode === 'dark' ? "text-white" : "text-slate-800")}>Current Usage</DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            <div className={cn("divide-y", mode === 'dark' ? "divide-slate-700" : "divide-slate-100")}>
             {usageItems.length === 0 ? (
               <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No usage data available</div>
             ) : usageItems.map((item: any, idx: number) => (
               <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/10 transition-colors">
                  <div className="space-y-0.5">
                     <p className="font-bold text-sm">{item.label}</p>
                  </div>
                  <div className="flex items-center gap-24">
                     <div className="text-right w-24">
                        <p className="text-sm font-bold">{item.count}</p>
                        <p className="text-[10px] text-gray-500 font-medium tracking-tight uppercase">{item.type}</p>
                     </div>
                     <div className="text-right w-24">
                        <p className="text-sm font-bold">{item.amount}</p>
                        <p className="text-[10px] text-gray-500 font-medium tracking-tight uppercase">Amount</p>
                     </div>
                  </div>
               </div>
             ))}
            </div>
          </div>
          
          <div className={cn("p-6 space-y-4 border-t", mode === 'dark' ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-100")}>
             <div className="flex justify-between items-center px-6">
                <span className="font-bold text-sm">Sub total</span>
                <div className="text-right">
                   <p className="text-sm font-bold">{subtotal.toFixed(2)}</p>
                   <p className="text-[10px] text-gray-500 font-medium tracking-tight uppercase">Amount</p>
                </div>
             </div>
             <div className="flex justify-between items-center px-6">
                <span className="font-bold text-sm">Discount</span>
                <div className="text-right">
                   <p className="text-sm font-bold">{discount.toFixed(2)}</p>
                   <p className="text-[10px] text-gray-500 font-medium tracking-tight uppercase">Amount</p>
                </div>
             </div>
             <div className="flex justify-between items-center px-6 pt-2">
                <span className="font-bold text-lg">Total</span>
                <div className="text-right">
                   <p className="text-lg font-bold text-primary">{total.toFixed(2)}</p>
                   <p className="text-[10px] text-gray-500 font-medium tracking-tight uppercase">Amount</p>
                </div>
             </div>
             
             <div className="flex justify-end pt-4">
                <DialogClose asChild>
                   <button className={cn("px-6 py-2 rounded text-sm font-bold transition-colors border shadow-sm",
                     mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
                     Close
                   </button>
                </DialogClose>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgencyBillingManage;
