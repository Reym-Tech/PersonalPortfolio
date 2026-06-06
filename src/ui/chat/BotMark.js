import { motion, useReducedMotion } from "framer-motion";

// The "AI Assistant" face from CHATBOT_DESIGN.png (At Rest state): a friendly
// robot head drawn in white line-art on the dark FAB, with a purple 4-point
// sparkle twinkling at the upper-right. The sparkle is the design's mark of
// intelligence ("AI Sparkle — gentle twinkle loop"), so it carries the only
// idle motion; the face itself stays calm.
const SPARKLE = "#BB8CF6"; // lighter than the #8B5CF6 token so it reads on #111827

// 4-point sparkle (concave star) centered at (cx, cy): outer tips at N/E/S/W,
// inner valleys pulled close to center on the diagonals.
function sparklePath(cx, cy, r) {
  const i = r * 0.16; // valley radius
  const d = i * 0.707; // diagonal component of a valley point
  return [
    `M${cx} ${cy - r}`,
    `L${cx + d} ${cy - d}`,
    `L${cx + r} ${cy}`,
    `L${cx + d} ${cy + d}`,
    `L${cx} ${cy + r}`,
    `L${cx - d} ${cy + d}`,
    `L${cx - r} ${cy}`,
    `L${cx - d} ${cy - d}`,
    "Z",
  ].join(" ");
}

export function BotMark({ isThinking = false, hasNewMessage = false, size = 30 }) {
  const reduceMotion = useReducedMotion();

  // Twinkle cadence: a calm loop at rest, livelier while the assistant thinks.
  const twinkle = reduceMotion
    ? {}
    : isThinking
      ? { opacity: [0.55, 1, 0.55], scale: [0.9, 1.18, 0.9], rotate: [0, 12, 0] }
      : { opacity: [0.7, 1, 0.7], scale: [0.92, 1.08, 0.92] };
  const twinkleTransition = {
    duration: isThinking ? 1.1 : 3.2,
    repeat: Infinity,
    ease: "easeInOut",
  };

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {/* Antenna — short stalk + tip dot */}
      <path d="M15 9V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15" cy="5" r="1.15" fill="white" />

      {/* Side ear nubs */}
      <rect x="4.6" y="14" width="2" height="4" rx="1" stroke="white" strokeWidth="1.4" />
      <rect x="23.4" y="14" width="2" height="4" rx="1" stroke="white" strokeWidth="1.4" />

      {/* Head */}
      <rect x="7" y="9" width="16" height="14" rx="5" stroke="white" strokeWidth="1.6" />

      {/* Eyes */}
      <circle cx="11.8" cy="15" r="1.5" fill="white" />
      <circle cx="18.2" cy="15" r="1.5" fill="white" />

      {/* Smile */}
      <path d="M12.2 18.4Q15 20.4 17.8 18.4" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* AI sparkle — the intelligence mark, upper-right */}
      <motion.g
        style={{ transformOrigin: "25px 7.5px" }}
        animate={twinkle}
        transition={twinkleTransition}
      >
        <path d={sparklePath(25, 7.5, 4.4)} fill={SPARKLE} />
      </motion.g>

      {/* Notification spark — a tiny second sparkle that blinks for new messages */}
      {hasNewMessage && (
        <motion.path
          d={sparklePath(28.5, 12, 2)}
          fill={SPARKLE}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.4 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: [0, 1, 0.2, 1], scale: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          style={{ transformOrigin: "28.5px 12px" }}
        />
      )}
    </svg>
  );
}
