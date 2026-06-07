// Procedural sound engine on the Web Audio API. Tones are synthesized at play
// time rather than loaded from audio files, so the site's sound shares the
// generative character of its visuals and ships no extra assets. Every method is
// a safe no-op where Web Audio is unavailable (e.g. the jsdom test environment),
// so callers never need to feature-detect.
//
// Cues route through a shared master bus — a dry path plus a convolution-reverb
// send — so each one blooms in a room rather than sounding bare and electronic.
// A gentle limiter on the bus glues overlapping layers and guards against
// clipping. This "space and warmth" is what separates a designed cue from a beep.

import { LIGHT_SWITCH_BASE64 } from "./light-switch-sample";

const AudioContextClass =
  typeof window !== "undefined"
    ? window.AudioContext || window.webkitAudioContext
    : undefined;

// Reverb send for the toggle bus. Touch devices usually play through small speakers
// that shed the reverb tail and low end, so the same click reads thinner there; a
// wetter send (plus the body layer below) claws some presence back without making
// the desktop mix washy — which would re-introduce the "too cinematic" clash this
// sound was dialed back from.
const REVERB_SEND = 0.35;
const REVERB_SEND_COMPACT = 0.46;

const prefersCompactMix = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(pointer: coarse)").matches;

export function createSoundEngine() {
  let context = null;
  let bus = null;
  let switchBuffer = null;
  let switchRequested = false;

  // A fresh AudioContext starts "suspended" and stays silent until resumed from a
  // user gesture. Callers invoke play()/unlock() from click handlers, so resuming
  // here lazily is enough to unlock audio.
  const ensureContext = () => {
    if (!AudioContextClass) return null;
    if (!context) context = new AudioContextClass();
    if (context.state === "suspended") context.resume();
    return context;
  };

  // Built once per context. `input` is the reverberant path (dry + wet) for tonal
  // cues; `dryInput` bypasses the reverb for sub-bass, which would otherwise turn
  // the tail to mud.
  const ensureBus = (ctx) => {
    if (bus) return bus;

    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -3;
    limiter.knee.value = 6;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.18;
    limiter.connect(ctx.destination);

    const input = ctx.createGain();
    const dry = ctx.createGain();
    dry.gain.value = 0.85;
    const send = ctx.createGain();
    send.gain.value = prefersCompactMix() ? REVERB_SEND_COMPACT : REVERB_SEND;
    const reverb = ctx.createConvolver();
    reverb.buffer = createImpulseResponse(ctx, 1.8, 2.4);

    input.connect(dry).connect(limiter);
    input.connect(send).connect(reverb).connect(limiter);

    const dryInput = ctx.createGain();
    dryInput.connect(limiter);

    bus = { input, dryInput };
    return bus;
  };

  // Decode the inlined switch sample once. The bytes are already in the bundle
  // (no network request — see light-switch-sample.js), so this only does the
  // async decode. Until it resolves (or if it fails), toggles fall back to the
  // synth tick, so audio never depends on the sample.
  const loadSwitch = (ctx) => {
    if (switchRequested) return;
    switchRequested = true;
    Promise.resolve()
      .then(() => ctx.decodeAudioData(decodeBase64(LIGHT_SWITCH_BASE64)))
      .then((buffer) => { switchBuffer = buffer; })
      .catch(() => { switchBuffer = null; });
  };

  // playbackRate doubles as a pitch shift, so the one sample reads directional:
  // slightly down toward dark, up toward light. Falls back to the synth tick (with
  // its own pitch) until the sample has decoded.
  const playToggle = (ctx, out, rate, freq) => {
    if (!switchBuffer) {
      tick(ctx, out, freq);
      return;
    }
    const source = ctx.createBufferSource();
    source.buffer = switchBuffer;
    source.playbackRate.value = rate;
    source.connect(out.input);
    source.start();
  };

  const unlock = () => {
    const ctx = ensureContext();
    if (!ctx) return Promise.resolve();
    // Preload here so the sample is ready by the first theme toggle: unmuting is
    // the gesture that unlocks audio and is the earliest point a fetch can run.
    loadSwitch(ctx);
    return ctx.resume();
  };

  const play = (name) => {
    const ctx = ensureContext();
    if (!ctx) return;
    const out = ensureBus(ctx);
    loadSwitch(ctx);
    // The recorded click is the snap; body() adds the cinematic weight under it.
    // Lower frequency toward dark, higher toward light, matching the click's pitch.
    if (name === "toggleDark") {
      playToggle(ctx, out, 0.94, 392);
      body(ctx, out, 150);
    } else if (name === "toggleLight") {
      playToggle(ctx, out, 1.06, 523.25);
      body(ctx, out, 190);
    }
  };

  return { unlock, play };
}

// Turn the inlined base64 sample into the ArrayBuffer decodeAudioData expects.
function decodeBase64(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

// An intimate hall, not a cathedral — exponentially decaying stereo noise makes a
// smooth, controlled tail. Luxury reads as a tight, deliberate room, not a wash.
function createImpulseResponse(ctx, seconds, decay) {
  const rate = ctx.sampleRate;
  const length = Math.max(1, Math.floor(seconds * rate));
  const impulse = ctx.createBuffer(2, length, rate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

// Soft pluck for discrete confirmations (theme/sound toggles). Near-instant
// attack into a short exponential decay; peak gain is kept low so it reads as a
// gentle tick, never a notification chime. The reverb send gives it bloom. Pitch
// is passed in so a direction can be heard (lower for dark, higher for light).
function tick(ctx, out, freq) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, now);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2200, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.06, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  osc.connect(filter).connect(gain).connect(out.input);
  osc.start(now);
  osc.stop(now + 0.2);
}

// Cinematic weight layered under the toggle click. A short low-mid triangle with a
// quick downward pitch drop reads as a "thud" that gives the snap body; its
// overtones survive small phone speakers (missing-fundamental effect) where the
// reverb tail is lost. Gain stays low so it reinforces the click, never booms.
function body(ctx, out, freq) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.07);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(520, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.05, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

  osc.connect(filter).connect(gain).connect(out.input);
  osc.start(now);
  osc.stop(now + 0.15);
}
