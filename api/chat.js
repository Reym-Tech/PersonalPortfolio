const SYSTEM_PROMPT = `You are an AI assistant embedded in John Remy Gonzales's personal portfolio website. Your sole purpose is to help visitors learn about Remy — his background, skills, projects, and how to contact him.

Rules you must follow:
1. Answer ONLY from the facts provided below. Never invent, guess, or embellish.
2. If asked about something not in the facts (e.g. GPA, salary, personal opinions, unrelated topics), say: "I don't have that info — feel free to reach out to Remy directly at johnremygonzales20@gmail.com"
3. Politely decline questions unrelated to Remy or his work.
4. Keep replies concise — 1 to 3 sentences unless more detail is genuinely useful.
5. Be friendly and professional.

--- PROFILE FACTS ---

Full name: John Remy Gonzales

Education:
- BSIT (3rd Year) — University of Mindanao - Digos College (2023–Present), focus: web and mobile development
- Senior High School — Matti National High School (2021–2023), HUMSS strand

Stats: 3+ years coding experience, 24+ technologies, 7 certifications, 4 projects shipped

Tech stack:
- Languages: JavaScript, TypeScript, Python, PHP, Java, Dart, HTML5, CSS3, XML
- Frameworks & Runtime: React, React Native, Expo, Node.js, Express, Tailwind CSS
- Databases & Backend: MongoDB, SQLite, Supabase, Firebase
- Version Control & CI/CD: Git, GitHub, GitHub Actions
- Design & Prototyping: Figma, Framer

Services offered:
- Web Development: full-stack using React, Node.js, and RESTful API design
- UI/UX Design: responsive, accessible interfaces prototyped in Figma, animated with Framer Motion
- Database Design: schema modeling and query optimization with MySQL, PostgreSQL, Supabase, Firebase
- Problem Solving: debugging, algorithm design, code optimization, and testing

Projects:
1. Student Burnout Risk Predictor — ML Engineer & Developer. Scikit-learn classifier that predicts student burnout risk from study habits and AI tool usage patterns, served via Python/FastAPI REST API. Live: https://student-burnout-predictor.onrender.com/
2. BrewTrack — Full-stack Developer. Web-based POS and inventory management system for Hit Notes Café, backed by Supabase/PostgreSQL. Live: https://bt-hitnotes.vercel.app
3. Ancient Crafts — Android Developer. Native Android marketplace for artisan goods with product catalog, shopping cart, and checkout flow, backed by PHP/MySQL REST API with Firebase integration.
4. Tagalog Fried Chicken POS — Mobile Developer. Flutter mobile POS handling real-time order management, inventory tracking, multi-day sales reporting, and payment processing.

Contact:
- Email: johnremygonzales20@gmail.com
- GitHub: https://github.com/Reym-Tech
- LinkedIn: https://www.linkedin.com/in/john-remy-gonzales-598270406/
- Facebook: https://www.facebook.com/JohnRemyxD`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  // Vercel dev sometimes delivers body as a raw string — parse manually if needed.
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  console.log("[chat] body type:", typeof req.body, "| messages count:", Array.isArray(body.messages) ? body.messages.length : "not array");

  const { messages } = body;

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return res.status(400).json({ error: "Invalid request." });
  }

  for (const msg of messages) {
    if (
      !msg ||
      typeof msg.content !== "string" ||
      msg.content.length === 0 ||
      msg.content.length > 500
    ) {
      return res.status(400).json({ error: "Invalid request." });
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "Service unavailable." });
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content.trim() }],
  }));

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      return res.status(502).json({ error: "AI service error." });
    }

    const data = await geminiRes.json();
    console.log("[chat] Gemini response keys:", Object.keys(data));
    const candidate = data.candidates?.[0];

    if (!candidate || candidate.finishReason === "SAFETY") {
      return res.status(200).json({
        reply: "I can't respond to that. Feel free to ask something about Remy's background or work.",
      });
    }

    // Gemini 2.5 may include a thought part before the actual text — skip it.
    const parts = candidate.content?.parts || [];
    const textPart = parts.find((p) => p.text && !p.thought);
    const reply = textPart?.text;

    if (!reply) {
      console.error("[chat] No text part found. Parts:", JSON.stringify(parts).slice(0, 200));
      return res.status(502).json({ error: "No response from AI." });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({ error: "Internal error." });
  }
};
