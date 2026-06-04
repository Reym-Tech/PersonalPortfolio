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
    send.gain.value = 0.35;
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
    if (name === "toggleDark") playToggle(ctx, out, 0.94, 392);
    else if (name === "toggleLight") playToggle(ctx, out, 1.06, 523.25);
    else if (name === "intro") introSwell(ctx, out);
    else if (name === "droplet") droplet(ctx, out);
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

// Spacious swell for the entry intro, fired on the "Enter" gesture as the grid
// draws in: a slow, weightless bloom rather than a hard rise. A small cluster of
// detuned sines forms a drone that beats gently — the chorus that reads as "wide"
// — drifting up only a fifth, so the room (the bus's long reverb tail) carries the
// motion instead of the pitch. A shimmer an octave up adds air; a dry sub adds
// weight without muddying the tail. Runs ~1.7s, spanning the draw-in before the
// droplet hands off to the Hero.
function introSwell(ctx, out) {
  const now = ctx.currentTime;
  const duration = 1.7;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(2600, now + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.07, now + duration * 0.5);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  filter.connect(gain).connect(out.input);

  [-8, 0, 8].forEach((detune) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.detune.setValueAtTime(detune, now);
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(165, now + duration);
    osc.connect(filter);
    osc.start(now);
    osc.stop(now + duration);
  });

  const shimmer = ctx.createOscillator();
  const shimmerGain = ctx.createGain();
  shimmer.type = "triangle";
  shimmer.frequency.setValueAtTime(330, now);
  shimmer.frequency.exponentialRampToValueAtTime(495, now + duration);
  shimmerGain.gain.setValueAtTime(0.0001, now);
  shimmerGain.gain.exponentialRampToValueAtTime(0.025, now + duration * 0.6);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  shimmer.connect(shimmerGain).connect(out.input);
  shimmer.start(now);
  shimmer.stop(now + duration);

  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = "sine";
  sub.frequency.setValueAtTime(55, now);
  sub.frequency.exponentialRampToValueAtTime(82, now + duration);
  subGain.gain.setValueAtTime(0.0001, now);
  subGain.gain.exponentialRampToValueAtTime(0.12, now + duration * 0.5);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  sub.connect(subGain).connect(out.dryInput);
  sub.start(now);
  sub.stop(now + duration);
}

// Droplet for the entry→Hero handoff: a bright, quick "ploink" — a hard attack
// with a fast downward pitch drop, like something landing on the surface. The
// transient itself is tiny; what bridges the 1.4s crossfade is the bus reverb,
// so it's routed through the reverberant path to leave a ripple ringing as the
// Hero arrives rather than a sound that cuts. Its tail is the one part to judge
// by ear — too short reads as a click, too wet swamps the handoff.
function droplet(ctx, out) {
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(360, now + 0.11);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  osc.connect(gain).connect(out.input);
  osc.start(now);
  osc.stop(now + 0.32);
}
