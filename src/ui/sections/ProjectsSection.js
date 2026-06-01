import { motion } from "framer-motion";

import { useRise, ParallaxImage } from "../design-system/animations/scroll-primitives";
import { primaryButtonSm, outlineButtonSm } from "../design-system/button-styles";
import { BORDER } from "../design-system/tokens";
import { SectionHeading } from "../shared/SectionHeading";
import { projects } from "../../domain/data/projects";

export function ProjectsSection() {
  const rise = useRise();

  return (
    <section id="projects" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-8">
        <motion.div {...rise()}>
          <SectionHeading
            eyebrow="Selected work"
            title="Featured Projects"
            description="A selection of full-stack web and mobile projects built across academic coursework and independent study."
          />
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              {...rise(idx * 0.05)}
              className={`flex flex-col overflow-hidden rounded-[8px] border ${BORDER} bg-elegant-surface`}
            >
              <ParallaxImage
                src={project.image}
                alt={project.title}
                frameClassName={`h-56 w-full border-b ${BORDER}`}
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-medium">{project.title}</h3>
                <p className="mt-2 flex-1 text-base leading-relaxed text-elegant-text/70 text-justify">
                  {project.description}
                </p>
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
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.websiteLink && (
                    <a
                      href={project.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={primaryButtonSm}
                    >
                      Visit website
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={outlineButtonSm}
                    >
                      GitHub repository
                    </a>
                  )}
                  {project.apkLink && (
                    <a
                      href={project.apkLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={outlineButtonSm}
                    >
                      Download APK
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
