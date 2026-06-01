import { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

const SPACING = 40;
const RADIUS = 160;
const MAX_PULL = 1.5;
const SPRING = 0.08;
const DAMPING = 0.82;

export function LineGrid({ className = "", fadeColor = "#ffffff" }) {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

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
          nodes.push({ rx: c * SPACING, ry: r * SPACING, dx: 0, dy: 0, vx: 0, vy: 0 });
        }
      }
    }

    function drawGrid() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(17, 24, 39, 0.07)";
      ctx.lineWidth = 1;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const nd = nodes[r * cols + c];
          if (!nd) continue;
          const x = nd.rx + nd.dx;
          const y = nd.ry + nd.dy;
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
          const x = nd.rx + nd.dx;
          const y = nd.ry + nd.dy;
          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      const grad = ctx.createLinearGradient(0, h * 0.85, 0, h);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(1, fadeColor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    function frame() {
      if (!alive || !visible) {
        rafId = null;
        return;
      }

      for (const nd of nodes) {
        const nx = nd.rx + nd.dx;
        const ny = nd.ry + nd.dy;
        const ex = mx - nx;
        const ey = my - ny;
        const d = Math.sqrt(ex * ex + ey * ey);

        let ax = -nd.dx * SPRING;
        let ay = -nd.dy * SPRING;

        if (d < RADIUS && d > 1) {
          const t = 1 - d / RADIUS;
          const f = (t * t * MAX_PULL) / d;
          ax += ex * f;
          ay += ey * f;
        }

        nd.vx = (nd.vx + ax) * DAMPING;
        nd.vy = (nd.vy + ay) * DAMPING;
        nd.dx += nd.vx;
        nd.dy += nd.vy;
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
  }, [reduceMotion, fadeColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
