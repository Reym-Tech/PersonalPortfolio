import { motion } from "framer-motion";

import { useRise } from "../design-system/animations/scroll-primitives";
import { BORDER } from "../design-system/tokens";
import { SectionHeading } from "../shared/SectionHeading";
import { cardTitleSm } from "../design-system/typography";
import { education } from "../../domain/data/education";

export function EducationSection() {
  const rise = useRise();

  return (
    <section id="education" className={`scroll-mt-20 border-y ${BORDER} bg-elegant-muted tile-bg-muted`}>
      <div className="mx-auto max-w-4xl px-6 py-24 md:px-8">
        <motion.div {...rise()}>
          <SectionHeading index="05" eyebrow="Background" title="Education & Experience" center />
        </motion.div>

        <div className="mt-12 space-y-6">
          {education.map((item, index) => (
            <motion.div
              key={item.id}
              {...rise(index * 0.05)}
              className={`rounded-none border ${BORDER} bg-elegant-surface p-6`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className={`${cardTitleSm} text-elegant-text`}>{item.title}</h3>
                <span className="font-mono text-sm text-elegant-text/50">{item.period}</span>
              </div>
              <p className="mt-2 text-base font-medium">{item.institution}</p>
              <p className="mt-2 text-base leading-relaxed text-elegant-text/70">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
