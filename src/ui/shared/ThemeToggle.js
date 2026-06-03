import { useTheme } from "../../ThemeContext";
import { focusLink } from "../design-system/button-styles";
import { Moon, Sun } from "../design-system/icons";
import { BORDER } from "../design-system/tokens";

export function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] border ${BORDER} text-elegant-text transition-colors hover:bg-elegant-hover ${focusLink} ${className}`}
    >
      {isDark ? <Sun /> : <Moon />}
    </button>
  );
}
