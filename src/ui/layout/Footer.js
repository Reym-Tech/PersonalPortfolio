import { focusLink } from "../design-system/button-styles";
import { BORDER } from "../design-system/tokens";
import { contactMethods } from "../../domain/data/contact-methods";

const FOOTER_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Certifications", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const socials = contactMethods.filter((method) => !method.disabled);

  return (
    <footer className={`border-t ${BORDER}`}>
      <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-semibold">John Remy Gonzales</p>
            <p className="mt-2 text-sm leading-relaxed text-elegant-text/60">
              Full-stack web & mobile developer building clean, accessible, and
              refined digital experiences.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((method) => (
                <a
                  key={method.name}
                  href={method.href}
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noopener noreferrer" : undefined}
                  aria-label={method.name}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${BORDER} bg-elegant-surface transition-colors hover:bg-[#F9FAFB] ${focusLink}`}
                >
                  <img src={method.icon} alt="" aria-hidden="true" className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3"
          >
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm text-elegant-text/60 transition-colors hover:text-elegant-primary ${focusLink}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div
          className={`mt-12 flex flex-col items-center gap-4 border-t ${BORDER} pt-8 sm:flex-row sm:justify-between`}
        >
          <div className="text-center sm:text-left">
            <p className="text-sm text-elegant-text/60">
              © 2026 John Remy Gonzales • BSIT • UM Digos College
            </p>
            <p className="mt-1 text-sm text-elegant-text/40">
              Built with React, Tailwind & Framer Motion.
            </p>
          </div>
          <a
            href="#home"
            className={`inline-flex items-center gap-2 text-sm text-elegant-text/60 transition-colors hover:text-elegant-primary ${focusLink}`}
          >
            Back to top
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
