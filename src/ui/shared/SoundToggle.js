import { useSound } from "../../SoundContext";
import { focusLink } from "../design-system/button-styles";
import { SpeakerOff, SpeakerOn } from "../design-system/icons";

export function SoundToggle({ className = "", variant = "icon" }) {
  const { isMuted, toggleMute } = useSound();
  const ariaLabel = isMuted ? "Turn sound on" : "Turn sound off";

  // Fixed, understated mono text toggle in the lower-left corner — sized to the
  // feature (one minor confirmation cue), so it stays findable without competing for
  // attention. Mirrors the FAB's bottom-right placement and the intro "Skip" voice.
  if (variant === "corner") {
    return (
      <button
        type="button"
        onClick={toggleMute}
        aria-label={ariaLabel}
        aria-pressed={!isMuted}
        className={`fixed bottom-6 left-6 z-30 font-mono text-[0.65rem] uppercase tracking-widest transition-colors ${focusLink} ${isMuted ? "text-elegant-text/35 hover:text-elegant-text/60" : "text-elegant-text/50 hover:text-elegant-text/75"} ${className}`}
      >
        Sound {isMuted ? "Off" : "On"}
      </button>
    );
  }

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={toggleMute}
        aria-label={ariaLabel}
        aria-pressed={!isMuted}
        className={`flex w-full items-center justify-between rounded-none px-4 py-3 text-base text-elegant-text/80 transition-colors hover:bg-elegant-hover ${focusLink} ${className}`}
      >
        <span>Sound</span>
        <span className="font-mono text-sm uppercase tracking-widest text-elegant-text/50">
          {isMuted ? "Off" : "On"}
        </span>
      </button>
    );
  }

  // Muted recedes to half opacity so "off" reads as the quiet default, not an alert.
  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={ariaLabel}
      aria-pressed={!isMuted}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-none transition-colors hover:bg-elegant-hover ${focusLink} ${isMuted ? "text-elegant-text/50" : "text-elegant-text"} ${className}`}
    >
      {isMuted ? <SpeakerOff /> : <SpeakerOn />}
    </button>
  );
}
