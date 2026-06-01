import { BORDER } from "../design-system/tokens";

export function Footer() {
  return (
    <footer className={`border-t ${BORDER}`}>
      <div className="mx-auto flex w-full max-w-6xl justify-center items-center gap-6 px-6 py-12">
        <div className="text-center">
          <p className="text-sm text-elegant-text/60">
            © 2026 John Remy Gonzales • BSIT • University of Mindanao Digos College
          </p>
          <p className="mt-1 text-sm text-elegant-text/40">
            Built with React, Tailwind & Framer Motion.
          </p>
        </div>
      </div>
    </footer>
  );
}
