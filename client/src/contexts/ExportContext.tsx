import React, { createContext, useContext, useState } from "react";

interface ExportOptions {
  overview: Record<string, boolean>;
  agentPerformance: Record<string, Record<string, boolean>>;
  whatsapp: Record<string, Record<string, boolean>>;
  botDashboard: Record<string, boolean>;
  voiceOfCustomer: Record<string, Record<string, boolean>>;
  csatDashboard: Record<string, Record<string, boolean>>;
}

interface ExportContextType {
  exportOptions: ExportOptions;
  setExportOptions: (options: ExportOptions | ((prev: ExportOptions) => ExportOptions)) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
}

const ExportContext = createContext<ExportContextType | undefined>(undefined);

const defaultExportOptions: ExportOptions = {
  overview: {
    totalCustomers: false,
    newCustomers: false,
    messageDetails: false,
    monthlyActiveUsers: false,
  },
  agentPerformance: {
    "agent-performance-main": {
      agentBoardSummary: false,
      agentBoardDetails: false,
      agentAwayLogs: false,
      agentLoginLogs: false,
    },
    "agent-conversion": {
      initiated: false,
      open: false,
      inProgress: false,
      closed: false,
      pending: false,
      exited: false,
      conversationsInitiatedVsInProgressVsSolved: false,
      conversationTagsStats: false,
    },
  },
  whatsapp: {
    "whatsapp-messages": {
      messageDetails: false,
      callDetails: false,
    },
    "whatsapp-calls": {
      messageDetails: false,
      callDetails: false,
    },
  },
  botDashboard: {
    popularityOfInteractionsDetailed: false,
    popularityOfInteractionsSummary: false,
    busiestPeriod: false,
    botVsHuman: false,
    exportChatData: false,
  },
  voiceOfCustomer: {
    "voice-of-customer-summary": {
      customerSentimentsExport: false,
    },
    "voice-of-customer-details": {
      customerSentimentsExport: false,
    },
  },
  csatDashboard: {
    "csat-dashboard-summary": {
      feedbackDetails: false,
      feedbackChart: false,
    },
    "csat-dashboard-details": {
      feedbackDetails: false,
      feedbackChart: false,
    },
  },
};

export function ExportProvider({ children }: { children: React.ReactNode }) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>(defaultExportOptions);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <ExportContext.Provider
      value={{
        exportOptions,
        setExportOptions,
        isExportModalOpen,
        setIsExportModalOpen,
      }}
    >
      {children}
    </ExportContext.Provider>
  );
}

export function useExport() {
  const context = useContext(ExportContext);
  if (!context) {
    throw new Error("useExport must be used within ExportProvider");
  }
  return context;
}

