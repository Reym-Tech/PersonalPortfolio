import { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

import { useTheme } from "../../../ThemeContext";

const SPACING = 40;
const BASE_COLOR = "156, 163, 175";

// Ambient wave keeps the grid subtly alive on load and on touch devices, not
// only when a cursor is near. Barely-there (~1.5px against 40px cells) so it
// never competes with the hero text.
const WAVE_AMP = 1.5;
const WAVE_SPEED = 0.0009;
const WAVE_FREQ = 0.012;

// Cursor spotlight: lines within GLOW_RADIUS of the pointer brighten and thicken
// with a soft falloff — a legible interaction that leaves the grid geometry
// undistorted (unlike a pull/warp, which reads as a faint smudge). The glow
// carries the brand blue (#2563EB) while the base grid stays structural gray:
// blue means "alive / responding to you", the site's one signature interaction.
const GLOW_RADIUS = 150;
const GLOW_ALPHA = 0.5;
const GLOW_COLOR = "37, 99, 235";

// One-shot radial pulse echoing the 3D entry ripple. When the grid first reveals
// after the intro, a shockwave expands from center along each node's radial
// direction, then decays into the ambient wave — so the handoff reads as the
// entry's energy arriving on this surface, not a cut. The bell envelope peaks
// ~0.75s in (mid-crossfade, where both grids sit near half opacity) and settles,
// leaving only the ambient breathing. Skipped on revisit / reduced motion.
const PULSE_PEAK = 15;
const PULSE_DURATION = 1500;
const PULSE_FREQ = 0.018;
const PULSE_SPEED = 0.0035;

export function LineGrid({ className = "", fadeColor = null, pulse = false }) {
  const canvasRef = useRef(null);
  const pulseStartRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // On dark, light-tinted lines at lower alpha read as the same whisper-quiet
  // texture they do on white; the glow keeps carrying the (lighter) brand blue.
  const baseColor = isDark ? "148, 163, 184" : BASE_COLOR;
  const baseAlpha = isDark ? 0.14 : 0.2;
  const glowColor = isDark ? "96, 165, 250" : GLOW_COLOR;
  const fade = fadeColor ?? (isDark ? "#0d1117" : "#ffffff");
  const fadeTransparent = isDark ? "rgba(13,17,23,0)" : "rgba(255,255,255,0)";

  // Mark the pulse's start so the animation loop can run its envelope; the loop
  // reads performance.now(), the same clock as the rAF timestamp.
  useEffect(() => {
    if (pulse && !reduceMotion) pulseStartRef.current = performance.now();
  }, [pulse, reduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let nodes = [];
    let cols = 0;
    let rows = 0;
    let mx = -9999;
    let my = -9999;
    let rafId = null;
    let alive = true;
    let visible = true;

    function build() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      cols = Math.ceil(w / SPACING) + 2;
      rows = Math.ceil(h / SPACING) + 2;
      nodes = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodes.push({ rx: c * SPACING, ry: r * SPACING, wx: 0, wy: 0 });
        }
      }
    }

    function drawGrid() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = `rgba(${baseColor}, ${baseAlpha})`;
      ctx.lineWidth = 1;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const nd = nodes[r * cols + c];
          if (!nd) continue;
          const x = nd.rx + nd.wx;
          const y = nd.ry + nd.wy;
          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const nd = nodes[r * cols + c];
          if (!nd) continue;
          const x = nd.rx + nd.wx;
          const y = nd.ry + nd.wy;
          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      drawGlow();

      const grad = ctx.createLinearGradient(0, h * 0.85, 0, h);
      grad.addColorStop(0, fadeTransparent);
      grad.addColorStop(1, fade);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    function drawGlow() {
      if (mx < -9000) return;
      const cMin = Math.max(0, Math.floor((mx - GLOW_RADIUS) / SPACING) - 1);
      const cMax = Math.min(cols - 1, Math.ceil((mx + GLOW_RADIUS) / SPACING) + 1);
      const rMin = Math.max(0, Math.floor((my - GLOW_RADIUS) / SPACING) - 1);
      const rMax = Math.min(rows - 1, Math.ceil((my + GLOW_RADIUS) / SPACING) + 1);

      for (let r = rMin; r <= rMax; r++) {
        for (let c = cMin; c <= cMax; c++) {
          const nd = nodes[r * cols + c];
          if (!nd) continue;
          const x = nd.rx + nd.wx;
          const y = nd.ry + nd.wy;
          const ex = mx - x;
          const ey = my - y;
          const d = Math.sqrt(ex * ex + ey * ey);
          if (d > GLOW_RADIUS) continue;

          const t = 1 - d / GLOW_RADIUS;
          ctx.strokeStyle = `rgba(${glowColor}, ${GLOW_ALPHA * t * t})`;
          ctx.lineWidth = 1 + t;
          ctx.beginPath();

          const right = nodes[r * cols + c + 1];
          if (c < cols - 1 && right) {
            ctx.moveTo(x, y);
            ctx.lineTo(right.rx + right.wx, right.ry + right.wy);
          }
          const down = nodes[(r + 1) * cols + c];
          if (r < rows - 1 && down) {
            ctx.moveTo(x, y);
            ctx.lineTo(down.rx + down.wx, down.ry + down.wy);
          }
          ctx.stroke();
        }
      }
    }

    function frame(now) {
      if (!alive || !visible) {
        rafId = null;
        return;
      }

      let pulseAmp = 0;
      let pulseT = 0;
      if (pulseStartRef.current != null) {
        pulseT = now - pulseStartRef.current;
        if (pulseT >= PULSE_DURATION) pulseStartRef.current = null;
        else pulseAmp = PULSE_PEAK * Math.sin((pulseT / PULSE_DURATION) * Math.PI);
      }
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (const nd of nodes) {
        const phase = (nd.rx + nd.ry) * WAVE_FREQ + now * WAVE_SPEED;
        let dx = Math.sin(phase) * WAVE_AMP;
        let dy = Math.cos(phase) * WAVE_AMP;
        if (pulseAmp > 0) {
          const ox = nd.rx - cx;
          const oy = nd.ry - cy;
          const dist = Math.hypot(ox, oy) || 1;
          const disp = pulseAmp * Math.sin(dist * PULSE_FREQ - pulseT * PULSE_SPEED);
          dx += (ox / dist) * disp;
          dy += (oy / dist) * disp;
        }
        nd.wx = dx;
        nd.wy = dy;
      }

      drawGrid();
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (!alive || reduceMotion || !visible || rafId != null) return;
      rafId = requestAnimationFrame(frame);
    }

    function stop() {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mx = x;
        my = y;
      } else {
        mx = -9999;
        my = -9999;
      }
    }

    function onTouch(e) {
      if (e.touches[0]) onMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    }

    function onTouchEnd() {
      mx = -9999;
      my = -9999;
    }

    function onResize() {
      stop();
      build();
      drawGrid();
      if (!reduceMotion) start();
    }

    build();
    drawGrid();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) return;
        if (reduceMotion) drawGrid();
        else start();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      alive = false;
      stop();
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
