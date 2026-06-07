import { useRef } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useTheme } from "../../ThemeContext";
import { useSound } from "../../SoundContext";
import { focusLink } from "../design-system/button-styles";
import { Moon, Sun } from "../design-system/icons";

const WAVE_MS = 500;

// Reveal the incoming theme through a transparent hole that grows from the tap point.
// A full-screen overlay painted with the OUTGOING surface color covers everything;
// the theme is swapped underneath it, then a radial-gradient mask punches an
// expanding hole so the freshly themed page is exposed progressively inside the
// circle. Built without the View Transitions API on purpose: VT snapshots the whole
// page, and Chrome Android anchors that snapshot to the document top when scrolled,
// which blinked out the sticky nav and fired the wave from the top.
function playThemeWave(originX, originY, applyTheme) {
  const root = document.documentElement;
  const surface = getComputedStyle(root).getPropertyValue("--elegant-surface").trim();

  // Reach past the farthest corner so the hole fully clears the viewport.
  const radius =
    Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY),
    ) + 2;

  const overlay = document.createElement("div");
  overlay.style.cssText =
    `position:fixed;inset:0;z-index:9999;pointer-events:none;background:rgb(${surface});--wave-radius:0px;`;
  const mask =
    `radial-gradient(circle at ${originX}px ${originY}px, ` +
    `transparent 0, transparent calc(var(--wave-radius) - 2px), #000 var(--wave-radius))`;
  overlay.style.webkitMaskImage = mask;
  overlay.style.maskImage = mask;
  document.body.appendChild(overlay);

  // Swap under the covering overlay (flushSync so the .dark class is live before the
  // hole opens), then grow the hole to expose the new theme. Reading the overlay's
  // own color first means the swap underneath is never seen.
  flushSync(applyTheme);

  const animation = overlay.animate(
    [{ "--wave-radius": "0px" }, { "--wave-radius": `${radius}px` }],
    { duration: WAVE_MS, easing: "ease-in-out", fill: "forwards" },
  );
  return animation.finished.finally(() => overlay.remove());
}

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
    if (prefersReducedMotion) {
      toggleTheme();
      return;
    }
    if (isWavingRef.current) return;

    // Keyboard activation has no pointer coords (detail === 0); anchor the wave to
    // the button's center so it doesn't shoot in from the top-left corner.
    const rect = event.currentTarget.getBoundingClientRect();
    const originX = event.detail === 0 ? rect.left + rect.width / 2 : event.clientX;
    const originY = event.detail === 0 ? rect.top + rect.height / 2 : event.clientY;

    isWavingRef.current = true;
    playThemeWave(originX, originY, toggleTheme).finally(() => {
      isWavingRef.current = false;
    });
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
