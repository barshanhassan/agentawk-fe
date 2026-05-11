import React from 'react';
import { getUserInfo } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  Settings, 
  Ticket,
  FileText,
  BarChart3,
  ChevronLeft,
  X,
  Receipt
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
import { useTranslation } from 'react-i18next';

const AgencyBillingManage = () => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const { toast } = useToast();
  const userInfo = getUserInfo();
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
      toast({ title: t("agency.billing.coupons.applied"), description: t("agency.billing.coupons.appliedDesc", { code: upperCode }) });
    } else {
      toast({ title: t("agency.billing.coupons.alreadyApplied"), description: t("agency.billing.coupons.alreadyAppliedDesc"), variant: "destructive" });
    }
    setCouponCode("");
  };

  const removeCoupon = (code: string) => {
    setAppliedCoupons(appliedCoupons.filter(c => c !== code));
    toast({ title: t("agency.billing.coupons.removed"), description: t("agency.billing.coupons.removedDesc", { code }) });
  };

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", 
      mode === "dark" ? "bg-[#0f172a] text-white" : "bg-slate-50 text-slate-900")}>
      
      <div className={cn("rounded-xl border shadow-sm transition-all duration-300 w-full", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-300")}>
        
        {/* Header Section */}
        <div className={cn("flex items-center gap-4 p-5 border-b",
          mode === "dark" ? "border-slate-800" : "border-slate-300")}>
          <div className={cn("p-2.5 rounded-xl border transition-all", 
            mode === "dark" ? "bg-[#0f172a] border-slate-700 shadow-[0_0_15px_rgba(0,229,94,0.1)]" : "bg-white border-slate-200 shadow-sm")}>
            <Receipt className="w-6 h-6 text-[#00e55e]" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-[20px] font-bold tracking-tight">{t("agency.billing.title")}</h1>
            <p className={cn("text-[13px] font-medium", mode === "dark" ? "text-slate-400" : "text-slate-600")}>
              {t("agency.billing.desc")}
            </p>
          </div>
        </div>

        {/* Management Grid */}
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Coupons Box */}
            <div className={cn("flex flex-col p-5 rounded-lg border", 
              mode === "dark" ? "border-slate-800" : "border-slate-300")}>
              <div className="flex items-start gap-3 mb-6">
                <Ticket className={cn("w-5 h-5", mode === "dark" ? "text-slate-300" : "text-slate-800")} />
                <div>
                  <h3 className={cn("font-bold text-[15px] tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>{t("agency.billing.coupons.title")}</h3>
                  <p className={cn("text-[12px] font-medium mt-0.5", mode === "dark" ? "text-slate-400" : "text-slate-600")}>{t("agency.billing.coupons.addDesc")}</p>
                </div>
              </div>
              
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-300" : "text-slate-900")}>{t("agency.billing.coupons.appliedList")}</span>
                  <div className="flex flex-wrap gap-2">
                    {appliedCoupons.map(coupon => (
                      <Badge 
                        key={coupon}
                        variant="secondary" 
                        className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#00e55e] hover:bg-[#00e55e] text-white border-none flex items-center"
                      >
                        {coupon}
                        <X 
                          size={12} 
                          className="cursor-pointer ml-1 opacity-70 hover:opacity-100" 
                          onClick={() => removeCoupon(coupon)} 
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-300" : "text-slate-900")}>{t("agency.billing.coupons.add")}</p>
                  <div className="flex gap-2">
                    <Input 
                      placeholder={t("agency.billing.coupons.placeholder")}
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        if (e.target.value.trim()) setCouponError(false);
                      }}
                      className={cn("text-[13px] h-9 rounded transition-all focus-visible:ring-1 focus-visible:ring-slate-300 shadow-none", 
                        mode === "dark" 
                          ? "bg-[#0f172a] border-slate-700 text-white" 
                          : "bg-white border-slate-200 text-slate-900",
                        couponError && "border-red-500")}
                    />
                    <button 
                      onClick={applyCoupon}
                      className={cn("px-4 py-1.5 rounded text-[13px] font-medium transition-all border",
                        mode === "dark" 
                          ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" 
                          : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>
                      {t("common.add")}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-500 font-bold italic ml-1">
                      {t("agency.billing.coupons.error")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Manage billing & credit card Box */}
            <div className={cn("flex flex-col p-5 rounded-lg border", 
              mode === "dark" ? "border-slate-800" : "border-slate-300")}>
              <div className="flex items-start gap-3 mb-4 flex-1">
                <CreditCard className={cn("w-5 h-5", mode === "dark" ? "text-slate-300" : "text-slate-800")} />
                <div>
                  <h3 className={cn("font-bold text-[15px] tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>{t("agency.billing.manage.title")}</h3>
                  <p className={cn("text-[12px] font-medium mt-0.5", mode === "dark" ? "text-slate-400" : "text-slate-600")}>{t("agency.billing.manage.desc")}</p>
                </div>
              </div>
              
              <div className="flex justify-end mt-auto">
                <button 
                  onClick={() => setShowManageModal(true)}
                  className={cn("px-6 py-1.5 rounded text-[13px] font-medium transition-all border",
                    mode === "dark" 
                      ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" 
                      : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>
                  {t("common.manage")}
                </button>
              </div>
            </div>

            {/* Current Usage Box */}
            <div className={cn("flex flex-col p-5 rounded-lg border", 
              mode === "dark" ? "border-slate-800" : "border-slate-300")}>
              <div className="flex items-start gap-3 mb-4 flex-1">
                <BarChart3 className={cn("w-5 h-5", mode === "dark" ? "text-slate-300" : "text-slate-800")} />
                <div>
                  <h3 className={cn("font-bold text-[15px] tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>{t("agency.billing.usage.title")}</h3>
                  <p className={cn("text-[12px] font-medium mt-0.5", mode === "dark" ? "text-slate-400" : "text-slate-600")}>{t("agency.billing.usage.desc")}</p>
                </div>
              </div>
              
              <div className="flex justify-end mt-auto">
                <button 
                  onClick={() => setShowUsageModal(true)}
                  className={cn("px-6 py-1.5 rounded text-[13px] font-medium transition-all border",
                    mode === "dark" 
                      ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" 
                      : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>
                  {t("agency.billing.usage.show")}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Manage Subscriptions Modal */}
      <Dialog open={showManageModal} onOpenChange={setShowManageModal}>
        <DialogContent hideClose className={cn("max-w-[420px] p-0 overflow-visible border shadow-lg rounded-lg", mode === 'dark' ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
          <div className="relative">
            <DialogClose className={cn("absolute -right-3 -top-3 transition-colors z-50", mode === 'dark' ? "text-slate-300" : "text-white")}>
               <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2 shadow-sm", 
                 mode === 'dark' ? "bg-slate-700 hover:bg-slate-600 border-slate-800" : "bg-slate-500 hover:bg-slate-600 border-white")}>
                 <X size={12} strokeWidth={3} />
               </div>
            </DialogClose>
            
            <div className="text-center">
              {/* Header Section */}
              <div className={cn("p-6 pb-5 border-b", mode === 'dark' ? "border-slate-800" : "border-slate-100")}>
                <div className="flex flex-col items-center gap-1.5 mb-4">
                   <div className="w-8 h-8 bg-[#00e55e] rounded flex items-center justify-center font-bold text-white text-[15px]">E</div>
                   <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">EZCONN</span>
                </div>
                
                <h2 className="text-[17px] font-bold text-[#00e55e]">{t("agency.billing.manage.modalTitle")}</h2>
              </div>
              
              {/* Form Section */}
              <div className="p-8 pb-10 space-y-6">
                 <div className="space-y-3">
                    <p className="text-[13px] font-medium text-[#00e55e]">{t("agency.billing.manage.emailPrompt")}</p>
                    <Input 
                      placeholder={t("common.email")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn("h-10 text-center text-[13px] border focus-visible:ring-1 focus-visible:ring-slate-300 shadow-none rounded", 
                        mode === 'dark' ? "bg-[#0f172a] text-white border-slate-700" : "bg-white text-slate-500 border-slate-200")}
                    />
                 </div>
                 
                 <button className="w-full h-10 bg-[#00e55e] hover:bg-[#00c853] text-white font-bold text-[13px] rounded transition-all flex items-center justify-center gap-1.5 active:scale-95">
                   {t("common.continue")} <span>→</span>
                 </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Current Usage Modal */}
      <Dialog open={showUsageModal} onOpenChange={setShowUsageModal}>
        <DialogContent hideClose className={cn("max-w-2xl p-0 overflow-visible rounded-lg shadow-xl border", mode === 'dark' ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
          <DialogHeader className={cn("px-6 py-4 border-b", mode === 'dark' ? "border-slate-800" : "border-slate-100")}>
            <DialogTitle className={cn("text-[15px] font-medium tracking-tight", mode === 'dark' ? "text-white" : "text-slate-900")}>{t("agency.billing.usage.title")}</DialogTitle>
          </DialogHeader>
          
          <div>
            <div className={cn("divide-y", mode === 'dark' ? "divide-slate-800" : "divide-slate-100")}>
             {usageItems.length === 0 ? (
               <div className="flex items-center justify-center h-32 text-slate-400 text-[13px]">{t("agency.billing.usage.empty")}</div>
             ) : usageItems.map((item, idx) => (
               <div key={idx} className={cn("px-6 py-3 flex items-center justify-between", mode === 'dark' ? "hover:bg-slate-800/40" : "hover:bg-slate-50")}>
                  <div>
                     <p className={cn("text-[13px] font-medium", mode === 'dark' ? "text-slate-300" : "text-slate-800")}>{item.label}</p>
                  </div>
                  <div className="flex items-center gap-16">
                     <div className="text-center w-20">
                        <p className={cn("text-[13px] font-bold", mode === 'dark' ? "text-slate-200" : "text-slate-900")}>{item.count}</p>
                        <p className="text-[9px] text-slate-400 uppercase">{item.type}</p>
                     </div>
                     <div className="text-right w-20">
                        <p className={cn("text-[13px] font-bold", mode === 'dark' ? "text-slate-200" : "text-slate-900")}>{item.amount}</p>
                        <p className="text-[9px] text-slate-400 uppercase">{t("agency.billing.usage.amount")}</p>
                     </div>
                  </div>
               </div>
             ))}
            </div>
          </div>
          
          <div className={cn("px-6 py-4 space-y-3 border-t", mode === 'dark' ? "border-slate-800" : "border-slate-100")}>
             <div className="flex justify-between items-center">
                <span className={cn("text-[13px] font-bold", mode === 'dark' ? "text-slate-300" : "text-slate-800")}>{t("agency.billing.usage.subtotal")}</span>
                <div className="text-right">
                   <p className={cn("text-[13px] font-bold", mode === 'dark' ? "text-slate-200" : "text-slate-900")}>{subtotal.toFixed(2)}</p>
                   <p className="text-[9px] text-slate-400 uppercase">{t("agency.billing.usage.amount")}</p>
                </div>
             </div>
             <div className="flex justify-between items-center">
                <span className={cn("text-[13px] font-bold", mode === 'dark' ? "text-slate-300" : "text-slate-800")}>{t("agency.billing.usage.discount")}</span>
                <div className="text-right">
                   <p className={cn("text-[13px] font-bold", mode === 'dark' ? "text-slate-200" : "text-slate-900")}>{discount.toFixed(2)}</p>
                   <p className="text-[9px] text-slate-400 uppercase">{t("agency.billing.usage.amount")}</p>
                </div>
             </div>
             <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200 dark:border-slate-700">
                <span className={cn("text-[15px] font-bold", mode === 'dark' ? "text-white" : "text-slate-900")}>{t("agency.billing.usage.total")}</span>
                <div className="text-right">
                   <p className={cn("text-[15px] font-bold", mode === 'dark' ? "text-white" : "text-slate-900")}>{total.toFixed(2)}</p>
                   <p className="text-[9px] text-slate-400 uppercase">{t("agency.billing.usage.amount")}</p>
                </div>
             </div>
             
             <div className="flex justify-end pt-4">
                <DialogClose asChild>
                   <button className={cn("px-6 py-1.5 rounded text-[13px] font-medium transition-all border",
                     mode === "dark" 
                      ? "bg-[#1e293b] hover:bg-slate-800 text-slate-300 border-slate-700" 
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
                     {t("common.close")}
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
