import { useState } from "react";

import { ThemeProvider } from "./ThemeContext";
import { ScrollProgress } from "./ui/design-system/animations/scroll-primitives";
import { EntryTransition } from "./ui/design-system/animations/entry-transition";
import { NavBar } from "./ui/layout/NavBar";
import { Footer } from "./ui/layout/Footer";
import { HeroSection } from "./ui/sections/HeroSection";
import { AboutSection } from "./ui/sections/AboutSection";
import { StatsSection } from "./ui/sections/StatsSection";
import { ProjectsSection } from "./ui/sections/ProjectsSection";
import { TechStackSection } from "./ui/sections/TechStackSection";
import { ServicesSection } from "./ui/sections/ServicesSection";
import { EducationSection } from "./ui/sections/EducationSection";
import { CertificationsSection } from "./ui/sections/CertificationsSection";
import { ContactSection } from "./ui/sections/ContactSection";
import { ContactFab } from "./ui/shared/ContactFab";

export default function Portfolio() {
  const seenIntro = sessionStorage.getItem("intro-seen") === "1";
  const [introExiting, setIntroExiting] = useState(seenIntro);
  const [introDone, setIntroDone] = useState(seenIntro);

  return (
    <ThemeProvider>
      <div className="min-h-screen scroll-smooth bg-elegant-surface font-display text-elegant-text antialiased">
      {!introDone && (
        <EntryTransition
          onExitBegin={() => setIntroExiting(true)}
          onComplete={() => {
            sessionStorage.setItem("intro-seen", "1");
            setIntroDone(true);
          }}
        />
      )}
      <ScrollProgress />
      <NavBar />
      <HeroSection introExiting={introExiting} instantReveal={seenIntro} />
      <AboutSection />
      <StatsSection />
      <ProjectsSection />
      <TechStackSection />
      <ServicesSection />
      <EducationSection />
      <CertificationsSection />
      <ContactSection />
      <Footer />
      <ContactFab />
      </div>
    </ThemeProvider>
  );
}
