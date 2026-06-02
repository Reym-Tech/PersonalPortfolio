import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

import { ParallaxImage } from "../design-system/animations/scroll-primitives";
import { primaryButtonSm, outlineButtonSm } from "../design-system/button-styles";
import { ArrowRight } from "../design-system/icons";
import { BORDER } from "../design-system/tokens";
import { Eyebrow } from "../shared/Eyebrow";

export function FeaturedProject({ project, onOpen }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // The Outcome is pulled out of the narrative so it can carry the focal
  // emphasis the case study builds toward; Problem/Approach lead into it.
  const outcome = project.highlights?.find((h) => h.label === "Outcome");
  const story = project.highlights?.filter((h) => h.label !== "Outcome") ?? [];

  return (
    <div ref={ref} className={`border-y ${BORDER} bg-elegant-surface`}>
      <div className="mx-auto grid max-w-6xl items-start gap-8 px-6 py-16 md:grid-cols-[3fr_4fr] md:gap-14 md:px-8 md:py-20">
        <ParallaxImage
          src={project.image}
          alt={project.title}
          frameClassName={`aspect-[4/3] w-full rounded-[8px] border ${BORDER}`}
        />

        <div>
          <RevealAt progress={scrollYProgress} at={0.06}>
            <span
              aria-hidden="true"
              className="block font-mono text-[4rem] font-semibold leading-none text-elegant-text/15 md:text-[6rem]"
            >
              01
            </span>
            <div className="mt-2">
              <Eyebrow>Featured Project</Eyebrow>
            </div>
          </RevealAt>

          <RevealAt progress={scrollYProgress} at={0.13}>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              {project.title}
            </h3>
            {project.role && (
              <p className="mt-2 font-mono text-sm text-elegant-text/50">{project.role}</p>
            )}
          </RevealAt>

          <RevealAt progress={scrollYProgress} at={0.2}>
            <div className="mt-6 space-y-5">
              {story.map((h) => (
                <div key={h.label}>
                  <span className="font-mono text-xs font-medium uppercase tracking-wider text-elegant-text/40">
                    {h.label}
                  </span>
                  <p className="mt-2 max-w-prose text-base leading-relaxed text-elegant-text/70">
                    {h.text}
                  </p>
                </div>
              ))}
            </div>
          </RevealAt>

          {outcome && (
            <RevealAt progress={scrollYProgress} at={0.27}>
              <div className="mt-6 border-l-2 border-elegant-primary pl-5">
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-elegant-primary">
                  {outcome.label}
                </span>
                <p className="mt-2 max-w-prose text-lg leading-relaxed text-elegant-text md:text-xl">
                  {outcome.text}
                </p>
              </div>
            </RevealAt>
          )}

          <RevealAt progress={scrollYProgress} at={0.34}>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className={`rounded-[4px] border ${BORDER} px-3 py-1 font-mono text-sm text-elegant-text/70`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </RevealAt>

          <RevealAt progress={scrollYProgress} at={0.4}>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => onOpen(project)} className={primaryButtonSm}>
                View case study
                <ArrowRight />
              </button>
              {project.websiteLink && (
                <a
                  href={project.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={outlineButtonSm}
                >
                  Live demo
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={outlineButtonSm}
                >
                  GitHub
                </a>
              )}
              {project.apkLink && (
                <a
                  href={project.apkLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={outlineButtonSm}
                >
                  APK
                </a>
              )}
            </div>
          </RevealAt>
        </div>
      </div>
    </div>
  );
}

// Reveals its children in sequence as the featured band scrolls through the
// viewport, each block keyed to a slice of the section's scroll progress.
function RevealAt({ progress, at, children }) {
  const reduceMotion = useReducedMotion();
  const opacity = useTransform(progress, [at, at + 0.1], [0, 1]);
  const y = useTransform(progress, [at, at + 0.1], [24, 0]);

  if (reduceMotion) return <div>{children}</div>;

  return (
    <motion.div style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}
