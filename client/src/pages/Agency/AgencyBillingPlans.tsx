import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  AlertTriangle,
  Check,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from 'react-i18next';

const AgencyBillingPlans = () => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelCodeInput, setCancelCodeInput] = useState("");
  const [checks, setChecks] = useState({
    c1: false,
    c2: false,
    c3: false
  });

  const generatedCode = "44399";

  const plans = [
    { 
      name: t("agency.billing.plans.types.free.name"), 
      price: "$0", 
      limit: t("agency.billing.plans.types.free.limit"), 
      feature: t("agency.billing.plans.types.free.feature") 
    },
    { 
      name: t("agency.billing.plans.types.premium.name"), 
      price: "$19", 
      limit: t("agency.billing.plans.types.premium.limit"), 
      feature: t("agency.billing.plans.types.premium.feature") 
    },
    { 
      name: t("agency.billing.plans.types.ignite.name"), 
      price: "$299", 
      limit: t("agency.billing.plans.types.ignite.limit"), 
      feature: t("agency.billing.plans.types.ignite.feature") 
    },
    { 
      name: t("agency.billing.plans.types.enterprise.name"), 
      price: "$599", 
      limit: t("agency.billing.plans.types.enterprise.limit"), 
      feature: t("agency.billing.plans.types.enterprise.feature"),
      isCurrent: true,
      nextPayment: "2026-05-11"
    },
  ];

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300 flex flex-col", 
      isDark ? "text-white" : "text-slate-900")}>
      
      <div className={cn("w-full border rounded-xl transition-colors flex flex-col bg-white",
        isDark ? "bg-[#1e293b] border-slate-700" : "border-slate-200")}>
        
        {/* Header Section */}
        <div className={cn("flex items-center gap-4 p-6 border-b transition-colors",
          isDark ? "border-slate-800" : "border-slate-100")}>
          <CreditCard className={cn("w-7 h-7 text-slate-700")} strokeWidth={1.5} />
          <div>
            <h1 className="text-[19px] font-bold tracking-tight text-slate-900 leading-tight">{t("agency.billing.plans.title")}</h1>
            <p className="text-slate-500 text-[13px] font-medium leading-tight mt-0.5">{t("agency.billing.plans.desc")}</p>
          </div>
        </div>

        {/* Plans Grid Area */}
        <div className="p-6 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan, i) => (
              <div key={i} className={cn("rounded-md p-5 flex flex-col transition-all", 
                i === 0 ? "bg-[#fef4ce]" : i === 1 ? "bg-[#a5f3d4]" : i === 2 ? "bg-[#d8f2fe]" : "bg-[#ccd4ff]")}>
                
                <h3 className="text-[16px] font-bold text-slate-900 mb-3">{plan.name}</h3>
                
                <div className="mb-4">
                  <span className="text-[36px] font-bold text-slate-900 tracking-tight">{plan.price}</span>
                  <span className="text-[14px] font-bold text-slate-900 ml-1">/{t("common.month")}</span>
                </div>
                
                <div className="space-y-1 mb-4">
                  <p className="text-[12px] font-medium text-slate-900 leading-snug">{plan.limit}</p>
                  <p className="text-[11px] font-medium text-slate-800 leading-snug">{plan.feature}</p>
                </div>
                
                {plan.isCurrent ? (
                  <div className="mt-auto flex flex-col items-center w-full pt-2">
                    <button className="w-full bg-[#1cd45b] hover:bg-[#16a34a] text-white py-2 rounded font-semibold text-[13px] transition-all active:scale-95">
                      {t("agency.billing.plans.current_plan")}
                    </button>
                    <p className="text-[11px] font-bold text-slate-900 mt-2">{t("agency.billing.plans.next_payment", { date: plan.nextPayment })}</p>
                    <button 
                      onClick={() => setIsCancelModalOpen(true)}
                      className="text-[11px] font-medium text-[#f43f5e] mt-1 hover:underline transition-all">
                      {t("agency.billing.plans.cancel_subscription")}
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Warning Alert Integrated */}
        <div className="p-6 pt-0">
          <div className={cn(
            "px-5 py-4 rounded border flex gap-3 transition-colors items-start",
            isDark ? "bg-yellow-900/10 border-yellow-900/30" : "bg-[#fffdeb] border-[#fde047]/60"
          )}>
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="font-bold text-yellow-700 mb-1 text-[12px]">{t("agency.billing.plans.heads_up")}</p>
              <div className="font-medium text-slate-700 text-[12px] leading-relaxed">
                <p>{t("agency.billing.plans.downgrade_warning_title")}</p>
                <p>{t("agency.billing.plans.downgrade_warning_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal Overlay */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
          <div className={cn(
            "w-full max-w-[650px] p-10 rounded-xl shadow-2xl transition-colors",
            isDark ? "bg-[#1e293b]" : "bg-white"
          )}>
            <div className="flex flex-col items-center mb-8">
              <AlertTriangle className="w-16 h-16 text-[#f97316] mb-4" strokeWidth={2} />
              <h2 className={cn("text-[18px] font-black uppercase tracking-wide", isDark ? "text-white" : "text-slate-900")}>
                {t("agency.billing.plans.cancel_modal.title")}
              </h2>
            </div>

            <div className={cn("space-y-6 text-[14px]", isDark ? "text-slate-300" : "text-slate-800")}>
              <p className="font-bold">{t("agency.billing.plans.cancel_modal.understand")}</p>
              
              <div className="space-y-5">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-[#f43f5e] focus:ring-[#f43f5e]"
                    checked={checks.c1}
                    onChange={(e) => setChecks({...checks, c1: e.target.checked})}
                  />
                  <span className="leading-snug">{t("agency.billing.plans.cancel_modal.check1")}</span>
                </label>
                
                <label className="flex items-start gap-4 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#f43f5e] focus:ring-[#f43f5e]"
                    checked={checks.c2}
                    onChange={(e) => setChecks({...checks, c2: e.target.checked})}
                  />
                  <span className="leading-snug">{t("agency.billing.plans.cancel_modal.check2")}</span>
                </label>
                
                <label className="flex items-start gap-4 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#f43f5e] focus:ring-[#f43f5e]"
                    checked={checks.c3}
                    onChange={(e) => setChecks({...checks, c3: e.target.checked})}
                  />
                  <span className="leading-snug">{t("agency.billing.plans.cancel_modal.check3")}</span>
                </label>
              </div>

              <div className="pt-2">
                <p className="leading-relaxed">
                  {t("agency.billing.plans.cancel_modal.renew_warning", { date: "2026-05-11" })}
                </p>
              </div>

              <div className="pt-4">
                <p className="font-bold mb-3">
                  {t("agency.billing.plans.cancel_modal.enter_code", { code: generatedCode })}
                </p>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder={t("agency.billing.plans.cancel_modal.code_placeholder")}
                    value={cancelCodeInput}
                    onChange={(e) => setCancelCodeInput(e.target.value)}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-md border text-[14px] outline-none transition-colors",
                      isDark ? "bg-[#0f172a] border-slate-700 text-white placeholder-slate-500 focus:border-slate-500" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-slate-400"
                    )}
                  />
                  <button 
                    onClick={() => setIsCancelModalOpen(false)}
                    className={cn("px-6 py-2.5 rounded-md border font-medium text-[14px] transition-colors",
                      isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {t("common.cancel")}
                  </button>
                  <button 
                    disabled={!checks.c1 || !checks.c2 || !checks.c3 || cancelCodeInput !== generatedCode}
                    className="px-6 py-2.5 rounded-md bg-[#eb6e6e] hover:bg-[#ef4444] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[14px] transition-colors"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgencyBillingPlans;
