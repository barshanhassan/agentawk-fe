import React, { createContext, useContext, useState, useEffect } from "react";

interface SiteData {
  app: {
    name: string;
    site_type: "AGENCY" | "WORKSPACE";
    domain?: string;
  };
  site?: any;
}

interface SiteContextType {
  siteData: SiteData | null;
  loading: boolean;
  error: string | null;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const LIVE_URL = "https://ezconn-backend-396801134474.us-central1.run.app";

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ignite = async () => {
      try {
        const host = window.location.host; 
        const isAgency = host.startsWith("agency.");

        try {
          const response = await fetch(`${LIVE_URL}/ignite?hostname=${host}`);
          if (response.ok) {
            const data = await response.json();
            setSiteData(data);
            return;
          }
        } catch {
          // Backend ignite failed
        }

        setSiteData({
          app: {
            name: isAgency ? "EZCONN Agency" : "EZCONN",
            site_type: isAgency ? "AGENCY" : "WORKSPACE",
          },
        });
      } catch (err: any) {
        console.error("Ignition error:", err);
        setError(err.message);
        setSiteData({ app: { name: "Ezconn", site_type: "WORKSPACE" } });
      } finally {
        setLoading(false);
      }
    };

    ignite();
  }, []);

  return (
    <SiteContext.Provider value={{ siteData, loading, error }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
};
