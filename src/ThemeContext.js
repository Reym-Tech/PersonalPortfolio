import { createContext, useCallback, useContext, useLayoutEffect, useState } from "react";

const ThemeContext = createContext(null);

// Mirror the pre-paint script in public/index.html so React's initial state
// matches the class already on <html> (no flash, no first-render mismatch).
function getInitialTheme() {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Layout (not passive) effect so the .dark class lands synchronously when the
  // toggle runs it inside flushSync(); the theme-wave view transition snapshots
  // <html> right after, and a late class would make the wave reveal no change.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Private mode / storage disabled — theme still applies for this session.
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0D1117" : "#FFFFFF");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Null-safe: decorative components (LineGrid) and section tests render outside a
// provider; they get a static light theme rather than throwing.
export function useTheme() {
  return useContext(ThemeContext) ?? { theme: "light", toggleTheme: () => {} };
}
