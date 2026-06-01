import { motion } from "framer-motion";

import { useRise } from "../design-system/animations/scroll-primitives";
import { BORDER } from "../design-system/tokens";
import { SectionHeading } from "../shared/SectionHeading";
import { services } from "../../domain/data/services";

export function ServicesSection() {
  const rise = useRise();

  return (
    <section id="services" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-8">
        <motion.div {...rise()}>
          <SectionHeading eyebrow="Services" title="What I Offer" center />
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              {...rise(index * 0.05)}
              className={`rounded-[8px] border ${BORDER} bg-elegant-surface p-8 transition-colors hover:bg-[#F9FAFB]`}
            >
              <span aria-hidden="true" className="font-mono text-sm text-elegant-text/40">
                {String(service.id).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-medium">{service.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-elegant-text/70">
                {service.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`rounded-[4px] border ${BORDER} px-3 py-1 font-mono text-sm text-elegant-text/70`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
