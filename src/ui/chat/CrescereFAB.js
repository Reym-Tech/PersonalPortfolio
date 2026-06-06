import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { focusRing } from "../design-system/button-styles";
import { Close } from "../design-system/icons";
import { BotMark } from "./BotMark";

const IDLE_DELAY = 10_000;
const EASE_OUT = [0.16, 1, 0.3, 1]; // 250ms ease-out per the guide's Tech Notes
const MORPH_MS = 0.25;

// The FAB is the chat launcher: one tap opens Remy's AI panel (which carries both
// Chat and Contact as its own tabs), one tap closes it. The robot face morphs to
// an X while the panel is open so the button mirrors the panel's state. No radial
// menu — the panel already exposes both destinations, so a pre-menu would just
// repeat that choice a tap earlier.
export function CrescereFAB({
  isOpen,
  onOpen,
  onClose,
  isAiThinking = false,
  hasNewMessage = false,
}) {
  const reduceMotion = useReducedMotion();
  const [isIdle, setIsIdle] = useState(false);
  const [fabHovered, setFabHovered] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const idleTimerRef = useRef(null);

  const resetIdle = useCallback(() => {
    setIsIdle(false);
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setIsIdle(true), IDLE_DELAY);
  }, []);

  useEffect(() => {
    resetIdle();
    return () => clearTimeout(idleTimerRef.current);
  }, [resetIdle]);

  const idleOrOpen = reduceMotion || isOpen || isIdle;

  return (
    <div data-chat-fab className="fixed z-50" style={{ bottom: 32, right: 32, width: 56, height: 56 }}>
      {/* Press feedback — a glow burst that fires from the core on each tap */}
      {!reduceMotion && burstKey > 0 && (
        <motion.span
          key={burstKey}
          className="pointer-events-none absolute rounded-full"
          style={{
            inset: "-10px",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(59,130,246,0.4) 45%, transparent 72%)",
          }}
          initial={{ opacity: 0.75, scale: 0.55 }}
          animate={{ opacity: 0, scale: 1.7 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      )}

      {/* Ambient glow — radiates outward; gated on at-rest state */}
      {!isOpen && !reduceMotion && !isIdle && (
        <motion.span
          className="pointer-events-none absolute rounded-full"
          style={{
            inset: "-14px",
            background:
              "radial-gradient(circle, rgba(187,140,246,0.45) 0%, rgba(187,140,246,0.2) 45%, transparent 70%)",
          }}
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <motion.button
        type="button"
        onClick={() => {
          resetIdle();
          setBurstKey((k) => k + 1);
          if (isOpen) onClose();
          else onOpen();
        }}
        onHoverStart={() => setFabHovered(true)}
        onHoverEnd={() => setFabHovered(false)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? "Close chat" : "Open AI chat"}
        animate={idleOrOpen ? {} : { scale: [1, 1.03, 1], rotate: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={reduceMotion ? undefined : { scale: 1.08 }}
        whileTap={reduceMotion ? undefined : { scale: 0.95 }}
        className={`relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#111827] text-white shadow-xl transition-shadow hover:shadow-2xl ${focusRing}`}
      >
        {/* Robot face (closed) and Close X (open) crossfade in place. The X rotates
            45° on hover, per Micro Interactions: "Close — Rotate 45° on hover". */}
        <span className="relative inline-flex h-[30px] w-[30px] items-center justify-center">
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.7 : 1 }}
            transition={{ duration: MORPH_MS, ease: EASE_OUT }}
            aria-hidden="true"
          >
            <BotMark isThinking={isAiThinking} hasNewMessage={hasNewMessage && !isOpen} />
          </motion.span>
          <motion.span
            className="absolute inset-0 flex items-center justify-center text-white"
            animate={{
              opacity: isOpen ? 1 : 0,
              scale: isOpen ? 1 : 0.7,
              rotate: isOpen && fabHovered && !reduceMotion ? 45 : 0,
            }}
            transition={{ duration: MORPH_MS, ease: EASE_OUT }}
            aria-hidden="true"
          >
            <Close />
          </motion.span>
        </span>
      </motion.button>
    </div>
  );
}
