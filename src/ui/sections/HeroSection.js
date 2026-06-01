import { motion, useReducedMotion } from "framer-motion";

import { primaryButton, outlineButton } from "../design-system/button-styles";
import { ArrowRight } from "../design-system/icons";
import { LineGrid } from "../design-system/canvas/LineGrid";
import { Parallax } from "../design-system/animations/scroll-primitives";
import { BORDER } from "../design-system/tokens";
import { generateCv } from "../../application/use-cases/generate-cv";

export function HeroSection({ introExiting }) {
  const reduceMotion = useReducedMotion();

  const heroReveal = (delay = 0) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: introExiting ? { opacity: 1, y: 0 } : reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    transition: {
      duration: reduceMotion ? 0.3 : 0.65,
      delay: reduceMotion ? delay * 0.1 : 2.0 + delay,
      ease: [0.22, 1, 0.36, 1],
    },
  });

  const handleViewProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="relative scroll-mt-20">
      <LineGrid />
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-8">
        <motion.div
          className={`relative overflow-hidden rounded-[8px] border ${BORDER} bg-elegant-surface p-8 md:p-12`}
          initial={{ opacity: 0 }}
          animate={introExiting ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0.3 : 1.2,
            delay: reduceMotion ? 0 : 1.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span
            aria-hidden="true"
            className="absolute top-6 font-mono text-sm uppercase tracking-widest text-elegant-text/30"
          >
            Portfolio
          </span>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div {...heroReveal()}>
              <p className="flex items-center gap-2 text-sm text-elegant-text/70">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-elegant-success" />
                Available for work
              </p>

              <h1 className="mt-6 text-[2rem] font-medium leading-tight tracking-tight md:text-[2.5rem]">
                John Remy C. Gonzales
              </h1>

              <p className="mt-4 text-base text-elegant-text/70">
                BSIT 3rd Year • <em className="font-light italic text-elegant-primary-400">UM Digos College</em>
              </p>

              <p className="mt-6 max-w-md text-base leading-relaxed text-elegant-text/70">
                Building full-stack web and mobile applications with a focus on
                clean code, accessibility, and refined user experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={handleViewProjects} className={primaryButton}>
                  View My Work
                  <ArrowRight />
                </button>
                <button onClick={generateCv} className={outlineButton}>
                  Download Resume
                </button>
              </div>
            </motion.div>

            <motion.div {...heroReveal(0.12)} className="flex justify-center md:justify-end">
              <Parallax offset={24}>
                <img
                  src="/images/profile--.png"
                  alt="John Remy Gonzales"
                  loading="lazy"
                  className={`w-64 rounded-[8px] border ${BORDER} object-cover`}
                />
              </Parallax>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
