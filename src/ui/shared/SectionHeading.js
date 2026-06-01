import { Parallax } from "../design-system/animations/scroll-primitives";
import { Eyebrow } from "./Eyebrow";

export function SectionHeading({ eyebrow, title, description, center = false }) {
  return (
    <Parallax offset={18} className={center ? "text-center" : ""}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-[2rem] font-medium leading-tight tracking-tight md:text-[2.5rem]">
        {title}
      </h2>
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
