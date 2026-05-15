import { useState, useEffect } from "react";
import { useTab } from "@/contexts/TabContext";
import CustomDropdown from "@/components/CustomDropdown";
import MessagesSubTab from "./MessagesSubTab";
import CallsSubTab from "./CallsSubTab";
import { AlertCircle, MessageSquare, Phone, Globe, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const countryOptions = [
  { id: "us", name: "United States" },
  { id: "gb", name: "United Kingdom" },
  { id: "de", name: "Germany" },
  { id: "fr", name: "France" },
  { id: "it", name: "Italy" },
  { id: "es", name: "Spain" },
  { id: "nl", name: "Netherlands" },
  { id: "in", name: "India" },
  { id: "pk", name: "Pakistan" },
  { id: "id", name: "Indonesia" },
  { id: "my", name: "Malaysia" },
  { id: "mx", name: "Mexico" },
  { id: "br", name: "Brazil" },
  { id: "ar", name: "Argentina" },
  { id: "cl", name: "Chile" },
  { id: "co", name: "Colombia" },
  { id: "pe", name: "Peru" },
  { id: "ru", name: "Russia" },
  { id: "ng", name: "Nigeria" },
  { id: "za", name: "South Africa" },
  { id: "ae", name: "United Arab Emirates" },
  { id: "sa", name: "Saudi Arabia" },
  { id: "tr", name: "Turkey" },
  { id: "eg", name: "Egypt" }
];

export default function WhatsAppPricingTab() {
  const { activeSubTab, setActiveSubTab } = useTab();
  const [whatsappPricingTab, setWhatsappPricingTab] = useState(
    activeSubTab.whatsapp === "whatsapp-messages" ? "messages" : "calls"
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // Sync local state with context when context changes
  useEffect(() => {
    setWhatsappPricingTab(activeSubTab.whatsapp === "whatsapp-messages" ? "messages" : "calls");
  }, [activeSubTab.whatsapp]);

  const handleTabChange = (tab: string) => {
    setWhatsappPricingTab(tab);
    const subTabKey = tab === "messages" ? "whatsapp-messages" : "whatsapp-calls";
    setActiveSubTab({ whatsapp: subTabKey });
  };

  return (
    <div className="space-y-4">
      {/* ── Sub-header: Minimalist Sub-tabs & Country Filter ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-1.5 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
        
        {/* Left: Compact Sub-tabs Switcher */}
        <div className="flex items-center p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg shadow-inner">
          {[
            { id: "messages", label: "Messages", icon: <MessageSquare size={12} /> },
            { id: "calls", label: "Calls", icon: <Phone size={12} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-md text-[11px] font-bold transition-all duration-300",
                whatsappPricingTab === tab.id
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: High-density Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-200/30 dark:bg-slate-800/30">
            <Globe size={11} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Region:</span>
          </div>
          <CustomDropdown
            options={countryOptions}
            selected={selectedCountries}
            onChange={setSelectedCountries}
            placeholder="All Countries"
            className="h-8 min-w-[130px] text-[10px] rounded-lg border-slate-200 dark:border-slate-800 shadow-sm"
          />
        </div>
      </div>

      {/* Note Banner - More Professional */}
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 transition-all hover:bg-blue-500/10">
        <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
        <p className="text-[10px] font-medium text-blue-600/80 dark:text-blue-400/80 leading-tight">
          <span className="font-bold uppercase tracking-wider text-[9px] mr-1.5 opacity-70">Note:</span>
          All insights data is approximate and may differ from invoices due to small variations in data processing.
        </p>
      </div>

      {/* Filter Summary */}
      {selectedCountries.length > 0 && (
        <div className="flex items-center gap-2 px-1 animate-in fade-in slide-in-from-top-1 duration-300">
          <span className="text-[10px] font-medium text-slate-400">Selected:</span>
          <div className="flex flex-wrap gap-1.5">
            {selectedCountries.map(id => (
              <span key={id} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-bold border border-slate-200 dark:border-slate-700">
                {countryOptions.find(c => c.id === id)?.name}
              </span>
            ))}
            <button 
              onClick={() => setSelectedCountries([])}
              className="text-[9px] font-bold text-slate-400 hover:text-rose-500 transition-colors ml-1"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="mt-2">
        {whatsappPricingTab === "messages" && <MessagesSubTab />}
        {whatsappPricingTab === "calls" && <CallsSubTab />}
      </div>
    </div>
  );
}
