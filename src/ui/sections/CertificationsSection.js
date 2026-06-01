import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { useRise, ParallaxImage } from "../design-system/animations/scroll-primitives";
import { outlineButton, focusLink, focusRing } from "../design-system/button-styles";
import { ArrowRight, Close } from "../design-system/icons";
import { BORDER } from "../design-system/tokens";
import { SectionHeading } from "../shared/SectionHeading";
import { useDialog } from "../design-system/use-dialog";
import { certificates } from "../../domain/data/certificates";

export function CertificationsSection() {
  const rise = useRise();
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const [expandCerts, setExpandCerts] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  const closeCert = () => setSelectedCert(null);
  useDialog(dialogRef, Boolean(selectedCert), closeCert);

  return (
    <section id="certificates" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-8">
        <motion.div {...rise()}>
          <SectionHeading
            eyebrow="Credentials"
            title="Certifications"
            description="Verified credentials in IT infrastructure, web development, and programming."
          />
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {certificates.slice(0, expandCerts ? certificates.length : 3).map((cert, index) => (
            <motion.button
              key={cert.id}
              {...rise(index * 0.05)}
              onClick={() => setSelectedCert(cert)}
              className={`group flex flex-col overflow-hidden rounded-[8px] border ${BORDER} bg-elegant-surface text-left transition-colors hover:bg-[#F9FAFB] ${focusLink}`}
            >
              <ParallaxImage
                src={cert.image}
                alt={cert.title}
                frameClassName={`h-40 w-full border-b ${BORDER}`}
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-medium leading-snug">{cert.title}</h3>
                <p className="mt-2 font-mono text-sm text-elegant-text/50">
                  {cert.issuer} • {cert.date}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-elegant-primary opacity-0 transition-opacity group-hover:opacity-100">
                  View certificate <ArrowRight />
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {certificates.length > 3 && (
          <div className="mt-12 flex justify-center">
            <button onClick={() => setExpandCerts(!expandCerts)} className={outlineButton}>
              {expandCerts ? "See less" : "See more"}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCert}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={selectedCert.title}
              tabIndex={-1}
              initial={reduceMotion ? { opacity: 0 } : { scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0.92, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] max-w-4xl flex-col focus:outline-none"
            >
              <button
                type="button"
                onClick={closeCert}
                aria-label="Close certificate"
                className={`absolute -top-3 -right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border ${BORDER} bg-elegant-surface text-elegant-text/60 shadow-md transition-colors hover:text-elegant-text ${focusRing}`}
              >
                <Close />
              </button>
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="max-h-[90vh] rounded-lg object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}