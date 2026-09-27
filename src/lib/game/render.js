import { drawTile } from './tiles';
import {
  drawCarrot,
  drawBunny,
  drawBurrow,
  drawRoots,
  drawDrop,
  drawMaterial,
  drawBeetle,
  drawHotSpring,
  drawMolePeddler,
  drawLuckyBox,
} from './characters';

const PARTICLE_COLORS = ['#c99461', '#8a5a33', '#e0b584', '#00f0ff', '#ef4444'];
const DRILL_PARTICLE_COLORS = ['#00f0ff', '#ffffff', '#70e0ff', '#ff0055'];

export function render(ctx, fog, s, w, h, t, dpr) {
  const ts = Math.max(36, Math.min(w, h) / 7.5);
  const sh = s.shake * 30;
  const camX = s.x * ts - w / 2 + (Math.random() - 0.5) * sh;
  const camY = s.y * ts - h / 2 + (Math.random() - 0.5) * sh;
  ctx.fillStyle = '#1a0f08';
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(-camX, -camY);
  const x0 = Math.max(0, Math.floor(camX / ts)), x1 = Math.min(s.W - 1, Math.ceil((camX + w) / ts));
  const y0 = Math.max(0, Math.floor(camY / ts)), y1 = Math.min(s.H - 1, Math.ceil((camY + h) / ts));
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) drawTile(ctx, s.grid[y][x], x * ts, y * ts, ts, x, y, t);

  drawBurrow(ctx, (s.start.x + 0.5) * ts, (s.start.y + 0.5) * ts, ts);
  drawRoots(ctx, (s.landmark.x + 0.5) * ts, (s.landmark.y + 0.5) * ts, ts * 2);

  // Subterranean Encounters
  (s.encounters || []).forEach((enc) => {
    if (enc.type === 'spring') {
      drawHotSpring(ctx, (enc.x + 0.5) * ts, (enc.y + 0.5) * ts, ts, t, enc.used);
    } else if (enc.type === 'merchant') {
      drawMolePeddler(ctx, (enc.x + 0.5) * ts, (enc.y + 0.5) * ts, ts, t);
    } else if (enc.type === 'chest') {
      drawLuckyBox(ctx, (enc.x + 0.5) * ts, (enc.y + 0.5) * ts, ts, t, enc.opened);
    }
  });

  s.droplets.forEach((d) => !d.taken && drawDrop(ctx, (d.x + 0.5 + d.ox) * ts, (d.y + 0.5 + d.oy) * ts, ts, t + d.x));
  s.materials.forEach((m) => !m.taken && drawMaterial(ctx, (m.x + 0.5 + m.ox) * ts, (m.y + 0.5 + m.oy) * ts, m.type, ts, t));
  s.carrots.forEach((c) => !c.taken && drawCarrot(ctx, (c.x + 0.5) * ts, (c.y + 0.5) * ts + Math.sin(t * 3 + c.x) * ts * 0.05, ts * 0.5, 0.5, t));

  const isFinal = s.level >= 20;
  const gx = (s.exit.x - 0.6) * ts, gy = (s.exit.y + 0.5) * ts;
  const glowRad = isFinal ? ts * 2.6 : ts * 1.4;
  const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowRad);
  if (isFinal) {
    glow.addColorStop(0, 'rgba(255,220,50,0.85)');
    glow.addColorStop(0.4, 'rgba(255,140,0,0.45)');
    glow.addColorStop(1, 'rgba(255,140,0,0)');
  } else {
    glow.addColorStop(0, 'rgba(255,200,120,0.45)');
    glow.addColorStop(1, 'rgba(255,200,120,0)');
  }
  ctx.fillStyle = glow; ctx.fillRect(gx - glowRad, gy - glowRad, glowRad * 2, glowRad * 2);
  drawCarrot(ctx, gx, gy, isFinal ? ts * 3.0 : ts * 1.9, 1.2, t);

  s.particles.forEach((p) => {
    ctx.fillStyle = p.drill ? DRILL_PARTICLE_COLORS[p.c % 4] : PARTICLE_COLORS[p.c % 5];
    ctx.globalAlpha = Math.min(1, p.life * 2);
    ctx.fillRect(p.x * ts - ts * 0.04, p.y * ts - ts * 0.04, ts * 0.08, ts * 0.08);
  });
  ctx.globalAlpha = 1;

  // Draw Cave Beetles (Level 40+)
  (s.beetles || []).forEach((b) => {
    drawBeetle(ctx, b.x * ts, b.y * ts, ts, b, t);
  });

  // Bunny blink feedback during invulnerability cooldown
  const isBlinking = s.beetleCooldown > 0 && Math.floor(t * 20) % 2 === 0;
  if (isBlinking) ctx.globalAlpha = 0.45;
  drawBunny(ctx, s.x * ts, s.y * ts, ts, s.facing, t, s.moving, s.drillActive);
  ctx.globalAlpha = 1;
  ctx.restore();

  // Full Vision Lens active: Skip fog of war
  if (s.visionTimer > 0) {
    return;
  }

  // Fog of war
  if (fog.width !== Math.round(w * dpr) || fog.height !== Math.round(h * dpr)) {
    fog.width = Math.round(w * dpr); fog.height = Math.round(h * dpr);
  }
  const f = fog.getContext('2d');
  f.setTransform(dpr, 0, 0, dpr, 0, 0);
  f.globalCompositeOperation = 'source-over';
  f.clearRect(0, 0, w, h);
  f.fillStyle = 'rgba(16,9,5,0.97)';
  f.fillRect(0, 0, w, h);
  f.globalCompositeOperation = 'destination-out';
  const hole = (x, y, r) => {
    const g = f.createRadialGradient(x, y, r * 0.35, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    f.fillStyle = g; f.beginPath(); f.arc(x, y, r, 0, Math.PI * 2); f.fill();
  };
  hole(s.x * ts - camX, s.y * ts - camY, ts * 2.8);
  s.droplets.forEach((d) => !d.taken && hole((d.x + 0.5 + d.ox) * ts - camX, (d.y + 0.5 + d.oy) * ts - camY, ts * (1 + 0.1 * Math.sin(t * 2.5 + d.x))));
  s.materials
    .filter((m) => m.type === 'shard' && !m.taken)
    .forEach((m) => hole((m.x + 0.5) * ts - camX, (m.y + 0.5) * ts - camY, ts * 1.1));

  (s.encounters || []).forEach((enc) => {
    if (enc.type === 'spring' && !enc.used) {
      hole((enc.x + 0.5) * ts - camX, (enc.y + 0.5) * ts - camY, ts * 1.5);
    } else if (enc.type === 'merchant') {
      hole((enc.x + 0.5) * ts - camX, (enc.y + 0.5) * ts - camY, ts * 1.4);
    }
  });

  hole(gx - camX, gy - camY, ts * 1.5);
  ctx.drawImage(fog, 0, 0, w, h);
}