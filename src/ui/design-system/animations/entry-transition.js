import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";

import { useTheme } from "../../../ThemeContext";

const GRID_HALF = 20;
const GRID_STEP = 1.6;
const GRID_COLOR = 0x9ca3af;

// One-shot ripple: a single wave swells from the grid's center as the lines draw
// in, peaks mid-entry, then settles to a faint residual hum. The displacement is
// on Y (the grid sits on the Y=0 floor), so the surface undulates without
// breaking its perspective read. Amplitude is driven by draw progress, not wall
// time, so ripple and draw-in stay locked together.
const RIPPLE_MAX = 1.1;
// The residual the ripple decays to during the exit crossfade, matched to the
// energy the Hero's 2D LineGrid breathes at so the handoff reads as one surface
// losing momentum rather than two animations. LineGrid waves WAVE_AMP=1.5px over
// SPACING=40px cells (a 0.0375 cell-fraction); scaled to this grid's GRID_STEP
// of 1.6 world units that's 0.0375 * 1.6 = 0.06. Phase can't carry across (the
// entry wave is radial, LineGrid's is a planar diagonal), only the energy level.
const RIPPLE_REST = 0.06;
const RIPPLE_FREQ = 0.45;
const RIPPLE_SPEED = 2.4;
const RIPPLE_SEG = GRID_STEP;

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

function ArchGrid() {
  const geomRef = useRef(null);
  const progress = useRef(-0.18);
  const clock = useRef(0);

  // Each grid line is subdivided into short segments so the ripple can bend it
  // along its length (a 2-point line could only tilt). Segments are sorted by
  // their distance from center so the draw-in materializes as an expanding disc,
  // riding the same outward wave as the ripple. `radii` holds each vertex's
  // distance from center, reused every frame to compute its Y displacement.
  const { positions, radii, vertexCount } = useMemo(() => {
    const n = Math.ceil(GRID_HALF / GRID_STEP);
    const segments = [];

    const addLine = (ax, az, bx, bz) => {
      const length = Math.hypot(bx - ax, bz - az);
      const steps = Math.max(1, Math.round(length / RIPPLE_SEG));
      for (let s = 0; s < steps; s++) {
        const t0 = s / steps;
        const t1 = (s + 1) / steps;
        const x1 = ax + (bx - ax) * t0;
        const z1 = az + (bz - az) * t0;
        const x2 = ax + (bx - ax) * t1;
        const z2 = az + (bz - az) * t1;
        const midDist = Math.hypot((x1 + x2) / 2, (z1 + z2) / 2);
        segments.push({ midDist, x1, z1, x2, z2 });
      }
    };

    for (let i = -n; i <= n; i++) addLine(i * GRID_STEP, -GRID_HALF, i * GRID_STEP, GRID_HALF);
    for (let i = -n; i <= n; i++) addLine(-GRID_HALF, i * GRID_STEP, GRID_HALF, i * GRID_STEP);

    segments.sort((a, b) => a.midDist - b.midDist);

    const pos = new Float32Array(segments.length * 6);
    const rad = new Float32Array(segments.length * 2);
    for (let k = 0; k < segments.length; k++) {
      const s = segments[k];
      pos[k * 6] = s.x1;
      pos[k * 6 + 2] = s.z1;
      pos[k * 6 + 3] = s.x2;
      pos[k * 6 + 5] = s.z2;
      rad[k * 2] = Math.hypot(s.x1, s.z1);
      rad[k * 2 + 1] = Math.hypot(s.x2, s.z2);
    }

    return { positions: pos, radii: rad, vertexCount: segments.length * 2 };
  }, []);

  useFrame((_, delta) => {
    const geom = geomRef.current;
    if (!geom) return;
    progress.current = Math.min(1, progress.current + delta * 0.44);
    if (progress.current <= 0) {
      geom.setDrawRange(0, 0);
      return;
    }

    clock.current += delta;
    const p = progress.current;
    const pulse = Math.sin(p * Math.PI); // bell: 0 → peak at mid-draw → 0
    const amp = RIPPLE_REST + (RIPPLE_MAX - RIPPLE_REST) * pulse;

    const array = geom.attributes.position.array;
    for (let v = 0; v < vertexCount; v++) {
      array[v * 3 + 1] = amp * Math.sin(radii[v] * RIPPLE_FREQ - clock.current * RIPPLE_SPEED);
    }
    geom.attributes.position.needsUpdate = true;

    const count = Math.floor(p * vertexCount);
    geom.setDrawRange(0, count & ~1);
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

function GridPlane({ phaseRef }) {
  const groupRef = useRef(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (phaseRef.current === "exit") {
      groupRef.current.rotation.x +=
        (Math.PI / 2 - groupRef.current.rotation.x) * Math.min(1, delta * 0.75);
    }
  });

  return (
    <group ref={groupRef}>
      <ArchGrid />
    </group>
  );
}

function CameraRig({ phaseRef }) {
  useFrame((state, delta) => {
    const phase = phaseRef.current;

    if (phase === "exit") {
      state.camera.position.y += (12 - state.camera.position.y) * Math.min(1, delta * 0.75);
      state.camera.position.z += (22 - state.camera.position.z) * Math.min(1, delta * 0.75);
    } else {
      state.camera.position.y += (9 - state.camera.position.y) * Math.min(1, delta * 0.3);
      state.camera.position.z += (10 - state.camera.position.z) * Math.min(1, delta * 0.3);
    }
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ phaseRef, isDark }) {
  return (
    <>
      <color attach="background" args={[isDark ? "#0D1117" : "#FFFFFF"]} />
      <ambientLight intensity={1.8} />
      <GridPlane phaseRef={phaseRef} />
      <CameraRig phaseRef={phaseRef} />
    </>
  );
}

export function EntryTransition({ onComplete, onExitBegin }) {
  const reduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [supported] = useState(hasWebGL);
  const [phase, setPhase] = useState("intro");
  const phaseRef = useRef("intro");
  const onExitBeginRef = useRef(onExitBegin);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onExitBeginRef.current = onExitBegin; });
  useEffect(() => { onCompleteRef.current = onComplete; });

  const t1Ref = useRef(null);

  const skip = reduceMotion || !supported;

  const beginExit = useCallback(() => {
    clearTimeout(t1Ref.current);
    phaseRef.current = "exit";
    setPhase("exit");
    onExitBeginRef.current?.();
  }, []);

  useEffect(() => {
    if (skip) {
      onExitBeginRef.current?.();
      onCompleteRef.current?.();
      return undefined;
    }
    t1Ref.current = setTimeout(beginExit, 1800);
    return () => { clearTimeout(t1Ref.current); };
  }, [skip, beginExit]);

  useEffect(() => {
    if (skip) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [skip]);

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
        duration: isExiting ? 1.4 : 0,
        delay: 0,
        ease: [0.65, 0, 0.35, 1],
      }}
      onAnimationComplete={() => {
        if (isExiting) onCompleteRef.current?.();
      }}
      role="presentation"
    >
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
            <Scene phaseRef={phaseRef} isDark={isDark} />
          </Suspense>
        </Canvas>
      </motion.div>

      {isExiting && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-8 rounded-[8px] border border-elegant-border md:inset-x-24 md:inset-y-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, ${
            isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.045)"
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
