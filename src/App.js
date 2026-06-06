import { useState, useEffect } from "react";

import { ThemeProvider } from "./ThemeContext";
import { SoundProvider } from "./SoundContext";
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
import { CrescereFAB } from "./ui/chat/CrescereFAB";
import { ChatWidget } from "./ui/chat/ChatWidget";

export default function Portfolio() {
  const seenIntro = sessionStorage.getItem("intro-seen") === "1";
  const [introExiting, setIntroExiting] = useState(seenIntro);
  const [introDone, setIntroDone] = useState(seenIntro);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatTab, setChatTab] = useState("chat");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  // Bumped when the panel finishes its absorb-into-FAB exit, so the FAB can fire its
  // "snap back" pulse exactly on close-complete rather than on a drift-prone timer.
  const [closePulse, setClosePulse] = useState(0);

  // Auto-clear new-message indicator after the pulse animation completes
  useEffect(() => {
    if (!hasNewMessage) return undefined;
    const t = setTimeout(() => setHasNewMessage(false), 3000);
    return () => clearTimeout(t);
  }, [hasNewMessage]);

  function openPanel(tab) {
    setChatTab(tab);
    setChatOpen(true);
  }

  return (
    <ThemeProvider>
      <SoundProvider>
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
      <NavBar introExiting={introExiting} instantReveal={seenIntro} />
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
      <CrescereFAB
        isOpen={chatOpen}
        onOpen={() => openPanel("chat")}
        onClose={() => setChatOpen(false)}
        isAiThinking={isAiThinking}
        hasNewMessage={hasNewMessage}
        closePulse={closePulse}
      />
      <ChatWidget
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onClosed={() => setClosePulse((k) => k + 1)}
        initialTab={chatTab}
        onThinkingChange={setIsAiThinking}
        onNewMessage={() => setHasNewMessage(true)}
      />
      </div>
      </SoundProvider>
    </ThemeProvider>
  );
}
