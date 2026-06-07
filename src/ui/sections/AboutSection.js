import { motion } from "framer-motion";
import { useRise, ParallaxImage } from "../design-system/animations/scroll-primitives";
import { BORDER } from "../design-system/tokens";
import { SectionHeading } from "../shared/SectionHeading";
import { EditorialFrame } from "../design-system/EditorialFrame";
import { certificates } from "../../domain/data/certificates";

export function AboutSection() {
  const rise = useRise();

  return (
    <section id="about" className="scroll-mt-20">
      <div className="relative mx-auto max-w-5xl px-6 py-24 md:px-8">
        <EditorialFrame bottomRight="01 · About" />
        <motion.div {...rise()}>
          <SectionHeading index="01" eyebrow="About" title="About Me" display />
        </motion.div>

        <div className="mt-12 grid items-start gap-12 md:grid-cols-2">
          <motion.div {...rise(0.05)} className="space-y-6">
            <p className="text-base leading-relaxed text-elegant-text/80">
              I'm <span className="font-medium text-elegant-text">John Remy Gonzales</span>, a
              BSIT student at UM Digos College in the Philippines. I started with{" "}
              <span className="font-medium text-elegant-text">Ancient Crafts</span> — a native
              Android marketplace I built to give indigenous artisans in Davao del Sur a digital
              storefront for their handmade goods. Seeing a real community's craft inside something
              I'd made is what turned coursework into the path I want to follow.
            </p>
            <p className="text-base leading-relaxed text-elegant-text/80">
              By my third year I was building for real users.{" "}
              <span className="font-medium text-elegant-text">BrewTrack</span>, a point-of-sale and
              inventory system, runs day to day at a local café — my first project built in
              cooperation with an actual client. That taught me the part most student work skips:
              too many projects stop at <span className="italic">"it works,"</span> leaving edge
              cases ignored until they grow into real problems. I'd rather handle them up front.
            </p>
            <p className="text-base leading-relaxed text-elegant-text/80">
              What I care about most is how an interface{" "}
              <span className="font-medium text-elegant-text">feels</span> — clean, responsive, and
              accessible on every device, and a genuine pleasure to use. I build full-stack: React
              and Tailwind on the front end, FastAPI, Supabase, and serverless functions behind it.
              My goal is to grow into a{" "}
              <span className="font-medium text-elegant-text">software engineering</span> role, and
              every project is a step toward it.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { label: "Accessibility-first" },
                { label: "Motion-driven interfaces" },
                { label: "Full-Stack — React · FastAPI" },
                { label: "Continuous learner" },
              ].map((item) => (
                <span
                  key={item.label}
                  className={`inline-flex items-center gap-2 rounded-full border ${BORDER} bg-elegant-surface px-4 py-2 text-sm text-elegant-text/70`}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div {...rise(0.1)} className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <ParallaxImage
                  src="/images/profiles/AboutSection.jpg"
                  alt="John Remy Gonzales portrait"
                  frameClassName={`w-56 rounded-[8px] border ${BORDER}`}
                  imgClassName="h-56 w-full object-cover"
                />
              </div>
            </div>

            <div className={`rounded-[8px] border ${BORDER} bg-elegant-surface p-8`}>
              <h3 className="flex items-center gap-2 text-lg font-medium">
                My Passion
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Building motion-driven, interactive web interfaces",
                  "Prototyping and implementing accessible UI systems",
                  "Writing maintainable, performant code",
                  "Breaking down complex problems into clean, testable solutions",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-elegant-text/80">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-elegant-text/40" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className={`mt-6 flex items-center gap-2 border-t ${BORDER} pt-6 text-lg font-medium`}>
                Quick Facts
              </h3>
              <ul className="mt-4 space-y-2 text-base text-elegant-text/70">
                <li>· Based in Philippines</li>
                <li>· BSIT 3rd Year Student</li>
                <li>· 3+ Years Coding Experience</li>
                <li>· {certificates.length} Certifications Earned</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
