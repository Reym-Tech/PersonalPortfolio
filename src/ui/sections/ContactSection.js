import { motion } from "framer-motion";

import { useRise } from "../design-system/animations/scroll-primitives";
import { primaryButton, focusLink } from "../design-system/button-styles";
import { ArrowRight } from "../design-system/icons";
import { BORDER } from "../design-system/tokens";
import { SectionHeading } from "../shared/SectionHeading";
import { contactMethods } from "../../domain/data/contact-methods";

export function ContactSection() {
  const rise = useRise();

  return (
    <section id="contact" className={`scroll-mt-20 border-y ${BORDER} bg-[#FAFAFA] tile-bg-muted`}>
      <div className="mx-auto max-w-4xl px-6 py-24 md:px-8">
        <motion.div {...rise()}>
          <SectionHeading
            eyebrow="Contact"
            title="Let's create something together"
            description="I'm open to new projects and opportunities — reach out through any of the channels below."
            center
          />
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.name}
              {...rise(index * 0.05)}
              href={method.disabled ? undefined : method.href}
              target={method.external ? "_blank" : undefined}
              rel={method.external ? "noopener noreferrer" : undefined}
              aria-disabled={method.disabled}
              className={`flex items-start gap-4 rounded-[8px] border ${BORDER} bg-elegant-surface p-6 transition-colors ${
                method.disabled
                  ? "cursor-not-allowed opacity-60"
                  : `hover:bg-[#F9FAFB] ${focusLink}`
              }`}
            >
              <span className={`inline-flex h-12 w-12 flex-none items-center justify-center rounded-[8px] border ${BORDER}`}>
                <img src={method.icon} alt="" aria-hidden="true" className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-base font-medium">{method.name}</span>
                <span className="mt-1 block break-all font-mono text-sm text-elegant-text/60">
                  {method.handle}
                </span>
                <span className="mt-2 block text-sm text-elegant-text/50">{method.caption}</span>
              </span>
            </motion.a>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a href="mailto:johnremygonzales20@gmail.com" className={primaryButton}>
            Get in touch
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
