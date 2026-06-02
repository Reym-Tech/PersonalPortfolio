import { Parallax } from "../design-system/animations/scroll-primitives";
import { Eyebrow } from "./Eyebrow";

export function SectionHeading({ eyebrow, title, description, center = false, display = false }) {
  // Anchor sections (About, Projects, Contact) use the larger display scale; the
  // contrast against the restrained default scale is what gives the page its rhythm.
  const titleClass = display
    ? "mt-3 text-[2.5rem] font-semibold leading-[1.05] tracking-tight md:text-[3.5rem]"
    : "mt-3 text-[2rem] font-medium leading-tight tracking-tight md:text-[2.5rem]";

  return (
    <Parallax offset={18} className={center ? "text-center" : ""}>
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
