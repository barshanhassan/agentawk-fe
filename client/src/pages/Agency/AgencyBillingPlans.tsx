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

import AgencyIgniteCheckout from './AgencyIgniteCheckout';
import AgencyEnterpriseCheckout from './AgencyEnterpriseCheckout';

const AgencyBillingPlans = () => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const dark = mode === "dark";

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [checkoutType, setCheckoutType] = useState<null | 'ignite' | 'enterprise'>(null);
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
      id: 'free',
      name: t("agency.billing.plans.types.free.name"), 
      price: "$0", 
      limit: t("agency.billing.plans.types.free.limit"), 
      feature: t("agency.billing.plans.types.free.feature"),
      accent: dark ? 'bg-amber-900/10 border-amber-800/30' : 'bg-orange-50/50 border-orange-100',
      textColor: 'text-amber-900 dark:text-amber-100',
    },
    { 
      id: 'premium',
      name: t("agency.billing.plans.types.premium.name"), 
      price: "$19", 
      limit: t("agency.billing.plans.types.premium.limit"), 
      feature: t("agency.billing.plans.types.premium.feature"),
      isCurrent: true,
      nextPayment: "2026-06-11",
      accent: dark ? 'bg-emerald-900/10 border-emerald-800/30' : 'bg-emerald-50/50 border-emerald-100',
      textColor: 'text-emerald-900 dark:text-emerald-100',
    },
    { 
      id: 'ignite',
      name: t("agency.billing.plans.types.ignite.name"), 
      price: "$299", 
      limit: t("agency.billing.plans.types.ignite.limit"), 
      feature: t("agency.billing.plans.types.ignite.feature"),
      accent: dark ? 'bg-sky-900/10 border-sky-800/30' : 'bg-sky-50/50 border-sky-100',
      textColor: 'text-sky-900 dark:text-sky-100',
    },
    { 
      id: 'enterprise',
      name: t("agency.billing.plans.types.enterprise.name"), 
      price: "$599", 
      limit: t("agency.billing.plans.types.enterprise.limit"), 
      feature: t("agency.billing.plans.types.enterprise.feature"),
      accent: dark ? 'bg-indigo-900/10 border-indigo-800/30' : 'bg-indigo-50/50 border-indigo-100',
      textColor: 'text-indigo-900 dark:text-indigo-100',
    },
  ];

  if (checkoutType === 'ignite') {
    return <AgencyIgniteCheckout onBack={() => setCheckoutType(null)} />;
  }

  if (checkoutType === 'enterprise') {
    return <AgencyEnterpriseCheckout onBack={() => setCheckoutType(null)} />;
  }

  return (
    <div className={cn("min-h-full transition-colors flex flex-col font-sans", bg)}>

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
                return (
                  <div key={i} className={cn(
                    "rounded-xl p-6 flex flex-col border transition-all duration-200",
                    plan.accent
                  )}>
                    {/* Plan Name */}
                    <h3 className={cn("text-[14px] font-bold mb-6", text)}>{plan.name}</h3>

                    {/* Price */}
                    <div className="mb-1">
                      <div className="flex items-end gap-1">
                        <span className={cn("text-[32px] font-black tracking-tight leading-none", text)}>{plan.price}</span>
                        <span className={cn("text-[14px] font-bold mb-1", sub)}>/{t("common.month")}</span>
                      </div>
                    </div>

                    {/* Features Description */}
                    <div className="mb-6">
                      <p className={cn("text-[11px] font-bold", text)}>{plan.limit}</p>
                      <p className={cn("text-[11px] font-medium", text)}>{plan.feature}</p>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto space-y-3">
                      {plan.isCurrent ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-full bg-slate-800 dark:bg-slate-700 text-white py-2 rounded-lg font-bold text-[12px] text-center shadow-sm">
                            {t("agency.billing.plans.current_plan")}
                          </div>
                          <div className="text-center space-y-1">
                            <p className={cn("text-[10px] font-bold", text)}>
                              {t("agency.billing.plans.next_payment", { date: plan.nextPayment })}
                            </p>
                            <button 
                              onClick={() => setIsCancelModalOpen(true)}
                              className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 transition-all">
                              {t("agency.billing.plans.cancel_subscription")}
                            </button>
                          </div>
                        </div>
                      ) : plan.price !== "$0" ? (
                        <button 
                          onClick={() => {
                            if (plan.id === 'ignite') setCheckoutType('ignite');
                            if (plan.id === 'enterprise') setCheckoutType('enterprise');
                          }}
                          className={cn(
                          "w-full py-2 rounded-lg font-bold text-[12px] border transition-all text-center",
                          dark ? "border-slate-700 text-slate-300 hover:bg-primary hover:text-white hover:border-primary" 
                               : "border-slate-300/60 text-slate-600 hover:bg-primary hover:text-white hover:border-primary"
                        )}>
                          {t("common.upgrade")}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Warning Alert Card */}
        <div className={cn("rounded-2xl border border-yellow-200 dark:border-yellow-900/50 overflow-hidden shadow-sm", dark ? "bg-yellow-900/10" : "bg-yellow-50/30")}>
          <div className="px-6 py-6 flex gap-4 items-start">
            <div className={cn("p-2 rounded-lg shrink-0 mt-0.5", dark ? "bg-yellow-900/20" : "bg-yellow-100/50")}>
              <AlertTriangle className="w-4 h-4 text-yellow-600" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-black text-yellow-700 mb-1.5 text-[12px] uppercase tracking-wide flex items-center gap-2">
                {t("agency.billing.plans.heads_up")}
              </p>
              <div className={cn("text-[12px] font-medium leading-relaxed max-w-4xl text-yellow-700/80")}>
                {t("agency.billing.plans.downgrade_warning_desc")}
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
                dark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100", sub)}>
                {t("agency.billing.plans.cancel_modal.renew_warning", { date: "2026-06-11" })}
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
