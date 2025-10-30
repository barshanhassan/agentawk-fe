import { useState, useEffect } from "react";
import { useTab } from "@/contexts/TabContext";
import CustomDropdown from "@/components/CustomDropdown";
import AgentPerformanceMain from "./AgentPerformanceMain";
import AgentConversion from "./AgentConversion";

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

export default function AgentPerformanceTab() {
  const { activeSubTab, setActiveSubTab } = useTab();
  const [agentPerformanceTab, setAgentPerformanceTab] = useState(activeSubTab.agentPerformance);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  // Sync local state with context when context changes
  useEffect(() => {
    setAgentPerformanceTab(activeSubTab.agentPerformance);
  }, [activeSubTab.agentPerformance]);

  const handleTabChange = (tab: string) => {
    setAgentPerformanceTab(tab);
    setActiveSubTab({ agentPerformance: tab });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        {/* Left side - Tabs */}
        <div className="flex items-center space-x-1 bg-black/5 rounded-lg p-1">
          <button
            onClick={() => handleTabChange("agent-performance-main")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              agentPerformanceTab === "agent-performance-main"
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Agent Performance
          </button>
          <button
            onClick={() => handleTabChange("agent-conversion")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              agentPerformanceTab === "agent-conversion"
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Agent Conversion
          </button>
        </div>

        {/* Right side - Dropdowns */}
        <div className="flex items-center gap-3">
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

      {/* Filter Summary */}
      {(selectedTeams.length > 0 || selectedAgents.length > 0) && (
        <div className="bg-muted/50 rounded-lg p-3 mb-6">
          <p className="text-sm text-muted-foreground">
            Filtered by:&nbsp;
            {selectedTeams.length > 0 && (
              <span className="text-foreground font-medium">
                {selectedTeams.map(teamId => teams.find(t => t.id === teamId)?.name).join(", ")}
              </span>
            )}
            {selectedTeams.length > 0 && selectedAgents.length > 0 && " and "}
            {selectedAgents.length > 0 && (
              <span className="text-foreground font-medium">
                {selectedAgents.map(agentId => agents.find(a => a.id === agentId)?.name).join(", ")}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Tab Content */}
      {agentPerformanceTab === "agent-performance-main" && <AgentPerformanceMain />}
      {agentPerformanceTab === "agent-conversion" && <AgentConversion />}
    </div>
  );
}

