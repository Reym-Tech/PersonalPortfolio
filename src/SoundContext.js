import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

import { createSoundEngine } from "./infrastructure/audio/sound-engine";

const SoundContext = createContext(null);

// Default to muted: browsers block autoplay-with-sound anyway, and unsolicited
// audio is the fastest way to lose a visitor. Only an explicit "0" (the user
// turned sound on) counts as unmuted.
function getInitialMuted() {
  try {
    return localStorage.getItem("sound-muted") !== "0";
  } catch {
    return true;
  }
}

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(getInitialMuted);
  const engineRef = useRef(null);

  const getEngine = useCallback(() => {
    if (!engineRef.current) engineRef.current = createSoundEngine();
    return engineRef.current;
  }, []);

  const playSound = useCallback(
    (name) => {
      if (isMuted) return;
      getEngine().play(name);
    },
    [isMuted, getEngine],
  );

  // The entry "Enter" gate is the gesture that unlocks audio: it turns sound on
  // and fires the intro cue in one go. Plays directly on the engine (like the
  // unmute path below) because setIsMuted hasn't re-rendered yet, so the playSound
  // guard would still read muted this tick.
  const enableSound = useCallback(
    (cue) => {
      setIsMuted(false);
      try {
        localStorage.setItem("sound-muted", "0");
      } catch {
        // Storage disabled — preference still applies for this session.
      }
      const engine = getEngine();
      engine.unlock();
      if (cue) engine.play(cue);
    },
    [getEngine],
  );

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    try {
      localStorage.setItem("sound-muted", next ? "1" : "0");
    } catch {
      // Storage disabled — preference still applies for this session.
    }
    // Turning sound on is the gesture that unlocks the AudioContext; confirm it
    // with a tick so the toggle never appears to do nothing.
    if (!next) {
      const engine = getEngine();
      engine.unlock();
      engine.play("toggleLight");
    }
  }, [isMuted, getEngine]);

  const value = useMemo(
    () => ({ isMuted, toggleMute, playSound, enableSound }),
    [isMuted, toggleMute, playSound, enableSound],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

// Null-safe like useTheme: components and tests that render outside a provider get
// a silent, no-op sound surface rather than throwing.
export function useSound() {
  return (
    useContext(SoundContext) ?? {
      isMuted: true,
      toggleMute: () => {},
      playSound: () => {},
      enableSound: () => {},
    }
  );
}
