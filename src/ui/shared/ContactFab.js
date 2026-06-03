import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { focusLink, focusRing } from "../design-system/button-styles";
import { Mail, Close } from "../design-system/icons";
import { BORDER } from "../design-system/tokens";
import { contactMethods } from "../../domain/data/contact-methods";

export function ContactFab() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const items = contactMethods.filter((method) => !method.disabled);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <AnimatePresence>
        {open &&
          items.map((method, index) => (
            <motion.a
              key={method.name}
              href={method.href}
              target={method.external ? "_blank" : undefined}
              rel={method.external ? "noopener noreferrer" : undefined}
              aria-label={`${method.name} — ${method.caption}`}
              onClick={() => setOpen(false)}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.85 }}
              transition={{ duration: 0.18, delay: reduceMotion ? 0 : index * 0.04, ease: "easeOut" }}
              className={`group flex items-center gap-3 ${focusLink}`}
            >
              <span className={`rounded-full border ${BORDER} bg-elegant-surface px-3 py-1.5 text-sm font-medium text-elegant-text shadow-sm`}>
                {method.name}
              </span>
              <span className={`inline-flex h-12 w-12 flex-none items-center justify-center rounded-full border ${BORDER} bg-elegant-surface shadow-md transition-colors group-hover:bg-elegant-hover`}>
                <img src={method.icon} alt="" aria-hidden="true" className="h-5 w-5" />
              </span>
            </motion.a>
          ))}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? "Close contact menu" : "Open contact menu"}
        whileTap={reduceMotion ? undefined : { scale: 0.92 }}
        className={`inline-flex h-14 w-14 items-center justify-center rounded-full bg-elegant-text text-elegant-surface shadow-lg transition-colors hover:bg-elegant-text/90 active:bg-elegant-text/80 ${focusRing}`}
      >
        <motion.span
          animate={reduceMotion ? undefined : { rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          aria-hidden="true"
        >
          {open ? <Close /> : <Mail />}
        </motion.span>
      </motion.button>
    </div>
  );
}
