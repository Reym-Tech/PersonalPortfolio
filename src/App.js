import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import jsPDF from "jspdf";
import {
  primaryButton,
  outlineButton,
  primaryButtonSm,
  outlineButtonSm,
  focusLink,
  focusRing,
} from "./elegant/button-styles";
import { ArrowRight, Mail, Close } from "./elegant/icons";
import { EntryTransition } from "./elegant/EntryTransition";
import { ScrollProgress, Parallax, ParallaxImage, CountUp } from "./elegant/scroll";

// Data
const projectsData = [
  {
    id: 1,
    title: "Ancient Crafts",
    description: "A full-stack e-commerce mobile app with a product catalog, shopping cart, and checkout.",
    image: "/images/project1.jpg",
    githubLink: "https://github.com/Reym-Tech/AncientCrafts",
    technologies: ["MySQL", "PHP", "Firebase", "XML", "Java"]
  },
  {
    id: 2,
    title: "BrewTrack",
    description: "A web-based POS and inventory system for cafés that manages sales, tracks stock, and surfaces analytics in one dashboard.",
    image: "/images/project2.jpg",
    githubLink: "https://github.com/Reym-Tech/BrewTrack_Latest",
    websiteLink: "https://bt-hitnotes.vercel.app",
    technologies: ["HTML", "CSS", "JavaScript", "Supabase", "PostgreSQL"]
  },
  {
    id: 3,
    title: "Tagalog Fried Chicken POS",
    description: "A mobile POS system for quick-service restaurants, with real-time order management, inventory tracking, sales reporting, and payment processing.",
    image: "/images/project3.png",
    githubLink: "https://github.com/Reym-Tech/Tagalog_FC_POS",
    apkLink: "https://drive.google.com/file/d/13mClr8Gk6Y4M6r1Q6IrfrKFbeoKLDzKC/view?usp=sharing",
    technologies: ["Dart", "Java", "Makefile", "C++", "CMake"]
  },
];

const certificatesData = [
  {
    id: 1,
    title: "Installing and Configuring Computer Systems",
    issuer: "TESDA",
    date: "2025",
    image: "/images/cert1.jpg",
    link: "https://drive.google.com/file/d/1mU54IfXL0hNFKd-1NgcR4h9MFXryWjFX/view?usp=sharing"
  },
  {
    id: 2,
    title: "Introduction to CSS",
    issuer: "TESDA",
    date: "2025",
    image: "/images/cert2.jpg",
    link: "https://drive.google.com/file/d/119l__TFwt9jKP5acr-ge6GYIh84dzhVw/view?usp=sharing"
  },
  {
    id: 3,
    title: "Maintaining Computer Systems and Networks",
    issuer: "TESDA",
    date: "2025",
    image: "/images/cert3.jpg",
    link: "https://drive.google.com/file/d/1yZhKpraybzeDAxWbKzeh2RekgFgPFdBr/view?usp=sharing"
  },
  {
    id: 4,
    title: "Setting Up Computer Networks",
    issuer: "TESDA",
    date: "2025",
    image: "/images/cert4.jpg",
    link: "https://drive.google.com/file/d/10IlKvK9qg2_6G0vcGf2zy90wZaRSrT7i/view?usp=sharing"
  },
  {
    id: 5,
    title: "Setting Up Computer Servers",
    issuer: "TESDA",
    date: "2025",
    image: "/images/cert5.jpg",
    link: "https://drive.google.com/file/d/1d-8QAy4vShI5-yUt6ZuohGBGYpDWFoal/view?usp=sharing"
  },
  {
    id: 6,
    title: "Introduction to Java",
    issuer: "SoloLearn",
    date: "2026",
    image: "/images/cert6_introjava.jpg",
    link: "https://drive.google.com/file/d/1cHacDUTs5FLoITVVcRGobnVgwrhmDGSc/view?usp=sharing"
  },
];

const educationData = [
  {
    id: 1,
    title: "BSIT (3rd Year)",
    institution: "University of Mindanao - Digos College",
    period: "2023 - Present",
    description: "Pursuing a degree in Information Technology with a focus on web and mobile development.",
  },
  {
    id: 2,
    title: "Senior High School",
    institution: "Matti National High School",
    period: "2021 - 2023",
    description: "Completed the HUMSS strand, with an emphasis on communication, social sciences, and critical thinking.",
  }
];

const servicesData = [
  {
    id: 1,
    title: "Web Development",
    description: "Full-stack web applications built with React, Node.js, and REST APIs.",
    skills: ["React", "JavaScript", "Tailwind CSS", "REST APIs"]
  },
  {
    id: 2,
    title: "UI/UX Design",
    description: "Responsive, accessible interfaces with smooth animations and intuitive interactions.",
    skills: ["Figma", "Framer Motion", "UI Design", "User Research"]
  },
  {
    id: 3,
    title: "Database Design",
    description: "Database architecture and query optimization for scalable applications.",
    skills: ["MySQL", "PostgreSQL", "Supabase", "Database Design"]
  },
  {
    id: 4,
    title: "Problem Solving",
    description: "An analytical approach to complex problems, delivered through clean, efficient code.",
    skills: ["Debugging", "Algorithm Design", "Code Optimization", "Testing"]
  }
];

const statsData = [
  { label: "Projects Completed", value: "3" },
  { label: "Certificates Earned", value: "6" },
  { label: "Technologies", value: "24+" },
  { label: "Years Coding", value: "3+" }
];

const techStack = [
  {
    category: "Languages & Markup",
    items: ["JavaScript", "TypeScript", "Python", "PHP", "Java", "Dart", "HTML5", "CSS3", "XML"]
  },
  {
    category: "Frameworks & Runtime",
    items: ["React", "React Native", "Expo", "Node.js", "Express", "Tailwind CSS"]
  },
  {
    category: "Databases & Backend",
    items: ["MongoDB", "SQLite", "Supabase", "Firebase"]
  },
  {
    category: "Version Control & CI/CD",
    items: ["Git", "GitHub", "GitHub Actions"]
  },
  {
    category: "Design & Prototyping",
    items: ["Figma", "Framer"]
  }
];

const contactMethods = [
  {
    name: "Gmail",
    handle: "johnremygonzales20@gmail.com",
    caption: "Send me a message",
    href: "mailto:johnremygonzales20@gmail.com",
    icon: "/images/gmail-icon.svg",
    external: false,
    disabled: false,
  },
  {
    name: "GitHub",
    handle: "github.com/Reym-Tech",
    caption: "View my projects",
    href: "https://github.com/Reym-Tech",
    icon: "/images/github-icon.svg",
    external: true,
    disabled: false,
  },
  {
    name: "Facebook",
    handle: "JohnRemyxD",
    caption: "Follow me on Facebook",
    href: "https://www.facebook.com/JohnRemyxD",
    icon: "/images/facebook-icon.svg",
    external: true,
    disabled: false,
  },
  {
    name: "LinkedIn",
    handle: "Coming soon",
    caption: "Connect with me",
    href: "#",
    icon: "/images/linkedin-icon.svg",
    external: false,
    disabled: true,
  },
];

const NAV_LINKS = ["Home", "About", "Projects", "Skills", "Contact"];

const BORDER = "border-[#E5E7EB]";

// Shared presentational helpers ------------------------------------------------

function Eyebrow({ children }) {
  return (
    <p className="font-mono text-sm uppercase tracking-widest text-elegant-text/50">{children}</p>
  );
}

// Scroll-linked drift via Parallax gives every section heading a shared sense of
// depth as it passes through the viewport.
function SectionHeading({ eyebrow, title, description, center = false }) {
  return (
    <Parallax offset={18} className={center ? "text-center" : ""}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-[2rem] font-medium leading-tight tracking-tight md:text-[2.5rem]">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed text-elegant-text/70 ${
            center ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </Parallax>
  );
}

// Google-Drive-style speed dial: a persistent bottom-right button that fans out
// the contact channels on tap. Disabled channels (e.g. "Coming soon") are omitted.
function ContactFab({ methods }) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const items = methods.filter((method) => !method.disabled);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <AnimatePresence>
        {open &&
          items.map((method, index) => (
            <motion.a
              key={method.name}
              href={method.href}
              target={method.external ? "_blank" : undefined}
              rel={method.external ? "noopener noreferrer" : undefined}
              aria-label={`${method.name} — ${method.caption}`}
              onClick={() => setOpen(false)}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.85 }}
              transition={{ duration: 0.18, delay: reduceMotion ? 0 : index * 0.04, ease: "easeOut" }}
              className={`group flex items-center gap-3 ${focusLink}`}
            >
              <span className={`rounded-full border ${BORDER} bg-elegant-surface px-3 py-1.5 text-sm font-medium text-elegant-text shadow-sm`}>
                {method.name}
              </span>
              <span className={`inline-flex h-12 w-12 flex-none items-center justify-center rounded-full border ${BORDER} bg-elegant-surface shadow-md transition-colors group-hover:bg-[#F9FAFB]`}>
                <img src={method.icon} alt="" aria-hidden="true" className="h-5 w-5" />
              </span>
            </motion.a>
          ))}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? "Close contact menu" : "Open contact menu"}
        whileTap={reduceMotion ? undefined : { scale: 0.92 }}
        className={`inline-flex h-14 w-14 items-center justify-center rounded-full bg-elegant-text text-white shadow-lg transition-colors hover:bg-elegant-text/90 active:bg-elegant-text/80 ${focusRing}`}
      >
        <motion.span
          animate={reduceMotion ? undefined : { rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          aria-hidden="true"
        >
          {open ? <Close /> : <Mail />}
        </motion.span>
      </motion.button>
    </div>
  );
}

function PortfolioContent() {
  const reduceMotion = useReducedMotion();
  const [expandCerts, setExpandCerts] = useState(false);
  const [photoLikes, setPhotoLikes] = useState(() => Number(localStorage.getItem("photoLikes")) || 0);
  const [photoLiked, setPhotoLiked] = useState(() => localStorage.getItem("photoLiked") === "true");
  const [loopHeartCount, setLoopHeartCount] = useState(22);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  // Subtle scroll-reveal preset; honors prefers-reduced-motion.
  const rise = (delay = 0) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5, delay, ease: "easeOut" },
  });

  // Hero entrance is gated on the entry transition so the section assembles
  // exactly as the cinematic overlay lifts — a seamless handoff into the Hero.
  const heroReveal = (delay = 0) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: introDone ? { opacity: 1, y: 0 } : reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });

  // Persist photo likes
  useEffect(() => {
    try {
      localStorage.setItem("photoLikes", String(photoLikes));
      localStorage.setItem("photoLiked", String(photoLiked));
    } catch (e) {}
  }, [photoLikes, photoLiked]);

  // Looping heart counter animation
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

  const handleViewProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDownloadCV = () => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Professional color scheme
  const colors = {
    primary: [0, 0, 0],
    accent: [50, 50, 50],
    dark: [20, 20, 20],
    text: [60, 60, 60],
    lightText: [120, 120, 120],
    divider: [180, 180, 180]
  };

  // Helper: Add section header with underline
  const addSectionHeader = (text) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...colors.primary);
    doc.text(text, margin, yPosition);

    // Underline with accent color
    yPosition += 2;
    doc.setDrawColor(...colors.accent);
    doc.setLineWidth(0.8);
    doc.line(margin, yPosition, margin + 50, yPosition);
    yPosition += 8;
  };

  // Helper: Add wrapped text with proper spacing
  const addText = (text, fontSize = 10, isBold = false, indent = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont(undefined, isBold ? "bold" : "normal");
    doc.setTextColor(...colors.text);

    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line) => {
      if (yPosition > pageHeight - 15) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin + indent, yPosition);
      yPosition += fontSize * 0.4;
    });
  };

  // Helper: Add bullet point
  const addBullet = (text, fontSize = 9.5) => {
    if (yPosition > pageHeight - 15) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(fontSize);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...colors.text);

    // Bullet point
    doc.setFillColor(...colors.accent);
    doc.circle(margin + 2, yPosition - 1.5, 0.8, 'F');

    const lines = doc.splitTextToSize(text, contentWidth - 8);
    lines.forEach((line, index) => {
      doc.text(line, margin + 6, yPosition);
      yPosition += fontSize * 0.42;
    });
  };

  // Helper: Add spacing
  const addSpace = (space = 4) => {
    yPosition += space;
  };

  // ==================== HEADER ====================
  doc.setFontSize(26);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...colors.primary);  
  doc.text("REM", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 7;

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...colors.accent);
  doc.text("Full-Stack Web Developer • BSIT Student", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  // Contact bar with icons effect
  doc.setFontSize(9);
  doc.setTextColor(...colors.lightText);
  const contactInfo = "johnremygonzales20@gmail.com  •  github.com/Reym-Tech  •  facebook.com/JohnRemyxD";
  doc.text(contactInfo, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  // Divider line
  doc.setDrawColor(...colors.divider);
  doc.setLineWidth(0.3);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // ==================== PROFESSIONAL PROFILE ====================
  addSectionHeader("PROFESSIONAL PROFILE");
  addText(
    "Information Technology student with 3+ years of hands-on coding experience in full-stack web development and UI/UX design. I build responsive, user-centered applications with clean architecture and reliable backends, and I'm committed to continuous learning.",
    10
  );
  addSpace(6);

  // ==================== TECHNICAL SKILLS ====================
  addSectionHeader("TECHNICAL SKILLS");

  const skillCategories = [
    { label: "Languages & Frameworks", skills: "JavaScript (ES6+), PHP, Java, HTML5/CSS3, React.js, Node.js" },
    { label: "Frontend Technologies", skills: "React, Tailwind CSS, Framer Motion, Responsive Design, Component Architecture" },
    { label: "Backend & APIs", skills: "REST API Development, Express.js, Database Design, Server Configuration" },
    { label: "Databases & Tools", skills: "MySQL, PostgreSQL, Firebase, Supabase, Git/GitHub, VS Code, Figma" }
  ];

  skillCategories.forEach((category) => {
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...colors.dark);
    doc.text(category.label + ":", margin, yPosition);

    doc.setFont(undefined, "normal");
    doc.setTextColor(...colors.text);
    const lines = doc.splitTextToSize(category.skills, contentWidth - 65);
    lines.forEach((line, index) => {
      doc.text(line, margin + 65, yPosition + (index * 4));
    });
    yPosition += 4 + (lines.length - 1) * 4 + 3;
  });
  addSpace(4);

  // ==================== PROJECTS ====================
  addSectionHeader("KEY PROJECTS & EXPERIENCE");

  // Project 1
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...colors.dark);
  doc.text("BrewTrack", margin, yPosition);

  doc.setFontSize(9);
  doc.setFont(undefined, "italic");
  doc.setTextColor(...colors.accent);
  doc.text("Web-Based POS & Inventory Management System", margin + 30, yPosition);
  yPosition += 5.5;

  addBullet("Built a point-of-sale system with real-time inventory tracking and a sales analytics dashboard");
  addBullet("Implemented a responsive UI that works across devices for a streamlined checkout flow");
  addBullet("Tech Stack: HTML5, CSS3, JavaScript, Supabase, PostgreSQL");
  addBullet("Live Demo: bt-hitnotes.vercel.app");
  addSpace(5);

  // Project 2
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...colors.dark);
  doc.text("Ancient Crafts", margin, yPosition);

  doc.setFontSize(9);
  doc.setFont(undefined, "italic");
  doc.setTextColor(...colors.accent);
  doc.text("Mobile E-Commerce Application", margin + 36, yPosition);
  yPosition += 5.5;

  addBullet("Built a mobile e-commerce app with product catalog, shopping cart, and secure checkout");
  addBullet("Integrated Firebase authentication and real-time database for live data synchronization");
  addBullet("Tech Stack: Java (Android), PHP, MySQL, Firebase, XML");
  addSpace(6);

  // ==================== EDUCATION ====================
  addSectionHeader("EDUCATION");

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...colors.dark);
  doc.text("Bachelor of Science in Information Technology", margin, yPosition);
  yPosition += 5;

  doc.setFontSize(9.5);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...colors.text);
  doc.text("University of Mindanao - Digos College", margin, yPosition);
  yPosition += 4.5;

  doc.setFontSize(9);
  doc.setTextColor(...colors.lightText);
  doc.text("2023 - Present  •  Expected Graduation: 2026", margin, yPosition);
  yPosition += 8;

  // ==================== CERTIFICATIONS ====================
  addSectionHeader("PROFESSIONAL CERTIFICATIONS");

  const certifications = [
    "Installing and Configuring Computer Systems - TESDA National Certification (2025)",
    "Introduction to CSS - TESDA (2025)",
    "Maintaining Computer Systems and Networks - TESDA (2025)",
    "Setting Up Computer Networks - TESDA (2025)",
    "Setting Up Computer Servers - TESDA (2025)"
  ];

  certifications.forEach((cert) => {
    addBullet(cert, 9.5);
  });
  addSpace(4);

  // ==================== CORE COMPETENCIES ====================
  addSectionHeader("CORE COMPETENCIES");

  const competencies = [
    ["Full-Stack Web Development", "Problem Solving & Debugging"],
    ["UI/UX Design & Prototyping", "Responsive Web Design"],
    ["Database Architecture", "RESTful API Development"],
    ["Version Control (Git)", "Agile Methodologies"]
  ];

  competencies.forEach((row) => {
    doc.setFontSize(9.5);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...colors.text);

    // Left column
    doc.setFillColor(...colors.accent);
    doc.circle(margin + 2, yPosition - 1.5, 0.8, 'F');
    doc.text(row[0], margin + 6, yPosition);

    // Right column
    if (row[1]) {
      doc.circle(pageWidth / 2 + 5, yPosition - 1.5, 0.8, 'F');
      doc.text(row[1], pageWidth / 2 + 9, yPosition);
    }

    yPosition += 5;
  });

  // ==================== FOOTER ====================
  doc.setFontSize(8);
  doc.setTextColor(...colors.lightText);
  doc.setFont(undefined, "italic");
  const footerText = `Generated ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • github.com/Reym-Tech`;
  doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });

  // Save PDF
  doc.save("John_Remy_Gonzales_Resume.pdf");
};

  return (
    <div className="min-h-screen scroll-smooth bg-elegant-surface font-display text-elegant-text antialiased">
      {!introDone && <EntryTransition onComplete={() => setIntroDone(true)} />}

      <ScrollProgress />

      {/* NAVIGATION */}
      <nav
        aria-label="Primary"
        className={`sticky top-0 z-30 border-b ${BORDER} bg-elegant-surface/80 backdrop-blur`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
          <a href="#home" className={`flex items-center gap-3 ${focusLink}`}>
            <img
              src="/images/AppIcon.png"
              alt="REM Logo"
              className="h-10 w-10 object-contain"
            />
          </a>

          <div className="flex items-center gap-6">
            <ul className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className={`text-sm text-elegant-text/70 transition-colors hover:text-elegant-text ${focusLink}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] border ${BORDER} text-elegant-text hover:bg-[#F9FAFB] md:hidden ${focusLink}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-elegant-text/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", damping: 24, stiffness: 280 }}
        className={`fixed left-0 top-0 z-50 h-full w-64 border-r ${BORDER} bg-elegant-surface p-6 md:hidden`}
        aria-label="Mobile menu"
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="font-mono text-sm uppercase tracking-widest text-elegant-text/50">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-[8px] border ${BORDER} hover:bg-[#F9FAFB] ${focusLink}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                onClick={() => setSidebarOpen(false)}
                className={`block rounded-[8px] px-4 py-3 text-base text-elegant-text/80 transition-colors hover:bg-[#F9FAFB] hover:text-elegant-text ${focusLink}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            setSidebarOpen(false);
            handleDownloadCV();
          }}
          className={`${primaryButton} mt-6 w-full`}
        >
          Download Resume
        </button>
      </motion.aside>

      {/* HERO */}
      <section id="home" className="scroll-mt-20 tile-bg">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-8">
          <div className={`relative overflow-hidden rounded-[8px] border ${BORDER} bg-elegant-surface p-8 md:p-12`}>
            <span
              aria-hidden="true"
              className="absolute top-6 font-mono text-sm uppercase tracking-widest text-elegant-text/30"
            >
              Portfolio
            </span>

            <div className="grid items-center gap-12 md:grid-cols-2">
              <motion.div {...heroReveal()}>
                <p className="flex items-center gap-2 text-sm text-elegant-text/70">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-elegant-success" />
                  Available for work
                </p>

                <h1 className="mt-6 text-[2rem] font-medium leading-tight tracking-tight md:text-[2.5rem]">
                  John Remy C. Gonzales
                </h1>

                <p className="mt-4 text-base text-elegant-text/70">
                  BSIT 3rd Year • <em className="font-light italic text-elegant-primary-400">UM Digos College</em>
                </p>

                <p className="mt-6 max-w-md text-base leading-relaxed text-elegant-text/70">
                  A developer crafting responsive, accessible web experiences with
                  clean, modern design.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button onClick={handleViewProjects} className={primaryButton}>
                    View My Work
                    <ArrowRight />
                  </button>
                  <button onClick={handleDownloadCV} className={outlineButton}>
                    Download Resume
                  </button>
                </div>
              </motion.div>

              <motion.div {...heroReveal(0.12)} className="flex justify-center md:justify-end">
                <Parallax offset={24}>
                  <img
                    src="/images/profile--.png"
                    alt="John Remy Gonzales"
                    loading="lazy"
                    className={`w-64 rounded-[8px] border ${BORDER} object-cover`}
                  />
                </Parallax>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="scroll-mt-20">
        <div className="mx-auto max-w-5xl px-6 py-24 md:px-8">
          <motion.div {...rise()}>
            <SectionHeading eyebrow="About" title="About Me" />
          </motion.div>

          <div className="mt-12 grid items-start gap-12 md:grid-cols-2">
            <motion.div {...rise(0.05)} className="space-y-6">
              <p className="text-base leading-relaxed text-elegant-text/80">
                I'm <span className="font-medium text-elegant-text">John Remy Gonzales</span>, a
                BSIT student at the University of Mindanao Digos College. My journey in tech began
                with curiosity about how things work, which grew into a passion for building
                functional, well-designed digital experiences.
              </p>
              <p className="text-base leading-relaxed text-elegant-text/80">
                I specialize in{" "}
                <span className="font-medium text-elegant-text">full-stack web development</span>,
                building responsive frontends with React and Tailwind CSS and reliable
                backends with Node.js and REST APIs. I care most about{" "}
                <span className="font-medium text-elegant-text">
                  refined interfaces with smooth interactions
                </span>{" "}
                that are a pleasure to use.
              </p>
              <p className="text-base leading-relaxed text-elegant-text/80">
                Beyond coding, I'm deeply interested in{" "}
                <span className="font-medium text-elegant-text">UI/UX design</span>,{" "}
                <span className="font-medium text-elegant-text">problem-solving</span>, and
                automation. I'm a continuous learner, always exploring new tools and technologies.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { label: "Full-Stack Developer"},
                  { label: "Can cook rice in under a minute"},
                  { label: "UI/UX Enthusiast"},
                  { label: "Problem Solver"},
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
                    "Creating interactive web experiences",
                    "Designing intuitive user interfaces",
                    "Writing clean, efficient code",
                    "Solving complex problems creatively",
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

      {/* STATS */}
      <section className={`border-y ${BORDER} bg-[#FAFAFA] tile-bg-muted`}>
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                {...rise(index * 0.05)}
                className={`rounded-[8px] border ${BORDER} bg-elegant-surface p-6 text-center`}
              >
                <CountUp value={stat.value} className="text-[2rem] font-medium text-elegant-primary" />
                <p className="mt-2 font-mono text-sm uppercase tracking-widest text-elegant-text/50">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-8">
          <motion.div {...rise()}>
            <SectionHeading
              eyebrow="Selected work"
              title="Featured Projects"
              description="Recent projects spanning web and mobile development."
            />
          </motion.div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {projectsData.map((project, idx) => (
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

      {/* SKILLS */}
      <section id="skills" className={`scroll-mt-20 border-y ${BORDER} bg-[#FAFAFA] tile-bg-muted`}>
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-8">
          <motion.div {...rise()}>
            <SectionHeading
              eyebrow="Capabilities"
              title="Tech Stack & Tools"
              description="The languages, frameworks, and tools I work with across the stack."
              center
            />
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {techStack.map((group, index) => (
              <motion.div
                key={group.category}
                {...rise(index * 0.05)}
                className={`rounded-[8px] border ${BORDER} bg-elegant-surface p-6 transition-colors hover:bg-[#F9FAFB]`}
              >
                <h3 className="font-mono text-sm uppercase tracking-widest text-elegant-text/50">
                  {group.category}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className={`rounded-[4px] border ${BORDER} px-3 py-1 font-mono text-sm text-elegant-text/70`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-8">
          <motion.div {...rise()}>
            <SectionHeading eyebrow="Services" title="What I Offer" center />
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {servicesData.map((service, index) => (
              <motion.div
                key={service.id}
                {...rise(index * 0.05)}
                className={`rounded-[8px] border ${BORDER} bg-elegant-surface p-8 transition-colors hover:bg-[#F9FAFB]`}
              >
                <span aria-hidden="true" className="font-mono text-sm text-elegant-text/40">
                  {String(service.id).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-medium">{service.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-elegant-text/70">
                  {service.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`rounded-[4px] border ${BORDER} px-3 py-1 font-mono text-sm text-elegant-text/70`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section className={`border-y ${BORDER} bg-[#FAFAFA] tile-bg-muted`}>
        <div className="mx-auto max-w-4xl px-6 py-24 md:px-8">
          <motion.div {...rise()}>
            <SectionHeading eyebrow="Background" title="Education & Experience" center />
          </motion.div>

          <div className="mt-12 space-y-6">
            {educationData.map((item, index) => (
              <motion.div
                key={item.id}
                {...rise(index * 0.05)}
                className={`rounded-[8px] border ${BORDER} bg-elegant-surface p-6`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-medium text-elegant-primary">{item.title}</h3>
                  <span className="font-mono text-sm text-elegant-text/50">{item.period}</span>
                </div>
                <p className="mt-2 text-base font-medium">{item.institution}</p>
                <p className="mt-2 text-base leading-relaxed text-elegant-text/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATES */}
      <section id="certificates" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-8">
          <motion.div {...rise()}>
            <SectionHeading
              eyebrow="Credentials"
              title="Certifications"
              description="Professional certifications I've earned."
            />
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {certificatesData.slice(0, expandCerts ? certificatesData.length : 3).map((cert, index) => (
              <motion.button
                key={cert.id}
                {...rise(index * 0.05)}
                onClick={() => window.open(cert.link, "_blank")}
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

          {certificatesData.length > 3 && (
            <div className="mt-12 flex justify-center">
              <button onClick={() => setExpandCerts(!expandCerts)} className={outlineButton}>
                {expandCerts ? "See less" : "See more"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
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

      {/* FOOTER */}
      <footer className={`border-t ${BORDER}`}>
        <div className="mx-auto flex w-full max-w-6xl justify-center items-center gap-6 px-6 py-12">
          <div className="text-center">
            <p className="text-sm text-elegant-text/60">
              © 2026 John Remy Gonzales • BSIT • University of Mindanao Digos College
            </p>
            <p className="mt-1 text-sm text-elegant-text/40">
              Built with React, Tailwind & Framer Motion.
            </p>
          </div>
        </div>
      </footer>

      <ContactFab methods={contactMethods} />
    </div>
  );
}

export default function Portfolio() {
  return <PortfolioContent />;
}
