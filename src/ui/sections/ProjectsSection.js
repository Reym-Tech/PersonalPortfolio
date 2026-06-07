import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { useRise } from "../design-system/animations/scroll-primitives";
import { focusRing } from "../design-system/button-styles";
import { Close } from "../design-system/icons";
import { BORDER } from "../design-system/tokens";
import { SectionHeading } from "../shared/SectionHeading";
import { EditorialFrame } from "../design-system/EditorialFrame";
import { useDialog } from "../design-system/use-dialog";
import { projects } from "../../domain/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectCardBrief } from "./ProjectCardBrief";

// Desktop + motion-OK gates the sticky pile; otherwise a plain readable stack (this
// is also the accessibility baseline and the mobile layout).
function useEnablePile() {
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop && !reduceMotion;
}

const PEEK_REM = 1.1; // top-edge sliver each covered card leaves visible
const TOP_BASE_REM = 6; // first card's pin offset (clears the navbar)
const GAP_REM = 2; // flow space between cards — a strip of page shows between them

// One card in the pile. It pins (sticky) at an offset that grows with its index, so
// each previous card peeks above the next. A flow gap above each card (GAP_REM) lets
// a strip of page show between cards as one slides toward the next. As the following
// card rises to cover it, the card shrinks/dims to read as receding into the stack;
// the last card never recedes (final resting state). The depth transform is driven
// off the whole deck's scroll (cards are uniform height, so even index slices track
// coverage); the sticky element is never the scroll target, which would freeze its
// progress while pinned.
function PileCard({ progress, index, total, children }) {
  const isLast = index === total - 1;
  const start = (index + 0.5) / total;
  const end = (index + 1) / total;
  const scale = useTransform(progress, [start, end], [1, isLast ? 1 : 0.94]);
  const opacity = useTransform(progress, [start, end], [1, isLast ? 1 : 0.6]);

  return (
    <div
      className="sticky"
      style={{
        top: `${TOP_BASE_REM + index * PEEK_REM}rem`,
        marginTop: index === 0 ? undefined : `${GAP_REM}rem`,
        zIndex: index,
      }}
    >
      <motion.div style={{ scale, opacity, transformOrigin: "top center" }}>
        {children}
      </motion.div>
    </div>
  );
}

// The deck owns the scroll target. Kept as its own component so useScroll only runs
// on the desktop pile path — never in the static baseline (also avoids motion's
// "ref not hydrated" warning under jsdom, where the pile is gated off).
function Pile({ onOpen }) {
  const deckRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: deckRef,
    offset: ["start start", "end start"],
  });

  return (
    <div ref={deckRef} className="relative px-6 pb-24 md:px-8">
      {projects.map((project, index) => (
        <PileCard
          key={project.id}
          progress={scrollYProgress}
          index={index}
          total={projects.length}
        >
          <ProjectCardBrief
            project={project}
            index={index}
            onOpen={() => onOpen(project)}
          />
        </PileCard>
      ))}
    </div>
  );
}

export function ProjectsSection() {
  const rise = useRise();
  const reduceMotion = useReducedMotion();
  const enablePile = useEnablePile();
  const dialogRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const close = () => setSelected(null);
  useDialog(dialogRef, Boolean(selected), close);
  const selectedIndex = selected ? projects.findIndex((p) => p.id === selected.id) : -1;

  return (
    <section id="projects" className="scroll-mt-20">
      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-24 md:px-8">
        <EditorialFrame bottomRight="02 · Projects" inset="inset-x-3 md:inset-x-4 top-16 bottom-8" />
        <motion.div {...rise()}>
          <SectionHeading
            index="02"
            eyebrow="Selected work"
            title="Featured Projects"
            description="A selection of full-stack web and mobile projects built across academic coursework and independent study."
            display
          />
        </motion.div>
      </div>

      {enablePile ? (
        <Pile onOpen={setSelected} />
      ) : (
        <div className="mx-auto max-w-5xl space-y-8 px-6 pb-24 md:px-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/50 p-4 md:p-8"
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`project-title-${selected.id}`}
              tabIndex={-1}
              initial={reduceMotion ? { opacity: 0 } : { scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0.94, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-auto w-full max-w-2xl focus:outline-none"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close case study"
                className={`absolute -top-3 -right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-none border ${BORDER} bg-elegant-surface text-elegant-text/60 shadow-md transition-colors hover:text-elegant-text ${focusRing}`}
              >
                <Close />
              </button>
              <ProjectCard project={selected} index={selectedIndex} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
