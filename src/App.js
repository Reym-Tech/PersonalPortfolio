import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeProvider, useTheme } from "./ThemeContext";
import jsPDF from "jspdf";

// Animation variants for consistent motion
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Data
const projectsData = [
  {
    id: 1,
    title: "Ancient Crafts",
    description: "A full-stack e-commerce mobile application with product catalog, shopping cart, and checkout functionality.",
    image: "/images/project1.jpg",
    githubLink: "https://github.com/Reym-Tech/AncientCrafts",
    technologies: ["MySQL", "PHP", "Firebase", "XML", "Java"]
  },
  {
    id: 2,
    title: "BrewTrack",
    description: "BrewTrack is a simple web-based POS and inventory system for cafés that manages sales, tracks stock, and provides basic analytics in one dashboard.",
    image: "/images/project2.jpg",
    githubLink: "https://github.com/Reym-Tech/BrewTrack",
    websiteLink: "https://bt-hitnotes.vercel.app",
    technologies: ["HTML", "CSS", "JavaScript", "Supabase", "POSTgreSQL"]
  },
  {
    id: 3,
    title: "Tagalog Fried Chicken POS",
    description: "A comprehensive mobile POS system designed for restaurant operations. Features real-time order management, inventory tracking, sales reporting, and payment processing optimized for quick-service restaurants.",
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
];

const languagesData = [
  { name: "JavaScript", icon: "🟨", color: "from-yellow-400 to-orange-500" },
  { name: "React", icon: "⚛️", color: "from-blue-400 to-cyan-500" },
  { name: "PHP", icon: "🐘", color: "from-purple-400 to-pink-500" },
  { name: "Java", icon: "☕", color: "from-red-400 to-orange-500" },
  { name: "HTML/CSS", icon: "🎨", color: "from-pink-400 to-purple-500" },
  { name: "Node.js", icon: "🟢", color: "from-green-400 to-cyan-500" },
  { name: "MySQL", icon: "🗄️", color: "from-blue-500 to-purple-500" },
  { name: "Firebase", icon: "🔥", color: "from-orange-400 to-red-500" }
];

const educationData = [
  {
    id: 1,
    title: "BSIT (3rd Year)",
    institution: "University of Mindanao - Digos College",
    period: "2023 - Present",
    description: "Pursuing a degree in Information Technology with focus on web and mobile development.",
    icon: "🎓"
  },
  {
    id: 2,
    title: "Senior High School",
    institution: "Matti National High School",
    period: "2021 - 2023",
    description: "HUMSS emphasizes understanding people, society, and effective communication.",
    icon: "📚"
  }
];

const servicesData = [
  {
    id: 1,
    title: "Web Development",
    description: "Full-stack web applications using React, Node.js, and modern frameworks",
    icon: "🌐",
    skills: ["React", "JavaScript", "Tailwind CSS", "REST APIs"]
  },
  {
    id: 2,
    title: "UI/UX Design",
    description: "Beautiful, responsive interfaces with smooth animations and intuitive user experience",
    icon: "🎨",
    skills: ["Figma", "Framer Motion", "UI Design", "User Research"]
  },
  {
    id: 3,
    title: "Database Design",
    description: "Robust database architecture and optimization for scalable applications",
    icon: "🗄️",
    skills: ["MySQL", "PostgreSQL", "Supabase", "Database Design"]
  },
  { 
    id: 4,
    title: "Problem Solving",
    description: "Analytical approach to complex problems with clean, efficient code solutions",
    icon: "⚡",
    skills: ["Debugging", "Algorithm Design", "Code Optimization", "Testing"]
  }
];

const statsData = [
  { label: "Projects Completed", value: "3", icon: "🚀" },
  { label: "Certificates Earned", value: "5", icon: "🏆" },
  { label: "Technologies", value: "8+", icon: "⚙️" },
  { label: "Years Coding", value: "3+", icon: "💻" }
];

const socialLinks = [
  { name: "GitHub", url: "https://github.com/Reym-Tech", icon: "/images/github-icon.svg" },
  { name: "LinkedIn", url: "#", icon: "/images/linkedin-icon.svg" },
  { name: "Gmail", url: "mailto:johnremygonzales20@gmail.com", icon: "/images/gmail-icon.svg" },
  { name: "Facebook", url: "https://www.facebook.com/JohnRemyxD", icon: "/images/facebook-icon.svg" }
];

const languageSkillsMap = {
  "JavaScript": [
    { name: "JavaScript", percentage: 90 },
    { name: "REST APIs", percentage: 82 },
    { name: "Problem Solving", percentage: 88 }
  ],
  "React": [
    { name: "React", percentage: 85 },
    { name: "UI/UX Design", percentage: 80 },
    { name: "Tailwind CSS", percentage: 88 }
  ],
  "PHP": [
    { name: "REST APIs", percentage: 82 },
    { name: "Problem Solving", percentage: 88 },
    { name: "Node.js", percentage: 75 }
  ],
  "Java": [
    { name: "Problem Solving", percentage: 88 },
    { name: "REST APIs", percentage: 82 },
    { name: "Node.js", percentage: 75 }
  ],
  "HTML/CSS": [
    { name: "HTML/CSS", percentage: 95 },
    { name: "UI/UX Design", percentage: 80 },
    { name: "Tailwind CSS", percentage: 88 }
  ],
  "Node.js": [
    { name: "Node.js", percentage: 75 },
    { name: "REST APIs", percentage: 82 },
    { name: "JavaScript", percentage: 90 }
  ],
  "MySQL": [
    { name: "Problem Solving", percentage: 88 },
    { name: "REST APIs", percentage: 82 },
    { name: "Node.js", percentage: 75 }
  ],
  "Firebase": [
    { name: "React", percentage: 85 },
    { name: "JavaScript", percentage: 90 },
    { name: "Problem Solving", percentage: 88 }
  ]
};

function PortfolioContent() {
  const theme = useTheme();
  const [currentLang, setCurrentLang] = useState(0);
  const [expandCerts, setExpandCerts] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [photoLikes, setPhotoLikes] = useState(() => Number(localStorage.getItem("photoLikes")) || 0);
  const [photoLiked, setPhotoLiked] = useState(() => localStorage.getItem("photoLiked") === "true");
  const [loopHeartCount, setLoopHeartCount] = useState(22);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-play language carousel
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentLang((prev) => (prev + 1) % languagesData.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

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

  // Event handlers
  const handleDotClick = (index) => {
    setCurrentLang(index);
    setIsAutoPlay(false);
  };

  const handleToggleLike = () => {
    if (photoLiked) {
      setPhotoLiked(false);
      setPhotoLikes((p) => Math.max(0, p - 1));
    } else {
      setPhotoLiked(true);
      setPhotoLikes((p) => p + 1);
    }
  };

  const handleAutoPlayToggle = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // Drag handlers for language carousel
  const handleMouseDown = (e) => {
    setDragStart(e.clientX);
    setIsDragging(true);
    setIsAutoPlay(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || dragStart === null) return;
    const diff = e.clientX - dragStart;
    setDragOffset(diff);
  };

  const handleMouseUp = (e) => {
    if (dragStart === null) return;
    const diff = e.clientX - dragStart;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setCurrentLang((prev) => (prev - 1 + languagesData.length) % languagesData.length);
      } else {
        setCurrentLang((prev) => (prev + 1) % languagesData.length);
      }
    }

    setDragStart(null);
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setDragStart(e.touches[0].clientX);
    setIsDragging(true);
    setIsAutoPlay(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || dragStart === null) return;
    const diff = e.touches[0].clientX - dragStart;
    setDragOffset(diff);
  };

  const handleTouchEnd = (e) => {
    if (dragStart === null) return;
    const diff = e.changedTouches[0].clientX - dragStart;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setCurrentLang((prev) => (prev - 1 + languagesData.length) % languagesData.length);
      } else {
        setCurrentLang((prev) => (prev + 1) % languagesData.length);
      }
    }

    setDragStart(null);
    setDragOffset(0);
    setIsDragging(false);
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
    let yPosition = 15;
    const margin = 12;
    const lineHeight = 5.5;
    const textWidth = pageWidth - 2 * margin;

    // Set colors
    const primaryColor = [59, 130, 246]; // Blue-500
    const secondaryColor = [15, 23, 42]; // Primary-900
    const textColor = [51, 65, 85]; // Primary-600

    // Helper function for text with automatic wrapping
    const addWrappedText = (text, fontSize, isBold = false, color = textColor) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      if (isBold) {
        doc.setFont(undefined, "bold");
      } else {
        doc.setFont(undefined, "normal");
      }
      const lines = doc.splitTextToSize(text, textWidth);
      lines.forEach((line) => {
        if (yPosition > pageHeight - 10) {
          doc.addPage();
          yPosition = 15;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight * 0.7;
      });
      yPosition += 2;
    };

    // Title
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, "bold");
    doc.text("JOHN REMY GONZALES", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;

    doc.setFontSize(12);
    doc.setTextColor(...secondaryColor);
    doc.setFont(undefined, "normal");
    doc.text("BSIT 3rd Year Student & Web Developer", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;

    // Contact Info
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text("Email: johnremygonzales20@gmail.com | GitHub: github.com/Reym-Tech | Facebook: facebook.com/JohnRemyxD", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    // Divider
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Professional Profile Section
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, "bold");
    doc.text("PROFESSIONAL PROFILE", margin, yPosition);
    yPosition += 7;

    const profileText =
      "Passionate and skilled Information Technology student with 3+ years of coding experience, specialized in full-stack web development and UI/UX design. Proven track record of delivering high-quality projects with responsive interfaces and robust backend systems.";
    addWrappedText(profileText, 10);
    yPosition += 3;

    // Core Competencies
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, "bold");
    doc.text("CORE COMPETENCIES", margin, yPosition);
    yPosition += 7;

    const competencies = [
      "Languages & Frameworks: JavaScript, PHP, Java, HTML/CSS, React, Node.js",
      "Frontend: React, Tailwind CSS, Framer Motion, Responsive Design, UI/UX",
      "Backend: REST APIs, Express.js, Database Design, Server Configuration",
      "Databases & Tools: MySQL, PostgreSQL, Firebase, Supabase, Git, VS Code, Figma",
    ];

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    competencies.forEach((comp) => {
      addWrappedText(comp, 10);
    });
    yPosition += 2;

    // Projects
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, "bold");
    doc.text("PROFESSIONAL EXPERIENCE & PROJECTS", margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont(undefined, "bold");
    doc.text("ANCIENT CRAFTS - Full-Stack E-Commerce Application", margin, yPosition);
    yPosition += 6;
    doc.setFont(undefined, "normal");
    addWrappedText(
      "• Developed comprehensive mobile e-commerce platform with product catalog, shopping cart, and checkout\n• Tech Stack: MySQL, PHP, Firebase, XML, Java",
      9
    );

    doc.setFont(undefined, "bold");
    doc.text("BREWTRACK - Web-Based POS & Inventory System", margin, yPosition);
    yPosition += 6;
    doc.setFont(undefined, "normal");
    addWrappedText(
      "• Created intuitive point-of-sale system with real-time inventory tracking and analytics\n• Tech Stack: HTML, CSS, JavaScript, Supabase, PostgreSQL | Live: bt-hitnotes.vercel.app",
      9
    );

    // Education
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, "bold");
    doc.text("EDUCATION", margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont(undefined, "bold");
    doc.text("Bachelor of Science in Information Technology (BSIT)", margin, yPosition);
    yPosition += 5;
    doc.setFont(undefined, "normal");
    addWrappedText("University of Mindanao - Digos College (2023 - Present) | Expected Graduation: 2026", 9);

    // Certifications
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, "bold");
    doc.text("PROFESSIONAL CERTIFICATIONS", margin, yPosition);
    yPosition += 7;

    const certifications = [
      "• Installing and Configuring Computer Systems (TESDA, 2025)",
      "• Introduction to CSS (TESDA, 2025)",
      "• Maintaining Computer Systems and Networks (TESDA, 2025)",
      "• Setting Up Computer Networks (TESDA, 2025)",
      "• Setting Up Computer Servers (TESDA, 2025)",
    ];

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    certifications.forEach((cert) => {
      addWrappedText(cert, 9);
    });

    // Skills Summary
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, "bold");
    doc.text("KEY SKILLS", margin, yPosition);
    yPosition += 7;

    const skills = [
      "• Full-Stack Web Development         • Problem Solving & Debugging",
      "• UI/UX Design & Animations          • Responsive Web Design",
      "• Database Architecture & Design     • REST API Development",
    ];

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    skills.forEach((skill) => {
      addWrappedText(skill, 9);
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated: January 2026 | Portfolio: john-remy-gonzales-portfolio`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );

    // Save PDF
    doc.save("John_Remy_Gonzales_Resume.pdf");
  };

  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} ${theme.textColor} overflow-x-hidden transition-colors duration-500`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Mobile Hamburger Button */}
      <motion.button
        {...fadeInUp}
        onClick={() => setSidebarOpen(true)}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className={`fixed top-6 left-6 md:hidden ${theme.cardBackdrop} ${theme.navbarBg} rounded-lg p-3 ${theme.cardShadow} z-50 border ${theme.navbarBorder} text-xl ${theme.textColor} hover:${theme.cardHoverBg} transition-all duration-300`}
      >
        ☰
      </motion.button>

      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80, delay: 0.2 }}
        className={`fixed top-8 left-1/2 -translate-x-1/2 ${theme.cardBackdrop} ${theme.navbarBg} rounded-xl px-10 py-3 hidden md:flex items-center justify-center gap-10 ${theme.cardShadow} z-50 border ${theme.navbarBorder} transition-all duration-300`}
      >
        {["Home", "About", "Projects", "Skills", "Contact"].map((item, idx) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase()}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.05, duration: 0.4 }}
            className={`text-sm font-medium transition-colors duration-300 ${theme.secondaryText} ${theme.accentColor} hover:${theme.accentColor}`}
          >
            {item}
          </motion.a>
        ))}
        <motion.div className="w-px h-6 bg-primary-400/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
        <motion.button
          onClick={theme.toggleTheme}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, rotate: -30 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.65, duration: 0.4, type: "spring", stiffness: 150 }}
          className={`text-lg transition-transform ${theme.accentColor}`}
          title={theme.isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme.isDark ? "☀️" : "🌙"}
        </motion.button>
      </motion.nav>

      {/* Mobile Theme Toggle */}
      <motion.button
        {...fadeInUp}
        onClick={theme.toggleTheme}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className={`fixed top-6 right-6 md:hidden ${theme.cardBackdrop} ${theme.navbarBg} rounded-lg p-3 ${theme.cardShadow} z-50 border ${theme.navbarBorder} text-xl ${theme.accentColor} hover:${theme.cardHoverBg} transition-all duration-300`}
        title={theme.isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme.isDark ? "☀️" : "🌙"}
      </motion.button>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={`fixed top-0 left-0 h-full w-64 ${theme.cardBg} z-50 md:hidden ${theme.cardShadow} ${theme.cardBackdrop}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <span className={`text-xl font-bold bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>Menu</span>
            <motion.button
              onClick={() => setSidebarOpen(false)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
              className={`text-2xl ${theme.textColor}`}
            >
              ✕
            </motion.button>
          </div>
          <div className="flex flex-col gap-3">
            {["Home", "About", "Projects", "Skills", "Contact"].map((item, idx) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setSidebarOpen(false)}
                whileHover={{ x: 8 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`text-base py-3 px-4 rounded-lg transition-colors font-medium ${theme.secondaryText} ${theme.hoverEffect}`}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 md:pt-20 md:pb-0">
        <motion.div
          {...scaleIn}
          transition={{ duration: 0.7, delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
          className={`relative ${theme.cardBg} ${theme.cardBackdrop} rounded-3xl p-12 md:p-20 max-w-5xl w-full mx-4 ${theme.cardShadow} border ${theme.cardBorder} transition-all duration-500`}
        >
          {/* Subtle background glow */}
          <motion.div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${theme.accentGradient} opacity-5 blur-2xl transition-colors duration-500`}
            animate={{ opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp} transition={{ duration: 0.8, delay: 0.4 }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="inline-block mb-6"
              >
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${theme.isDark ? `bg-accent-400/20 ${theme.accentColor} border border-accent-400/30` : `bg-accent-500/10 text-accent-600 border border-accent-500/30`}`}>
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-lg">✨</motion.span>
                  Welcome to my portfolio
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight"
              >
                John Remy{" "}
                <motion.span 
                  className={`bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}
                  initial={{ backgroundPosition: "0%" }}
                  animate={{ backgroundPosition: "100%" }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                >
                  Gonzales
                </motion.span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                className={`mt-4 text-lg ${theme.secondaryText} leading-relaxed`}
              >
                BSIT 3rd Year • University of Mindanao Digos College
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                className={`mt-6 text-lg ${theme.secondaryText} leading-relaxed max-w-md`}
              >
                A passionate developer crafting beautiful, responsive web experiences with modern technologies and clean design.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.7 }}
                className="mt-10 flex gap-4 flex-wrap"
              >
                <motion.button
                  onClick={handleViewProjects}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`px-8 py-3 rounded-xl bg-gradient-to-r ${theme.accentGradient} text-white font-semibold ${theme.cardShadow} transition-all duration-300 hover:shadow-lg`}
                >
                  View My Work
                </motion.button>
                
                <motion.button
                  onClick={handleDownloadCV}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`px-8 py-3 rounded-xl border-2 ${theme.cardBorder} ${theme.cardHoverBg} font-semibold transition-all duration-300`}
                >
                  Download Resume
                </motion.button>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center"
            >
              <div className="relative">
                <img
                  src="/images/profile--.png"
                  alt="profile"
                  className={`relative w-64 h-100 object-cover rounded-3xl border-4 ${theme.cardBorder} ${theme.cardShadow}`}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CERTIFICATES SECTION */}
      <section id="certificates" className="py-32 max-w-6xl mx-auto px-10">
        <motion.div {...fadeInUp} className="mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Certifications</h2>
          <motion.div
            className={`h-1 w-20 rounded-full bg-gradient-to-r ${theme.accentGradient}`}
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          <p className={`mt-4 text-lg ${theme.secondaryText}`}>Professional certifications and achievements</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {certificatesData.slice(0, expandCerts ? certificatesData.length : 3).map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative ${theme.cardBg} ${theme.cardBackdrop} rounded-2xl p-6 cursor-pointer border ${theme.cardBorder} ${theme.hoverEffect} transition-all duration-300 group overflow-hidden ${theme.cardShadow}`}
              onClick={() => window.open(cert.link, '_blank')}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${theme.accentGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-400`} />
              
              <div className="relative z-10">
                <motion.img
                  src={cert.image}
                  alt={cert.title}
                  className="h-40 w-full object-cover rounded-xl mb-4 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                <h3 className={`text-lg font-semibold ${theme.accentColor} group-hover:${theme.accentColor} transition-colors`}>{cert.title}</h3>
                <p className={`text-sm ${theme.secondaryText} mt-2`}>{cert.issuer} • {cert.date}</p>
                
                <div className={`mt-4 ${theme.accentColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <span className="text-xs font-semibold uppercase tracking-wider">View Certificate</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {certificatesData.length > 3 && (
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="flex justify-center mt-12"
          >
            <motion.button
              onClick={() => setExpandCerts(!expandCerts)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-10 py-3 rounded-xl bg-gradient-to-r ${theme.accentGradient} text-white font-semibold ${theme.cardShadow} hover:shadow-lg transition-all duration-300`}
            >
              {expandCerts ? "See Less" : "See More"}
            </motion.button>
          </motion.div>
        )}
      </section>

      
        {/* ABOUT */}
        <section id="about" className="py-32 bg-gradient-to-b from-transparent via-white/5 to-transparent">
          <div className="max-w-5xl mx-auto px-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Section title */}
              <motion.h2
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-5xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
              >
                About Me
              </motion.h2>

              {/* Main content grid */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Story */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-6"
                >
                  <p className={`text-lg ${theme.secondaryText} leading-relaxed`}>
                    I'm <span className={`font-semibold bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>John Remy Gonzales</span>, a passionate BSIT student at the University of Mindanao Digos College. My journey in tech started with curiosity about how things work, which evolved into a deep passion for building beautiful, functional digital experiences.
                  </p>

                  <p className={`text-lg ${theme.secondaryText} leading-relaxed`}>
                    I specialize in <span className={`font-semibold bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>full-stack web development</span>, crafting everything from responsive frontends using React and Tailwind CSS to robust backends with Node.js and REST APIs. What truly drives me is creating <span className={`font-semibold bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>futuristic interfaces with smooth animations</span> that not only look impressive but provide exceptional user experiences.
                  </p>

                  <p className={`text-lg ${theme.secondaryText} leading-relaxed`}>
                    Beyond coding, I'm deeply interested in <span className={`font-semibold bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>UI/UX design</span>, <span className={`font-semibold bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>problem-solving</span>, and automation. I believe in continuous learning and constantly explore new technologies to stay ahead in this ever-evolving field.
                  </p>

                  {/* Highlight badges */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    {[
                      { label: "Full-Stack Developer", icon: "🚀" },
                      { label: "UI/UX Enthusiast", icon: "🎨" },
                      { label: "Problem Solver", icon: "⚡" }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`flex items-center gap-2 ${theme.cardBg} backdrop-blur-xl rounded-full px-4 py-2 border ${theme.cardBorder} transition-all group cursor-pointer ${theme.hoverEffect}`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className={`text-sm ${theme.smallText} group-hover:text-cyan-300 transition-colors`}>{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Right side - Visual elements */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative"
                >
                  {/* Photo card (square profile with improved animations) */}
                  <div className="mb-6 flex justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      whileHover={{ scale: 1.03, rotate: -1 }}
                      transition={{ delay: 0.25, type: 'spring', stiffness: 120 }}
                      className="relative"
                    >
                      <div className="w-56 h-56 rounded-2xl p-1 mx-auto shadow-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/15">
                        <div className={`rounded-xl overflow-hidden w-full h-full ${theme.cardBg} ${theme.cardBackdrop} ${theme.cardText}`}>
                          <motion.img
                            src="/images/profile3.jpg"
                            alt="Profile"
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.06 }}
                            transition={{ duration: 0.6 }}
                          />
                        </div>
                      </div>

                      <motion.button
                        onClick={handleToggleLike}
                        whileTap={{ scale: 0.96 }}
                        className="absolute -bottom-3 right-0 bg-gradient-to-r from-pink-500/10 to-red-400/8 backdrop-blur rounded-full px-3 py-1 flex items-center gap-3 border border-white/10 hover:scale-105 transform transition"
                      >
                        <div className="relative flex items-center">
                          <motion.span
                            animate={photoLiked ? { scale: [1, 1.35, 1], rotate: [0, -8, 0], opacity: [1, 1, 1] } : { scale: [1, 1.06, 1], rotate: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-2xl"
                          >
                            {photoLiked ? '💖' : '🤍'}
                          </motion.span>

                          <motion.span
                            key={loopHeartCount}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="ml-2 text-sm text-pink-200 font-semibold"
                          >
                            {loopHeartCount}
                          </motion.span>

                          {/* glowing pulse behind the heart */}
                          <motion.div
                            aria-hidden
                            className="absolute -inset-2 rounded-xl pointer-events-none"
                            animate={{ opacity: [0, 0.45, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity }}
                            style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255,120,160,0.14), transparent 30%)' }}
                          />
                        </div>

                      
                      </motion.button>

                      

                      <motion.div
                        aria-hidden
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-400/10 text-cyan-200 text-xs px-3 py-1 rounded-full border border-cyan-300/10"
                      >
                        <span className="font-semibold">John Remy</span>
                      </motion.div>
                    </motion.div>
                  </div>
                  {/* Background decorative elements */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-3xl blur-2xl" />

                  {/* Content card */}
                  <div className={`relative ${theme.cardBg} ${theme.cardBackdrop} rounded-3xl p-8 border ${theme.cardBorder} space-y-6 ${theme.cardText}`}>
                    {/* Passion areas */}
                    <div>
                      <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2"
                      >
                        <span className="text-2xl">💡</span> My Passion
                      </motion.h3>
                      <motion.ul
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4, staggerChildren: 0.1 }}
                      >
                        {[
                          "Creating interactive web experiences",
                          "Designing intuitive user interfaces",
                          "Writing clean, efficient code",
                          "Solving complex problems creatively"
                        ].map((item, index) => (
                          <motion.li
                            key={item}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            className={`flex items-start gap-3 ${theme.smallText}`}
                          >
                            <motion.span
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                              className="text-cyan-400 text-lg mt-1"
                            >
                              ✓
                            </motion.span>
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>

                    {/* Quick stats */}
                    <div className="pt-4 border-t border-white/10">
                      <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2"
                      >
                        <span className="text-2xl">🎯</span> Quick Facts
                      </motion.h3>
                      <div className={`space-y-2 text-sm ${theme.smallText}`}>
                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.55 }}
                        >
                          📍 Based in Philippines
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          🎓 BSIT 3rd Year Student
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.65 }}
                        >
                          💻 2+ Years Coding Experience
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          🏆 5 Certifications Earned
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      {/* LANGUAGES & SKILLS - MERGED SECTION */}
      <section id="skills" className="py-32 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <h2 className="text-center text-4xl font-extrabold mb-16 tracking-tight">Languages, Technologies & Skills</h2>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Main Slideshow Container */}
          <div
            className="relative w-full h-96 flex items-center justify-center overflow-hidden rounded-3xl cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0f172a] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0f172a] to-transparent z-10 pointer-events-none" />

            {/* Drag hint text */}
            {!isDragging && (
              <motion.div
                className={`absolute top-4 right-4 text-xs ${theme.faintText} pointer-events-none`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1 }}
              >
                Drag to browse
              </motion.div>
            )}

            {/* Sliding Container */}
            <motion.div
              className="flex gap-8 px-12"
              animate={{ x: -((currentLang * 320) % (languagesData.length * 320)) + dragOffset }}
              transition={isDragging ? { type: "inertia" } : { duration: 0.8, ease: "easeInOut" }}
              draggable={false}
            >
              {/* First set of cards */}
              {[...languagesData, ...languagesData].map((lang, index) => (
                <motion.div
                  key={index}
                  className={`min-w-max w-72 h-72 bg-gradient-to-br ${lang.color} rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group cursor-pointer`}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Animated background glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-white transition-opacity rounded-3xl" />
                  
                  {/* Icon and Text */}
                  <div className="relative z-10 text-center">
                    <motion.div
                      className="text-7xl mb-6"
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {lang.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">{lang.name}</h3>
                  </div>

                  {/* Card shine effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-white/30"
                    whileHover={{ borderColor: "rgba(255, 255, 255, 0.5)" }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-8 mt-8 px-4 flex-wrap">
            {/* Dot Indicators */}
            <div className="flex gap-3 items-center">
              {languagesData.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`rounded-full transition-all ${currentLang === index ? 'bg-gradient-to-r from-cyan-400 to-purple-500' : (theme.isDark ? 'bg-white/30 hover:bg-white/50' : 'bg-gray-200 hover:bg-gray-300')} ${currentLang === index ? 'w-8' : 'w-3'}`}
                  style={{ height: 6 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={currentLang === index ? { scale: 1.15 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              ))}
            </div>
          </div>

          {/* Autoplay Toggle & Info */}
          <div className="flex items-center justify-center gap-4 mt-8">
              <motion.button
              onClick={handleAutoPlayToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${isAutoPlay ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg' : `${theme.cardBg} ${theme.smallText} border ${theme.cardBorder} ${theme.cardHoverBg}`}`}
            >
              <motion.span
                animate={{ rotate: isAutoPlay ? 360 : 0 }}
                transition={{ duration: 2, repeat: isAutoPlay ? Infinity : 0 }}
              >
                
              </motion.span>
              {isAutoPlay ? "Auto-Playing" : "Paused"}
            </motion.button>

            <span className={`${theme.faintText} text-sm`}>
              {currentLang + 1} / {languagesData.length} • {languagesData[currentLang].name}
            </span>
          </div>
        </div>

        {/* RELATED SKILLS SECTION */}
        <motion.div
          layout
          className="mt-16 max-w-6xl mx-auto px-10"
          key={currentLang}
        >
          {/* Language Name & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative bg-gradient-to-r ${languagesData[currentLang].color} rounded-3xl p-8 mb-12 shadow-2xl overflow-hidden`}
          >
            {/* Background glow */}
            <div className={`absolute inset-0 ${theme.cardBg} blur-3xl`} />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{languagesData[currentLang].icon}</span>
                <div>
                  <h3 className="text-3xl font-bold text-white">{languagesData[currentLang].name}</h3>
                  <p className="text-white/80 text-sm mt-1">Related Skills & Expertise</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {languageSkillsMap[languagesData[currentLang].name].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                whileHover={{ y: -8, scale: 1.05 }}
                transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 200 }}
                className={`relative ${theme.cardBg} ${theme.cardBackdrop} rounded-2xl p-6 border ${theme.cardBorder} ${theme.cardHoverBg} transition-all group overflow-hidden ${theme.cardShadow}`}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  {/* Skill Name */}
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h4>
                    <motion.span
                      className={`text-sm font-bold bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 300 }}
                    >
                      {skill.percentage}%
                    </motion.span>
                  </div>

                  {/* Progress Bar */}
                  <div className={`h-2 ${theme.cardBg} rounded-full overflow-hidden relative`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${theme.accentGradient} rounded-full shadow-lg`}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${theme.accentGradient} rounded-full blur-md opacity-50`}
                    />
                  </div>

                  {/* Skill Level Text */}
                  <p className={`text-xs ${theme.faintText} mt-3`}>
                    {skill.percentage >= 90
                      ? "Expert"
                      : skill.percentage >= 80
                      ? "Advanced"
                      : skill.percentage >= 70
                      ? "Proficient"
                      : "Intermediate"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* STATS SECTION */}
      <section className={`py-24 ${theme.isDark ? 'bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 border-white/10' : 'bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 border-gray-300'} border-y transition-colors duration-500`}>
        <div className="max-w-6xl mx-auto px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity" />
                <div className={`relative ${theme.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${theme.cardBorder} transition-all duration-500 text-center`}>
                  <motion.div
                    className="text-4xl mb-3"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div
                    className={`text-3xl font-bold bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className={`text-sm ${theme.faintText} mt-2`}>{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-32 max-w-6xl mx-auto px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center text-4xl font-bold mb-16"
        >
          What I Offer
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              
              <div className={`relative ${theme.cardBg} ${theme.cardBackdrop} rounded-3xl p-8 border ${theme.cardBorder} group-hover:border-white/30 transition-all overflow-hidden ${theme.cardText}`}>
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <motion.div
                    className="text-5xl mb-4"
                    animate={{ rotate: [0, 0, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {service.icon}
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className={`${theme.smallText} mb-4 text-sm leading-relaxed`}>
                    {service.description}
                  </p>
                  
                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-2">
                    {service.skills.map((skill, idx) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full border border-cyan-400/30"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EDUCATION TIMELINE SECTION */}
      <section className="py-32">
        <h2 className="text-center text-4xl font-extrabold mb-16 tracking-tight">Education & Experience</h2>
        
        <div className="max-w-4xl mx-auto px-10">
          <div className="relative">
            {/* Vertical line */}
            <div className={`absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b ${theme.accentGradient} transform -translate-x-1/2 hidden md:block`} />
            
            {/* Timeline items */}
            <div className="space-y-12">
              {educationData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex md:gap-8 gap-6 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Content */}
                  <div className="flex-1 md:w-1/2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`${theme.cardBg} ${theme.cardBackdrop} rounded-2xl p-6 border ${theme.cardBorder} ${theme.hoverEffect} transition-all duration-300 group ${theme.cardShadow}`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl">{item.icon}</span>
                        <div className="flex-1">
                          <h3 className={`text-xl font-bold ${theme.accentColor}`}>{item.title}</h3>
                          <p className={`text-sm ${theme.secondaryText}`}>{item.period}</p>
                        </div>
                      </div>
                      <p className={`${theme.textColor} text-sm mb-2 font-medium`}>{item.institution}</p>
                      <p className={`${theme.secondaryText} text-sm leading-relaxed`}>{item.description}</p>
                    </motion.div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden md:flex md:w-1/2 justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className={`w-5 h-5 bg-gradient-to-r ${theme.accentGradient} rounded-full border-4 ${theme.isDark ? 'border-primary-900' : 'border-white'} shadow-lg`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-32 max-w-6xl mx-auto px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Featured Projects</h2>
          <motion.div
            className={`h-1 w-20 rounded-full bg-gradient-to-r ${theme.accentGradient}`}
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          <p className={`mt-4 text-lg ${theme.secondaryText}`}>Showcasing my latest work and technical expertise</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projectsData.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <motion.div className={`absolute inset-0 bg-gradient-to-br ${theme.accentGradient} opacity-0 group-hover:opacity-10 transition-all duration-500 z-10`} />
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="h-56 w-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: idx * 0.15 + 0.2, duration: 0.4 }}
                className={`mt-6 ${theme.cardBg} ${theme.cardBackdrop} rounded-2xl p-6 border ${theme.cardBorder} group-hover:border-accent-400/50 transition-all duration-300`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${theme.accentColor} group-hover:${theme.accentColor} transition-colors`}>{project.title}</h3>
                <p className={`${theme.secondaryText} mb-4 leading-relaxed`}>{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${theme.isDark ? "bg-orange-500/20 text-orange-400 border border-orange-400/30" : "bg-orange-100 text-orange-700 border border-orange-200"}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                  {project.websiteLink && (
                    <motion.button
                      onClick={() => window.open(project.websiteLink, '_blank')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg bg-gradient-to-r ${theme.accentGradient} text-white font-semibold text-sm hover:shadow-lg transition-all duration-300 ${theme.cardShadow}`}
                    >
                      Visit Website
                    </motion.button>
                  )}
                  
                  {project.githubLink && (
                    <motion.button
                      onClick={() => window.open(project.githubLink, '_blank')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg border-2 ${theme.cardBorder} ${theme.accentColor} font-semibold text-sm ${theme.hoverEffect} transition-all duration-300`}
                    >
                      GitHub Repository
                    </motion.button>
                  )}
                  
                  {project.apkLink && (
                    <motion.button
                      onClick={() => window.open(project.apkLink, '_blank')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg border-2 ${theme.cardBorder} ${theme.accentColor} font-semibold text-sm ${theme.hoverEffect} transition-all duration-300`}
                    >
                      Download APK
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-32 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-4xl mx-auto px-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-20 transition-opacity" />
            
            <div className={`relative ${theme.cardBg} ${theme.cardBackdrop} rounded-3xl p-12 md:p-16 border ${theme.cardBorder} text-center`}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
              >
                Let's Create Something
                <motion.span className={`block bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent leading-tight`}>
                  Amazing Together
                </motion.span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={`${theme.secondaryText} mb-10 max-w-2xl mx-auto text-lg`}
              >
                I'm always interested in hearing about new projects and opportunities. Let's collaborate and build something incredible!
              </motion.p>

              {/* Contact Methods Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <motion.a
                  href="mailto:johnremygonzales20@gmail.com"
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative group overflow-hidden"
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={`relative ${theme.cardBg} ${theme.cardBackdrop} rounded-2xl p-8 border ${theme.cardBorder} group-hover:border-red-400/50 transition-all`}>
                    <div className="w-14 h-14 mb-6 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                      <img src="/images/gmail-icon.svg" alt="Gmail" className="w-8 h-8" />
                    </div>
                    <p className={`font-semibold text-lg ${theme.isDark ? "text-red-300 group-hover:text-red-200" : "text-red-600 group-hover:text-red-500"} transition-colors mb-2`}>Gmail</p>
                    <p className={`text-sm ${theme.faintText} font-mono break-all`}>johnremygonzales20@gmail.com</p>
                    <p className={`text-xs ${theme.faintText} mt-3`}>Send me a message</p>
                  </div>
                </motion.a>

                <motion.a
                  href="https://github.com/Reym-Tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="relative group overflow-hidden"
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={`relative ${theme.cardBg} ${theme.cardBackdrop} rounded-2xl p-8 border ${theme.cardBorder} group-hover:border-gray-400/50 transition-all`}>
                    <div className="w-14 h-14 mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                      <img src="/images/github-icon.svg" alt="GitHub" className="w-8 h-8" />
                    </div>
                    <p className={`font-semibold text-lg ${theme.isDark ? "text-gray-300 group-hover:text-gray-200" : "text-gray-700 group-hover:text-gray-600"} transition-colors mb-2`}>GitHub</p>
                    <p className={`text-sm ${theme.faintText} break-all`}>github.com/Reym-Tech</p>
                    <p className={`text-xs ${theme.faintText} mt-3`}>View my projects</p>
                  </div>
                </motion.a>

                <motion.a
                  href="https://www.facebook.com/JohnRemyxD"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="relative group overflow-hidden"
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={`relative ${theme.cardBg} ${theme.cardBackdrop} rounded-2xl p-8 border ${theme.cardBorder} group-hover:border-blue-400/50 transition-all`}>
                    <div className="w-14 h-14 mb-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                      <img src="/images/facebook-icon.svg" alt="Facebook" className="w-8 h-8" />
                    </div>
                    <p className={`font-semibold text-lg ${theme.isDark ? "text-blue-300 group-hover:text-blue-200" : "text-blue-600 group-hover:text-blue-500"} transition-colors mb-2`}>Facebook</p>
                    <p className={`text-sm ${theme.faintText}`}>JohnRemyxD</p>
                    <p className={`text-xs ${theme.faintText} mt-3`}>Follow me on Facebook</p>
                  </div>
                </motion.a>

                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="relative group overflow-hidden"
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={`relative ${theme.cardBg} ${theme.cardBackdrop} rounded-2xl p-8 border ${theme.cardBorder} group-hover:border-blue-400/50 transition-all opacity-60 cursor-not-allowed`}>
                    <div className="w-14 h-14 mb-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                      <img src="/images/linkedin-icon.svg" alt="LinkedIn" className="w-8 h-8" />
                    </div>
                    <p className={`font-semibold text-lg ${theme.isDark ? "text-blue-300/60" : "text-blue-600/60"} transition-colors mb-2`}>LinkedIn</p>
                    <p className={`text-sm ${theme.faintText}`}>Coming Soon</p>
                    <p className={`text-xs ${theme.faintText} mt-3`}>Connect with me</p>
                  </div>
                </motion.a>
              </div>

              {/* Primary CTA Button */}
              <motion.a
                href="mailto:johnremygonzales20@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className={`inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r ${theme.accentGradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all`}
              >
                Get In Touch
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-16 border-t ${theme.cardBorder} ${theme.isDark ? "bg-black/50" : "bg-white/50"} backdrop-blur-md transition-colors duration-500`}>
        <div className="max-w-6xl mx-auto px-10">
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-12 flex-wrap">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target={link.url.startsWith("http") && !link.url.startsWith("mailto:") ? "_blank" : undefined}
                rel={link.url.startsWith("http") && !link.url.startsWith("mailto:") ? "noopener noreferrer" : undefined}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08, type: "spring", stiffness: 200 }}
                className={`relative group`}
                title={link.name}
              >
                {/* Gradient halo background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${link.color} rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 w-16 h-16`} />
                
                {/* Icon container */}
                <div className={`relative w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r ${link.color} border-2 border-white/30 group-hover:border-white/70 transition-all shadow-lg group-hover:shadow-2xl`}>
                  <img src={link.icon} alt={link.name} className="w-7 h-7" />
                </div>
                
                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-full mt-3 whitespace-nowrap ${theme.cardBg} ${theme.cardBackdrop} rounded-lg px-3 py-1 text-xs border ${theme.cardBorder} pointer-events-none font-medium`}
                >
                  {link.name}
                </motion.div>
              </motion.a>
            ))}
          </div>

          {/* Footer text */}
          <div className={`text-center border-t ${theme.cardBorder} pt-10`}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`text-sm ${theme.smallText} mb-3 font-medium`}
            >
              © 2025 John Remy Gonzales • BSIT • University of Mindanao Digos College
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className={`text-xs ${theme.faintText}`}
            >
              Designed & Built with <span className="inline-block">❤️</span> using React, Tailwind & Framer Motion
            </motion.p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

export default function Portfolio() {
  return (
    <ThemeProvider>
      <PortfolioContent />
    </ThemeProvider>
  );
}
