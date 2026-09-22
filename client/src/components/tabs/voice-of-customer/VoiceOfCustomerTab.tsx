import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useTab } from "@/contexts/TabContext";
import CustomDropdown from "@/components/CustomDropdown";
import InsightsDateRangePicker from "@/components/InsightsDateRangePicker";
import VoiceOfCustomerSummary from "./VoiceOfCustomerSummary";
import VoiceOfCustomerDetails from "./VoiceOfCustomerDetails";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Users, User, ChevronDown } from "lucide-react";

export default function VoiceOfCustomerTab() {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { activeSubTab, setActiveSubTab } = useTab();
  const [voiceOfCustomerTab, setVoiceOfCustomerTab] = useState(
    activeSubTab.voiceOfCustomer === "voice-of-customer-summary" ? "summary" : "details"
  );
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  // Real workspace teams/agents — these dropdowns used to be permanently
  // empty (hardcoded `[]`) and the selection was never sent to the backend
  // at all, same pattern already fixed on the Performance/CSAT tabs.
  const { data: teamsData } = useQuery<any[]>({
    queryKey: ["/api/teams/get-all"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/teams/get-all");
      return res.json();
    },
  });
  const { data: usersData } = useQuery<any>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/users");
      return res.json();
    },
  });
  const teams: Array<{ id: string; name: string }> = (teamsData ?? []).map((tm: any) => ({ id: tm.id, name: tm.name }));
  const agents: Array<{ id: string; name: string }> = (usersData?.users ?? []).map((u: any) => ({ id: u.id, name: u.name }));

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
            {t("voice_of_customer_tab.summary")}
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
            {t("voice_of_customer_tab.details")}
          </button>
        </div>

        {/* Right side - Dropdowns */}
        <div className="flex items-center space-x-3">
          <InsightsDateRangePicker tab="voice" />
          <CustomDropdown
            options={teams}
            selected={selectedTeams}
            onChange={setSelectedTeams}
            placeholder={t("voice_of_customer_tab.teams")}
            width="120px"
            className="!w-[120px] border-slate-200 dark:border-slate-800"
            triggerContent={
              <>
                <div className="flex items-center gap-2 truncate">
                  <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className={cn("truncate text-[11px]", selectedTeams.length > 0 ? "text-slate-900 dark:text-white font-bold" : "text-slate-500 dark:text-slate-400")}>
                    {selectedTeams.length === 0 ? t("voice_of_customer_tab.teams") : t("voice_of_customer_tab.teams_count", { count: selectedTeams.length })}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400 ml-1 shrink-0" />
              </>
            }
          />
          <CustomDropdown
            options={agents}
            selected={selectedAgents}
            onChange={setSelectedAgents}
            placeholder={t("voice_of_customer_tab.agents")}
            width="120px"
            className="!w-[120px] border-slate-200 dark:border-slate-800"
            popoutAlign="right"
            triggerContent={
              <>
                <div className="flex items-center gap-2 truncate">
                  <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className={cn("truncate text-[11px]", selectedAgents.length > 0 ? "text-slate-900 dark:text-white font-bold" : "text-slate-500 dark:text-slate-400")}>
                    {selectedAgents.length === 0 ? t("voice_of_customer_tab.agents") : t("voice_of_customer_tab.agents_count", { count: selectedAgents.length })}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400 ml-1 shrink-0" />
              </>
            }
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in-50 duration-500">
        {voiceOfCustomerTab === "summary" && <VoiceOfCustomerSummary teamIds={selectedTeams} agentIds={selectedAgents} />}
        {voiceOfCustomerTab === "details" && <VoiceOfCustomerDetails teamIds={selectedTeams} agentIds={selectedAgents} />}
      </div>
    </div>
  );
}
