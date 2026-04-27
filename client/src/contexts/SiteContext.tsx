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

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ignite = async () => {
      try {
        const response = await fetch(`/api/ignite?hostname=${window.location.host}`);
        if (!response.ok) throw new Error("Failed to ignite application");
        const data = await response.json();
        setSiteData(data);
      } catch (err: any) {
        console.error("Ignition error:", err);
        setError(err.message);
        // Default fallback to WORKSPACE if ignite fails
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
