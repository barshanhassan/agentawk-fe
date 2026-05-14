import { useState, useEffect } from "react";
import { useTab } from "@/contexts/TabContext";
import CustomDropdown from "@/components/CustomDropdown";
import VoiceOfCustomerSummary from "./VoiceOfCustomerSummary";
import VoiceOfCustomerDetails from "./VoiceOfCustomerDetails";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const teams = [
  { id: "team-1", name: "Sales Team" },
  { id: "team-2", name: "Support Team" },
  { id: "team-3", name: "Technical Team" },
  { id: "team-4", name: "Marketing Team" },
];

const agents = [
  { id: "agent-1", name: "John Smith" },
  { id: "agent-2", name: "Sarah Johnson" },
  { id: "agent-3", name: "Mike Wilson" },
  { id: "agent-4", name: "Emma Davis" },
  { id: "agent-5", name: "Chris Brown" },
  { id: "agent-6", name: "Lisa Anderson" },
];

export default function VoiceOfCustomerTab() {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { activeSubTab, setActiveSubTab } = useTab();
  const [voiceOfCustomerTab, setVoiceOfCustomerTab] = useState(
    activeSubTab.voiceOfCustomer === "voice-of-customer-summary" ? "summary" : "details"
  );
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  useEffect(() => {
    setVoiceOfCustomerTab(activeSubTab.voiceOfCustomer === "voice-of-customer-summary" ? "summary" : "details");
  }, [activeSubTab.voiceOfCustomer]);

  const handleTabChange = (tab: string) => {
    setVoiceOfCustomerTab(tab);
    const subTabKey = tab === "summary" ? "voice-of-customer-summary" : "voice-of-customer-details";
    setActiveSubTab({ voiceOfCustomer: subTabKey });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left side - Tabs */}
        <div className={cn("flex items-center space-x-1 rounded-xl p-1", dark ? "bg-slate-800" : "bg-slate-100")}>
          <button
            onClick={() => handleTabChange("summary")}
            className={cn(
              "px-5 py-1.5 rounded-lg text-xs font-bold transition-all",
              voiceOfCustomerTab === "summary"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Summary
          </button>
          <button
            onClick={() => handleTabChange("details")}
            className={cn(
              "px-5 py-1.5 rounded-lg text-xs font-bold transition-all",
              voiceOfCustomerTab === "details"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Details
          </button>
        </div>

        {/* Right side - Dropdowns */}
        <div className="flex items-center space-x-3">
          <CustomDropdown
            options={teams}
            selected={selectedTeams}
            onChange={setSelectedTeams}
            placeholder="Teams"
            width="180px"
          />
          <CustomDropdown
            options={agents}
            selected={selectedAgents}
            onChange={setSelectedAgents}
            placeholder="Agents"
            width="180px"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in-50 duration-500">
        {voiceOfCustomerTab === "summary" && <VoiceOfCustomerSummary />}
        {voiceOfCustomerTab === "details" && <VoiceOfCustomerDetails />}
      </div>
    </div>
  );
}
