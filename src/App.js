import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const projectsData = [
  {
    id: 1,
    title: "Ancient Crafts",
    description: "A full-stack e-commerce mobile application with product catalog, shopping cart, and checkout functionality.",
    image: "/images/project1.jpg",
    link: "https://github.com/Reym-Tech/AncientCrafts",
    technologies: ["MySQL", "PHP", "Firebase", "XML", "Java"]
  },
  {
    id: 2,
    title: "BrewTrack",
    description: "BrewTrack is a simple web-based POS and inventory system for cafés that manages sales, tracks stock, and provides basic analytics in one dashboard.",
    image: "/images/project2.jpg",
    link: "https://github.com/Reym-Tech/BrewTrack",
    technologies: ["HTML", "CSS", "JavaScript", "Supabase", "POSTgreSQL"]
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

const skillsData = [
  { name: "JavaScript", percentage: 90 },
  { name: "React", percentage: 85 },
  { name: "Tailwind CSS", percentage: 88 },
  { name: "Node.js", percentage: 75 },
  { name: "HTML/CSS", percentage: 95 },
  { name: "UI/UX Design", percentage: 80 },
  { name: "REST APIs", percentage: 82 },
  { name: "Problem Solving", percentage: 88 }
];

// Education and Experience data
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

// Services/Expertise data
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
    skills: ["MySQL", "PostgreSQL", "Firebase", "Database Design"]
  },
  {
    id: 4,
    title: "Problem Solving",
    description: "Analytical approach to complex problems with clean, efficient code solutions",
    icon: "⚡",
    skills: ["Debugging", "Algorithm Design", "Code Optimization", "Testing"]
  }
];

// Stats data
const statsData = [
  { label: "Projects Completed", value: "3+", icon: "🚀" },
  { label: "Certificates Earned", value: "5", icon: "🏆" },
  { label: "Technologies", value: "8+", icon: "⚙️" },
  { label: "Years Coding", value: "2+", icon: "💻" }
];

// Social links
const socialLinks = [
  { name: "GitHub", url: "https://github.com/Reym-Tech", icon: "🐙", color: "from-gray-600 to-gray-800" },
  { name: "LinkedIn", url: "#", icon: "💼", color: "from-blue-600 to-blue-800" },
  { name: "Gmail", url: "mailto:johnremygonzales20@gmail.com", icon: "📧", color: "from-red-500 to-red-700" },
  { name: "Facebook", url: "https://www.facebook.com/JohnRemyxD", icon: "f", color: "from-blue-500 to-blue-700" }
];

// Mapping languages to related skills
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

export default function Portfolio() {
  const [currentLang, setCurrentLang] = useState(0);
  const [expandCerts, setExpandCerts] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [photoLikes, setPhotoLikes] = useState(() => Number(localStorage.getItem("photoLikes")) || 0);
  const [photoLiked, setPhotoLiked] = useState(() => localStorage.getItem("photoLiked") === "true");
  const [loopHeartCount, setLoopHeartCount] = useState(22);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentLang((prev) => (prev + 1) % languagesData.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handleDotClick = (index) => {
    setCurrentLang(index);
    setIsAutoPlay(false);
  };

  useEffect(() => {
    try {
      localStorage.setItem("photoLikes", String(photoLikes));
      localStorage.setItem("photoLiked", String(photoLiked));
    } catch (e) {}
  }, [photoLikes, photoLiked]);

  const handleToggleLike = () => {
    if (photoLiked) {
      setPhotoLiked(false);
      setPhotoLikes((p) => Math.max(0, p - 1));
    } else {
      setPhotoLiked(true);
      setPhotoLikes((p) => p + 1);
    }
  };

  // Looping heart counter animation (22 -> 69) — slower, smoother loop
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

  const handleAutoPlayToggle = () => {
    setIsAutoPlay(!isAutoPlay);
  };

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

  // Handler for View Projects button
  const handleViewProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handler for Download CV button
  const handleDownloadCV = () => {
    // Create a simple CV file or link to actual CV
    const cvContent = `
JOHN REMY GONZALES
BSIT 3rd Year | University of Mindanao Digos College
johnremygonzales20@gmail.com | GitHub: github.com/Reym-Tech

PROFESSIONAL SUMMARY
Passionate Information Technology student focused on web development, UI/UX design, automation, and modern JavaScript technologies. Experienced in full-stack development with proven ability to create engaging user interfaces and robust backend systems.

EDUCATION
Bachelor of Science in Information Technology (BSIT) - 3rd Year
University of Mindanao - Digos College (2023 - Present)
Focus: Web Development & Software Engineering

Senior High School - HUMSS Track
Matti National High School (2021 - 2023)

TECHNICAL SKILLS
Languages: JavaScript, PHP, Java, HTML/CSS
Frontend: React, Tailwind CSS, Framer Motion
Backend: Node.js, REST APIs
Databases: MySQL, PostgreSQL, Firebase
Tools: Git, Figma, VS Code

PROJECTS COMPLETED
1. Ancient Crafts - Full-stack e-commerce mobile application
2. BrewTrack - Web-based POS and inventory system

CERTIFICATIONS
- Installing and Configuring Computer Systems (TESDA 2025)
- Introduction to CSS (TESDA 2025)
- Maintaining Computer Systems and Networks (TESDA 2025)
- Setting Up Computer Networks (TESDA 2025)
- Setting Up Computer Servers (TESDA 2025)

EXPERTISE
✓ Full-Stack Web Development
✓ UI/UX Design & Animations
✓ Database Architecture & Optimization
✓ Problem Solving & Debugging
✓ Responsive Web Design
✓ REST API Development

CONTACT
Email: johnremygonzales20@gmail.com
GitHub: https://github.com/Reym-Tech
Facebook: https://www.facebook.com/JohnRemyxD
    `;

    // Create a blob and download
    const blob = new Blob([cvContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "John_Remy_Gonzales_CV.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white font-sans overflow-hidden">
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 backdrop-blur-xl bg-white/10 rounded-full px-10 py-4 flex gap-8 shadow-xl z-50 border border-white/20"
      >
        {["Home", "About", "Projects", "Skills", "Contact"].map((item) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase()}`}
            whileHover={{ scale: 1.1, color: "#06b6d4" }}
            className="text-sm text-gray-300 hover:text-cyan-400 transition"
          >
            {item}
          </motion.a>
        ))}
      </motion.nav>

      {/* HERO */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        <motion.div//via.placeholder.com/300
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative bg-white/10 backdrop-blur-2xl rounded-[3rem] p-20 max-w-5xl w-full shadow-2xl"
        >
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-r from-cyan-400/20 to-purple-500/20 blur-3xl" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-5xl font-bold leading-tight">John Remy Gonzales</h1>
              <p className="mt-4 text-cyan-400">BSIT 3rd Year • University of Mindanao Digos College</p>
              <p className="mt-6 text-gray-300">
                A passionate Information Technology student focused on web development, UI/UX design,
                automation, and modern JavaScript technologies.
              </p>
              <div className="mt-8 flex gap-4">
                <motion.button
                  onClick={handleViewProjects}
                  whileHover={{ scale: 1.05, x: 5, boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 transition font-semibold flex items-center gap-2 group cursor-pointer shadow-lg"
                >
                  View Projects
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block"
                  >
                    →
                  </motion.span>
                </motion.button>
                
                <motion.button
                  onClick={handleDownloadCV}
                  whileHover={{ scale: 1.05, x: -5, borderColor: "#06b6d4" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-full border border-white/30 hover:bg-white/10 transition font-semibold flex items-center gap-2 group cursor-pointer"
                >
                  <motion.span
                    animate={{ x: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block"
                  >
                    ↓
                  </motion.span>
                  Download CV
                </motion.button>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="flex items-center justify-center"
            >
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 blur-xl absolute" />
              <img
                src="/images/profile1.jpg"
                alt="profile"
                className="relative w-56 h-56 object-cover rounded-full border-4 border-white/30"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CERTIFICATES */}
      <section id="certificates" className="py-24 max-w-6xl mx-auto px-10 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <h2 className="text-4xl font-bold mb-12">Certificates</h2>
        <motion.div
          layout
          className="grid md:grid-cols-3 gap-8"
        >
          {certificatesData.slice(0, expandCerts ? certificatesData.length : 3).map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-6 shadow-xl cursor-pointer hover:shadow-2xl hover:from-white/20 hover:to-white/10 transition-all border border-white/10 hover:border-cyan-400/50 group overflow-hidden"
              onClick={() => window.open(cert.link, '_blank')}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="relative z-10">
                <img src={cert.image} alt={cert.title} className="h-40 w-full object-cover rounded-xl mb-4 group-hover:shadow-lg transition-shadow" />
                <h3 className="text-lg font-semibold group-hover:text-cyan-300 transition-colors">{cert.title}</h3>
                <p className="text-sm text-gray-300 mt-2">{cert.issuer} • {cert.date}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* See More / See Less Button */}
        {certificatesData.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mt-12"
          >
            <motion.button
              onClick={() => setExpandCerts(!expandCerts)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-3 rounded-full font-semibold text-white overflow-hidden group"
            >
              {/* Button background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-100 group-hover:opacity-80 transition-opacity rounded-full" />
              
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur opacity-0 group-hover:opacity-50"
                animate={{ scale: [0.8, 1.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              {/* Button text */}
              <motion.span
                className="relative z-10 flex items-center justify-center gap-2"
                key={expandCerts ? "less" : "more"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {expandCerts ? (
                  <>
                    <span>See Less</span>
                    <motion.span
                      animate={{ rotate: 180, y: [0, -3, 0] }}
                      transition={{ rotate: { duration: 0.3 }, y: { duration: 1.5, repeat: Infinity } }}
                      className="inline-block"
                    >
                      ↓
                    </motion.span>
                  </>
                ) : (
                  <>
                    <span>See More</span>
                    <motion.span
                      animate={{ y: [0, 5, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="inline-block"
                    >
                      ↓
                    </motion.span>
                  </>
                )}
              </motion.span>
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
                  <p className="text-lg text-gray-300 leading-relaxed">
                    I'm <span className="text-cyan-300 font-semibold">John Remy Gonzales</span>, a passionate BSIT student at the University of Mindanao Digos College. My journey in tech started with curiosity about how things work, which evolved into a deep passion for building beautiful, functional digital experiences.
                  </p>

                  <p className="text-lg text-gray-300 leading-relaxed">
                    I specialize in <span className="text-purple-300 font-semibold">full-stack web development</span>, crafting everything from responsive frontends using React and Tailwind CSS to robust backends with Node.js and REST APIs. What truly drives me is creating <span className="text-cyan-300 font-semibold">futuristic interfaces with smooth animations</span> that not only look impressive but provide exceptional user experiences.
                  </p>

                  <p className="text-lg text-gray-300 leading-relaxed">
                    Beyond coding, I'm deeply interested in <span className="text-purple-300 font-semibold">UI/UX design</span>, <span className="text-cyan-300 font-semibold">problem-solving</span>, and automation. I believe in continuous learning and constantly explore new technologies to stay ahead in this ever-evolving field.
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
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 hover:border-cyan-400/50 transition-all group cursor-pointer hover:bg-white/20"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm text-gray-300 group-hover:text-cyan-300 transition-colors">{item.label}</span>
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
                        <div className="bg-white/5 rounded-xl overflow-hidden w-full h-full">
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
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 space-y-6">
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
                            className="flex items-start gap-3 text-gray-300"
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
                      <div className="space-y-2 text-sm text-gray-300">
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
        <h2 className="text-center text-4xl font-bold mb-16">Languages, Technologies & Skills</h2>
        
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
                className="absolute top-4 right-4 text-xs text-gray-400 pointer-events-none"
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
                  className={`rounded-full transition-all ${
                    currentLang === index
                      ? "bg-gradient-to-r from-cyan-400 to-purple-500"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  style={{ height: "6px" }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={currentLang === index ? { width: 32 } : { width: 12 }}
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
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
                isAutoPlay
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                  : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20"
              }`}
            >
              <motion.span
                animate={{ rotate: isAutoPlay ? 360 : 0 }}
                transition={{ duration: 2, repeat: isAutoPlay ? Infinity : 0 }}
              >
                ▶
              </motion.span>
              {isAutoPlay ? "Auto-Playing" : "Paused"}
            </motion.button>

            <span className="text-gray-400 text-sm">
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
            <div className="absolute inset-0 bg-white/10 blur-3xl" />
            
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
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group overflow-hidden"
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
                      className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                    >
                      {skill.percentage}%
                    </motion.span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full shadow-lg"
                    />
                  </div>

                  {/* Skill Level Text */}
                  <p className="text-xs text-gray-400 mt-3">
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
      <section className="py-24 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 border-y border-white/10">
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
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-cyan-400/50 transition-colors text-center">
                  <motion.div
                    className="text-4xl mb-3"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div
                    className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-sm text-gray-400 mt-2">{stat.label}</p>
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
              
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 group-hover:border-white/30 transition-all overflow-hidden">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <motion.div
                    className="text-5xl mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {service.icon}
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
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
      <section className="py-32 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <h2 className="text-center text-4xl font-bold mb-16">Education & Experience</h2>
        
        <div className="max-w-4xl mx-auto px-10">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-purple-500 transform -translate-x-1/2 hidden md:block" />
            
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
                      className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 transition-all group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl">{item.icon}</span>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-cyan-300">{item.title}</h3>
                          <p className="text-sm text-gray-400">{item.period}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{item.institution}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </motion.div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden md:flex md:w-1/2 justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full border-4 border-[#020617] shadow-lg"
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
        <h2 className="text-4xl font-bold mb-12">Projects</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -10 }}
              className="bg-white/10 rounded-3xl p-6 shadow-xl cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => window.open(project.link, '_blank')}
            >
              <img src={project.image} alt={project.title} className="h-40 w-full object-cover rounded-xl mb-4" />
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-300 mt-2">{project.description}</p>
              <div className="mt-4 flex gap-2 flex-wrap">
                {project.technologies.map(tech => (
                  <span key={tech} className="text-xs bg-cyan-500/20 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
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
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-3xl blur-3xl opacity-10" />
            
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center">
              <h2 className="text-4xl font-bold mb-4">Let's Work Together</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!
              </p>

              {/* Contact Methods Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <motion.a
                  href="mailto:johnremygonzales20@gmail.com"
                  whileHover={{ scale: 1.05, y: -8 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative group overflow-hidden"
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 group-hover:border-red-400/50 transition-all">
                    <motion.div
                      className="text-4xl mb-4"
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      📧
                    </motion.div>
                    <p className="font-semibold text-lg text-red-300 group-hover:text-red-200 transition-colors mb-2">Gmail</p>
                    <p className="text-sm text-gray-300 font-mono break-all">johnremygonzales20@gmail.com</p>
                    <p className="text-xs text-gray-400 mt-3">Send me a message</p>
                  </div>
                </motion.a>

                <motion.a
                  href="https://github.com/Reym-Tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -8 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative group overflow-hidden"
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 group-hover:border-gray-400/50 transition-all">
                    <motion.div
                      className="text-4xl mb-4"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🐙
                    </motion.div>
                    <p className="font-semibold text-lg text-gray-300 group-hover:text-gray-200 transition-colors mb-2">GitHub</p>
                    <p className="text-sm text-gray-400 break-all">github.com/Reym-Tech</p>
                    <p className="text-xs text-gray-500 mt-3">View my projects</p>
                  </div>
                </motion.a>

                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05, y: -8 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative group overflow-hidden"
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 group-hover:border-blue-400/50 transition-all">
                    <motion.div
                      className="text-4xl mb-4"
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      💼
                    </motion.div>
                    <p className="font-semibold text-lg text-blue-300 group-hover:text-blue-200 transition-colors mb-2">LinkedIn</p>
                    <p className="text-sm text-gray-400">Coming Soon</p>
                    <p className="text-xs text-gray-500 mt-3">Connect with me</p>
                  </div>
                </motion.a>

                <motion.a
                  href="https://www.facebook.com/JohnRemyxD"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -8 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative group overflow-hidden"
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 group-hover:border-blue-400/50 transition-all">
                    <motion.div
                      className="text-4xl mb-4"
                      animate={{ x: [0, 5, 0], y: [0, -3, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      f
                    </motion.div>
                    <p className="font-semibold text-lg text-blue-300 group-hover:text-blue-200 transition-colors mb-2">Facebook</p>
                    <p className="text-sm text-gray-400">JohnRemyxD</p>
                    <p className="text-xs text-gray-500 mt-3">Follow me on Facebook</p>
                  </div>
                </motion.a>
              </div>

              {/* Primary CTA Button */}
              <motion.a
                href="mailto:johnremygonzales20@gmail.com"
                whileHover={{ scale: 1.08, boxShadow: "0 0 30px rgba(6, 182, 212, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-12 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 transition-all font-semibold shadow-lg hover:shadow-2xl text-white relative overflow-hidden group"
              >
                {/* Animated background shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <span className="relative z-10 flex items-center gap-2">
                  <span>Get In Touch via Gmail</span>
                  <motion.span
                    animate={{ 
                      x: [0, 6, 0],
                      scale: [1, 1.3, 1],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block"
                  >
                    →
                  </motion.span>
                </span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-10">
          {/* Social Links */}
          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target={link.url.startsWith("http") && !link.url.startsWith("mailto:") ? "_blank" : undefined}
                rel={link.url.startsWith("http") && !link.url.startsWith("mailto:") ? "noopener noreferrer" : undefined}
                whileHover={{ scale: 1.3, rotate: 15, y: -5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative group`}
                title={link.name}
              >
                {/* Gradient halo background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${link.color} rounded-full blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-500 w-14 h-14 flex items-center justify-center`} />
                
                {/* Icon container */}
                <div className={`relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r ${link.color} border-2 border-white/20 group-hover:border-white/40 transition-all shadow-lg`}>
                  <span className="text-white text-lg font-bold">{link.icon}</span>
                </div>
                
                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 whitespace-nowrap bg-white/10 backdrop-blur-xl rounded-lg px-3 py-1 text-xs border border-white/20 pointer-events-none"
                >
                  {link.name}
                </motion.div>
              </motion.a>
            ))}
          </div>

          {/* Footer text */}
          <div className="text-center border-t border-white/10 pt-8">
            <p className="text-sm text-gray-400 mb-2">
              © 2025 John Remy Gonzales • BSIT • UM Digos College
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-xs text-gray-500"
            >
              Designed & Built with{" "}
              <motion.span
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0],
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block"
              >
                ❤️
              </motion.span>
              {" "}using React & Framer Motion
            </motion.p>
          </div>
        </div>
      </footer>
    </div>
  );
}
