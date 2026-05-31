import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";

const NAME_WORDS = ["John", "Remy", "C.", "Gonzales"];

// Elegant design tokens. Three.js needs raw hex, so they're mirrored here from
// tailwind.config.js (elegant.text / primary / secondary / surface).
const SCENE = {
  bg: "#111827",
  primary: "#3B82F6",
  secondary: "#8B5CF6",
  surface: "#FFFFFF",
};

const STAR_COUNT = 1800;
const STAR_FIELD_DEPTH = 120;
const STAR_SPREAD = 60;

// WebGL is required for the 3D sequence. jsdom and the rare unsupported browser
// fall through to a clean, immediate hand-off to the Hero instead of a black box.
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

// A field of points streaming past the camera. On exit the stream accelerates
// into a warp to sell the push through the lens.
function Starfield({ exiting }) {
  const pointsRef = useRef(null);
  const speed = useRef(8);

  const positions = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * STAR_SPREAD;
      arr[i * 3 + 1] = (Math.random() - 0.5) * STAR_SPREAD;
      arr[i * 3 + 2] = -Math.random() * STAR_FIELD_DEPTH;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const target = exiting.current ? 90 : 8;
    speed.current += (target - speed.current) * Math.min(1, delta * 2);

    const attribute = pointsRef.current.geometry.attributes.position;
    const array = attribute.array;
    for (let i = 0; i < STAR_COUNT; i += 1) {
      const zIndex = i * 3 + 2;
      array[zIndex] += speed.current * delta;
      if (array[zIndex] > 12) {
        array[zIndex] = -STAR_FIELD_DEPTH;
        array[i * 3] = (Math.random() - 0.5) * STAR_SPREAD;
        array[i * 3 + 1] = (Math.random() - 0.5) * STAR_SPREAD;
      }
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={SCENE.surface}
        size={0.14}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

// Wireframe solids drifting in the brand palette to give the void some structure.
function FloatingShapes() {
  return (
    <>
      <Float speed={1.4} rotationIntensity={1.2} floatIntensity={1.6}>
        <mesh position={[-3.4, 1.4, -4]}>
          <icosahedronGeometry args={[1.1, 0]} />
          <meshStandardMaterial color={SCENE.primary} wireframe />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={1} floatIntensity={1.3}>
        <mesh position={[3.6, -1.3, -6]}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color={SCENE.secondary} wireframe />
        </mesh>
      </Float>
      <Float speed={1.9} rotationIntensity={1.5} floatIntensity={1.9}>
        <mesh position={[2.4, 2.4, -3]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color={SCENE.surface} wireframe />
        </mesh>
      </Float>
    </>
  );
}

// Eases the camera from its resting dolly to a push straight through the field
// on exit, the WebGL half of the seamless hand-off into the Hero.
function CameraRig({ exiting }) {
  useFrame((state, delta) => {
    const targetZ = exiting.current ? -10 : 8;
    state.camera.position.z +=
      (targetZ - state.camera.position.z) * Math.min(1, delta * 1.6);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ exiting }) {
  return (
    <>
      <color attach="background" args={[SCENE.bg]} />
      <fog attach="fog" args={[SCENE.bg, 9, 32]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[6, 5, 6]} intensity={60} color={SCENE.primary} />
      <pointLight position={[-6, -3, 3]} intensity={45} color={SCENE.secondary} />
      <Starfield exiting={exiting} />
      <FloatingShapes />
      <CameraRig exiting={exiting} />
    </>
  );
}

// Cinematic, single-shot entry: a 3D field assembles behind the name, then the
// camera pushes through and the whole scene dissolves to hand off to the Hero.
// Honors prefers-reduced-motion (and absent WebGL) by skipping to completion.
export function EntryTransition({ onComplete }) {
  const reduceMotion = useReducedMotion();
  const [supported] = useState(hasWebGL);
  const [phase, setPhase] = useState("intro"); // "intro" | "exit"
  const exiting = useRef(false);

  const skip = reduceMotion || !supported;

  const beginExit = useCallback(() => {
    exiting.current = true;
    setPhase("exit");
  }, []);

  useEffect(() => {
    if (skip) {
      onComplete();
      return undefined;
    }
    const timer = setTimeout(beginExit, 2600);
    return () => clearTimeout(timer);
  }, [skip, onComplete, beginExit]);

  // Lock scroll while the overlay owns the screen.
  useEffect(() => {
    if (skip) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [skip]);

  // Let the visitor bail out via keyboard at any point.
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
      className="fixed inset-0 z-[60] overflow-hidden bg-elegant-text"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: isExiting ? 1 : 0, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={() => {
        if (isExiting) onComplete();
      }}
      role="presentation"
    >
      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene exiting={exiting} />
        </Suspense>
      </Canvas>

      <motion.div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        animate={isExiting ? { scale: 1.4, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: isExiting ? 1 : 0.6, ease: [0.65, 0, 0.35, 1] }}
        aria-hidden="true"
      >
        <motion.p
          className="font-mono text-sm uppercase tracking-[0.4em] text-elegant-surface/50"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          Portfolio
        </motion.p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 text-4xl font-medium tracking-tight text-elegant-surface md:text-6xl">
          {NAME_WORDS.map((word, index) => (
            <motion.span
              key={word}
              className="inline-block"
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.35 + index * 0.13,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.span
          className="mt-8 block h-px bg-elegant-primary"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "8rem", opacity: 1 }}
          transition={{ duration: 0.7, delay: 1, ease: "easeOut" }}
        />
      </motion.div>

      <button
        type="button"
        onClick={beginExit}
        className="absolute bottom-8 right-8 font-mono text-sm uppercase tracking-widest text-elegant-surface/50 transition-colors hover:text-elegant-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-elegant-surface/40 focus-visible:ring-offset-2 focus-visible:ring-offset-elegant-text"
      >
        Skip
      </button>
    </motion.div>
  );
}
