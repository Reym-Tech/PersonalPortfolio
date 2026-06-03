export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elegant-primary focus-visible:ring-offset-2 focus-visible:ring-offset-elegant-surface";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-[8px] text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

// text-elegant-surface (not literal white) so the filled CTA inverts correctly in
// dark mode: a near-white pill needs near-black text.
const filled = "bg-elegant-text text-elegant-surface hover:bg-elegant-text/90 active:bg-elegant-text/80";
const outlined =
  "border border-elegant-border bg-elegant-surface text-elegant-text hover:bg-elegant-hover active:bg-elegant-active";

export const primaryButton = `${buttonBase} ${filled} px-6 py-3 ${focusRing}`;
export const outlineButton = `${buttonBase} ${outlined} px-6 py-3 ${focusRing}`;
export const primaryButtonSm = `${buttonBase} ${filled} px-4 py-2 ${focusRing}`;
export const outlineButtonSm = `${buttonBase} ${outlined} px-4 py-2 ${focusRing}`;

export const focusLink = `rounded-[4px] ${focusRing}`;
