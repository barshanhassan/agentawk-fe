import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  Settings, 
  Ticket,
  FileText,
  BarChart3,
  ChevronLeft,
  X
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
import { useToast } from "@/hooks/use-toast";

const AgencyBillingManage = () => {
  const { mode } = useTheme();
  const { toast } = useToast();
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const [showUsageModal, setShowUsageModal] = React.useState(false);
  const [showManageModal, setShowManageModal] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupons, setAppliedCoupons] = React.useState(["10PERCENT", "15PERCENT"]);
  const [couponError, setCouponError] = React.useState(false);
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
    if (!couponCode.trim()) {
      setCouponError(true);
      return;
    }
    setCouponError(false);
    const upperCode = couponCode.toUpperCase();
    if (!appliedCoupons.includes(upperCode)) {
      setAppliedCoupons([...appliedCoupons, upperCode]);
      toast({ title: "Coupon Applied", description: `Coupon ${upperCode} has been applied.` });
    } else {
      toast({ title: "Already Applied", description: "This coupon is already in use.", variant: "destructive" });
    }
    setCouponCode("");
  };

  const removeCoupon = (code: string) => {
    setAppliedCoupons(appliedCoupons.filter(c => c !== code));
    toast({ title: "Coupon Removed", description: `Coupon ${code} has been removed.` });
  };

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300 min-h-screen", 
      mode === "dark" ? "bg-[#0f172a] text-white" : "bg-slate-50 text-slate-900")}>
      
      {/* Header Section */}
      <div className={cn("flex items-center justify-between mb-8 p-6 rounded-xl border shadow-sm transition-all duration-300", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-lg", mode === "dark" ? "bg-slate-800" : "bg-slate-100")}>
            <FileText className={cn("w-6 h-6", mode === "dark" ? "text-teal-400" : "text-teal-600")} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Billing Plan</h1>
            <p className={cn("text-sm font-medium", mode === "dark" ? "text-slate-400" : "text-slate-500")}>Manage your subscription</p>
          </div>
        </div>
      </div>

      {/* Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Coupons Card */}
        <Card className={cn("shadow-lg min-h-[260px] flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl", 
          mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-100")}>
          <div className="flex items-start gap-3 mb-6">
            <Ticket className="w-5 h-5 text-teal-500 mt-1" />
            <div>
              <h3 className={cn("font-bold text-lg tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>Coupons</h3>
              <p className={cn("text-xs font-medium", mode === "dark" ? "text-slate-400" : "text-slate-500")}>Add discount coupon</p>
            </div>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("text-sm font-bold", mode === "dark" ? "text-slate-300" : "text-slate-600")}>Applied coupons:</span>
              <div className="flex flex-wrap gap-2">
                {appliedCoupons.map(coupon => (
                  <Badge 
                    key={coupon}
                    variant="secondary" 
                    className={cn("px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 group", 
                      mode === "dark" 
                        ? "bg-teal-500/10 text-teal-400 hover:bg-teal-500/20" 
                        : "bg-teal-500 text-white hover:bg-teal-600")}
                  >
                    {coupon}
                    <X 
                      size={12} 
                      className="cursor-pointer opacity-70 hover:opacity-100" 
                      onClick={() => removeCoupon(coupon)} 
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className={cn("text-sm font-bold", mode === "dark" ? "text-slate-300" : "text-slate-600")}>Add a coupon</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter the coupon code e.g. FREECOUPON"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      if (e.target.value.trim()) setCouponError(false);
                    }}
                    className={cn("text-sm h-11 transition-all rounded-xl focus:ring-teal-500", 
                      mode === "dark" 
                        ? "bg-[#0f172a] border-slate-700 text-white" 
                        : "bg-slate-50 border-slate-200 text-slate-900",
                      couponError && "border-red-500")}
                  />
                  <button 
                    onClick={applyCoupon}
                    className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all border shadow-sm active:scale-95",
                      mode === "dark" 
                        ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700" 
                        : "bg-white hover:bg-slate-50 text-teal-600 border-teal-200")}>
                    Add
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-red-500 font-bold italic ml-1">
                    Please enter the coupon code
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Manage billing & credit card Card */}
        <Card className={cn("shadow-lg min-h-[260px] flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl", 
          mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-100")}>
          <div className="flex items-start gap-3 mb-4 flex-1">
            <CreditCard className="w-5 h-5 text-teal-500 mt-1" />
            <div>
              <h3 className={cn("font-bold text-lg tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>Manage billing & credit card</h3>
              <p className={cn("text-xs font-medium", mode === "dark" ? "text-slate-400" : "text-slate-500")}>Manage invoices and credit card information on file.</p>
            </div>
          </div>
          
          <div className="flex justify-end mt-auto">
            <button 
              onClick={() => setShowManageModal(true)}
              className={cn("px-8 py-2 rounded-xl text-sm font-bold transition-all border shadow-sm active:scale-95",
                mode === "dark" 
                  ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700" 
                  : "bg-white hover:bg-slate-50 text-teal-600 border-teal-200")}>
              Manage
            </button>
          </div>
        </Card>

        {/* Current Usage Card */}
        <Card className={cn("shadow-lg min-h-[260px] flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl", 
          mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-100")}>
          <div className="flex items-start gap-3 mb-4 flex-1">
            <BarChart3 className="w-5 h-5 text-teal-500 mt-1" />
            <div>
              <h3 className={cn("font-bold text-lg tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>Current Usage</h3>
              <p className={cn("text-xs font-medium", mode === "dark" ? "text-slate-400" : "text-slate-500")}>View your account costs</p>
            </div>
          </div>
          
          <div className="flex justify-end mt-auto">
            <button 
              onClick={() => setShowUsageModal(true)}
              className={cn("px-8 py-2 rounded-xl text-sm font-bold transition-all border shadow-sm active:scale-95",
                mode === "dark" 
                  ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700" 
                  : "bg-white hover:bg-slate-50 text-teal-600 border-teal-200")}>
              Show current usage
            </button>
          </div>
        </Card>

      </div>

      {/* Manage Subscriptions Modal */}
      <Dialog open={showManageModal} onOpenChange={setShowManageModal}>
        <DialogContent hideClose className={cn("max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl", mode === 'dark' ? "bg-[#1e293b]" : "bg-white")}>
          <div className="relative">
            <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors z-50">
               <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                 <X size={18} />
               </div>
            </DialogClose>
            
            <div className="p-8 text-center space-y-6">
              <div className="flex flex-col items-center gap-3">
                 <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-teal-500/20">R</div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">REPLYAGENT</span>
              </div>
              
              <h2 className="text-2xl font-bold text-teal-500 tracking-tight">Manage Your Subscriptions</h2>
              
              <div className={cn("p-12 space-y-8 rounded-2xl shadow-inner", mode === 'dark' ? "bg-slate-900/30" : "bg-slate-50/50")}>
                 <div className="space-y-4">
                    <p className="text-sm font-bold text-teal-500">Enter your email address to login</p>
                    <Input 
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn("h-12 text-center text-sm border-slate-200 focus-visible:ring-0 shadow-sm rounded-xl", 
                        mode === 'dark' ? "bg-[#0f172a] text-white border-slate-700" : "bg-white text-slate-900")}
                    />
                 </div>
                 
                 <button className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 active:scale-95">
                   Continue <span className="text-xl">→</span>
                 </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Current Usage Modal */}
      <Dialog open={showUsageModal} onOpenChange={setShowUsageModal}>
        <DialogContent hideClose className={cn("max-w-3xl p-0 overflow-hidden rounded-2xl", mode === 'dark' ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
          <DialogHeader className={cn("px-6 py-4 border-b transition-colors", mode === 'dark' ? "border-slate-700 bg-slate-900/50" : "border-slate-100 bg-slate-50/30")}>
            <DialogTitle className={cn("text-lg font-bold tracking-tight", mode === 'dark' ? "text-white" : "text-slate-800")}>Current Usage</DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            <div className={cn("divide-y transition-colors", mode === 'dark' ? "divide-slate-700" : "divide-slate-100")}>
             {usageItems.length === 0 ? (
               <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No usage data available</div>
             ) : usageItems.map((item, idx) => (
               <div key={idx} className={cn("px-8 py-5 flex items-center justify-between transition-colors", mode === 'dark' ? "hover:bg-slate-800/40" : "hover:bg-slate-50")}>
                  <div className="space-y-1">
                     <p className="font-bold text-sm tracking-tight">{item.label}</p>
                  </div>
                  <div className="flex items-center gap-24">
                     <div className="text-right w-24">
                        <p className="text-sm font-bold tracking-tight">{item.count}</p>
                        <p className="text-[10px] text-gray-500 font-bold tracking-tight uppercase opacity-70">{item.type}</p>
                     </div>
                     <div className="text-right w-24">
                        <p className="text-sm font-bold tracking-tight">{item.amount}</p>
                        <p className="text-[10px] text-gray-500 font-bold tracking-tight uppercase opacity-70">Amount</p>
                     </div>
                  </div>
               </div>
             ))}
            </div>
          </div>
          
          <div className={cn("p-8 space-y-5 border-t transition-colors", mode === 'dark' ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-100")}>
             <div className="flex justify-between items-center px-6">
                <span className="font-bold text-sm text-slate-500">Sub total</span>
                <div className="text-right">
                   <p className="text-sm font-bold">{subtotal.toFixed(2)}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Amount</p>
                </div>
             </div>
             <div className="flex justify-between items-center px-6">
                <span className="font-bold text-sm text-slate-500">Discount</span>
                <div className="text-right">
                   <p className="text-sm font-bold text-teal-500">-{discount.toFixed(2)}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Amount</p>
                </div>
             </div>
             <div className="flex justify-between items-center px-6 pt-3 border-t border-dashed border-slate-300 dark:border-slate-600">
                <span className="font-bold text-xl tracking-tighter">Total</span>
                <div className="text-right">
                   <p className="text-2xl font-black text-teal-500 tracking-tighter">{total.toFixed(2)}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Amount</p>
                </div>
             </div>
             
             <div className="flex justify-end pt-6">
                <DialogClose asChild>
                   <button className={cn("px-10 py-2.5 rounded-xl text-sm font-bold transition-all border shadow-sm active:scale-95",
                     mode === "dark" 
                      ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700" 
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
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
