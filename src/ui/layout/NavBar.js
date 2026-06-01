import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { primaryButton, focusLink } from "../design-system/button-styles";
import { BORDER } from "../design-system/tokens";
import { NAV_LINKS } from "../../domain/data/nav-links";
import { generateCv } from "../../application/use-cases/generate-cv";

export function NavBar() {
  const reduceMotion = useReducedMotion();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Primary"
        className={`sticky top-0 z-30 border-b ${BORDER} bg-elegant-surface/80 backdrop-blur`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
          <a href="#home" className={`flex items-center gap-3 ${focusLink}`}>
            <img
              src="/images/AppIcon.png"
              alt="REM Logo"
              className="h-10 w-10 object-contain"
            />
          </a>

          <div className="flex items-center gap-6">
            <ul className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className={`text-sm text-elegant-text/70 transition-colors hover:text-elegant-text ${focusLink}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] border ${BORDER} text-elegant-text hover:bg-[#F9FAFB] md:hidden ${focusLink}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-elegant-text/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", damping: 24, stiffness: 280 }}
        className={`fixed left-0 top-0 z-50 h-full w-64 border-r ${BORDER} bg-elegant-surface p-6 md:hidden`}
        aria-label="Mobile menu"
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="font-mono text-sm uppercase tracking-widest text-elegant-text/50">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-[8px] border ${BORDER} hover:bg-[#F9FAFB] ${focusLink}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                onClick={() => setSidebarOpen(false)}
                className={`block rounded-[8px] px-4 py-3 text-base text-elegant-text/80 transition-colors hover:bg-[#F9FAFB] hover:text-elegant-text ${focusLink}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            setSidebarOpen(false);
            generateCv();
          }}
          className={`${primaryButton} mt-6 w-full`}
        >
          Download Resume
        </button>
      </motion.aside>
    </>
  );
}
