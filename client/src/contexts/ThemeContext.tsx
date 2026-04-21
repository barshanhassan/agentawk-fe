import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => Promise<void>;
    primaryColor: string; // The HSL color like '217 91% 60%'
    setPrimaryColor: (color: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>("light");
    const [primaryColor, setPrimaryColorState] = useState("217 91% 60%"); // Default Blue

    // Load from backend on mount
    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const res = await fetch("/api/users/theme");
                if (res.ok) {
                    const data = await res.json();
                    if (data.mode) setModeState(data.mode);
                    if (data.primaryColor) setPrimaryColorState(data.primaryColor);
                }
            } catch (error) {
                console.error("Failed to fetch theme:", error);
            }
        };
        fetchTheme();
    }, []);

    // Update cookie and DOM for mode
    useEffect(() => {
        if (mode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        document.cookie = `themeMode=${mode}; path=/; max-age=31536000`;
    }, [mode]);

    // Update CSS variables for color
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--primary", primaryColor);
        root.style.setProperty("--ring", primaryColor);
        root.style.setProperty("--sidebar-primary", primaryColor);
        root.style.setProperty("--sidebar-ring", primaryColor);
        root.style.setProperty("--chart-1", primaryColor);
        
        // Update complementary colors for charts based on primary selection
        // (Just updating the first chart color to match primary)
        
        document.cookie = `themePrimaryColor=${encodeURIComponent(primaryColor)}; path=/; max-age=31536000`;
    }, [primaryColor]);

    const setMode = async (newMode: ThemeMode) => {
        setModeState(newMode);
        try {
            await apiRequest("POST", "/api/users/theme", { mode: newMode, primaryColor });
        } catch (error) {
            console.error("Failed to save mode:", error);
        }
    };

    const setPrimaryColor = async (newColor: string) => {
        setPrimaryColorState(newColor);
        try {
            await apiRequest("POST", "/api/users/theme", { mode, primaryColor: newColor });
        } catch (error) {
            console.error("Failed to save primary color:", error);
        }
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
