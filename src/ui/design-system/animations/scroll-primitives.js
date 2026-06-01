import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

// Returns the standard scroll-reveal variant factory, honoring reduced-motion.
export function useRise() {
  const reduceMotion = useReducedMotion();
  return (delay = 0) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5, delay, ease: "easeOut" },
  });
}

// Thin reading-progress bar pinned to the top of the viewport, driven by overall
// page scroll. Decorative, so it stays put under prefers-reduced-motion (the
// motion is user-driven, never autonomous).
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[31] h-0.5 origin-left bg-elegant-primary"
    />
  );
}

// Drifts its children against the scroll for a sense of depth. Use only inside an
// overflow-hidden parent so the drift is clipped and never shifts the layout.
export function Parallax({ offset = 28, className = "", children }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={reduceMotion ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}

// Scroll-linked image: the picture drifts within a fixed, clipped frame for a
// parallax depth cue. The image is scaled up so the drift never exposes a gap.
export function ParallaxImage({
  src,
  alt,
  offset = 16,
  frameClassName = "",
  imgClassName = "h-full w-full object-cover",
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={`overflow-hidden ${frameClassName}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={reduceMotion ? undefined : { y, scale: 1.25 }}
        className={imgClassName}
      />
    </div>
  );
}

function parseStat(value) {
  const match = String(value).match(/^(\d+)(.*)$/);
  if (!match) return { target: 0, suffix: String(value) };
  return { target: Number(match[1]), suffix: match[2] };
}

// Counts up to the stat value once it scrolls into view. Reduced motion renders
// the final figure immediately.
export function CountUp({ value, className = "" }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { target, suffix } = parseStat(value);
  const count = useMotionValue(0);
  const smooth = useSpring(count, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (inView) count.set(target);
  }, [inView, target, count]);

  useEffect(() => {
    if (reduceMotion) {
      if (ref.current) ref.current.textContent = `${target}${suffix}`;
      return undefined;
    }
    return smooth.on("change", (latest) => {
      if (ref.current) ref.current.textContent = `${Math.round(latest)}${suffix}`;
    });
  }, [smooth, reduceMotion, target, suffix]);

  return (
    <span ref={ref} className={className}>
      {reduceMotion ? `${target}${suffix}` : `0${suffix}`}
    </span>
  );
}
