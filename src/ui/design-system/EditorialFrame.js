// Signature visual device (review #3): corner crop-marks + mono coordinate labels that
// frame a block like a technical drawing, tying the page to its mono-editorial vocabulary.
// Purely decorative (aria-hidden); the parent must be `relative`.
// `inset` positions the marks relative to that parent. The default insets past a section's
// py-24 / px-6 padding so the marks hug the content rather than floating at the section's
// outer corners; it must track the parent's padding. Parents that already pad their content
// (e.g. the hero card) pass `inset="inset-0"`.
// Light mode needs a stronger tick than dark — a hairline of near-white on a dark surface
// reads more than the same alpha of near-black on white.
export function EditorialFrame({
  topLeft,
  bottomRight,
  inset = "inset-y-16 inset-x-0",
  tone = "border-elegant-text/45 dark:border-elegant-text/30",
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${inset}`}>
      <span className={`absolute left-0 top-0 h-3.5 w-3.5 border-l border-t ${tone}`} />
      <span className={`absolute right-0 top-0 h-3.5 w-3.5 border-r border-t ${tone}`} />
      <span className={`absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l ${tone}`} />
      <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r ${tone}`} />

      {topLeft && (
        <span className="absolute left-5 top-1 font-mono text-[0.65rem] uppercase tracking-widest text-elegant-text/55 dark:text-elegant-text/40">
          {topLeft}
        </span>
      )}
      {bottomRight && (
        <span className="absolute bottom-1 right-5 font-mono text-[0.65rem] uppercase tracking-widest text-elegant-text/55 dark:text-elegant-text/40">
          {bottomRight}
        </span>
      )}
    </div>
  );
}
