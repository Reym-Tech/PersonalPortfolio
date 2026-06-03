import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { primaryButton, focusLink } from "../design-system/button-styles";
import { BORDER } from "../design-system/tokens";
import { useDialog } from "../design-system/use-dialog";
import { ThemeToggle } from "../shared/ThemeToggle";
import { NAV_LINKS } from "../../domain/data/nav-links";
import { generateCv } from "../../application/use-cases/generate-cv";

export function NavBar() {
  const reduceMotion = useReducedMotion();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const closeSidebar = () => setSidebarOpen(false);
  useDialog(sidebarRef, sidebarOpen, closeSidebar);

  return (
    <>
      <nav
        aria-label="Primary"
        className={`sticky top-0 z-30 border-b ${BORDER} bg-elegant-surface/80 backdrop-blur`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
          <a href="#home" aria-label="John Remy Gonzales — home" className={`flex items-center gap-3 ${focusLink}`}>
            <img
              src={
                isDark
                  ? "/images/icons/AppIcon_DarkMode.png"
                  : "/images/icons/AppIcon_LightMode.png"
              }
              alt=""
              className="h-10 w-10 object-contain"
            />
          </a>

          <div className="flex items-center gap-4">
            <ul className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`text-sm text-elegant-text/70 transition-colors hover:text-elegant-primary ${focusLink}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <ThemeToggle />
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] border ${BORDER} text-elegant-text hover:bg-elegant-hover md:hidden ${focusLink}`}
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
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <motion.aside
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        tabIndex={-1}
        inert={!sidebarOpen}
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", damping: 28, stiffness: 280 }}
        className={`fixed left-0 top-0 z-50 h-full w-64 border-r ${BORDER} bg-elegant-surface p-6 focus:outline-none md:hidden`}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="font-mono text-sm uppercase tracking-widest text-elegant-text/50">Menu</span>
          <button
            onClick={closeSidebar}
            aria-label="Close menu"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-[8px] border ${BORDER} hover:bg-elegant-hover ${focusLink}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={closeSidebar}
                className={`block rounded-[8px] px-4 py-3 text-base text-elegant-text/80 transition-colors hover:bg-elegant-hover hover:text-elegant-primary ${focusLink}`}
              >
                {item.label}
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
