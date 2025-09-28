"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return a default theme instead of throwing an error
    return {
      theme: "light" as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
      isDarkMode: false,
      mounted: false,
    };
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        setThemeState(savedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const systemTheme = prefersDark ? "dark" : "light";
        setThemeState(systemTheme);
        // Save system preference to localStorage
        localStorage.setItem("theme", systemTheme);
      }
    } catch (error) {
      // Fallback to light theme if localStorage is not available
      setThemeState("light");
    }
    setMounted(true);
  }, []);

  // Apply theme to document and sync with next-themes
  useEffect(() => {
    if (mounted) {
      // Remove existing theme classes
      document.documentElement.classList.remove("light", "dark");
      // Add current theme class
      document.documentElement.classList.add(theme);

      // Set data attribute for next-themes compatibility
      document.documentElement.setAttribute("data-theme", theme);

      // Update CSS custom properties for immediate effect
      const root = document.documentElement;
      if (theme === "dark") {
        root.style.colorScheme = "dark";
      } else {
        root.style.colorScheme = "light";
      }
    }
  }, [theme, mounted]);

  // Listen for storage changes to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        const newTheme = e.newValue as Theme;
        if (newTheme === "light" || newTheme === "dark") {
          setThemeState(newTheme);
        }
      }
    };

    // Listen for custom theme change events within the same tab
    const handleThemeChange = (e: CustomEvent) => {
      const newTheme = e.detail as Theme;
      if (newTheme === "light" || newTheme === "dark") {
        setThemeState(newTheme);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("themeChanged", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "themeChanged",
        handleThemeChange as EventListener
      );
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
      // Dispatch custom event for immediate sync within the same tab
      window.dispatchEvent(
        new CustomEvent("themeChanged", { detail: newTheme })
      );
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const isDarkMode = theme === "dark";

  // Always render the provider, but with default values until mounted
  const contextValue = mounted
    ? { theme, setTheme, toggleTheme, isDarkMode, mounted }
    : {
        theme: "light" as Theme,
        setTheme: () => {},
        toggleTheme: () => {},
        isDarkMode: false,
        mounted: false,
      };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
