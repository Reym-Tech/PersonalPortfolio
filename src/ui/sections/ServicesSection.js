import { motion } from "framer-motion";

import { useRise } from "../design-system/animations/scroll-primitives";
import { BORDER } from "../design-system/tokens";
import { SectionHeading } from "../shared/SectionHeading";
import { services } from "../../domain/data/services";

export function ServicesSection() {
  const rise = useRise();

  return (
    <section id="services" className="scroll-mt-20">
      <div className="mx-auto max-w-4xl px-6 py-24 md:px-8">
        <motion.div {...rise()}>
          <SectionHeading index="04" eyebrow="Services" title="What I Offer" />
        </motion.div>

        <div className="mt-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              {...rise(index * 0.05)}
              className={`grid gap-x-8 gap-y-3 border-t ${BORDER} py-8 md:grid-cols-[auto_1fr]`}
            >
              <span
                aria-hidden="true"
                className="font-mono text-[2.5rem] font-semibold leading-none text-elegant-text/15 md:text-[3rem]"
              >
                {String(service.id).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl font-medium md:text-2xl">{service.title}</h3>
                <p className="mt-3 max-w-prose text-base leading-relaxed text-elegant-text/70">
                  {service.description}
                </p>
                <p className="mt-4 font-mono text-sm text-elegant-text/50">
                  {service.skills.join("  ·  ")}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
