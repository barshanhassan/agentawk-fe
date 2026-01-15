import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    primaryColor: string; // The HSL color like '217 91% 60%'
    setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>("light");
    const [primaryColor, setPrimaryColorState] = useState("217 91% 60%"); // Default Blue

    // Helper to read cookie
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    // Load from cookie on mount
    useEffect(() => {
        const savedMode = getCookie("themeMode") as ThemeMode;
        const savedColor = getCookie("themePrimaryColor");

        if (savedMode === "light" || savedMode === "dark") {
            setModeState(savedMode);
        }
        if (savedColor) {
            setPrimaryColorState(decodeURIComponent(savedColor));
        }
    }, []);

    // Update cookie and DOM when state changes
    useEffect(() => {
        // Update document class for dark mode
        if (mode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        document.cookie = `themeMode=${mode}; path=/; max-age=31536000`; // 1 year
    }, [mode]);

    useEffect(() => {
        // Update CSS variables
        // Updating all variables that rely on primary HSL channels
        document.documentElement.style.setProperty("--primary", primaryColor);
        document.documentElement.style.setProperty("--ring", primaryColor);
        document.documentElement.style.setProperty("--sidebar-primary", primaryColor);
        document.documentElement.style.setProperty("--sidebar-ring", primaryColor);

        // Cookie
        document.cookie = `themePrimaryColor=${encodeURIComponent(primaryColor)}; path=/; max-age=31536000`;
    }, [primaryColor]);

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
    };

    const setPrimaryColor = (newColor: string) => {
        setPrimaryColorState(newColor);
    };

    return (
        <ThemeContext.Provider value={{ mode, setMode, primaryColor, setPrimaryColor }}>
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
