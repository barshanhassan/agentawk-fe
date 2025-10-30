import { useState, useEffect } from "react";
import { useTab } from "@/contexts/TabContext";
import CustomDropdown from "@/components/CustomDropdown";
import VoiceOfCustomerSummary from "./VoiceOfCustomerSummary";
import VoiceOfCustomerDetails from "./VoiceOfCustomerDetails";

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
  const { activeSubTab, setActiveSubTab } = useTab();
  const [voiceOfCustomerTab, setVoiceOfCustomerTab] = useState(
    activeSubTab.voiceOfCustomer === "voice-of-customer-summary" ? "summary" : "details"
  );
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  // Sync local state with context when context changes
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
      <div className="flex items-center justify-between mb-6">
        {/* Left side - Tabs */}
        <div className="flex items-center space-x-1 bg-black/5 rounded-lg p-1">
          <button
            onClick={() => handleTabChange("summary")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              voiceOfCustomerTab === "summary"
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => handleTabChange("details")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              voiceOfCustomerTab === "details"
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Details
          </button>
        </div>

        {/* Right side - Dropdowns */}
        <div className="flex items-center space-x-4">
          <CustomDropdown
            options={teams}
            selected={selectedTeams}
            onChange={setSelectedTeams}
            placeholder="Teams"
          />
          <CustomDropdown
            options={agents}
            selected={selectedAgents}
            onChange={setSelectedAgents}
            placeholder="Agents"
          />
        </div>
      </div>

      {/* Tab Content */}
      {voiceOfCustomerTab === "summary" && <VoiceOfCustomerSummary />}
      {voiceOfCustomerTab === "details" && <VoiceOfCustomerDetails />}
    </div>
  );
}

