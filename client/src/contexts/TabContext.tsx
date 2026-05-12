import React, { createContext, useContext, useState } from "react";

interface ActiveSubTab {
  agentPerformance: string;
  whatsapp: string;
  voiceOfCustomer: string;
  csatDashboard: string;
}

interface TabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSubTab: ActiveSubTab;
  setActiveSubTab: (subTab: Partial<ActiveSubTab>) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSubTab, setActiveSubTabState] = useState<ActiveSubTab>({
    agentPerformance: "agent-performance-main",
    whatsapp: "whatsapp-messages",
    voiceOfCustomer: "voice-of-customer-summary",
    csatDashboard: "csat-dashboard-summary",
  });

  const setActiveSubTab = (subTab: Partial<ActiveSubTab>) => {
    setActiveSubTabState((prev) => ({ ...prev, ...subTab }));
  };

  return (
    <TabContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeSubTab,
        setActiveSubTab,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTab must be used within TabProvider");
  }
  return context;
}

