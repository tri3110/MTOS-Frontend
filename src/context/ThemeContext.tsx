"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URLS } from "@/lib/constants";
import { AuthService } from "@/services";

type ThemeMode = "light" | "dark";
type ThemeConfig = Record<string, string>;

type ThemeContextType = {
  mode: ThemeMode;
  toggleMode: () => void;
  theme: ThemeConfig;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [theme, setTheme] = useState<ThemeConfig>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ Load dark/light mode
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") as ThemeMode | null;
    const initialMode = savedMode || "light";

    setMode(initialMode);
    setIsInitialized(true);
  }, []);

  // ✅ Apply dark/light class
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem("themeMode", mode);

    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode, isInitialized]);

  // ✅ Load theme config từ API
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const cached = localStorage.getItem("themeData");
        if (cached) {
          const parsed = JSON.parse(cached);
          setTheme(parsed);
          applyTheme(parsed);
        }

        const data = await AuthService.getThemes();

        setTheme(data as ThemeConfig);
        localStorage.setItem("themeData", JSON.stringify(data));
        applyTheme(data as ThemeConfig);
      } catch (err) {
        console.error("Load theme failed:", err);
      }
    };

    loadTheme();
  }, []);

  // ✅ Apply CSS variables
  const applyTheme = (config: ThemeConfig) => {
    const root = document.documentElement;

    Object.entries(config).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};