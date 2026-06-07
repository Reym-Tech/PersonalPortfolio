import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { createSoundEngine } from "./infrastructure/audio/sound-engine";

const SoundContext = createContext(null);

// Default to ON: the site's only cue is a soft confirmation tick that fires on the
// theme toggle — a user gesture. Nothing autoplays on load, so the usual
// autoplay-with-sound objection doesn't apply here. Only an explicit "1" (the user
// turned sound off) counts as muted.
function getInitialMuted() {
  try {
    return localStorage.getItem("sound-muted") === "1";
  } catch {
    return false;
  }
}

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(getInitialMuted);
  const engineRef = useRef(null);

  const getEngine = useCallback(() => {
    if (!engineRef.current) engineRef.current = createSoundEngine();
    return engineRef.current;
  }, []);

  // When sound is already on at load (persisted from a prior session), no gesture
  // has unlocked the AudioContext yet. Without this, the first cue would create the
  // context and schedule a tone before resume() resolves — and play it silent. Warm
  // it up on the first user gesture so the context is running before any cue fires.
  useEffect(() => {
    if (isMuted) return;
    const warmUp = () => getEngine().unlock();
    window.addEventListener("pointerdown", warmUp, { once: true });
    window.addEventListener("keydown", warmUp, { once: true });
    return () => {
      window.removeEventListener("pointerdown", warmUp);
      window.removeEventListener("keydown", warmUp);
    };
  }, [isMuted, getEngine]);

  const playSound = useCallback(
    (name) => {
      if (isMuted) return;
      getEngine().play(name);
    },
    [isMuted, getEngine],
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
    () => ({ isMuted, toggleMute, playSound }),
    [isMuted, toggleMute, playSound],
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
    }
  );
}
