// The heading type scale — one source of truth so title tiers can't drift per-component
// (the way button-styles.js owns button shape). Three roles across the site: display
// (Space Grotesk) for every heading, sans (Inter) for body, mono for labels/indices.
//
// Every heading is `font-display` + `tracking-tight` — Space Grotesk reads loose at size
// without it. Headings are `font-semibold` except the smaller section variant, which stays
// `font-medium` on purpose: the size + weight step-down is what gives the page its rhythm.
//
// Layout-specific classes (margins, max-width, text-balance) stay at the call site; these
// constants carry only font / size / weight / leading / tracking.

export const heroTitle =
  "font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight md:text-[3.25rem] lg:text-[3.5rem]";

// Section <h2> (via SectionHeading). `sectionTitle` is the larger anchor scale; the Sm
// variant steps down for restraint on secondary sections.
export const sectionTitle =
  "font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight md:text-[3.5rem]";
export const sectionTitleSm =
  "font-display text-[2rem] font-medium leading-tight tracking-tight md:text-[2.5rem]";

// Card / sub-section <h3> scale — one font, weight, and tracking; only the size steps down.
// Lg = project case study; base = feature cards (pile brief, services); Sm = info cards
// (certificate, education, the About sub-cards, the footer name).
export const cardTitleLg =
  "font-display text-2xl font-semibold leading-tight tracking-tight md:text-3xl";
export const cardTitle =
  "font-display text-xl font-semibold leading-tight tracking-tight md:text-2xl";
export const cardTitleSm =
  "font-display text-lg font-semibold leading-tight tracking-tight";
