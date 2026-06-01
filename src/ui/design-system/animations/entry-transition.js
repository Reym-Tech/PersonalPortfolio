import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";

const GRID_HALF = 20;
const GRID_STEP = 1.6;
const GRID_COLOR = 0x9ca3af;

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

function Scene({ phaseRef }) {
  return (
    <>
      <color attach="background" args={["#FFFFFF"]} />
      <ambientLight intensity={1.8} />
      <GridPlane phaseRef={phaseRef} />
      <CameraRig phaseRef={phaseRef} />
    </>
  );
}

export function EntryTransition({ onComplete, onExitBegin }) {
  const reduceMotion = useReducedMotion();
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
            <Scene phaseRef={phaseRef} />
          </Suspense>
        </Canvas>
      </motion.div>

      {isExiting && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-8 rounded-[8px] border border-[#E5E7EB] md:inset-x-24 md:inset-y-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.045) 100%)",
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
