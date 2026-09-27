let actx;
let muted = localStorage.getItem('bunny_muted') === '1';

function tone(freq, dur, type = 'sine', vol = 0.12, slide) {
  if (muted) return;
  actx = actx || new (window.AudioContext || window.webkitAudioContext)();
  const now = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, now);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, now + dur);
  g.gain.setValueAtTime(vol, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + dur);
  o.connect(g).connect(actx.destination);
  o.start(now); o.stop(now + dur);
}

const seq = (notes, gap, type = 'square', vol = 0.07) =>
  notes.forEach((f, i) => setTimeout(() => tone(f, 0.22, type, vol), i * gap));

export const sfx = {
  dig: () => { tone(200, 0.14, 'square', 0.06, 70); setTimeout(() => tone(130, 0.14, 'triangle', 0.1, 50), 70); },
  thud: () => tone(95, 0.22, 'sine', 0.22, 40),
  tired: () => tone(320, 0.25, 'triangle', 0.08, 140),
  pickup: () => seq([660, 990], 70),
  water: () => seq([880, 1320], 70, 'sine', 0.08),
  material: () => tone(700, 0.12, 'triangle', 0.09, 1000),
  craftReady: () => seq([784, 1175], 100),
  click: () => tone(540, 0.06, 'triangle', 0.08),
  win: () => seq([523, 659, 784, 1047, 1319], 130),
  shatter: () => {
    tone(130, 0.35, 'sawtooth', 0.25, 40);
    setTimeout(() => tone(240, 0.25, 'square', 0.15, 60), 60);
    setTimeout(() => seq([880, 1175, 1760], 50, 'sine', 0.1), 120);
  },
  tick: () => tone(880, 0.04, 'sine', 0.05),
};

export const isMuted = () => muted;
export function setMuted(m) {
  muted = m;
  localStorage.setItem('bunny_muted', m ? '1' : '0');
}