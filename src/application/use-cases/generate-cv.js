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
  let yPosition = 20;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  const colors = {
    primary: [0, 0, 0],
    accent: [50, 50, 50],
    dark: [20, 20, 20],
    text: [60, 60, 60],
    lightText: [120, 120, 120],
    divider: [180, 180, 180],
  };

  const addSectionHeader = (text) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...colors.primary);
    doc.text(text, margin, yPosition);
    yPosition += 2;
    doc.setDrawColor(...colors.accent);
    doc.setLineWidth(0.8);
    doc.line(margin, yPosition, margin + 50, yPosition);
    yPosition += 8;
  };

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

  const addBullet = (text, fontSize = 9.5) => {
    if (yPosition > pageHeight - 15) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(fontSize);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...colors.text);
    doc.setFillColor(...colors.accent);
    doc.circle(margin + 2, yPosition - 1.5, 0.8, "F");
    const lines = doc.splitTextToSize(text, contentWidth - 8);
    lines.forEach((line) => {
      doc.text(line, margin + 6, yPosition);
      yPosition += fontSize * 0.42;
    });
  };

  const addSpace = (space = 4) => {
    yPosition += space;
  };

  // HEADER
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

  doc.setFontSize(9);
  doc.setTextColor(...colors.lightText);
  const contactInfo = "johnremygonzales20@gmail.com  •  github.com/Reym-Tech  •  facebook.com/JohnRemyxD";
  doc.text(contactInfo, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  doc.setDrawColor(...colors.divider);
  doc.setLineWidth(0.3);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // PROFESSIONAL PROFILE
  addSectionHeader("PROFESSIONAL PROFILE");
  addText(
    "Information Technology student with 3+ years of hands-on coding experience in full-stack web development and UI/UX design. I build responsive, user-centered applications with clean architecture and reliable backends, and I'm committed to continuous learning.",
    10
  );
  addSpace(6);

  // TECHNICAL SKILLS
  addSectionHeader("TECHNICAL SKILLS");
  const skillCategories = [
    { label: "Languages & Frameworks", skills: "JavaScript (ES6+), Python, PHP, Java, HTML5/CSS3, React.js, Node.js" },
    { label: "Frontend Technologies", skills: "React, Tailwind CSS, Framer Motion, Responsive Design, Component Architecture" },
    { label: "Backend & APIs", skills: "REST API Development, FastAPI, Express.js, Serverless Functions, Database Design, Server Configuration" },
    { label: "Databases & Tools", skills: "MySQL, PostgreSQL, Firebase, Supabase, Git/GitHub, VS Code, Figma" },
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
      doc.text(line, margin + 65, yPosition + index * 4);
    });
    yPosition += 4 + (lines.length - 1) * 4 + 3;
  });
  addSpace(4);

  // KEY PROJECTS
  addSectionHeader("KEY PROJECTS & EXPERIENCE");

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

  // EDUCATION
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

  // CERTIFICATIONS
  addSectionHeader("PROFESSIONAL CERTIFICATIONS");
  const certifications = [
    "Installing and Configuring Computer Systems - TESDA National Certification (2025)",
    "Introduction to CSS - TESDA (2025)",
    "Maintaining Computer Systems and Networks - TESDA (2025)",
    "Setting Up Computer Networks - TESDA (2025)",
    "Setting Up Computer Servers - TESDA (2025)",
  ];
  certifications.forEach((cert) => addBullet(cert, 9.5));
  addSpace(4);

  // CORE COMPETENCIES
  addSectionHeader("CORE COMPETENCIES");
  const competencies = [
    ["Full-Stack Web Development", "Problem Solving & Debugging"],
    ["UI/UX Design & Prototyping", "Responsive Web Design"],
    ["Database Architecture", "RESTful API Development"],
    ["Version Control (Git)", "Agile Methodologies"],
  ];
  competencies.forEach((row) => {
    doc.setFontSize(9.5);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...colors.text);
    doc.setFillColor(...colors.accent);
    doc.circle(margin + 2, yPosition - 1.5, 0.8, "F");
    doc.text(row[0], margin + 6, yPosition);
    if (row[1]) {
      doc.circle(pageWidth / 2 + 5, yPosition - 1.5, 0.8, "F");
      doc.text(row[1], pageWidth / 2 + 9, yPosition);
    }
    yPosition += 5;
  });

  // FOOTER
  doc.setFontSize(8);
  doc.setTextColor(...colors.lightText);
  doc.setFont(undefined, "italic");
  const footerText = `Generated ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} • github.com/Reym-Tech`;
  doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });

  doc.save("John_Remy_Gonzales_Resume.pdf");
}
