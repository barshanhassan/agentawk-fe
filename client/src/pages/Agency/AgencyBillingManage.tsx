import React from 'react';
import { getUserInfo } from "@/lib/auth";
import { 
  CreditCard,
  Ticket,
  BarChart3,
  X,
  Receipt,
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
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import PaymentsSection from "@/components/sections/connect/PaymentsSection";

// Default (no white-label logo uploaded) mark — same icon used on the auth pages/sidebars.
const BotMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 52" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M6 3 H34 A4 4 0 0 1 38 7 V17 A4 4 0 0 1 34 21 H6 A4 4 0 0 1 2 17 V7 A4 4 0 0 1 6 3 Z M11 12 a3.2 3.2 0 1 0 6.4 0 a3.2 3.2 0 1 0 -6.4 0 Z M22.6 12 a3.2 3.2 0 1 0 6.4 0 a3.2 3.2 0 1 0 -6.4 0 Z" fill="#25d366" />
    <rect x="4" y="25" width="32" height="5.5" rx="2" fill="#25d366" />
    <rect x="16.5" y="30" width="7" height="20" rx="2" fill="#25d366" />
  </svg>
);

const AgencyBillingManage = () => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const { toast } = useToast();
  const userInfo = getUserInfo();

  // White-label aware modal header: agency logo + name replace hardcoded "E" + "EZCONN".
  const agencyId = userInfo?.modelable_id;
  const { data: agencyResp } = useQuery<any>({
    queryKey: [`/api/organizations/${agencyId}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/organizations/${agencyId}`);
      return res.json();
    },
    enabled: !!agencyId,
  });
  // Theme-aware logo selection (replyagent parity). Small/square variant preferred for 36x36 badge.
  const b = agencyResp?.agency?.branding;
  const isDark = mode === "dark";
  const agencyLogoUrl: string | null = isDark
    ? b?.logo_dark_small || b?.logo_light_small || b?.logo_dark || b?.logo_light || null
    : b?.logo_light_small || b?.logo_dark_small || b?.logo_light || b?.logo_dark || null;
  const [showUsageModal, setShowUsageModal] = React.useState(false);
  const [showManageModal, setShowManageModal] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupons, setAppliedCoupons] = React.useState(["10PERCENT", "15PERCENT"]);
  const [couponError, setCouponError] = React.useState(false);

  const dark = mode === "dark";
  const bg     = dark ? 'bg-[#0b1120]'  : 'bg-slate-50/80';
  const card   = dark ? 'bg-[#0f1829]'  : 'bg-white';
  const border = dark ? 'border-slate-800' : 'border-slate-200';
  const text   = dark ? 'text-white'    : 'text-slate-900';
  const sub    = dark ? 'text-slate-500' : 'text-slate-400';

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
    if (!couponCode.trim()) { setCouponError(true); return; }
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
    <div className={cn("min-h-full transition-colors flex flex-col font-sans", bg)}>

      {/* ── Header Card ── */}
      <div className={cn('px-8 py-5 border-b flex items-center justify-between', card, border)}>
        <div className="flex items-center gap-4">
          <div className={cn('p-2.5 rounded-xl shadow-sm', dark ? 'bg-primary/15' : 'bg-primary/10')}>
            <Receipt className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className={cn('text-[15px] font-bold', text)}>{t("agency.billing.title")}</h1>
            <p className={cn('text-[11px] mt-0.5', sub)}>{t("agency.billing.desc")}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className={cn("rounded-2xl border overflow-hidden shadow-sm", card, border)}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* ── Coupons & Discounts Box ── */}
              <div className={cn("flex flex-col p-5 rounded-xl border transition-all", border,
                dark ? "bg-slate-900/30" : "bg-slate-50/60")}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={cn("p-2 rounded-lg", dark ? "bg-slate-800" : "bg-white border border-slate-200 shadow-sm")}>
                    <Ticket className="w-4 h-4 text-primary" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className={cn("font-black text-[13px] uppercase tracking-widest", text)}>
                      {t("agency.billing.coupons.title")}
                    </h3>
                    <p className={cn("text-[11px] font-medium mt-0.5", sub)}>
                      {t("agency.billing.coupons.addDesc")}
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-5">
                  <div>
                    <p className={cn("text-[11px] font-bold uppercase tracking-widest mb-2", sub)}>
                      {t("agency.billing.coupons.appliedList")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {appliedCoupons.map(coupon => (
                        <Badge
                          key={coupon}
                          className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-primary text-white border-none flex items-center gap-1 shadow-sm shadow-primary/20"
                        >
                          {coupon}
                          <X size={11} className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={() => removeCoupon(coupon)} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className={cn("text-[11px] font-bold uppercase tracking-widest", sub)}>
                      {t("agency.billing.coupons.add")}
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t("agency.billing.coupons.placeholder")}
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value); if (e.target.value.trim()) setCouponError(false); }}
                        className={cn("text-[12px] h-9 rounded-lg transition-all shadow-none",
                          dark ? "bg-slate-950/50 border-slate-800 text-white focus-visible:ring-primary/30"
                               : "bg-white border-slate-200 text-slate-900 focus-visible:ring-primary/20",
                          couponError && "border-rose-500")}
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-1.5 rounded-lg text-[12px] font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-sm shadow-primary/20">
                        {t("common.add")}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-500 font-bold">{t("agency.billing.coupons.error")}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Manage Payment Methods Box ── */}
              <div className={cn("flex flex-col p-5 rounded-xl border transition-all", border,
                dark ? "bg-slate-900/30" : "bg-slate-50/60")}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={cn("p-2 rounded-lg", dark ? "bg-slate-800" : "bg-white border border-slate-200 shadow-sm")}>
                    <CreditCard className="w-4 h-4 text-primary" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className={cn("font-black text-[13px] uppercase tracking-widest", text)}>
                      {t("agency.billing.manage.title")}
                    </h3>
                    <p className={cn("text-[11px] font-medium mt-0.5", sub)}>
                      {t("agency.billing.manage.desc")}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-auto">
                  <button
                    onClick={() => setShowManageModal(true)}
                    className="px-5 py-2 rounded-lg text-[12px] font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-sm shadow-primary/20">
                    {t("common.manage")}
                  </button>
                </div>
              </div>

              {/* ── Current Usage Box ── */}
              <div className={cn("flex flex-col p-5 rounded-xl border transition-all", border,
                dark ? "bg-slate-900/30" : "bg-slate-50/60")}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={cn("p-2 rounded-lg", dark ? "bg-slate-800" : "bg-white border border-slate-200 shadow-sm")}>
                    <BarChart3 className="w-4 h-4 text-primary" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className={cn("font-black text-[13px] uppercase tracking-widest", text)}>
                      {t("agency.billing.usage.title")}
                    </h3>
                    <p className={cn("text-[11px] font-medium mt-0.5", sub)}>
                      {t("agency.billing.usage.desc")}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-auto">
                  <button
                    onClick={() => setShowUsageModal(true)}
                    className="px-5 py-2 rounded-lg text-[12px] font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-sm shadow-primary/20">
                    {t("agency.billing.usage.show")}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Manage Subscriptions Modal ── */}
      <Dialog open={showManageModal} onOpenChange={setShowManageModal}>
        <DialogContent hideClose className={cn("max-w-4xl p-0 overflow-visible border shadow-2xl rounded-2xl", card, border)}>
          <div className="relative">
            <DialogClose className="absolute -right-3 -top-3 z-50">
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center border-2 shadow-md transition-colors",
                dark ? "bg-slate-700 hover:bg-slate-600 border-slate-900 text-white" : "bg-slate-600 hover:bg-slate-700 border-white text-white")}>
                <X size={13} strokeWidth={3} />
              </div>
            </DialogClose>

            {/* Modal Header */}
            <div className={cn("px-8 py-6 border-b text-center", border)}>
              <div className="flex flex-col items-center gap-1.5 mb-4">
                {agencyLogoUrl ? (
                  <img
                    src={agencyLogoUrl}
                    alt="Organization logo"
                    className="w-9 h-9 object-contain"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <BotMark className="w-9 h-9 shrink-0" />
                )}
                <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", sub)}>
                  AGEN<span className="text-[#25d366]">TAWK</span>
                </span>
              </div>
              <h2 className={cn("text-[16px] font-black text-primary")}>{t("agency.billing.manage.modalTitle")}</h2>
            </div>

            {/* Payment method — Swich PayIn credentials, powers the Billing/Plans checkout above */}
            <div className="px-8 py-7 max-h-[75vh] overflow-y-auto">
              <PaymentsSection basePath="/api/swich/agency" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Current Usage Modal ── */}
      <Dialog open={showUsageModal} onOpenChange={setShowUsageModal}>
        <DialogContent hideClose className={cn("max-w-2xl p-0 rounded-2xl shadow-2xl border overflow-hidden", card, border)}>
          <DialogHeader className={cn("px-6 py-4 border-b", border)}>
            <DialogTitle className={cn("text-[14px] font-black uppercase tracking-widest", text)}>
              {t("agency.billing.usage.title")}
            </DialogTitle>
          </DialogHeader>

          <div className={cn("divide-y", dark ? "divide-slate-800" : "divide-slate-100")}>
            {usageItems.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-400 text-[13px]">{t("agency.billing.usage.empty")}</div>
            ) : usageItems.map((item, idx) => (
              <div key={idx} className={cn("px-6 py-3.5 flex items-center justify-between transition-colors",
                dark ? "hover:bg-slate-800/30" : "hover:bg-slate-50")}>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-60 shrink-0" />
                  <p className={cn("text-[13px] font-semibold", text)}>{item.label}</p>
                </div>
                <div className="flex items-center gap-16">
                  <div className="text-center w-20">
                    <p className={cn("text-[13px] font-bold", text)}>{item.count}</p>
                    <p className={cn("text-[9px] uppercase tracking-widest font-bold", sub)}>{item.type}</p>
                  </div>
                  <div className="text-right w-20">
                    <p className={cn("text-[13px] font-bold", text)}>{item.amount}</p>
                    <p className={cn("text-[9px] uppercase tracking-widest font-bold", sub)}>{t("agency.billing.usage.amount")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Footer */}
          <div className={cn("px-6 py-5 border-t space-y-3", border, dark ? "bg-slate-900/30" : "bg-slate-50/60")}>
            {[
              { label: t("agency.billing.usage.subtotal"), value: subtotal.toFixed(2) },
              { label: t("agency.billing.usage.discount"), value: discount.toFixed(2) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className={cn("text-[12px] font-bold", sub)}>{label}</span>
                <div className="text-right">
                  <p className={cn("text-[13px] font-bold", text)}>{value}</p>
                  <p className={cn("text-[9px] uppercase tracking-widest font-bold", sub)}>{t("agency.billing.usage.amount")}</p>
                </div>
              </div>
            ))}
            <div className={cn("flex justify-between items-center pt-3 border-t", border)}>
              <span className={cn("text-[14px] font-black", text)}>{t("agency.billing.usage.total")}</span>
              <div className="text-right">
                <p className={cn("text-[15px] font-black", text)}>{total.toFixed(2)}</p>
                <p className={cn("text-[9px] uppercase tracking-widest font-bold", sub)}>{t("agency.billing.usage.amount")}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <DialogClose asChild>
                <button className={cn("px-5 py-2 rounded-lg text-[12px] font-bold transition-all border",
                  dark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100")}>
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
