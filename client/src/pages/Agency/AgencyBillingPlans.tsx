import React, { useState } from 'react';
import { 
  CreditCard, 
  AlertTriangle,
  Check,
  Zap,
  Building2,
  Sparkles,
  Gift
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from 'react-i18next';

const AgencyBillingPlans = () => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const dark = mode === "dark";

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelCodeInput, setCancelCodeInput] = useState("");
  const [checks, setChecks] = useState({ c1: false, c2: false, c3: false });

  const generatedCode = "44399";

  const bg     = dark ? 'bg-[#0b1120]'  : 'bg-slate-50/80';
  const card   = dark ? 'bg-[#0f1829]'  : 'bg-white';
  const border = dark ? 'border-slate-800' : 'border-slate-200';
  const text   = dark ? 'text-white'    : 'text-slate-900';
  const sub    = dark ? 'text-slate-500' : 'text-slate-400';

  const plans = [
    { 
      name: t("agency.billing.plans.types.free.name"), 
      price: "$0", 
      limit: t("agency.billing.plans.types.free.limit"), 
      feature: t("agency.billing.plans.types.free.feature"),
      icon: Gift,
      accent: dark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200',
      iconColor: 'text-slate-400',
    },
    { 
      name: t("agency.billing.plans.types.premium.name"), 
      price: "$19", 
      limit: t("agency.billing.plans.types.premium.limit"), 
      feature: t("agency.billing.plans.types.premium.feature"),
      icon: Sparkles,
      accent: dark ? 'bg-violet-900/20 border-violet-800/40' : 'bg-violet-50 border-violet-100',
      iconColor: 'text-violet-500',
    },
    { 
      name: t("agency.billing.plans.types.ignite.name"), 
      price: "$299", 
      limit: t("agency.billing.plans.types.ignite.limit"), 
      feature: t("agency.billing.plans.types.ignite.feature"),
      icon: Zap,
      accent: dark ? 'bg-sky-900/20 border-sky-800/40' : 'bg-sky-50 border-sky-100',
      iconColor: 'text-sky-500',
    },
    { 
      name: t("agency.billing.plans.types.enterprise.name"), 
      price: "$599", 
      limit: t("agency.billing.plans.types.enterprise.limit"), 
      feature: t("agency.billing.plans.types.enterprise.feature"),
      isCurrent: true,
      nextPayment: "2026-05-11",
      icon: Building2,
      accent: dark ? 'bg-primary/10 border-primary/30' : 'bg-primary/5 border-primary/20',
      iconColor: 'text-primary',
    },
  ];

  return (
    <div className={cn("min-h-screen transition-colors flex flex-col font-sans", bg)}>

      {/* ── Header Card ── */}
      <div className={cn('px-8 py-5 border-b flex items-center justify-between', card, border)}>
        <div className="flex items-center gap-4">
          <div className={cn('p-2.5 rounded-xl shadow-sm', dark ? 'bg-primary/15' : 'bg-primary/10')}>
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className={cn('text-[15px] font-bold', text)}>{t("agency.billing.plans.title")}</h1>
            <p className={cn('text-[11px] mt-0.5', sub)}>{t("agency.billing.plans.desc")}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 space-y-6">

        {/* Plans Grid */}
        <div className={cn("rounded-2xl border overflow-hidden shadow-sm", card, border)}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan, i) => {
                const Icon = plan.icon;
                return (
                  <div key={i} className={cn(
                    "rounded-xl p-5 flex flex-col border transition-all duration-200 hover:shadow-md",
                    plan.accent
                  )}>
                    {/* Plan Icon + Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn("p-2 rounded-lg", dark ? "bg-slate-800/50" : "bg-white/70")}>
                        <Icon className={cn("w-4 h-4", plan.iconColor)} strokeWidth={1.8} />
                      </div>
                      <h3 className={cn("text-[13px] font-black uppercase tracking-widest", text)}>{plan.name}</h3>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-end gap-1">
                        <span className={cn("text-[36px] font-black tracking-tight leading-none", text)}>{plan.price}</span>
                        <span className={cn("text-[13px] font-bold mb-1", sub)}>/{t("common.month")}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-1.5 mb-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Check className={cn("w-3.5 h-3.5 shrink-0", plan.iconColor)} strokeWidth={2.5} />
                        <p className={cn("text-[12px] font-semibold", text)}>{plan.limit}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className={cn("w-3.5 h-3.5 shrink-0", plan.iconColor)} strokeWidth={2.5} />
                        <p className={cn("text-[11px] font-medium", sub)}>{plan.feature}</p>
                      </div>
                    </div>

                    {/* Current Plan Badge */}
                    {plan.isCurrent && (
                      <div className="mt-auto pt-4 border-t border-primary/20 flex flex-col items-center gap-1.5">
                        <div className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-bold text-[12px] transition-all text-center shadow-lg shadow-primary/20">
                          {t("agency.billing.plans.current_plan")}
                        </div>
                        <p className={cn("text-[10px] font-bold mt-1", sub)}>
                          {t("agency.billing.plans.next_payment", { date: plan.nextPayment })}
                        </p>
                        <button 
                          onClick={() => setIsCancelModalOpen(true)}
                          className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 hover:underline transition-all">
                          {t("agency.billing.plans.cancel_subscription")}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Warning Alert Card */}
        <div className={cn("rounded-2xl border overflow-hidden shadow-sm", card, border)}>
          <div className="px-6 py-4 flex gap-4 items-start">
            <div className={cn("p-2 rounded-lg shrink-0 mt-0.5", dark ? "bg-yellow-900/20" : "bg-yellow-50")}>
              <AlertTriangle className="w-4 h-4 text-yellow-500" strokeWidth={2} />
            </div>
            <div>
              <p className="font-black text-yellow-600 mb-1 text-[12px] uppercase tracking-wide">
                {t("agency.billing.plans.heads_up")}
              </p>
              <div className={cn("text-[12px] font-medium leading-relaxed space-y-0.5", sub)}>
                <p className={cn("font-semibold", text)}>{t("agency.billing.plans.downgrade_warning_title")}</p>
                <p>{t("agency.billing.plans.downgrade_warning_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className={cn(
            "w-full max-w-[580px] rounded-2xl shadow-2xl border overflow-hidden",
            card, border
          )}>
            {/* Modal Header */}
            <div className={cn("px-8 py-6 border-b flex items-center gap-4", border)}>
              <div className={cn("p-2.5 rounded-xl", dark ? "bg-rose-900/20" : "bg-rose-50")}>
                <AlertTriangle className="w-5 h-5 text-rose-500" strokeWidth={2} />
              </div>
              <h2 className={cn("text-[15px] font-black uppercase tracking-wide", text)}>
                {t("agency.billing.plans.cancel_modal.title")}
              </h2>
            </div>

            <div className="px-8 py-6 space-y-5">
              <p className={cn("font-bold text-[13px]", text)}>{t("agency.billing.plans.cancel_modal.understand")}</p>
              
              <div className="space-y-4">
                {([
                  { key: 'c1', label: t("agency.billing.plans.cancel_modal.check1") },
                  { key: 'c2', label: t("agency.billing.plans.cancel_modal.check2") },
                  { key: 'c3', label: t("agency.billing.plans.cancel_modal.check3") },
                ] as const).map(({ key, label }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-400"
                      checked={checks[key]}
                      onChange={(e) => setChecks({ ...checks, [key]: e.target.checked })}
                    />
                    <span className={cn("text-[13px] font-medium leading-snug group-hover:text-rose-500 transition-colors", sub)}>{label}</span>
                  </label>
                ))}
              </div>

              <div className={cn("p-4 rounded-xl border text-[12px] font-medium", 
                dark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-100", sub)}>
                {t("agency.billing.plans.cancel_modal.renew_warning", { date: "2026-05-11" })}
              </div>

              <div>
                <p className={cn("font-bold text-[13px] mb-3", text)}>
                  {t("agency.billing.plans.cancel_modal.enter_code", { code: generatedCode })}
                </p>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder={t("agency.billing.plans.cancel_modal.code_placeholder")}
                    value={cancelCodeInput}
                    onChange={(e) => setCancelCodeInput(e.target.value)}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-xl border text-[13px] font-mono outline-none transition-colors",
                      dark ? "bg-slate-950/50 border-slate-800 text-white placeholder-slate-600 focus:border-primary/50" 
                           : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/30"
                    )}
                  />
                  <button 
                    onClick={() => setIsCancelModalOpen(false)}
                    className={cn("px-5 py-2.5 rounded-xl border font-bold text-[13px] transition-colors",
                      dark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}>
                    {t("common.cancel")}
                  </button>
                  <button 
                    disabled={!checks.c1 || !checks.c2 || !checks.c3 || cancelCodeInput !== generatedCode}
                    className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-[13px] transition-all shadow-lg shadow-rose-500/20">
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
