import { useState, useEffect } from "react";
import { useTab } from "@/contexts/TabContext";
import CustomDropdown from "@/components/CustomDropdown";
import MessagesSubTab from "./MessagesSubTab";
import CallsSubTab from "./CallsSubTab";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        {/* Left side - Tabs */}
        <div className="flex items-center space-x-1 bg-slate-200/75 rounded-lg p-1">
          <button
            onClick={() => handleTabChange("messages")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              whatsappPricingTab === "messages"
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => handleTabChange("calls")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              whatsappPricingTab === "calls"
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Calls
          </button>
        </div>

        {/* Right side - Country Select */}
        <div className="flex items-center space-x-4">
          <CustomDropdown
            options={countryOptions}
            selected={selectedCountries}
            onChange={setSelectedCountries}
            placeholder="Countries"
            width="220px"
          />
        </div>
      </div>

      {/* Filter Summary */}
      {selectedCountries.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-3 mb-6">
          <p className="text-sm text-muted-foreground">
            Filtered by:&nbsp;
            <span className="text-foreground font-medium">
              {selectedCountries.map(countryId => countryOptions.find(c => c.id === countryId)?.name).join(", ")}
            </span>
          </p>
        </div>
      )}

      {/* Tab Content */}
      {whatsappPricingTab === "messages" && <MessagesSubTab />}
      {whatsappPricingTab === "calls" && <CallsSubTab />}
    </div>
  );
}

