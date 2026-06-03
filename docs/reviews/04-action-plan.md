# Portfolio Action Plan

Based on: 03-fresh-review.md

## Tier 1 — Strategic Differentiators

### 1. Hero Value Proposition

Source: Fresh Review #2

Status: Done

---

### 2. Persistent WebGL Signature Experience

Source: Fresh Review #1

Status: Not Started (persistent-3D hero grid was prototyped and reverted — the
perspective floor read as awkward; the 2D LineGrid was kept by preference)

---

### 3. Featured Project Storytelling

Source: Fresh Review #5

Status: Done (note: as of the #10 redesign, the standalone Featured band was replaced
by the project pile — every project carries the full Problem/Approach/Outcome
storytelling, with the ML/FastAPI project first and marked "Featured". On desktop the
brief pile card shows the Outcome beat un-clicked and opens the full case study in an
overlay; on mobile/reduced-motion the full story renders inline. Preserved/expanded,
just delivered through the pile + overlay.)

---

### 4. Section Rhythm & Art Direction

Source: Fresh Review #6

Status: Done

## Tier 2 — Differentiation

### 5. Personality & Positioning

Source: Fresh Review #7

Status: Done (About chips reworked from generic role labels + rice joke to four
specific, site-provable claims: Accessibility-first, Motion-driven interfaces,
Full-Stack — React · Node, Continuous learner)

### 6. Brand Accent Strategy

Source:
- Visual Design Review
- Greatest Weaknesses

Goal:
Develop a more distinctive visual identity through intentional use of
the brand accent color, stronger focal points, and clearer art direction.

Status: Done (committed to a monochrome black/white identity with blue as a
rule-governed accent — blue now means "interactive / alive" only: hovers, focus
rings, scroll bar, the cursor-tinted grid glow, and the single Featured Outcome
beat; all structural uses demoted to black/gray. Added an oversized faint
section-numeral system (01–07) for editorial scale contrast and wayfinding.)

### 7. Hero Grid Visibility

Source: Fresh Review #9

Status: Done (LineGrid reworked with an ambient self-animating wave + a cursor
spotlight that brightens/thickens nearby lines — reads as present but not loud,
without raising base line opacity under the hero text)

### 8. Stats Reframing

Source: Fresh Review #8

Status: Done (reordered so the grid opens on the strongest number — 24+
Technologies — with the two small honest counts last; relabeled Projects
Shipped / Certifications. Count-up kept by preference; no invented metrics)

## Tier 3 — Polish

### 9. Dark Mode

Source: Fresh Review #4

Status: Done (shipped a real dark theme. Architecture: the elegant.* tokens are now
CSS variables in channel form — :root (light) / .dark (dark) in index.css, mapped in
tailwind.config.js via rgb(var(--x) / <alpha-value>) so opacity modifiers like
text-elegant-text/70 flip automatically across both modes. Created the long-documented-
but-missing src/ThemeContext.js (system-preference default, localStorage persist,
null-safe useTheme), a pre-paint inline script in index.html to kill FOUC, and an
accessible NavBar Sun/Moon toggle. Routed every hardcoded hex (BORDER, #F9FAFB hover,
#FAFAFA muted, #F3F4F6 active, raw #E5E7EB, tile-bg grids, filled-button/FAB text) and
the canvas + WebGL intro through the tokens so nothing reads light in dark. AA verified:
dark surface #0D1117 + text #F0F3F6 gives text/50 = 4.9:1, /70 = 8.6:1, accent blue
#60A5FA = 7.4:1 — all pass; light mode values unchanged, so no regression. Build +156 B
JS / +243 B CSS.)

### 10. Additional Memorable Interactions

Source: Fresh Review #3

Status: Done — implemented, both stages confirmed in-browser. SUPERSEDES the earlier
image-morph (felt half-finished) AND the first fold attempt (folding the card away
read as "gone", not "stacked"). Final signature interaction: a sticky CARD PILE.
On desktop each project is a compact brief card that pins at an offset growing with
its index (PEEK_REM), so every covered card leaves its top edge peeking — the stack
visibly builds behind. As the next card rises to cover it, the card shrinks (0.94) and
dims (0.6) to recede; the last card never recedes. Native scroll, no scroll-jacking.
The brief card keeps the Outcome beat visible (skimmers get impact un-clicked); the
whole card is a single button that opens an OVERLAY (restored on use-dialog: focus
trap, Escape, return-focus, body-scroll lock, aria-modal) whose body is the full
ProjectCard case study — a single-column reading view (no screenshot; the thumbnail
lives on the brief card), with Problem/Approach/Outcome, tech, and a links CTA row.
Built in two
confirmed stages: placeholder pile mechanic first, then brief content + overlay.
Files: new ProjectCardBrief.js (pile card), ProjectCard.js (full case study, reused
inline AND as overlay body), ProjectsSection.js (Pile + shared overlay). Key
engineering: the deck owns the useScroll target in its own component so it never runs
on the static path / under jsdom; depth driven off the deck's scroll via per-index
slices (uniform brief-card height makes slices track coverage); no perspective on any
sticky ancestor. A11y: the reduced-motion / <768px static stack is the accessibility
baseline and stays FULL-CONTENT inline (no click gate); the overlay is the established
modal contract; the pile is a sighted-pointer enhancement on top.

### 11. Intro Refinements

Source: Fresh Review #

Status: Not Started
