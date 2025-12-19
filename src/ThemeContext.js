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
    // Dark mode colors
    darkBg: "from-[#0f172a] via-[#020617] to-black",
    darkText: "text-white",
    darkCard: "bg-white/10",
    darkBorder: "border-white/20",
    darkHover: "hover:bg-white/20",
    // Light mode colors
    lightBg: "from-gray-50 via-white to-gray-100",
    lightText: "text-gray-900",
    lightCard: "bg-gray-100/80",
    lightBorder: "border-gray-300",
    lightHover: "hover:bg-gray-200/50",
    // Responsive/colors tokens
    bgGradient: isDark ? "from-[#0f172a] via-[#020617] to-black" : "from-gray-50 via-white to-gray-100",
    textColor: isDark ? "text-white" : "text-gray-900",
    // Card backgrounds and borders
    cardBg: isDark ? "bg-white/10" : "bg-white/80",
    cardBorder: isDark ? "border-white/20" : "border-gray-200",
    cardText: isDark ? "text-white" : "text-gray-900",
    smallText: isDark ? "text-gray-300" : "text-gray-600",
    faintText: isDark ? "text-gray-400" : "text-gray-500",
    navbarBg: isDark ? "bg-white/10" : "bg-white/90",
    navbarBorder: isDark ? "border-white/20" : "border-gray-300",
    accentGradient: isDark ? "from-cyan-400 to-purple-500" : "from-blue-500 to-purple-600",
    hoverEffect: isDark ? "hover:bg-white/20" : "hover:bg-gray-100",
    cardHoverBg: isDark ? "hover:bg-white/20" : "hover:bg-gray-50",
    // subtle backdrop for cards in light mode
    cardBackdrop: isDark ? "backdrop-blur-xl" : "",
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
