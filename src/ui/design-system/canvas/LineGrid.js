import { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

import { useTheme } from "../../../ThemeContext";

const SPACING = 40;
const BASE_COLOR = "52, 58, 64";

// Cursor glow: line segments within GLOW_RADIUS of the pointer brighten and
// thicken with a soft falloff. Brand blue on hover signals interactivity
// without distorting the grid geometry.
const GLOW_RADIUS = 150;
const GLOW_ALPHA = 0.5;
const GLOW_COLOR = "37, 99, 235";

export function LineGrid({ className = "", fadeColor = null }) {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const baseColor = isDark ? "148, 163, 184" : BASE_COLOR;
  const baseAlpha = isDark ? 0.14 : 0.2;
  const glowColor = isDark ? "96, 165, 250" : GLOW_COLOR;
  const fade = fadeColor ?? (isDark ? "#0d1117" : "#ffffff");
  const fadeTransparent = isDark ? "rgba(13,17,23,0)" : "rgba(255,255,255,0)";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let cols = 0;
    let rows = 0;
    let mx = -9999;
    let my = -9999;
    let visible = true;

    function build() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      cols = Math.ceil(w / SPACING) + 2;
      rows = Math.ceil(h / SPACING) + 2;
    }

    function drawGlow() {
      if (mx < -9000) return;
      const cMin = Math.max(0, Math.floor((mx - GLOW_RADIUS) / SPACING) - 1);
      const cMax = Math.min(cols - 1, Math.ceil((mx + GLOW_RADIUS) / SPACING) + 1);
      const rMin = Math.max(0, Math.floor((my - GLOW_RADIUS) / SPACING) - 1);
      const rMax = Math.min(rows - 1, Math.ceil((my + GLOW_RADIUS) / SPACING) + 1);

      for (let r = rMin; r <= rMax; r++) {
        for (let c = cMin; c <= cMax; c++) {
          const x = c * SPACING;
          const y = r * SPACING;
          const d = Math.hypot(mx - x, my - y);
          if (d > GLOW_RADIUS) continue;

          const t = 1 - d / GLOW_RADIUS;
          ctx.strokeStyle = `rgba(${glowColor}, ${GLOW_ALPHA * t * t})`;
          ctx.lineWidth = 1 + t;
          ctx.beginPath();
          if (c < cols - 1) { ctx.moveTo(x, y); ctx.lineTo(x + SPACING, y); }
          if (r < rows - 1) { ctx.moveTo(x, y); ctx.lineTo(x, y + SPACING); }
          ctx.stroke();
        }
      }
    }

    function drawGrid() {
      if (!visible) return;
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = `rgba(${baseColor}, ${baseAlpha})`;
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        ctx.beginPath(); ctx.moveTo(0, r * SPACING); ctx.lineTo(w, r * SPACING); ctx.stroke();
      }
      for (let c = 0; c < cols; c++) {
        ctx.beginPath(); ctx.moveTo(c * SPACING, 0); ctx.lineTo(c * SPACING, h); ctx.stroke();
      }

      drawGlow();

      const grad = ctx.createLinearGradient(0, h * 0.85, 0, h);
      grad.addColorStop(0, fadeTransparent);
      grad.addColorStop(1, fade);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    function onMove(e) {
      if (reduceMotion) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mx = (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) ? x : -9999;
      my = (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) ? y : -9999;
      drawGrid();
    }

    function onTouch(e) {
      if (e.touches[0]) onMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    }

    function onTouchEnd() {
      mx = -9999; my = -9999;
      drawGrid();
    }

    function onResize() {
      build();
      drawGrid();
    }

    build();
    drawGrid();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);

    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; drawGrid(); },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
    };
  }, [reduceMotion, baseColor, baseAlpha, glowColor, fade, fadeTransparent]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
