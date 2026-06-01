Re-review the portfolio after the completion of:                                                                                                                                       regression in the opposite direction from last review's recommendation. Give the link an accessible name (alt="John Remy Gonzales — home" or aria-label on the <a>).

2.3 Hero type now sits directly on the live grid with no scrim — Impact: Low · Effort: Small

Removing the card was right, but there's now no backdrop behind the headline/body. The grid stroke is very faint (rgba(17,24,39,0.07)) so legibility is currently fine — but it's worth a deliberate check at 320px and on lower-contrast displays, since the large headline and the /70 body now overlap moving lines. If it ever reads busy, a soft radial mask behind the text column (not a full card) keeps the grid exposed while protecting contrast.

---
3–8. Cross-cutting read

Visual hierarchy (3): Hero hierarchy is much stronger. One gap inside Projects: on the non-featured cards, "View case study" uses outlineButtonSm — identical weight to "Live demo"/"GitHub"/"APK" sitting beside it (ProjectsSection.js:135-171). The primary action (open the case study) doesn't lead. Make it the visual primary on regular cards too. Impact: Medium · Effort: Small. Brand blue is still nearly invisible site-wide (only the "UM Digos College" italic) — unchanged opportunity.

Motion design (4): The intro→hero handoff is now tight and good. The modal's bottom-sheet-on-mobile / center-rise-on-desktop with reduced-motion fallbacks is high quality. Remaining opportunity is continuity: the 3D intro grid and the 2D hero grid now rhyme conceptually but aren't one continuous space (Phase 3 territory).

UX flow (5): Two of the three worst friction points (5s gate, shallow projects) are fixed. Remaining flow gaps: incomplete nav (1.4), hidden scrollbar (2.1), footer dead-end, and still no scroll affordance hinting there's content below the hero fold.

Accessibility (6): Net mixed. Big gain (project modal); two regressions/inconsistencies (logo alt 2.2, scrollbar 2.1); two carry-overs (cert lightbox 1.6, mobile sidebar still not a trapped dialog, /40–/50 contrast pass still pending). Reduced-motion discipline remains excellent throughout.

Performance (7): Still two always-on costs: the fake-like interval (1.1) and the unpaused LineGrid RAF (1.5).

Memorability / Recruiter perception (8): Materially improved — faster entry, exposed signature interaction, and real case studies move it from "clean template" toward "considered." The ceiling-cappers now are the fake counter (credibility), missing LinkedIn, no share preview, the hidden-scrollbar quirk, and the still-monochrome mid-page card repetition (About→Stats→Skills→Services→Education→Certs share one layout).

---
9. Recruiter perception (delta)

A recruiter now: clears the intro in ~2s, lands on a confident large-type hero with a live reactive grid, and can actually go deep on the burnout predictor via a case-study modal instead of bouncing to GitHub. Strong upgrade. They'll still hit: no LinkedInabricated on close read, a cert number that disagrees with itself, and no link preview when they share the URL internally.

10. Awwwards-level opportunities (still on the table)

1. Unify intro→hero into one continuous grid space — resolve the 3D entry grid into the hero's 2D grid so they read as one camera move, not two canvases. Now that both are grids and
the handoff timing is tight, this is the natural next showcase beat.
2. One intentional brand-color moment — the blue is still essentially unused; a single deliberate accent (featured project, hero, or section rule) would give the monochrome system a
signature.
3. Break mid-page monotony with one full-bleed / asymmetric section — the six stacked card-grids are the remaining "template" read.
4. Scroll-driven sequence on the featured project — the case-study modal is toment on Student Burnout would be the payoff.

---
Revised roadmap (prioritized by ROI)

Phase 2A — Credibility & trust cleanup (cheap, do first; raises the floor)

┌───────────────────────────────────────────────────────────────────────────────────────────┬──────────┬────────┐
│                                            Fix                             ffort │
├───────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────┤
│ Remove fake loopHeartCount interval + dead {item.icon} span + text-justify mall  │
├───────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────┤
│ Reconcile cert count to one source (1.2)                                   mall  │
├───────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────┤
│ Remove site-wide scrollbar hide + leftover CSS comment (2.1)               mall  │
├───────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────┤
│ Restore nav-logo accessible name (2.2)                                     mall  │
├───────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────┤
│ Add OG/Twitter meta + og:image; fix theme-color (1.3)                      mall  │
└───────────────────────────────────────────────────────────────────────────────────────────┴──────────┴────────┘

Phase 2B — Reach, parity & perf (cheap–medium)

┌───────────────────────────────────────────────────────────────────────────────────────────┬──────────────────────┬────────┐
│                                            Fix                             t        │ Effort │
├───────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────┼────────┤
│ Complete nav anchors/links for all sections (1.4)                                   │ Small  │
├───────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────┼────────┤
│ Pause LineGrid RAF when offscreen (1.5)                                             │ Small  │
├───────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────┼────────┤
│ Promote "View case study" to primary on regular cards (3)                           │ Small  │
├───────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────┼────────┤
│ Apply the new modal's dialog pattern to Certifications lightbox + mobile si         │ Medium │
├───────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────┼────────┤
│ Add real LinkedIn + make footer a proper closing                           n: High) │ Medium │
└───────────────────────────────────────────────────────────────────────────────────────────┴──────────────────────┴────────┘

Phase 3 — Identity & the memorable moment (the differentiators)

┌─────────────────────────────────────────────────────────────────────────┬────────┬────────┐
│                                   Fix                                   │ I
├─────────────────────────────────────────────────────────────────────────┼────────┼────────┤
│ Break mid-page card monotony — one full-bleed/asymmetric section (10.3) │ H
├─────────────────────────────────────────────────────────────────────────┼────────┼────────┤
│ Introduce one deliberate brand-blue accent (10.2)                       │ M
├─────────────────────────────────────────────────────────────────────────┼────────┼────────┤
│ Unify intro→hero into a continuous grid (10.1)                          │ H
├─────────────────────────────────────────────────────────────────────────┼────────┼────────┤
│ Scroll-driven sequence on the featured project (10.4)                   │ H
└─────────────────────────────────────────────────────────────────────────┴────────┴────────┘

Net: Phases 1A/1B/1C did exactly the right high-leverage work — entry speed, exposed signature interaction, and project depth are genuinely fixed. The remaining floor-raisers are
almost all Small: the fake counter, the cert mismatch, the hidden scrollbar + and OG tags. Clear those in one pass, then spend Phase 3 on a singledistinctive idea (grid continuity or the featured-project sequence) rather than more uniform polish.

Want me to start on Phase 2A? The five items there are all small, mechanical, and I can do them in one batch.

✻ Churned for 2m 57s

※ recap: I re-reviewed the portfolio after Phases 1A/1B/1C, confirming the intro speed, hero grid, and project case studies are fixed, and flagged remaining issues like the fake like-counter and hidden scrollbar. Next: start Phase 2A cleanup if you approve.