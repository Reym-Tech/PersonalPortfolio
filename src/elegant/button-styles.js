// Shared interaction styles for the Elegant design system.
// Centralized so every button/link keeps identical states (SKILL: prefer
// system consistency over one-off local optimizations).

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elegant-primary focus-visible:ring-offset-2 focus-visible:ring-offset-elegant-surface";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-[8px] text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const filled = "bg-elegant-text text-white hover:bg-elegant-text/90 active:bg-elegant-text/80";
const outlined =
  "border border-[#E5E7EB] bg-elegant-surface text-elegant-text hover:bg-[#F9FAFB] active:bg-[#F3F4F6]";

export const primaryButton = `${buttonBase} ${filled} px-6 py-3 ${focusRing}`;
export const outlineButton = `${buttonBase} ${outlined} px-6 py-3 ${focusRing}`;
export const primaryButtonSm = `${buttonBase} ${filled} px-4 py-2 ${focusRing}`;
export const outlineButtonSm = `${buttonBase} ${outlined} px-4 py-2 ${focusRing}`;

export const focusLink = `rounded-[4px] ${focusRing}`;
