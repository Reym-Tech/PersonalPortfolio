import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { focusRing, focusLink } from "../design-system/button-styles";
import { BORDER } from "../design-system/tokens";
import { Close, ArrowRight, Sparkles } from "../design-system/icons";
import { contactMethods } from "../../domain/data/contact-methods";
import { BotMark } from "./BotMark";

// Dark robot avatar reused in the header and beside every assistant message, so
// the panel wears the same AI Assistant face as the FAB.
// Mirrors the FAB's theme invert: dark circle + white robot in light mode, white circle
// + dark robot in dark mode (so it never blends into the dark-mode panel surface).
function BotAvatar({ size, mark, isThinking = false }) {
  return (
    <span
      className="inline-flex flex-none items-center justify-center rounded-full bg-[#111827] text-white dark:bg-white dark:text-[#111827]"
      style={{ width: size, height: size }}
    >
      <BotMark
        size={mark}
        isThinking={isThinking}
        sparkleClassName="fill-[#BB8CF6] dark:fill-[#8B5CF6]"
      />
    </span>
  );
}

const INITIAL_MESSAGE = {
  id: "init",
  role: "assistant",
  content: "Hi! I'm John Remy's AI assistant. Ask me anything about his background, projects, or how to get in touch.",
};

// When /api/chat fails (no key, upstream error, offline), the panel still answers
// in character and hands the visitor a real way to reach Remy instead of a dead end.
const FALLBACK_REPLY =
  "I'm having trouble reaching my brain right now — you can reach Remy directly at johnremygonzales20@gmail.com, or open the Contact tab above.";

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
// A clean scale + fade about the FAB origin: the panel grows out of the launcher
// on open and settles back into it on close — no directional wipe, no overshoot.
const PANEL_OPEN = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };
const PANEL_CLOSE = { duration: 0.2, ease: [0.4, 0, 1, 1] };

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
  // lets the scale/fade read first, so content flows in "as it settles" rather than
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
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: "assistant", content: FALLBACK_REPLY },
        ]);
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
        {isOpen && (
          <motion.div
            key="scrim"
            // Backdrop scrim: dims + lightly blurs the page so the open panel reads as
            // the focused surface (the mobile-menu pattern) and gains a visible
            // tap-to-dismiss target. Stronger on mobile, where the panel nearly fills
            // the screen; lighter on desktop (sm+), where it's a small corner element and
            // a heavy blackout would feel disproportionate. The FAB (z-50) sits above
            // this, so the launcher stays bright as the close control.
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] sm:bg-black/20"
          />
        )}
        {isOpen && (
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Chat with Crescere"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : { opacity: 0, scale: 0.5, transition: PANEL_CLOSE }
            }
            transition={reduceMotion ? { duration: 0.15 } : PANEL_OPEN}
            style={{ transformOrigin: PANEL_ORIGIN }}
            className={`flex max-h-[calc(100dvh_-_8rem)] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-none border ${BORDER} bg-elegant-surface/95 shadow-xl backdrop-blur-sm`}
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
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-none text-elegant-text/60 transition-colors hover:bg-elegant-hover hover:text-elegant-text ${focusLink}`}
                >
                  <Close />
                </button>
              </motion.div>

              <motion.div className={`flex items-center gap-0.5 rounded-none border ${BORDER} bg-elegant-hover p-1`} {...revealProps(1)}>
                {[
                  { id: "chat", label: "Chat with AI" },
                  { id: "contact", label: "Contact" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 rounded-none px-3 py-1 text-xs font-medium transition-colors ${activeTab === id
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
                          className={`max-w-[80%] rounded-none px-4 py-2.5 text-sm leading-relaxed ${isUser
                            ? "bg-elegant-text text-elegant-surface"
                            : `border ${BORDER} bg-elegant-hover text-elegant-text`
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
                          className={`rounded-none border ${BORDER} bg-elegant-hover px-3 py-1 text-xs text-elegant-text/70 transition-colors hover:bg-elegant-active hover:text-elegant-text ${focusRing}`}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  {loading && (
                    <div className="flex items-end justify-start gap-2">
                      <BotAvatar size={28} mark={19} isThinking />
                      <div className={`flex items-center gap-1.5 rounded-none border ${BORDER} bg-elegant-hover px-4 py-3`}>
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
                      className={`flex-1 resize-none rounded-none border ${BORDER} bg-elegant-hover px-3 py-2 text-sm text-elegant-text placeholder:text-elegant-text/40 focus:outline-none focus:ring-2 focus:ring-elegant-primary focus:ring-offset-0`}
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
                      className={`inline-flex h-[38px] w-[38px] flex-none items-center justify-center rounded-none bg-elegant-text text-elegant-surface transition-opacity disabled:opacity-40 ${focusRing}`}
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
                      className={`flex items-center gap-3 rounded-none border ${BORDER} bg-elegant-hover px-3 py-3 transition-colors hover:bg-elegant-active ${focusLink}`}
                    >
                      <span className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-none border ${BORDER} bg-elegant-surface`}>
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
