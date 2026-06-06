import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useTheme } from "../../../ThemeContext";

// Keep in sync with LineGrid.js SPACING so the grids are identical.
const SPACING = 40;
const DRAW_DURATION = 1200; // ms to expand the reveal circle from center to corner

// Draws the same grid as LineGrid but reveals it with an expanding circular
// clip — center outward — so the handoff to the Hero's LineGrid reads as one
// continuous surface rather than two separate grids cutting over.
function EntryGrid({ isDark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let rafId = null;
    let alive = true;
    let startTime = null;

    const baseColor = isDark ? "148, 163, 184" : "52, 58, 64";
    const baseAlpha = isDark ? 0.14 : 0.2;
    const fade = isDark ? "#0d1117" : "#ffffff";
    const fadeTransparent = isDark ? "rgba(13,17,23,0)" : "rgba(255,255,255,0)";

    // Offset y so our lines land at the same viewport positions as the Hero's
    // LineGrid. Hero canvas sits below the NavBar, so its first line is at
    // navH in viewport coords. We phase-shift by navH % SPACING to match.
    const nav = document.querySelector('nav[aria-label="Primary"]');
    const navH = nav ? nav.offsetHeight : 64;
    const yPhase = navH % SPACING;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function draw(now) {
      if (!startTime) startTime = now;
      const progress = Math.min(1, (now - startTime) / DRAW_DURATION);
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) {
        if (alive) rafId = requestAnimationFrame(draw);
        return;
      }

      const cx = w / 2;
      const cy = h / 2;
      const radius = progress * Math.hypot(cx, cy);

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = `rgba(${baseColor}, ${baseAlpha})`;
      ctx.lineWidth = 1;

      // Horizontal: start at yPhase - SPACING so lines at navH, navH+40, navH+80…
      for (let y = yPhase - SPACING; y < h + SPACING; y += SPACING) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      // Vertical: Hero's LineGrid also starts from x=0, no offset needed
      for (let x = 0; x < w + SPACING; x += SPACING) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      ctx.restore();

      // Bottom fade matching LineGrid's own gradient
      const grad = ctx.createLinearGradient(0, h * 0.85, 0, h);
      grad.addColorStop(0, fadeTransparent);
      grad.addColorStop(1, fade);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (alive && progress < 1) rafId = requestAnimationFrame(draw);
    }

    resize();
    rafId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

export function EntryTransition({ onComplete, onExitBegin }) {
  const reduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [phase, setPhase] = useState("intro");
  const onExitBeginRef = useRef(onExitBegin);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onExitBeginRef.current = onExitBegin; });
  useEffect(() => { onCompleteRef.current = onComplete; });

  const t1Ref = useRef(null);

  const beginExit = useCallback(() => {
    clearTimeout(t1Ref.current);
    setPhase("exit");
    onExitBeginRef.current?.();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      onExitBeginRef.current?.();
      onCompleteRef.current?.();
      return undefined;
    }
    // Draw completes ~1.2s; 1600ms gives ~400ms hold before exit begins.
    t1Ref.current = setTimeout(beginExit, 1600);
    return () => { clearTimeout(t1Ref.current); };
  }, [reduceMotion, beginExit]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        beginExit();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reduceMotion, beginExit]);

  if (reduceMotion) return null;

  const isExiting = phase === "exit";

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-elegant-surface"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{
        duration: isExiting ? 1.0 : 0,
        ease: [0.65, 0, 0.35, 1],
      }}
      onAnimationComplete={() => {
        if (isExiting) onCompleteRef.current?.();
      }}
      role="presentation"
    >
      <EntryGrid isDark={isDark} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.045)"
            } 100%)`,
        }}
      />

      <button
        type="button"
        onClick={beginExit}
        className="absolute bottom-8 right-8 font-mono text-xs uppercase tracking-widest text-elegant-text/30 transition-colors hover:text-elegant-text/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-elegant-text/20 focus-visible:ring-offset-2"
      >
        Skip
      </button>
    </motion.div>
  );
}
