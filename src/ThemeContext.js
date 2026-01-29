import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("portfolioTheme");
    return saved ? saved === "dark" : true; // Default to dark mode
  });

  useEffect(() => {
    localStorage.setItem("portfolioTheme", isDark ? "dark" : "light");
    // Apply theme class to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const theme = {
    isDark,
    toggleTheme,
    
    // Background gradients - clean professional look
    bgGradient: isDark 
      ? "from-primary-900 via-primary-800 to-primary-900" 
      : "from-white via-primary-50 to-white",
    
    // Text colors - high contrast for readability
    textColor: isDark ? "text-primary-100" : "text-primary-900",
    secondaryText: isDark ? "text-primary-400" : "text-primary-500",
    
    // Card styling - subtle and professional
    cardBg: isDark 
      ? "bg-primary-700/30 dark:bg-primary-700/30" 
      : "bg-white/70",
    cardBorder: isDark 
      ? "border-primary-700/40" 
      : "border-primary-200/60",
    cardHoverBg: isDark 
      ? "hover:bg-primary-700/50" 
      : "hover:bg-white/90",
    cardBackdrop: "backdrop-blur-lg",
    
    // Navigation - clean and minimal
    navbarBg: isDark 
      ? "bg-primary-800/80 dark:bg-primary-800/80" 
      : "bg-white/80",
    navbarBorder: isDark 
      ? "border-primary-700/40" 
      : "border-primary-200/40",
    
    // Accent colors - professional blue
    accentColor: isDark ? "text-accent-400" : "text-accent-600",
    accentBg: isDark ? "bg-accent-400" : "bg-accent-600",
    accentHover: isDark ? "hover:bg-accent-500" : "hover:bg-accent-500",
    accentGradient: isDark 
      ? "from-accent-400 to-accent-500" 
      : "from-accent-500 to-accent-600",
    
    // Interactive elements
    hoverEffect: isDark 
      ? "hover:bg-primary-700/40 transition-colors duration-300" 
      : "hover:bg-primary-50 transition-colors duration-300",
    
    // Shadows - subtle depth
    cardShadow: isDark 
      ? "shadow-lg shadow-primary-900/20" 
      : "shadow-lg shadow-primary-900/10",
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
