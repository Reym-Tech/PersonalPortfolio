import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";

const GRID_HALF = 20;
const GRID_STEP = 1.6;
const GRID_COLOR = 0x9ca3af; // gray-400 — refined on white

// WebGL check — jsdom and unsupported browsers skip to an immediate hand-off.
function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// Architectural drafting grid. Lines sorted center-to-edge so drawRange
// reveals them outward — like a CAD tool initializing a workspace.
function ArchGrid() {
  const geomRef = useRef(null);
  const progress = useRef(-0.18); // brief void before first line appears

  const { positions, lineCount } = useMemo(() => {
    const lines = [];
    const n = Math.ceil(GRID_HALF / GRID_STEP);

    for (let i = -n; i <= n; i++) {
      const x = i * GRID_STEP;
      lines.push({ dist: Math.abs(x), pts: [x, 0, -GRID_HALF, x, 0, GRID_HALF] });
    }
    for (let i = -n; i <= n; i++) {
      const z = i * GRID_STEP;
      lines.push({ dist: Math.abs(z), pts: [-GRID_HALF, 0, z, GRID_HALF, 0, z] });
    }

    // Center lines first, then progressively outward toward the horizon.
    lines.sort((a, b) => a.dist - b.dist);

    const pts = [];
    for (const line of lines) pts.push(...line.pts);

    return { positions: new Float32Array(pts), lineCount: pts.length / 3 };
  }, []);

  useFrame((_, delta) => {
    if (!geomRef.current) return;
    progress.current = Math.min(1, progress.current + delta * 0.44);
    if (progress.current <= 0) {
      geomRef.current.setDrawRange(0, 0);
      return;
    }
    const count = Math.floor(progress.current * lineCount);
    // Round to even — each line segment needs 2 vertices.
    geomRef.current.setDrawRange(0, count & ~1);
  });

  return (
    <lineSegments>
      <bufferGeometry
        ref={(g) => {
          geomRef.current = g;
          if (g) g.setDrawRange(0, 0);
        }}
      >
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={GRID_COLOR} transparent opacity={0.48} />
    </lineSegments>
  );
}

// Slow cinematic drift: starts overhead, gently pushes into the space.
// On exit, lifts away — ascending through the void.
function CameraRig({ exiting }) {
  useFrame((state, delta) => {
    if (!exiting.current) {
      state.camera.position.y += (9 - state.camera.position.y) * Math.min(1, delta * 0.3);
      state.camera.position.z += (10 - state.camera.position.z) * Math.min(1, delta * 0.3);
    } else {
      state.camera.position.y += (18 - state.camera.position.y) * Math.min(1, delta * 1.8);
    }
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ exiting }) {
  return (
    <>
      <color attach="background" args={["#FFFFFF"]} />
      <ambientLight intensity={1.8} />
      <ArchGrid />
      <CameraRig exiting={exiting} />
    </>
  );
}

// Sequence 1 — Void Initialization:
//   1. White void breathes; camera drifts overhead.
//   2. Drafting grid draws itself from center outward (~2.5 s).
//   3. Identity card assembles over the grid — eyebrow, name, rule, tagline.
//   4. 0.8 s hold at full composition.
//   5. Exit: card lifts away, overlay fades — white dissolves into white Hero.
//      onComplete fires when Hero is fully visible.
//
// prefers-reduced-motion and absent WebGL skip straight to onComplete.
export function EntryTransition({ onComplete, onExitBegin }) {
  const reduceMotion = useReducedMotion();
  const [supported] = useState(hasWebGL);
  const [phase, setPhase] = useState("intro");
  const exiting = useRef(false);

  const skip = reduceMotion || !supported;

  const beginExit = useCallback(() => {
    exiting.current = true;
    setPhase("exit");
    onExitBegin?.();
  }, [onExitBegin]);

  useEffect(() => {
    if (skip) {
      onExitBegin?.();
      onComplete();
      return undefined;
    }
    const timer = setTimeout(beginExit, 3200);
    return () => clearTimeout(timer);
  }, [skip, onComplete, onExitBegin, beginExit]);

  // Lock scroll while the overlay owns the screen.
  useEffect(() => {
    if (skip) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [skip]);

  // Keyboard escape hatch.
  useEffect(() => {
    if (skip) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        beginExit();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [skip, beginExit]);

  if (skip) return null;

  const isExiting = phase === "exit";

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden bg-elegant-surface"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{
        duration: isExiting ? 0.9 : 0,
        delay: isExiting ? 0.22 : 0,
        ease: [0.65, 0, 0.35, 1],
      }}
      onAnimationComplete={() => {
        if (isExiting) onComplete();
      }}
      role="presentation"
    >
      {/* 3D canvas — materializes softly so the grid emerges from pure white. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 12, 12], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <Scene exiting={exiting} />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Soft radial vignette — edges deepen just enough to convey spatial depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.045) 100%)",
        }}
      />

      {/* Identity card — minimal monochromatic typography over the grid. */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        initial={{ opacity: 0 }}
        animate={isExiting ? { opacity: 0, y: -14 } : { opacity: 1, y: 0 }}
        transition={{
          duration: isExiting ? 0.32 : 0.7,
          delay: isExiting ? 0 : 0.55,
          ease: [0.65, 0, 0.35, 1],
        }}
        aria-hidden="true"
      >

      </motion.div>

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
