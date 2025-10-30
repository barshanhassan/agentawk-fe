import { useState, useEffect } from "react";
import { useTab } from "@/contexts/TabContext";
import CustomDropdown from "@/components/CustomDropdown";
import CSATSummary from "./CSATSummary";
import CSATDetails from "./CSATDetails";

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

export default function CSATDashboardTab() {
  const { activeSubTab, setActiveSubTab } = useTab();
  const [csatDashboardTab, setCSATDashboardTab] = useState(
    activeSubTab.csatDashboard === "csat-dashboard-summary" ? "summary" : "details"
  );
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  // Sync local state with context when context changes
  useEffect(() => {
    setCSATDashboardTab(activeSubTab.csatDashboard === "csat-dashboard-summary" ? "summary" : "details");
  }, [activeSubTab.csatDashboard]);

  const handleTabChange = (tab: string) => {
    setCSATDashboardTab(tab);
    const subTabKey = tab === "summary" ? "csat-dashboard-summary" : "csat-dashboard-details";
    setActiveSubTab({ csatDashboard: subTabKey });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        {/* Left side - Tabs */}
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => handleTabChange("summary")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              csatDashboardTab === "summary"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => handleTabChange("details")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              csatDashboardTab === "details"
                ? "bg-background text-foreground shadow-sm"
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
      {csatDashboardTab === "summary" && <CSATSummary />}
      {csatDashboardTab === "details" && <CSATDetails />}
    </div>
  );
}

