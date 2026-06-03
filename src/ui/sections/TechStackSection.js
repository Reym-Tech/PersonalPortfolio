import { motion } from "framer-motion";

import { useRise } from "../design-system/animations/scroll-primitives";
import { BORDER } from "../design-system/tokens";
import { SectionHeading } from "../shared/SectionHeading";
import { techStack } from "../../domain/data/tech-stack";

export function TechStackSection() {
  const rise = useRise();

  return (
    <section id="skills" className={`scroll-mt-20 border-y ${BORDER} bg-elegant-muted tile-bg-muted`}>
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-8">
        <motion.div {...rise()}>
          <SectionHeading
            index="03"
            eyebrow="Capabilities"
            title="Tech Stack & Tools"
            description="The languages, frameworks, and tools I work with across the stack."
            center
          />
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {techStack.map((group, index) => (
            <motion.div
              key={group.category}
              {...rise(index * 0.05)}
              className={`rounded-[8px] border ${BORDER} bg-elegant-surface p-6 transition-colors hover:bg-elegant-hover`}
            >
              <h3 className="font-mono text-sm uppercase tracking-widest text-elegant-text/50">
                {group.category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={`rounded-[4px] border ${BORDER} px-3 py-1 font-mono text-sm text-elegant-text/70`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
