import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => Promise<void>;
    primaryColor: string;
    setPrimaryColor: (color: string) => Promise<void>;
    setWorkspacePrimaryColor: (color: string | null) => void;
    setAgencyPrimaryColor: (color: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>("light");
    // User's personal color preference — persisted via /api/users/theme
    const [primaryColor, setPrimaryColorState] = useState("217 91% 60%");
    // User's explicit pick from the Theme settings page — wins over workspace default
    const [userOverride, setUserOverride] = useState<string | null>(null);
    // Workspace branding override (default brand color, below an explicit user choice)
    const [workspaceOverride, setWorkspaceOverride] = useState<string | null>(null);
    // Agency branding override — highest priority (hard white-label lock)
    const [agencyOverride, setAgencyOverride] = useState<string | null>(null);

    const effectivePrimary = agencyOverride ?? userOverride ?? workspaceOverride ?? primaryColor;

    // Load user's personal theme from backend once on mount
    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const res = await fetch("/api/users/theme");
                if (res.ok) {
                    const data = await res.json();
                    if (data.mode) setModeState(data.mode);
                    if (data.primaryColor) {
                        setPrimaryColorState(data.primaryColor);
                        // A saved personal color is an explicit user choice — keep it
                        // winning over the workspace default after reloads too.
                        setUserOverride(data.primaryColor);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch theme:", error);
            }
        };
        fetchTheme();
    }, []);

    // Apply dark/light class
    useEffect(() => {
        if (mode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        document.cookie = `themeMode=${mode}; path=/; max-age=31536000`;
    }, [mode]);

    // Apply CSS variables — effectivePrimary ensures the right tier wins
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--primary", effectivePrimary);
        root.style.setProperty("--ring", effectivePrimary);
        root.style.setProperty("--sidebar-primary", effectivePrimary);
        root.style.setProperty("--sidebar-ring", effectivePrimary);
        root.style.setProperty("--chart-1", effectivePrimary);
        document.cookie = `themePrimaryColor=${encodeURIComponent(effectivePrimary)}; path=/; max-age=31536000`;
    }, [effectivePrimary]);

    const setMode = async (newMode: ThemeMode) => {
        setModeState(newMode);
        try {
            await apiRequest("POST", "/api/users/theme", { mode: newMode, primaryColor });
        } catch (error) {
            console.error("Failed to save mode:", error);
        }
    };

    // Saves user's personal color preference to the DB
    const setPrimaryColor = async (newColor: string) => {
        setPrimaryColorState(newColor);
        // Explicit user pick — must immediately win over the workspace default.
        setUserOverride(newColor);
        try {
            await apiRequest("POST", "/api/users/theme", { mode, primaryColor: newColor });
        } catch (error) {
            console.error("Failed to save primary color:", error);
        }
    };

    // Sets workspace branding color — does NOT save to user theme
    const setWorkspacePrimaryColor = (color: string | null) => {
        setWorkspaceOverride(color);
    };

    // Sets agency branding color — highest priority override
    const setAgencyPrimaryColor = (color: string | null) => {
        setAgencyOverride(color);
    };

    return (
        <ThemeContext.Provider value={{ mode, setMode, primaryColor, setPrimaryColor, setWorkspacePrimaryColor, setAgencyPrimaryColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
