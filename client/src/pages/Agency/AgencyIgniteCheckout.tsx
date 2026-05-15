import React from 'react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  ShieldCheck, 
  CheckCircle2,
  Tag,
  Info,
  Zap,
  Sparkles,
  Building2,
  MessageSquare,
  QrCode,
  Paintbrush,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from 'react-i18next';

interface CheckoutProps {
  onBack: () => void;
}

const AgencyIgniteCheckout: React.FC<CheckoutProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const dark = mode === "dark";

  const [isCreditsModalOpen, setIsCreditsModalOpen] = React.useState(false);
  const [isFutureModalOpen, setIsFutureModalOpen] = React.useState(false);

  const bg     = dark ? 'bg-[#0b1120]'  : 'bg-slate-50/80';
  const card   = dark ? 'bg-[#0f1829]'  : 'bg-white';
  const border = dark ? 'border-slate-800' : 'border-slate-200';
  const text   = dark ? 'text-white'    : 'text-slate-900';
  const sub    = dark ? 'text-slate-500' : 'text-slate-400';

  const cartItems = [
    { type: 'PLAN', name: 'Ignite Plan', sub: 'Charged based on usage', price: '$0.00', icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { type: 'ADDON', name: 'Ignite Addon', sub: 'Base platform features', price: '$299.00', icon: <Sparkles className="w-4 h-4 text-violet-500" /> },
    { type: 'ADDON', name: 'Workspaces', sub: '$15.00 x 3 workspace', price: '$45.00', icon: <Building2 className="w-4 h-4 text-sky-500" /> },
    { type: 'ADDON', name: 'Channels', sub: '$10.00 x 4 channel', price: '$40.00', icon: <MessageSquare className="w-4 h-4 text-emerald-500" /> },
    { type: 'ADDON', name: 'Whatsapp QR', sub: '$15.00 x 4 instance', price: '$60.00', icon: <QrCode className="w-4 h-4 text-green-500" /> },
    { type: 'ADDON', name: 'Agency Branding Addon', sub: 'White label branding', price: '$49.00', icon: <ShieldCheck className="w-4 h-4 text-primary" /> },
    { type: 'ADDON', name: 'Branding', sub: '$10.00 x 5 brand', price: '$50.00', icon: <Paintbrush className="w-4 h-4 text-rose-500" /> },
    { type: 'ADDON', name: 'AI Agent Addon', sub: '$4.00 x 41 units', price: '$164.00', icon: <Bot className="w-4 h-4 text-indigo-500" /> },
  ];

  const Modal = ({ title, isOpen, onClose, children }: { title: string, isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
        <div className={cn("w-full max-w-[500px] rounded-[20px] shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-200", card, border)}>
          <div className={cn("px-6 py-5 border-b flex items-center justify-between", border)}>
            <h3 className={cn("text-[16px] font-bold", text)}>{title}</h3>
            <button onClick={onClose} className={cn("p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors", sub)}>
              <ArrowLeft className="w-4 h-4 rotate-90" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("min-h-screen transition-colors flex flex-col font-sans", bg)}>
      {/* ── Header ── */}
      <div className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">E</div>
           <span className={cn("font-bold text-[18px] tracking-tight", text)}>Ezconn</span>
        </div>
      </div>

      <div className="w-full max-w-[1400px] px-8 py-4">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className={cn("flex items-center gap-2 text-[12px] font-bold mb-8 transition-colors group", 
            dark ? "text-emerald-500 hover:text-emerald-400" : "text-emerald-600 hover:text-emerald-700")}
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Back to site
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Cart Items Consolidated Card */}
          <div className="lg:col-span-7">
            <div className={cn("rounded-[20px] border shadow-sm overflow-hidden", card, border)}>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {cartItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", 
                        dark ? "bg-slate-800/50" : "bg-slate-100/50")}>
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[13px] font-bold", text)}>{item.name}</span>
                          <span className={cn("text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase", 
                            dark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400")}>
                            {item.type}
                          </span>
                        </div>
                        {item.sub && <p className={cn("text-[11px] font-medium mt-0.5", sub)}>{item.sub}</p>}
                      </div>
                    </div>
                    <span className={cn("text-[14px] font-bold", text)}>{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className={cn("rounded-[20px] border p-8 sticky top-8 shadow-xl", card, border)}>
              <h3 className={cn("text-[16px] font-bold mb-8", text)}>Order summary</h3>
              
              <div className="space-y-4 mb-8">
                {[
                  { label: 'Workspaces', value: '$45.00', sub: '$15.00 x 3 / month' },
                  { label: 'Channels', value: '$40.00', sub: '$10.00 x 4 / month' },
                  { label: 'Whatsapp QR', value: '$60.00', sub: '$15.00 x 4 / month' },
                  { label: 'Agency Branding Addon', value: '$49.00', sub: '$49.00 / month' },
                  { label: 'Branding', value: '$50.00', sub: '$10.00 x 5 / month' },
                  { label: 'AI Agent Addon', value: '$164.00', sub: '$4.00 x 41 / month' },
                  { label: 'Ignite Addon', value: '$299.00', sub: '$299.00 / month' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <p className={cn("text-[12px] font-bold", text)}>{item.label}</p>
                      <p className={cn("text-[10px] font-medium", sub)}>{item.sub}</p>
                    </div>
                    <span className={cn("text-[12px] font-bold", text)}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className={cn("pt-6 border-t space-y-3", border)}>
                <div className="flex justify-between items-center">
                  <span className={cn("text-[12px] font-medium", sub)}>Subtotal (7 items)</span>
                  <span className={cn("text-[12px] font-bold", text)}>$707.00</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => setIsCreditsModalOpen(true)}
                      className="text-[11px] font-bold flex items-center gap-1.5 text-primary hover:underline"
                    >
                       <Tag className="w-3 h-3" /> Credits applied
                    </button>
                    <span className="text-[12px] font-bold text-primary">-$104.38</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                    <span className={cn("text-[11px] font-bold")}>15 Percent - 15% coupon applied</span>
                    <span className={cn("text-[12px] font-bold")}>-$106.05</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                    <span className={cn("text-[11px] font-bold")}>10 Percent - 10% coupon applied</span>
                    <span className={cn("text-[12px] font-bold")}>-$60.10</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <span className={cn("text-[18px] font-black", text)}>Total</span>
                  <span className={cn("text-[20px] font-black", text)}>$436.52</span>
                </div>
              </div>

              {/* Notice Box */}
              <div className={cn("mt-8 p-4 rounded-xl border flex items-start gap-3", 
                dark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100")}>
                <div className="w-4 h-4 rounded-full bg-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <p className={cn("text-[10px] font-medium leading-relaxed", sub)}>
                  Future charges will be based on usage
                </p>
              </div>

              <div className="mt-4">
                <p className={cn("text-[10px] font-bold", sub)}>
                  Next charge on June 14, 2026: <span className={text}>$540.05</span>
                </p>
                <button 
                  onClick={() => setIsFutureModalOpen(true)}
                  className="text-primary font-bold text-[10px] hover:underline"
                >
                  Future charges
                </button>
              </div>

              <button className="w-full bg-primary hover:opacity-90 text-white py-3.5 rounded-xl font-black text-[14px] mt-8 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]">
                Proceed To Checkout
              </button>

              <div className="mt-6 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Secure Checkout by Chargebee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Applicable Modal */}
      <Modal title="Credits Applicable" isOpen={isCreditsModalOpen} onClose={() => setIsCreditsModalOpen(false)}>
        <div className="space-y-4">
          {[
            { label: 'Channels - Prorated Credits for 14-May-2026 - 11-Jun-2026', value: '$36.84' },
            { label: 'Whatsapp QR - Prorated Credits for 14-May-2026 - 11-Jun-2026', value: '$55.28' },
            { label: 'AI Agent Addon - Prorated Credits for 14-May-2026 - 11-Jun-2026', value: '$25.83' },
            { label: 'VIP Pass - Prorated Credits for 14-May-2026 - 11-Jun-2026', value: '$18.43' },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-start gap-4">
              <p className={cn("text-[11px] font-medium leading-relaxed", text)}>{item.label}</p>
              <span className={cn("text-[11px] font-bold", text)}>{item.value}</span>
            </div>
          ))}
          <div className="pt-4 border-t border-dashed space-y-3">
            <p className={cn("text-[12px] font-bold mb-2", text)}>Coupons applied</p>
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[11px] font-medium">15 Percent -15%</span>
              <span className="text-[11px] font-bold">-$20.45</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[11px] font-medium">10 Percent -10%</span>
              <span className="text-[11px] font-bold">-$11.60</span>
            </div>
          </div>
          <div className={cn("pt-4 border-t", border)}>
            <div className="flex justify-between items-center mb-2">
              <span className={cn("text-[12px] font-bold", text)}>Subtotal (4 items)</span>
              <span className={cn("text-[12px] font-bold", text)}>$104.33</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className={cn("text-[14px] font-black", text)}>Total</span>
              <span className={cn("text-[14px] font-black", text)}>$104.33</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-primary">
              <span className="text-[13px] font-black uppercase tracking-tight">Credits applied</span>
              <span className="text-[13px] font-black">$104.33</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Future Charges Modal */}
      <Modal title="Future charges" isOpen={isFutureModalOpen} onClose={() => setIsFutureModalOpen(false)}>
        <div className="space-y-4">
          {[
            { label: 'Ignite Plan', value: '$0.00' },
            { label: 'Workspaces', value: '$45.00', sub: '$15.00 x 3' },
            { label: 'Channels', value: '$40.00', sub: '$10.00 x 4' },
            { label: 'Whatsapp QR', value: '$60.00', sub: '$15.00 x 4' },
            { label: 'Agency Branding Addon', value: '$49.00' },
            { label: 'Branding', value: '$50.00', sub: '$10.00 x 5' },
            { label: 'AI Agent Addon', value: '$164.00', sub: '$4.00 x 41' },
            { label: 'Ignite Addon', value: '$299.00' },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-start">
              <div>
                <p className={cn("text-[11px] font-bold", text)}>{item.label}</p>
                {item.sub && <p className={cn("text-[10px] font-medium", sub)}>{item.sub}</p>}
              </div>
              <span className={cn("text-[11px] font-bold", text)}>{item.value}</span>
            </div>
          ))}
          <div className={cn("pt-4 border-t space-y-3", border)}>
            <div className="flex justify-between items-center">
              <span className={cn("text-[11px] font-bold", text)}>Subtotal (8 items)</span>
              <span className={cn("text-[11px] font-bold", text)}>$707.00</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[11px] font-medium">15 Percent -15% coupon applied</span>
              <span className="text-[11px] font-bold">-$106.05</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[11px] font-medium">10 Percent -10% coupon applied</span>
              <span className="text-[11px] font-bold">-$60.10</span>
            </div>
            <div className={cn("pt-4 border-t flex justify-between items-center", border)}>
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[11px] font-bold">On June 14, 2026</span>
              </div>
              <span className={cn("text-[14px] font-black", text)}>$540.85</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AgencyIgniteCheckout;
