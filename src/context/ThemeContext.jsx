import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const PRESET_PALETTES = [
  { name: "Electric Tangerine", hex: "#f97316" },
  { name: "Warm Amber", hex: "#d97706" },
  { name: "Sunset Crimson", hex: "#e11d48" },
  { name: "Neon Violet", hex: "#8b5cf6" },
  { name: "Electric Blue", hex: "#2563eb" },
  { name: "Hot Coral", hex: "#f43f5e" },
  { name: "Burnt Ochre", hex: "#b45309" },
  { name: "Charcoal Slate", hex: "#334155" },
];

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("taskit_dark") === "true";
  });

  const [accentColor, setAccentColor] = useState(() => {
    const saved = localStorage.getItem("taskit_accent_hex");
    // Clear out any stale green hexes from previous sessions
    if (!saved || saved.toLowerCase().includes("047857") || saved.toLowerCase().includes("10b981")) {
      return "#f97316";
    }
    return saved;
  });

  useEffect(() => {
    localStorage.setItem("taskit_dark", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("taskit_accent_hex", accentColor);
    document.documentElement.style.setProperty("--custom-accent", accentColor);
  }, [accentColor]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        accentColor,
        setAccentColor,
        PRESET_PALETTES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};