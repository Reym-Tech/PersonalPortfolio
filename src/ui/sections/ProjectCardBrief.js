import { motion } from "framer-motion";

import { focusLink } from "../design-system/button-styles";
import { ArrowRight } from "../design-system/icons";
import { BORDER } from "../design-system/tokens";
import { Eyebrow } from "../shared/Eyebrow";

// The compact pile card. Fixed height keeps the stack uniform so the peeking top
// edges line up; the whole card is a single button (the only action is "open the
// case study"), which keeps it free of nested interactive elements. The Outcome
// beat stays visible so a skimming visitor gets the impact without opening.
export function ProjectCardBrief({ project, index, onOpen }) {
  const outcome = project.highlights?.find((h) => h.label === "Outcome");

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`View case study: ${project.title}`}
      className={`group mx-auto grid h-64 w-full max-w-5xl grid-cols-[2fr_3fr] overflow-hidden rounded-[12px] border ${BORDER} bg-elegant-surface text-left shadow-lg transition-colors hover:bg-elegant-hover ${focusLink}`}
    >
      <div className={`relative border-r ${BORDER}`}>
        <img src={project.image} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="flex h-full flex-col p-7">
        {/* The story clips if it runs long so the hint below always stays visible —
            the Featured card carries an extra eyebrow and would otherwise push the
            hint past the card's clipped bottom edge. */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="flex items-baseline gap-3">
            <span
              aria-hidden="true"
              className="font-mono text-[2.5rem] font-semibold leading-none text-elegant-text/15"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            {project.featured && <Eyebrow>Featured</Eyebrow>}
          </div>

          <h3 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">{project.title}</h3>
          {project.role && (
            <p className="mt-0.5 font-mono text-sm text-elegant-text/50">{project.role}</p>
          )}

          {outcome && (
            <p className="mt-3 border-l-2 border-elegant-primary pl-3 text-sm leading-relaxed text-elegant-text/80 line-clamp-2">
              {outcome.text}
            </p>
          )}
        </div>

        {/* Revealed on hover (and on keyboard focus, so it isn't pointer-only). The
            inter-card gap keeps the next card off this card's bottom edge while it's
            active, so the hint stays reachable. */}
        <span className="inline-flex items-center gap-1 pt-3 text-sm font-medium text-elegant-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          View case study
          <ArrowRight />
        </span>
      </div>
    </motion.button>
  );
}
