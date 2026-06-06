import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { focusRing, focusLink } from "../design-system/button-styles";
import { BORDER } from "../design-system/tokens";
import { Close, ArrowRight, Sparkles } from "../design-system/icons";
import { contactMethods } from "../../domain/data/contact-methods";
import { BotMark } from "./BotMark";

// Dark robot avatar reused in the header and beside every assistant message, so
// the panel wears the same AI Assistant face as the FAB.
function BotAvatar({ size, mark, isThinking = false }) {
  return (
    <span
      className="inline-flex flex-none items-center justify-center rounded-full bg-[#111827]"
      style={{ width: size, height: size }}
    >
      <BotMark size={mark} isThinking={isThinking} />
    </span>
  );
}

const INITIAL_MESSAGE = {
  id: "init",
  role: "assistant",
  content: "Hi! I'm John Remy's AI assistant. Ask me anything about his background, projects, or how to get in touch.",
};

const CHIPS = ["What's your stack?", "Available for hire?", "Tell me about your projects"];
const COOLDOWN_SECONDS = 3;
const TAB_TRANSITION = { duration: 0.2, ease: [0.22, 1, 0.36, 1] };
// The panel scales about the FAB's center, not its own corner, so it visibly
// grows out of the launcher on open and is swallowed back into it on close. The
// FAB center sits 28px left of and 44px below the panel's bottom-right corner
// (FAB: 56px box at bottom/right 32 → center 60px from each edge; panel right
// edge 32px from right, bottom edge 104px from bottom). Keep this in sync with
// the FAB geometry in CrescereFAB.js and the bottom-[104px] offset below.
const PANEL_ORIGIN = "calc(100% - 28px) calc(100% + 44px)";
// A soft directional wipe is layered on top of the scale so the panel doesn't
// just shrink uniformly — it is extruded/consumed one end at a time, like being
// pulled through the FAB. The mask is a feathered diagonal gradient; --reveal is
// how far along that diagonal the solid (visible) region reaches, and --ang sets
// which corner sits at the gradient's 0% (where the solid grows from / retracts
// to). To follow the tether, the FAB corner LEADS both phases: on open the panel
// unfurls out of the FAB corner first; on close the FAB corner empties first and
// the far corner trails. Open and close use different angles on purpose — a single
// shared axis would force them to be mirror opposites (FAB-first one way ⇒
// FAB-last the other), so decoupling --ang lets the FAB corner lead both ways.
// The 20% feather is the soft "wrap" edge that keeps the sweep from reading hard.
const REVEAL_HIDDEN = "-22%";
const REVEAL_SHOWN = "116%";
// 315deg puts 0% at the bottom-right FAB corner, so the solid region grows out of
// it on open (FAB-corner-first emerge). 135deg puts 0% at the top-left far corner
// — the FAB corner then sits at 100% and is the first to drop into the transparent
// feather as --reveal retracts on close (FAB-corner-first absorb).
const MASK_ANGLE_OPEN = "315deg";
const MASK_ANGLE_CLOSE = "135deg";
const PANEL_MASK =
  "linear-gradient(var(--ang, 135deg), #000 0%, #000 var(--reveal, 116%), transparent calc(var(--reveal, 116%) + 20%))";
// The base duration/ease govern --reveal (the wipe): a smooth, near-even
// ease-in-out played over a long-enough beat that the eye actually follows the
// edge travelling across the panel, which is what makes it read as a real object
// being unfurled/drawn in rather than a snap. Scale is overridden per-direction:
// open uses a mild overshoot so the panel surges out of the FAB with momentum and
// settles; close uses an ease-in so it slowly lets go then accelerates as it is
// sucked into the FAB. Both start/end near the FAB point (see the low scale on
// the panel itself), so the convergence reads as coming from / returning to it.
const PANEL_OPEN = { duration: 0.38, ease: [0.45, 0, 0.55, 1], scale: { duration: 0.4, ease: [0.22, 1.12, 0.36, 1] }, opacity: { duration: 0.2, ease: "easeOut" } };
// --ang snaps (duration 0) at the start of close: the axis flips while --reveal is
// still 116% (panel fully solid under either angle), so there's no visible rotation
// — only the retract direction changes.
const PANEL_CLOSE = { duration: 0.3, ease: [0.45, 0, 0.55, 1], scale: { duration: 0.3, ease: [0.5, 0, 0.85, 0.4] }, "--ang": { duration: 0 } };

// Liquid bridge ("genie neck") — an SVG metaball that visually merges the FAB and
// the rising panel, matching the reference design: a soft, pale-lavender gooey body,
// NOT a hard saturated column. Two circles share the FAB's horizontal centre; a gooey
// filter (blur + alpha-contrast) melds them into one shape with a concave neck. The
// lower circle is rooted at the FAB and sits behind the opaque z-50 launcher, so only
// the neck and the rising blob read above the FAB lip. The upper "blob" travels up to
// the panel base on open and back down into the FAB on close, so the connection is
// maintained through the whole flight and only dissolves once the panel has settled.
// The brand hue is already elegant.secondary (#8B5CF6); the reference's difference is
// tone (lifted toward white), softness (the goo), and shape (a necking metaball).
const BRIDGE_FILL = "#C4B1F2"; // pale lavender — elegant.secondary lifted toward white
const BRIDGE_CORE = "#9B7BEA"; // a touch deeper at the FAB-rooted base, softened by the goo blur
// Upper-blob travel in SVG-local coords (y=0 at the panel base, +y downward toward the
// FAB). It starts close to the base circle (short, fat neck = "spit out") and rises to
// just under the panel (long, thin neck = "stretch"), fattening slightly as it forms.
const BRIDGE_BLOB_FROM = { cy: 34, r: 11 };
const BRIDGE_BLOB_TO = { cy: 9, r: 14 };
// Opacity is present through the whole emerge/absorb and fades only at the very ends, so
// the bridge never vanishes before the panel arrives (the old desync, where it had fully
// faded ~50ms before the panel finished). Keyframes resolve to 0 because at rest the
// bridge is gone and the panel stands alone.
const BRIDGE_OPEN = { duration: 0.42, ease: "easeOut", opacity: { duration: 0.42, times: [0, 0.22, 0.72, 1], ease: "easeInOut" } };
const BRIDGE_CLOSE = { duration: 0.32, ease: "easeIn", opacity: { duration: 0.32, times: [0, 0.3, 1], ease: "easeInOut" } };

// Panel content settles in sequentially once the shell has emerged (brief step 6 /
// reference "Content Fade In"): header → tabs → conversation → input. Driven by a
// `custom` order index so each region self-delays — no parent stagger container, which
// keeps the tuned flex/scroll layout untouched. initial={false} on each region means a
// tab switch never replays the reveal; only the initial open does, via the contentIn flip.
const CONTENT_REVEAL = {
  hidden: { opacity: 0, y: 6 },
  shown: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.32, ease: [0.22, 1, 0.36, 1] } }),
};
const CONTENT_REVEAL_DELAY_MS = 150;

export function ChatWidget({
  isOpen,
  onClose,
  onClosed,
  initialTab = "chat",
  onThinkingChange,
  onNewMessage,
}) {
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [contentIn, setContentIn] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevMsgCountRef = useRef(messages.length);
  const panelRef = useRef(null);

  // Sync active tab when the panel opens
  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  // Stagger the panel's content in just after the shell has emerged. The short delay
  // lets the bridge/scale read first, so content flows in "as it settles" rather than
  // being present from frame one. Reduced motion shows everything at once.
  useEffect(() => {
    if (reduceMotion) {
      setContentIn(isOpen);
      return undefined;
    }
    if (!isOpen) {
      setContentIn(false);
      return undefined;
    }
    const timer = setTimeout(() => setContentIn(true), CONTENT_REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isOpen, reduceMotion]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" });
    }
  }, [messages, loading, reduceMotion]);

  useEffect(() => {
    if (isOpen && activeTab === "chat") {
      // Outlast the tab crossfade: when switching to chat, the old tab exits
      // (TAB_TRANSITION ≈ 200ms) before the chat input remounts, so a shorter
      // delay would focus a not-yet-mounted ref.
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, activeTab]);

  // Dismiss on Escape or a tap/click outside the widget. "Outside" means the
  // page behind it — but the FAB (the chat's own launcher) and the theme toggle
  // are exempt, so flipping light/dark mode mid-conversation doesn't dismiss the
  // panel.
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const handlePointerDown = (e) => {
      if (
        panelRef.current?.contains(e.target) ||
        e.target.closest("[data-chat-fab]") ||
        e.target.closest("[data-theme-toggle]")
      ) {
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Notify parent when AI is processing
  useEffect(() => {
    onThinkingChange?.(loading);
  }, [loading, onThinkingChange]);

  // Notify parent when a new AI message arrives
  useEffect(() => {
    const prev = prevMsgCountRef.current;
    prevMsgCountRef.current = messages.length;
    if (messages.length > prev) {
      const latest = messages[messages.length - 1];
      if (latest.role === "assistant" && latest.id !== "init") {
        onNewMessage?.();
      }
    }
  }, [messages, onNewMessage]);

  const handleSend = useCallback(
    async (text) => {
      const trimmed = (text !== undefined ? text : input).trim();
      if (!trimmed || loading || cooldown > 0) return;

      const userMsg = { id: Date.now(), role: "user", content: trimmed };
      const next = [...messages, userMsg];
      setMessages(next);
      setInput("");
      setLoading(true);
      setError(null);
      setCooldown(COOLDOWN_SECONDS);

      try {
        const apiMessages = next
          .filter((m) => m.id !== "init")
          .map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong.");

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: "assistant", content: data.reply },
        ]);
      } catch (err) {
        console.error("Chat error:", err);
        setError(err.message || "Couldn't get a response. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [input, loading, cooldown, messages]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showChips = messages.length === 1 && !loading;
  const sendDisabled = !input.trim() || loading || cooldown > 0;

  // Motion props for a content region's staggered reveal; `order` sets its place in the
  // sequence. No-op under reduced motion so the region just renders statically.
  const revealProps = (order) =>
    reduceMotion
      ? {}
      : { custom: order, variants: CONTENT_REVEAL, initial: false, animate: contentIn ? "shown" : "hidden" };

  // Float the panel above the FAB so the launcher stays visible and never covers
  // the input. bottom-[104px] = FAB bottom (32) + FAB height (56) + 16 gap; the
  // FAB lives in CrescereFAB.js, so this offset encodes its geometry. right-8
  // (32px) aligns the panel's right edge to the FAB on every breakpoint.
  return (
    <div className="fixed bottom-[104px] right-8 z-40 flex flex-col items-end">
      <AnimatePresence onExitComplete={() => onClosed?.()}>
        {isOpen && !reduceMotion && (
          <motion.svg
            key="bridge"
            aria-hidden="true"
            width={120}
            height={120}
            viewBox="0 0 120 120"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: [0, 1, 0], transition: BRIDGE_CLOSE }}
            transition={BRIDGE_OPEN}
            style={{
              // The 120px box is centred on the FAB (28px inset from the container's
              // right edge − 60px half-width = −32) and its top sits at the panel base
              // (top:100%), so SVG-local y grows downward into the FAB.
              position: "absolute",
              top: "100%",
              right: -32,
              marginTop: -6,
              // Behind the panel within this z-40 container, so the blob's top tucks under
              // the panel surface (hiding the handoff seam) while the neck below shows. The
              // FAB (separate z-50) still sits on top. Explicit so it doesn't hinge on the
              // panel's backdrop-blur happening to form a stacking context.
              zIndex: -1,
              pointerEvents: "none",
              overflow: "visible",
              filter: "drop-shadow(0 0 6px rgba(155,123,234,0.45))",
            }}
          >
            <defs>
              <filter id="bridge-goo" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
                <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" />
              </filter>
            </defs>
            <g filter="url(#bridge-goo)">
              {/* Base circle — rooted at the FAB centre, occluded by the opaque z-50
                  launcher; supplies the bottom of the liquid body so the neck reads as
                  pouring out of the FAB's top lip. */}
              <circle cx={60} cy={44} r={20} fill={BRIDGE_CORE} />
              {/* Rising blob — travels up to the panel base, stretching the neck. */}
              <motion.circle
                cx={60}
                fill={BRIDGE_FILL}
                initial={{ cy: BRIDGE_BLOB_FROM.cy, r: BRIDGE_BLOB_FROM.r }}
                animate={{ cy: BRIDGE_BLOB_TO.cy, r: BRIDGE_BLOB_TO.r }}
                exit={{ cy: BRIDGE_BLOB_FROM.cy, r: BRIDGE_BLOB_FROM.r, transition: BRIDGE_CLOSE }}
                transition={BRIDGE_OPEN}
              />
            </g>
          </motion.svg>
        )}
        {isOpen && (
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Chat with Crescere"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.2, "--reveal": REVEAL_HIDDEN, "--ang": MASK_ANGLE_OPEN }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, "--reveal": REVEAL_SHOWN, "--ang": MASK_ANGLE_OPEN }
            }
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : { opacity: 1, scale: 0.18, "--reveal": REVEAL_HIDDEN, "--ang": MASK_ANGLE_CLOSE, transition: PANEL_CLOSE }
            }
            transition={reduceMotion ? { duration: 0.15 } : PANEL_OPEN}
            style={{
              transformOrigin: PANEL_ORIGIN,
              WebkitMaskImage: PANEL_MASK,
              maskImage: PANEL_MASK,
            }}
            className={`flex max-h-[calc(100dvh_-_8rem)] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border ${BORDER} bg-elegant-surface/95 shadow-xl backdrop-blur-sm`}
          >
            {/* Header — assistant identity + tab switcher */}
            <div className={`flex flex-none flex-col gap-3 border-b ${BORDER} px-4 pb-3 pt-3.5`}>
              <motion.div className="flex items-center justify-between" {...revealProps(0)}>
                <div className="flex items-center gap-2.5">
                  <BotAvatar size={38} mark={26} isThinking={loading} />
                  <div className="leading-tight">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-elegant-text">Crescere</p>
                      <Sparkles className="h-3.5 w-3.5 text-elegant-secondary" />
                    </div>
                    <p className="flex items-center gap-1.5 text-[11px] text-elegant-text/50">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-elegant-success" />
                      Online · Ask me anything
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-elegant-text/60 transition-colors hover:bg-elegant-hover hover:text-elegant-text ${focusLink}`}
                >
                  <Close />
                </button>
              </motion.div>

              <motion.div className={`flex items-center gap-0.5 rounded-[8px] border ${BORDER} bg-elegant-hover p-1`} {...revealProps(1)}>
                {[
                  { id: "chat", label: "Chat with AI" },
                  { id: "contact", label: "Contact" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 rounded-[6px] px-3 py-1 text-xs font-medium transition-colors ${activeTab === id
                      ? "bg-elegant-surface text-elegant-text shadow-sm"
                      : "text-elegant-text/50 hover:text-elegant-text/80"
                      } ${focusRing}`}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Tab panels. mode="wait" keeps a single panel in the flex column at a
                time (they differ in height), and each tab is anchored to its side
                of the switcher — Chat slides from the left, Contact from the right —
                so the swap reads as spatial rather than a plain fade. */}
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
                  transition={TAB_TRANSITION}
                  className="flex min-h-0 flex-col"
                >
                <motion.div className="chat-scroll flex min-h-0 flex-[1_1_300px] flex-col gap-3 overflow-y-auto p-4" {...revealProps(2)}>
                  {messages.map((msg) => {
                    const isUser = msg.role === "user";
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        {!isUser && <BotAvatar size={28} mark={19} />}
                        <p
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isUser
                            ? "rounded-br-sm bg-elegant-text text-elegant-surface"
                            : `rounded-bl-sm border ${BORDER} bg-elegant-hover text-elegant-text`
                            }`}
                        >
                          {msg.content}
                        </p>
                      </div>
                    );
                  })}

                  {showChips && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleSend(chip)}
                          className={`rounded-full border ${BORDER} bg-elegant-hover px-3 py-1 text-xs text-elegant-text/70 transition-colors hover:bg-elegant-active hover:text-elegant-text ${focusRing}`}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  {loading && (
                    <div className="flex items-end justify-start gap-2">
                      <BotAvatar size={28} mark={19} isThinking />
                      <div className={`flex items-center gap-1.5 rounded-2xl rounded-bl-sm border ${BORDER} bg-elegant-hover px-4 py-3`}>
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-elegant-text/40"
                            animate={reduceMotion ? {} : { opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-center text-xs text-red-500/80">{error}</p>
                  )}

                  <div ref={messagesEndRef} />
                </motion.div>

                {/* Input */}
                <motion.div className={`flex flex-none flex-col gap-2 border-t ${BORDER} p-3`} {...revealProps(3)}>
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything about John Remy..."
                      rows={1}
                      maxLength={500}
                      aria-label="Message"
                      className={`flex-1 resize-none rounded-[8px] border ${BORDER} bg-elegant-hover px-3 py-2 text-sm text-elegant-text placeholder:text-elegant-text/40 focus:outline-none focus:ring-2 focus:ring-elegant-primary focus:ring-offset-0`}
                      style={{ minHeight: "38px", maxHeight: "96px" }}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSend()}
                      disabled={sendDisabled}
                      aria-label="Send message"
                      className={`inline-flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[8px] bg-elegant-text text-elegant-surface transition-opacity disabled:opacity-40 ${focusRing}`}
                    >
                      <ArrowRight />
                    </button>
                  </div>
                  {cooldown > 0 && (
                    <p className="text-center text-[10px] text-elegant-text/40">
                      Please wait {cooldown}s…
                    </p>
                  )}
                </motion.div>
                </motion.div>
              )}

              {activeTab === "contact" && (
                <motion.div
                  key="contact"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
                  transition={TAB_TRANSITION}
                  className="chat-scroll flex min-h-0 flex-col gap-2 overflow-y-auto p-4">
                <p className="mb-1 text-xs text-elegant-text/50">Reach out directly</p>
                {contactMethods
                  .filter((m) => !m.disabled)
                  .map((method) => (
                    <a
                      key={method.name}
                      href={method.href}
                      target={method.external ? "_blank" : undefined}
                      rel={method.external ? "noopener noreferrer" : undefined}
                      className={`flex items-center gap-3 rounded-[8px] border ${BORDER} bg-elegant-hover px-3 py-3 transition-colors hover:bg-elegant-active ${focusLink}`}
                    >
                      <span className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-[8px] border ${BORDER} bg-elegant-surface`}>
                        <img src={method.icon} alt="" aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-elegant-text">{method.name}</p>
                        <p className="truncate text-xs text-elegant-text/50">{method.handle}</p>
                      </div>
                      <ArrowRight className="flex-none text-elegant-text/30" />
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
