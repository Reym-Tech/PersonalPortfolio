import { primaryButtonSm, outlineButtonSm } from "../design-system/button-styles";
import { ArrowRight } from "../design-system/icons";
import { BORDER } from "../design-system/tokens";
import { Eyebrow } from "../shared/Eyebrow";

// One project's full case study as a single-column reading view (no screenshot — the
// brief pile card already carried the thumbnail). Used as the desktop detail-overlay
// body and as the mobile / reduced-motion inline baseline, so the two share one
// layout. The h3 id is the label target for the overlay's aria-labelledby.
export function ProjectCard({ project, index }) {
  const titleId = `project-title-${project.id}`;
  const outcome = project.highlights?.find((h) => h.label === "Outcome");
  const story = project.highlights?.filter((h) => h.label !== "Outcome") ?? [];

  return (
    <article
      aria-labelledby={titleId}
      className={`mx-auto max-w-2xl rounded-[12px] border ${BORDER} bg-elegant-surface shadow-sm`}
    >
      <div className="p-8 md:p-10">
        <div className="flex items-baseline gap-4">
          {/* NOTE: numbering starts at 00 — the first card is the portfolio itself
              (the meta "Case Study 00"); real projects follow as 01+. */}
          <span
            aria-hidden="true"
            className="font-mono text-[3rem] font-semibold leading-none text-elegant-text/15 md:text-[4rem]"
          >
            {String(index).padStart(2, "0")}
          </span>
          {project.featured && <Eyebrow>Featured</Eyebrow>}
        </div>

        <h3 id={titleId} className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          {project.title}
        </h3>
        {project.role && (
          <p className="mt-1 font-mono text-sm text-elegant-text/50">{project.role}</p>
        )}

        <div className={`mt-8 space-y-6 border-t ${BORDER} pt-8`}>
          {story.map((h) => (
            <div key={h.label}>
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-elegant-text/40">
                {h.label}
              </span>
              <p className="mt-1.5 leading-relaxed text-elegant-text/70">{h.text}</p>
            </div>
          ))}
          {outcome && (
            <div>
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-elegant-primary">
                {outcome.label}
              </span>
              <p className="mt-1.5 leading-relaxed text-elegant-text">{outcome.text}</p>
            </div>
          )}
        </div>

        {project.technologies?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className={`rounded-[4px] border ${BORDER} px-2.5 py-1 font-mono text-xs text-elegant-text/70`}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className={`mt-8 flex flex-wrap gap-3 border-t ${BORDER} pt-8`}>
          {project.websiteLink && (
            <a
              href={project.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className={primaryButtonSm}
            >
              Live demo
              <ArrowRight />
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
    </article>
  );
}
