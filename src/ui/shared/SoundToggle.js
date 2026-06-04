import { useSound } from "../../SoundContext";
import { focusLink } from "../design-system/button-styles";
import { SpeakerOff, SpeakerOn } from "../design-system/icons";

export function SoundToggle({ className = "", variant = "icon" }) {
  const { isMuted, toggleMute } = useSound();
  const ariaLabel = isMuted ? "Turn sound on" : "Turn sound off";

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={toggleMute}
        aria-label={ariaLabel}
        aria-pressed={!isMuted}
        className={`flex w-full items-center justify-between rounded-[8px] px-4 py-3 text-base text-elegant-text/80 transition-colors hover:bg-elegant-hover ${focusLink} ${className}`}
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
      className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] transition-colors hover:bg-elegant-hover ${focusLink} ${isMuted ? "text-elegant-text/50" : "text-elegant-text"} ${className}`}
    >
      {isMuted ? <SpeakerOff /> : <SpeakerOn />}
    </button>
  );
}
