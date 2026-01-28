import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("portfolioTheme");
    return saved ? saved === "dark" : true; // Default to dark mode
  });

  useEffect(() => {
    localStorage.setItem("portfolioTheme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const theme = {
    isDark,
    toggleTheme,
    // Background gradients - dark blue to black
    bgGradient: isDark ? "from-ink_black-600 via-prussian_blue-500 to-ink_black-500" : "from-gold-100 via-regal_navy-50 to-school_bus_yellow-50",
    // Text colors
    textColor: isDark ? "text-regal_navy-900" : "text-ink_black-500",
    cardText: isDark ? "text-regal_navy-900" : "text-ink_black-500",
    smallText: isDark ? "text-regal_navy-800" : "text-ink_black-600",
    faintText: isDark ? "text-regal_navy-700" : "text-ink_black-700",
    // Card styling
    cardBg: isDark ? "bg-prussian_blue-700/30" : "bg-white/70",
    cardBorder: isDark ? "border-regal_navy-700/40" : "border-school_bus_yellow-300/60",
    cardHoverBg: isDark ? "hover:bg-prussian_blue-600/40" : "hover:bg-white/90",
    cardShadow: isDark ? "shadow-lg shadow-school_bus_yellow-500/15" : "shadow-lg shadow-school_bus_yellow-300/20",
    cardBackdrop: "backdrop-blur-lg",
    // Navigation
    navbarBg: isDark ? "bg-prussian_blue-700/35" : "bg-white/70",
    navbarBorder: isDark ? "border-regal_navy-700/40" : "border-school_bus_yellow-300/40",
    // Accent colors - school bus yellow as primary accent
    accentGradient: "from-school_bus_yellow-400 to-gold-500",
    accentGradientHover: "from-school_bus_yellow-300 to-gold-400",
    hoverEffect: isDark ? "hover:bg-prussian_blue-600/40" : "hover:bg-white/80",
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
