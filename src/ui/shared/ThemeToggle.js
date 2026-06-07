import { useRef } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useTheme } from "../../ThemeContext";
import { useSound } from "../../SoundContext";
import { focusLink } from "../design-system/button-styles";
import { Moon, Sun } from "../design-system/icons";

export function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const { playSound } = useSound();
  const isDark = theme === "dark";
  const reduceMotion = useReducedMotion();
  const isWavingRef = useRef(false);

  const handleClick = (event) => {
    // Before the reduced-motion early return so both paths sound. Pitch follows
    // the destination: lower toward dark, higher toward light.
    playSound(isDark ? "toggleLight" : "toggleDark");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Skip the wave on touch devices: Chrome Android anchors the root view-transition
    // snapshot to the document top when the page is scrolled, so the sticky nav blinks
    // out and the wave fires from the top instead of the tap. The instant swap below is
    // clean everywhere; the wave is mouse-centric (it originates at the click point).
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!document.startViewTransition || prefersReducedMotion || isTouch) {
      toggleTheme();
      return;
    }
    if (isWavingRef.current) return;

    // Keyboard activation has no pointer coords (detail === 0); anchor the wave to
    // the button's center so it doesn't shoot in from the top-left corner.
    const rect = event.currentTarget.getBoundingClientRect();
    const originX = event.detail === 0 ? rect.left + rect.width / 2 : event.clientX;
    const originY = event.detail === 0 ? rect.top + rect.height / 2 : event.clientY;
    const radius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY),
    );

    const root = document.documentElement;
    root.style.setProperty("--wave-x", `${originX}px`);
    root.style.setProperty("--wave-y", `${originY}px`);
    root.style.setProperty("--wave-r", `${radius}px`);

    isWavingRef.current = true;
    const transition = document.startViewTransition(() => flushSync(() => toggleTheme()));
    const stopWaving = () => {
      isWavingRef.current = false;
    };
    transition.finished.then(stopWaving, stopWaving);
  };

  return (
    <button
      type="button"
      data-theme-toggle
      onClick={handleClick}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-none text-elegant-text transition-colors hover:bg-elegant-hover ${focusLink} ${className}`}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? "sun" : "moon"}
          className="inline-flex"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -90 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, rotate: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {isDark ? <Sun /> : <Moon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
