import { useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { primaryButton, outlineButton, focusRing } from "../design-system/button-styles";
import { Close } from "../design-system/icons";
import { BORDER } from "../design-system/tokens";
import { useDialog } from "../design-system/use-dialog";

export function ProjectDetailModal({ project, onClose }) {
  const dialogRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useDialog(dialogRef, Boolean(project), onClose);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[16px] bg-elegant-surface border ${BORDER} focus:outline-none sm:rounded-[8px]`}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className={`absolute top-4 right-4 z-10 rounded-[4px] text-elegant-text/40 transition-colors hover:text-elegant-text ${focusRing}`}
            >
              <Close />
            </button>

            {project.image && (
              <div className={`h-56 w-full overflow-hidden border-b ${BORDER}`}>
                <img
                  src={project.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              <h2 id="modal-project-title" className="pr-8 text-2xl font-semibold leading-tight">
                {project.title}
              </h2>
              {project.role && (
                <p className="mt-1 font-mono text-sm text-elegant-text/50">{project.role}</p>
              )}

              {project.technologies?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`rounded-[4px] border ${BORDER} px-3 py-1 font-mono text-sm text-elegant-text/70`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-6 text-base leading-relaxed text-elegant-text/70">
                {project.description}
              </p>

              {project.highlights?.length > 0 && (
                <div className={`mt-6 space-y-4 border-t ${BORDER} pt-6`}>
                  {project.highlights.map((h) => (
                    <div key={h.label} className="flex gap-4">
                      <span className="w-16 shrink-0 pt-0.5 font-mono text-xs font-medium uppercase tracking-wider text-elegant-text/40">
                        {h.label}
                      </span>
                      <p className="text-sm leading-relaxed text-elegant-text/70">{h.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {project.websiteLink && (
                  <a
                    href={project.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={primaryButton}
                  >
                    Live demo
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={outlineButton}
                  >
                    GitHub repository
                  </a>
                )}
                {project.apkLink && (
                  <a
                    href={project.apkLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={outlineButton}
                  >
                    Download APK
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
