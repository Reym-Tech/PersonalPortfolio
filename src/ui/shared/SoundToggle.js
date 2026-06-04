import { useSound } from "../../SoundContext";
import { focusLink } from "../design-system/button-styles";
import { SpeakerOff, SpeakerOn } from "../design-system/icons";
import { BORDER } from "../design-system/tokens";

export function SoundToggle({ className = "" }) {
  const { isMuted, toggleMute } = useSound();

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
      aria-pressed={!isMuted}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] border ${BORDER} text-elegant-text transition-colors hover:bg-elegant-hover ${focusLink} ${className}`}
    >
      {isMuted ? <SpeakerOff /> : <SpeakerOn />}
    </button>
  );
}
