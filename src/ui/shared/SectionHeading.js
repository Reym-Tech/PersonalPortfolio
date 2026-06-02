import { Parallax } from "../design-system/animations/scroll-primitives";
import { Eyebrow } from "./Eyebrow";

export function SectionHeading({ eyebrow, title, description, center = false, display = false, index }) {
  // Anchor sections (About, Projects, Contact) use the larger display scale; the
  // contrast against the restrained default scale is what gives the page its rhythm.
  const titleClass = display
    ? "mt-3 text-[2.5rem] font-semibold leading-[1.05] tracking-tight md:text-[3.5rem]"
    : "mt-3 text-[2rem] font-medium leading-tight tracking-tight md:text-[2.5rem]";

  return (
    <Parallax offset={18} className={center ? "text-center" : ""}>
      {/* Oversized section index as an editorial wayfinding mark — watermark-faint
          so the dramatic scale reads as texture, not a competing focal point. */}
      {index && (
        <span
          aria-hidden="true"
          className="block font-mono text-[3.5rem] font-semibold leading-none text-elegant-text/10 md:text-[5rem]"
        >
          {index}
        </span>
      )}
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className={titleClass}>{title}</h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed text-elegant-text/70 ${
            center ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </Parallax>
  );
}
