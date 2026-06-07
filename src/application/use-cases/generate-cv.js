export async function generateCv() {
  // jsPDF is ~heavy and resume export is rare, so load it on demand to keep it out of
  // the main bundle. Bail quietly if the chunk fails to load.
  let createPdfDocument;
  try {
    ({ createPdfDocument } = await import("../../infrastructure/pdf/pdf-service"));
  } catch {
    return;
  }

  const doc = createPdfDocument();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  const pageBottom = pageHeight - 18;
  let yPosition = 20;

  // Monochrome palette mirrors the site's sharp-edge, grayscale design language.
  const colors = {
    primary: [0, 0, 0],
    accent: [50, 50, 50],
    dark: [20, 20, 20],
    text: [60, 60, 60],
    lightText: [120, 120, 120],
    divider: [180, 180, 180],
  };

  // Start a fresh page before writing a block that needs `needed` mm of vertical room.
  const ensureSpace = (needed = 8) => {
    if (yPosition + needed > pageBottom) {
      doc.addPage();
      yPosition = 20;
    }
  };

  const addSpace = (space = 4) => {
    yPosition += space;
  };

  const addSectionHeader = (text) => {
    ensureSpace(16);
    doc.setFontSize(11.5);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...colors.primary);
    doc.text(text.toUpperCase(), margin, yPosition);
    yPosition += 2.5;
    doc.setDrawColor(...colors.divider);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 7;
  };

  const addText = (text, fontSize = 10, isBold = false, indent = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont(undefined, isBold ? "bold" : "normal");
    doc.setTextColor(...colors.text);
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line) => {
      ensureSpace(fontSize * 0.5);
      doc.text(line, margin + indent, yPosition);
      yPosition += fontSize * 0.42;
    });
  };

  // Square bullet keeps the resume consistent with the site's sharp-edge language.
  const addBullet = (text, fontSize = 9.5) => {
    doc.setFontSize(fontSize);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...colors.text);
    const lines = doc.splitTextToSize(text, contentWidth - 8);
    lines.forEach((line, index) => {
      ensureSpace(fontSize * 0.5);
      if (index === 0) {
        doc.setFillColor(...colors.accent);
        doc.rect(margin + 1.5, yPosition - 2, 1.5, 1.5, "F");
      }
      doc.text(line, margin + 6, yPosition);
      yPosition += fontSize * 0.42;
    });
  };

  const addProject = ({ name, subtitle, bullets }) => {
    // Reserve room for the whole block so a project never splits title-from-bullets across a page.
    ensureSpace(30);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...colors.dark);
    doc.text(name, margin, yPosition);
    const nameWidth = doc.getTextWidth(name);
    doc.setFontSize(9);
    doc.setFont(undefined, "italic");
    doc.setTextColor(...colors.accent);
    doc.text(subtitle, margin + nameWidth + 4, yPosition);
    yPosition += 5.5;
    bullets.forEach((bullet) => addBullet(bullet));
    addSpace(5);
  };

  // HEADER
  doc.setFontSize(24);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...colors.primary);
  doc.text("JOHN REMY C. GONZALES", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 7;

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...colors.accent);
  doc.text("Full-Stack Web Developer  •  BSIT Student", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 7;

  doc.setFontSize(9);
  doc.setTextColor(...colors.lightText);
  doc.text(
    "johnremygonzales20@gmail.com  •  Davao del Sur, Philippines",
    pageWidth / 2,
    yPosition,
    { align: "center" }
  );
  yPosition += 4.5;
  doc.text(
    "github.com/Reym-Tech  •  linkedin.com/in/john-remy-gonzales  •  facebook.com/JohnRemyxD",
    pageWidth / 2,
    yPosition,
    { align: "center" }
  );
  yPosition += 8;

  doc.setDrawColor(...colors.divider);
  doc.setLineWidth(0.3);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // PROFESSIONAL PROFILE
  addSectionHeader("Professional Profile");
  addText(
    "Information Technology student with 3+ years of hands-on coding across full-stack web and mobile development. I build responsive, accessible, user-centered applications — React and Tailwind on the front end, FastAPI and Supabase behind it — and ship software people actually use. Committed to continuous learning and growing into a software engineering role.",
    10
  );
  addSpace(6);

  // TECHNICAL SKILLS — reconciled to the stacks actually used in the projects below.
  addSectionHeader("Technical Skills");
  const skillCategories = [
    { label: "Languages", skills: "JavaScript (ES6+), Python, PHP, Java, Dart, HTML5/CSS3" },
    { label: "Frontend", skills: "React, Tailwind CSS, Framer Motion, Responsive Design, Component Architecture" },
    { label: "Backend & APIs", skills: "FastAPI, Node.js, REST API Design, Serverless Functions" },
    { label: "Databases", skills: "PostgreSQL, Supabase, Firebase, MySQL" },
    { label: "Data & ML", skills: "Scikit-learn, Pandas, NumPy" },
    { label: "Tools", skills: "Git & GitHub, Figma, Vercel, VS Code" },
  ];
  skillCategories.forEach((category) => {
    ensureSpace(8);
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...colors.dark);
    doc.text(category.label + ":", margin, yPosition);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...colors.text);
    const lines = doc.splitTextToSize(category.skills, contentWidth - 38);
    lines.forEach((line, index) => {
      doc.text(line, margin + 38, yPosition + index * 4);
    });
    yPosition += 4 + (lines.length - 1) * 4 + 3;
  });
  addSpace(4);

  // KEY PROJECTS — curated to four strongest, drawn from real project stacks.
  addSectionHeader("Key Projects");
  addProject({
    name: "Developer Portfolio",
    subtitle: "React SPA with Motion, Accessibility & AI Assistant",
    bullets: [
      "Built a single-page React portfolio with a device- and motion-aware Framer Motion system and a WCAG-AA accessibility layer",
      "Integrated an AI assistant grounded on a Gemini serverless function, with one-click resume export and graceful offline degradation",
      "Tech: React, Tailwind CSS, Framer Motion, Gemini API, Vercel",
    ],
  });
  addProject({
    name: "Student Burnout Risk Predictor",
    subtitle: "ML Classifier with FastAPI REST API",
    bullets: [
      "Trained a Scikit-learn classifier on study habits and AI-tool usage to tier student burnout risk",
      "Served predictions through a Python/FastAPI REST endpoint with a plain-JS frontend; deployed live",
      "Tech: Python, FastAPI, Scikit-learn, Pandas, NumPy",
    ],
  });
  addProject({
    name: "BrewTrack",
    subtitle: "Web-Based POS & Inventory System",
    bullets: [
      "Built a point-of-sale system with real-time inventory tracking and a revenue analytics dashboard",
      "Delivered for an actual café client and deployed live on Vercel, replacing spreadsheet-based operations",
      "Tech: JavaScript, Supabase, PostgreSQL  •  bt-hitnotes.vercel.app",
    ],
  });
  addProject({
    name: "Ancient Crafts",
    subtitle: "Native Android Marketplace",
    bullets: [
      "Built a native Android storefront giving indigenous artisans a product catalog, cart, and checkout flow",
      "Backed by a PHP/MySQL REST API with Firebase integration for authentication and live data",
      "Tech: Java (Android), PHP, MySQL, Firebase, XML",
    ],
  });

  // EDUCATION
  addSectionHeader("Education");
  ensureSpace(18);
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
  doc.text("2023 - Present (3rd Year)  •  Expected Graduation: 2026", margin, yPosition);
  yPosition += 8;

  ensureSpace(14);
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...colors.dark);
  doc.text("Senior High School - HUMSS Strand", margin, yPosition);
  yPosition += 5;
  doc.setFontSize(9.5);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...colors.text);
  doc.text("Matti National High School", margin, yPosition);
  yPosition += 4.5;
  doc.setFontSize(9);
  doc.setTextColor(...colors.lightText);
  doc.text("2021 - 2023", margin, yPosition);
  yPosition += 9;

  // CERTIFICATIONS
  addSectionHeader("Certifications");
  const certifications = [
    "Installing and Configuring Computer Systems - TESDA National Certification (2025)",
    "Maintaining Computer Systems and Networks - TESDA (2025)",
    "Setting Up Computer Networks - TESDA (2025)",
    "Setting Up Computer Servers - TESDA (2025)",
    "Introduction to CSS - TESDA (2025)",
    "Java Intermediate - SoloLearn (2026)",
    "Introduction to Java - SoloLearn (2026)",
  ];
  certifications.forEach((cert) => addBullet(cert, 9.5));
  addSpace(5);

  // CORE COMPETENCIES
  addSectionHeader("Core Competencies");
  const competencies = [
    ["Full-Stack Web Development", "Mobile App Development"],
    ["UI/UX Design & Prototyping", "Accessibility (WCAG-AA)"],
    ["RESTful API Development", "Database Design"],
    ["Problem Solving & Debugging", "Version Control (Git)"],
  ];
  competencies.forEach((row) => {
    ensureSpace(7);
    doc.setFontSize(9.5);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...colors.text);
    doc.setFillColor(...colors.accent);
    doc.rect(margin + 1.5, yPosition - 2, 1.5, 1.5, "F");
    doc.text(row[0], margin + 6, yPosition);
    if (row[1]) {
      doc.rect(pageWidth / 2 + 5, yPosition - 2, 1.5, 1.5, "F");
      doc.text(row[1], pageWidth / 2 + 9, yPosition);
    }
    yPosition += 5;
  });

  // FOOTER — drawn on every page so multi-page exports stay attributed.
  const pageCount = doc.internal.getNumberOfPages();
  const footerText = `Generated ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}  •  github.com/Reym-Tech`;
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setFont(undefined, "italic");
    doc.setTextColor(...colors.lightText);
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });
  }

  doc.save("John_Remy_Gonzales_Resume.pdf");
}
