import { useState } from "react";
import { motion } from "framer-motion";

import { useRise, ParallaxImage } from "../design-system/animations/scroll-primitives";
import { primaryButtonSm, outlineButtonSm } from "../design-system/button-styles";
import { ArrowRight } from "../design-system/icons";
import { BORDER } from "../design-system/tokens";
import { SectionHeading } from "../shared/SectionHeading";
import { projects } from "../../domain/data/projects";
import { FeaturedProject } from "./FeaturedProject";
import { ProjectDetailModal } from "./ProjectDetailModal";

export function ProjectsSection() {
  const rise = useRise();
  const [selectedProject, setSelectedProject] = useState(null);

  const visible = projects.filter((p) => p.description);
  const featured = visible.find((p) => p.featured);
  const rest = visible.filter((p) => !p.featured);

  return (
    <section id="projects" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 md:px-8">
        <motion.div {...rise()}>
          <SectionHeading
            index="02"
            eyebrow="Selected work"
            title="Featured Projects"
            description="A selection of full-stack web and mobile projects built across academic coursework and independent study."
            display
          />
        </motion.div>
      </div>

      {featured && <FeaturedProject project={featured} onOpen={setSelectedProject} />}

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {rest.map((project, idx) => (
            <motion.div key={project.id} {...rise(0.1 + idx * 0.05)}>
              <div
                className={`group flex h-full flex-col overflow-hidden rounded-[8px] border ${BORDER} bg-elegant-surface transition-shadow duration-200 hover:shadow-md`}
              >
                <ParallaxImage
                  src={project.image}
                  alt={project.title}
                  frameClassName={`h-56 w-full border-b ${BORDER}`}
                />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-medium transition-colors group-hover:text-elegant-primary">
                    {project.title}
                  </h3>
                  {project.role && (
                    <p className="mt-1 font-mono text-sm text-elegant-text/50">{project.role}</p>
                  )}
                  <p className="mt-2 flex-1 text-base leading-relaxed text-elegant-text/70">
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
                    <button
                      onClick={() => setSelectedProject(project)}
                      className={primaryButtonSm}
                    >
                      View case study
                      <ArrowRight />
                    </button>
                    {project.websiteLink && (
                      <a
                        href={project.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={outlineButtonSm}
                      >
                        Live demo
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={outlineButtonSm}
                      >
                        GitHub
                      </a>
                    )}
                    {project.apkLink && (
                      <a
                        href={project.apkLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={outlineButtonSm}
                      >
                        APK
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
