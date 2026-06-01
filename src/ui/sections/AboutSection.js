import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useRise, ParallaxImage } from "../design-system/animations/scroll-primitives";
import { focusLink } from "../design-system/button-styles";
import { BORDER } from "../design-system/tokens";
import { SectionHeading } from "../shared/SectionHeading";

export function AboutSection() {
  const rise = useRise();
  const [photoLikes, setPhotoLikes] = useState(() => Number(localStorage.getItem("photoLikes")) || 0);
  const [photoLiked, setPhotoLiked] = useState(() => localStorage.getItem("photoLiked") === "true");
  const [loopHeartCount, setLoopHeartCount] = useState(22);

  useEffect(() => {
    try {
      localStorage.setItem("photoLikes", String(photoLikes));
      localStorage.setItem("photoLiked", String(photoLiked));
    } catch (e) { }
  }, [photoLikes, photoLiked]);

  useEffect(() => {
    let current = 22;
    let mounted = true;
    const interval = setInterval(() => {
      current = current >= 69 ? 22 : current + 1;
      if (mounted) setLoopHeartCount(current);
    }, 200);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleToggleLike = () => {
    if (photoLiked) {
      setPhotoLiked(false);
      setPhotoLikes((p) => Math.max(0, p - 1));
    } else {
      setPhotoLiked(true);
      setPhotoLikes((p) => p + 1);
    }
  };

  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-8">
        <motion.div {...rise()}>
          <SectionHeading eyebrow="About" title="About Me" />
        </motion.div>

        <div className="mt-12 grid items-start gap-12 md:grid-cols-2">
          <motion.div {...rise(0.05)} className="space-y-6">
            <p className="text-base leading-relaxed text-elegant-text/80 text-justify">
              I'm <span className="font-medium text-elegant-text">John Remy Gonzales</span>, a
              BSIT student at the UM Digos College. My journey in tech began
              with curiosity about how things work, which grew into a passion for building
              functional, well-designed digital experiences.
            </p>
            <p className="text-base leading-relaxed text-elegant-text/80 text-justify">
              I specialize in{" "}
              <span className="font-medium text-elegant-text">full-stack web development</span>,
              building responsive frontends with React and Tailwind CSS and reliable
              backends with Node.js and REST APIs. I care most about{" "}
              <span className="font-medium text-elegant-text">
                refined interfaces with smooth interactions
              </span>{" "}
              that are a pleasure to use.
            </p>
            <p className="text-base leading-relaxed text-elegant-text/80 text-justify">
              Beyond coding, I'm deeply interested in{" "}
              <span className="font-medium text-elegant-text">UI/UX design</span>,{" "}
              <span className="font-medium text-elegant-text">problem-solving</span>, and
              automation. I'm a continuous learner, always exploring new tools and technologies.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { label: "Full-Stack Developer" },
                { label: "Can cook rice in under a minute" },
                { label: "UI/UX Enthusiast" },
                { label: "Problem Solver" },
              ].map((item) => (
                <span
                  key={item.label}
                  className={`inline-flex items-center gap-2 rounded-full border ${BORDER} bg-elegant-surface px-4 py-2 text-sm text-elegant-text/70`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div {...rise(0.1)} className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <ParallaxImage
                  src="/images/profile3.jpg"
                  alt="John Remy Gonzales portrait"
                  frameClassName={`w-56 rounded-[8px] border ${BORDER}`}
                  imgClassName="h-56 w-full object-cover"
                />
                <button
                  onClick={handleToggleLike}
                  aria-pressed={photoLiked}
                  aria-label={photoLiked ? "Unlike photo" : "Like photo"}
                  className={`absolute -bottom-3 right-0 inline-flex items-center gap-2 rounded-full border ${BORDER} bg-elegant-surface px-3 py-1 ${focusLink}`}
                >
                  <motion.span
                    animate={photoLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-lg"
                    aria-hidden="true"
                  >
                    {photoLiked ? "💖" : "🤍"}
                  </motion.span>
                  <span className="font-mono text-sm text-elegant-text/70">{loopHeartCount}</span>
                </button>
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
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-elegant-primary" />
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
                <li>· 6 Certifications Earned</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
