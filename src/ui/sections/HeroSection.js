import { motion, useReducedMotion } from "framer-motion";

import { primaryButton, outlineButton } from "../design-system/button-styles";
import { ArrowRight } from "../design-system/icons";
import { LineGrid } from "../design-system/canvas/LineGrid";
import { Parallax } from "../design-system/animations/scroll-primitives";

import { generateCv } from "../../application/use-cases/generate-cv";

export function HeroSection({ introExiting, instantReveal }) {
  const reduceMotion = useReducedMotion();

  const heroReveal = (delay = 0) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: introExiting ? { opacity: 1, y: 0 } : reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    transition: {
      duration: reduceMotion ? 0.3 : instantReveal ? 0.5 : 0.65,
      delay: reduceMotion ? delay * 0.1 : instantReveal ? 0.05 + delay * 0.5 : 0.5 + delay,
      ease: [0.22, 1, 0.36, 1],
    },
  });

  // The 2D grid settles in as the 3D entry grid recedes, reading as one continuous
  // surface. Skipped when revisiting (instantReveal) or under reduced motion.
  const gridSettle =
    reduceMotion || instantReveal
      ? { initial: false, animate: { opacity: 1, scale: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, scale: 1.06 },
          animate: introExiting ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.06 },
          transition: { duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
        };

  const handleViewProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="relative scroll-mt-20">
      <motion.div {...gridSettle} className="absolute inset-0">
        <LineGrid />
      </motion.div>
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-8">
        <motion.div
          className="relative p-8 pt-14 md:p-12"
          initial={{ opacity: 0 }}
          animate={introExiting ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0.3 : instantReveal ? 0.5 : 0.8,
            delay: reduceMotion ? 0 : instantReveal ? 0 : 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span
            aria-hidden="true"
            className="absolute top-6 left-0 font-mono text-sm uppercase tracking-widest text-elegant-text/30"
          >
            Portfolio
          </span>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <motion.p
                {...heroReveal()}
                className="flex items-center gap-2 text-sm text-elegant-text/70"
              >
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-elegant-success" />
                Available for work
              </motion.p>

              <motion.h1
                {...heroReveal(0.04)}
                className="mt-6 max-w-[15ch] text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-tight md:text-[4rem] lg:text-[5rem]"
              >
                I build accessible,{" "}
                <span className="whitespace-nowrap">motion-driven</span> interfaces.
              </motion.h1>

              <motion.p {...heroReveal(0.08)} className="mt-5 text-base text-elegant-text/70 md:text-lg">
                John Remy C. Gonzales — full-stack web &amp; mobile developer
              </motion.p>

              <motion.p {...heroReveal(0.08)} className="mt-2 text-base text-elegant-text/70">
                BSIT 3rd Year • <em className="font-light italic text-elegant-text">UM Digos College</em>
              </motion.p>

              <motion.p
                {...heroReveal(0.12)}
                className="mt-6 max-w-md text-base leading-relaxed text-elegant-text/70"
              >
                Front to back — React &amp; Tailwind interfaces, Node.js &amp; REST backends.
              </motion.p>

              <motion.div {...heroReveal(0.16)} className="mt-8 flex flex-wrap gap-4">
                <button onClick={handleViewProjects} className={primaryButton}>
                  View My Work
                  <ArrowRight />
                </button>
                <button onClick={generateCv} className={outlineButton}>
                  Download Resume
                </button>
              </motion.div>
            </div>

            <motion.div {...heroReveal(0.12)} className="flex justify-center md:justify-end">
              <Parallax offset={24}>
                <img
                  src="/images/profile--.png"
                  alt="John Remy Gonzales"
                  loading="lazy"
                  className="w-64 rounded-[8px] border border-[#E5E7EB] object-cover"
                />
              </Parallax>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
