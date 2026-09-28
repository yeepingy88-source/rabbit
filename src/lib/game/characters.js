const circle = (ctx, x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
const oval = (ctx, x, y, rx, ry) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); };

export function drawCarrot(ctx, x, y, len, rot = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const w = len * 0.42;
  ctx.fillStyle = '#5c9e3f';
  [-0.4, 0, 0.4].forEach((a, i) => {
    ctx.save(); ctx.translate(0, -len * 0.45); ctx.rotate(a + Math.sin(t * 2 + i) * 0.08);
    oval(ctx, 0, -len * 0.2, len * 0.09, len * 0.24);
    ctx.restore();
  });
  ctx.fillStyle = '#f08a3c';
  ctx.beginPath(); ctx.moveTo(-w / 2, -len * 0.45);
  ctx.quadraticCurveTo(0, -len * 0.58, w / 2, -len * 0.45);
  ctx.lineTo(0, len * 0.55); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(170,70,20,0.55)'; ctx.lineWidth = Math.max(1, len * 0.03); ctx.lineCap = 'round';
  for (let i = 1; i < 4; i++) {
    const yy = -len * 0.45 + i * len * 0.22, hw = (w / 2) * (1 - (yy + len * 0.45) / len);
    ctx.beginPath(); ctx.moveTo(-hw * 0.8, yy); ctx.lineTo(-hw * 0.2, yy + len * 0.03); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,225,180,0.35)';
  oval(ctx, w * 0.12, -len * 0.25, len * 0.04, len * 0.14);
  ctx.restore();
}

export function drawMushroom(ctx, x, y, ts, t) {
  const p = 0.85 + 0.15 * Math.sin(t * 2.2);
  const g = ctx.createRadialGradient(x, y, 0, x, y, ts * 0.55 * p);
  g.addColorStop(0, 'rgba(140,255,215,0.45)'); g.addColorStop(1, 'rgba(140,255,215,0)');
  ctx.fillStyle = g; circle(ctx, x, y, ts * 0.55 * p);
  [[0, 0, 1], [ts * 0.13, ts * 0.06, 0.65]].forEach(([dx, dy, k]) => {
    ctx.fillStyle = '#f3ead8'; ctx.fillRect(x + dx - ts * 0.035 * k, y + dy - ts * 0.02, ts * 0.07 * k, ts * 0.13 * k);
    ctx.fillStyle = '#5fe3bb';
    ctx.beginPath(); ctx.ellipse(x + dx, y + dy - ts * 0.01, ts * 0.14 * k, ts * 0.1 * k, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; circle(ctx, x + dx - ts * 0.04 * k, y + dy - ts * 0.06 * k, ts * 0.02 * k);
  });
}

export function drawBurrow(ctx, x, y, ts) {
  ctx.fillStyle = '#4a2c18'; oval(ctx, x, y, ts * 0.42, ts * 0.34);
  ctx.fillStyle = '#1c0f07'; oval(ctx, x, y + ts * 0.03, ts * 0.32, ts * 0.24);
  ctx.strokeStyle = '#d9b56a'; ctx.lineWidth = ts * 0.025; ctx.lineCap = 'round';
  [[-0.38, 0.2, -0.2, 0.32], [0.3, 0.26, 0.44, 0.14], [-0.1, -0.36, 0.1, -0.4]].forEach(([a, b, c, d]) => {
    ctx.beginPath(); ctx.moveTo(x + a * ts, y + b * ts); ctx.lineTo(x + c * ts, y + d * ts); ctx.stroke();
  });
}

export function drawRoots(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y);
  ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.45;
    ctx.strokeStyle = i % 2 ? '#7a5233' : '#5c3d22';
    ctx.lineWidth = s * (i % 2 ? 0.08 : 0.13);
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(
      Math.cos(a) * s * 0.45, Math.sin(a) * s * 0.45 - s * 0.15,
      Math.cos(a) * s * 0.8, Math.sin(a) * s * 0.8 + s * 0.1
    );
    ctx.stroke();
  }
  ctx.fillStyle = '#4a2c18'; circle(ctx, 0, 0, s * 0.22);
  ctx.fillStyle = '#8a6a45'; circle(ctx, -s * 0.05, -s * 0.05, s * 0.13);
  ctx.restore();
}

export function drawDrop(ctx, x, y, ts, t) {
  const p = 0.85 + 0.15 * Math.sin(t * 2.5);
  const g = ctx.createRadialGradient(x, y, 0, x, y, ts * 0.5 * p);
  g.addColorStop(0, 'rgba(110,190,255,0.5)'); g.addColorStop(1, 'rgba(110,190,255,0)');
  ctx.fillStyle = g; circle(ctx, x, y, ts * 0.5 * p);
  const r = ts * 0.16, fy = y + Math.sin(t * 2) * ts * 0.03;
  ctx.fillStyle = '#4db2ff';
  ctx.beginPath();
  ctx.moveTo(x, fy - r * 1.6);
  ctx.bezierCurveTo(x + r, fy - r * 0.4, x + r * 0.9, fy + r * 0.4, x, fy + r * 0.5);
  ctx.bezierCurveTo(x - r * 0.9, fy + r * 0.4, x - r, fy - r * 0.4, x, fy - r * 1.6);
  ctx.fill();
  ctx.fillStyle = '#8ed0ff'; oval(ctx, x - r * 0.25, fy - r * 0.1, r * 0.22, r * 0.42);
}

export function drawMaterial(ctx, x, y, type, ts, t) {
  if (type === 'fiber') {
    ctx.lineCap = 'round'; ctx.lineWidth = ts * 0.05;
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = i % 2 ? '#7fb35a' : '#5c9e3f';
      ctx.beginPath();
      ctx.moveTo(x + (i - 1.5) * ts * 0.08, y + ts * 0.14);
      ctx.quadraticCurveTo(
        x + (i - 1.5) * ts * 0.14 + Math.sin(t * 2 + i) * ts * 0.03, y - ts * 0.05,
        x + (i - 1.5) * ts * 0.16 + Math.sin(-0.7 + i * 0.45) * ts * 0.1, y - ts * 0.18
      );
      ctx.stroke();
    }
  } else if (type === 'shard') {
    // Deep Core Shard (地核碎屑): rare glowing crystal at dead ends
    const p = 0.82 + 0.18 * Math.sin(t * 3.2);
    const g = ctx.createRadialGradient(x, y, 0, x, y, ts * 0.5 * p);
    g.addColorStop(0, 'rgba(255, 60, 110, 0.55)');
    g.addColorStop(1, 'rgba(255, 60, 110, 0)');
    ctx.fillStyle = g; circle(ctx, x, y, ts * 0.5 * p);

    const cy = y + Math.sin(t * 2.8) * ts * 0.04;
    ctx.save();
    ctx.translate(x, cy);
    // Outer glow diamond
    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.moveTo(0, -ts * 0.22);
    ctx.lineTo(ts * 0.16, 0);
    ctx.lineTo(0, ts * 0.22);
    ctx.lineTo(-ts * 0.16, 0);
    ctx.closePath();
    ctx.fill();

    // Top-left facet highlight
    ctx.fillStyle = '#ff80ab';
    ctx.beginPath();
    ctx.moveTo(0, -ts * 0.22);
    ctx.lineTo(ts * 0.16, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(-ts * 0.16, 0);
    ctx.closePath();
    ctx.fill();

    // Inner bright crystal facet
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -ts * 0.18);
    ctx.lineTo(ts * 0.06, -ts * 0.04);
    ctx.lineTo(0, 0);
    ctx.lineTo(-ts * 0.06, -ts * 0.04);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; oval(ctx, x, y + ts * 0.1, ts * 0.26, ts * 0.1);
    ctx.fillStyle = '#9a7b5f'; oval(ctx, x, y, ts * 0.26, ts * 0.2);
    ctx.fillStyle = '#b5987a'; oval(ctx, x - ts * 0.07, y - ts * 0.05, ts * 0.13, ts * 0.09);
    ctx.strokeStyle = '#7a5f47'; ctx.lineWidth = ts * 0.03; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - ts * 0.1, y + ts * 0.04); ctx.lineTo(x + ts * 0.06, y + ts * 0.02); ctx.stroke();
  }
}

export function drawBunny(ctx, x, y, ts, facing, t, moving, drillActive = false, facingLeft = false, smoothTilt = 0) {
  const s = ts * 0.36, bob = moving ? Math.sin(t * 18) * 0.06 : 0;
  ctx.save(); ctx.translate(x, y);

  // Ground shadow beneath the bunny (stable on ground)
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  oval(ctx, 0, s * 0.2, s * 0.8, s * 0.5);

  // Horizontal mirror flip: scaleX(-1) when moving left, scaleX(1) when moving right
  const isLeft = facingLeft !== undefined ? facingLeft : ((facing.x || 0) < 0);
  ctx.scale(isLeft ? -1 : 1, 1);

  // Smooth forward angle (prohibiting upside-down flip)
  // tilt is in [-π/2, π/2], representing angle relative to forward horizontal
  const tilt = smoothTilt !== undefined ? smoothTilt : (facing?.y ? Math.atan2(facing.y, Math.abs(facing.x || 0.001)) : 0);
  ctx.rotate(tilt);

  // Rotate base top-down sprite (+Math.PI / 2) so nose (originally at -Y) points forward along +X
  ctx.rotate(Math.PI / 2);

  // Bobbing hop animation along length and width
  ctx.scale(1 - bob, 1 + bob);

  // If Rock Breaker Drill is active: radiant energy aura
  if (drillActive) {
    const pulse = 1 + 0.15 * Math.sin(t * 6);
    const dg = ctx.createRadialGradient(0, -s * 0.8, 0, 0, -s * 0.8, s * 1.2 * pulse);
    dg.addColorStop(0, 'rgba(0, 240, 255, 0.6)');
    dg.addColorStop(0.5, 'rgba(0, 180, 255, 0.25)');
    dg.addColorStop(1, 'rgba(0, 180, 255, 0)');
    ctx.fillStyle = dg;
    circle(ctx, 0, -s * 0.8, s * 1.2 * pulse);

    // Glowing diamond tip in front
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.6);
    ctx.lineTo(s * 0.3, -s * 1.1);
    ctx.lineTo(0, -s * 0.8);
    ctx.lineTo(-s * 0.3, -s * 1.1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    circle(ctx, 0, -s * 1.2, s * 0.1);
  }

  ctx.fillStyle = '#ffffff'; circle(ctx, 0, s * 0.95, s * 0.3);
  ctx.fillStyle = '#fffaf2'; oval(ctx, 0, s * 0.25, s * 0.78, s * 0.9);
  ctx.fillStyle = '#a0643a'; circle(ctx, -s * 0.48, -s * 0.52, s * 0.2); circle(ctx, s * 0.48, -s * 0.52, s * 0.2);
  ctx.fillStyle = '#fffaf2'; oval(ctx, 0, -s * 0.45, s * 0.6, s * 0.55);
  [-1, 1].forEach((side) => {
    ctx.save(); ctx.translate(side * s * 0.25, -s * 0.55); ctx.rotate(side * 0.28);
    ctx.fillStyle = '#f7efe4'; oval(ctx, 0, s * 0.55, s * 0.18, s * 0.6);
    ctx.fillStyle = '#f7b8c4'; oval(ctx, 0, s * 0.55, s * 0.08, s * 0.44);
    ctx.restore();
  });
  ctx.fillStyle = '#2a1a10'; circle(ctx, -s * 0.33, -s * 0.62, s * 0.08); circle(ctx, s * 0.33, -s * 0.62, s * 0.08);
  ctx.fillStyle = '#fff'; circle(ctx, -s * 0.3, -s * 0.65, s * 0.03); circle(ctx, s * 0.36, -s * 0.65, s * 0.03);
  ctx.fillStyle = '#f59aad'; circle(ctx, 0, -s * 0.96, s * 0.08);
  ctx.fillStyle = 'rgba(245,154,173,0.45)'; circle(ctx, -s * 0.42, -s * 0.4, s * 0.09); circle(ctx, s * 0.42, -s * 0.4, s * 0.09);
  ctx.restore();
}

export function drawBeetle(ctx, x, y, ts, dir, t) {
  const s = ts * 0.32;
  ctx.save();
  ctx.translate(x, y);

  // Drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  oval(ctx, 0, s * 0.15, s * 0.95, s * 0.75);

  // Heading rotation (dir has dx, dy)
  const angle = Math.atan2(dir.dy || 0, dir.dx || 0) + Math.PI / 2;
  ctx.rotate(angle);

  // 6 Animated articulated legs
  ctx.strokeStyle = '#1c1917';
  ctx.lineWidth = Math.max(1.5, s * 0.1);
  ctx.lineCap = 'round';
  [-1, 1].forEach((side) => {
    for (let i = 0; i < 3; i++) {
      const legY = (i - 1) * s * 0.45;
      const wiggle = Math.sin(t * 16 + i * 1.5 + (side > 0 ? Math.PI : 0)) * s * 0.25;
      ctx.beginPath();
      ctx.moveTo(side * s * 0.5, legY);
      ctx.lineTo(side * (s * 1.05 + Math.abs(wiggle) * 0.2), legY + wiggle);
      ctx.lineTo(side * (s * 1.35), legY + wiggle + s * 0.2);
      ctx.stroke();
    }
  });

  // Antennae
  [-1, 1].forEach((side) => {
    const twitch = Math.sin(t * 9 + side) * 0.12;
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = Math.max(1, s * 0.08);
    ctx.beginPath();
    ctx.moveTo(side * s * 0.25, -s * 0.8);
    ctx.quadraticCurveTo(side * (s * 0.6 + twitch * s), -s * 1.2, side * (s * 0.8), -s * 1.5);
    ctx.stroke();
  });

  // Abdomen / Carapace (Dark obsidian metallic chitin)
  const carapaceGrad = ctx.createLinearGradient(-s * 0.7, 0, s * 0.7, 0);
  carapaceGrad.addColorStop(0, '#171717');
  carapaceGrad.addColorStop(0.5, '#292524');
  carapaceGrad.addColorStop(1, '#171717');
  ctx.fillStyle = carapaceGrad;
  oval(ctx, 0, s * 0.15, s * 0.7, s * 0.85);

  // Carapace center split line
  ctx.strokeStyle = '#0c0a09';
  ctx.lineWidth = Math.max(1, s * 0.07);
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.65);
  ctx.lineTo(0, s * 0.95);
  ctx.stroke();

  // Subtle wing sheen highlights
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  oval(ctx, -s * 0.28, s * 0.1, s * 0.16, s * 0.55);
  oval(ctx, s * 0.28, s * 0.1, s * 0.16, s * 0.55);

  // Thorax
  ctx.fillStyle = '#262626';
  oval(ctx, 0, -s * 0.45, s * 0.58, s * 0.32);

  // Head
  ctx.fillStyle = '#171717';
  oval(ctx, 0, -s * 0.72, s * 0.42, s * 0.26);

  // Glowing Crimson Eyes
  const eyeGlowRadius = s * 0.38 * (1 + 0.15 * Math.sin(t * 8));
  [-1, 1].forEach((side) => {
    const eyeX = side * s * 0.24;
    const eyeY = -s * 0.78;

    // Red glow
    const eg = ctx.createRadialGradient(eyeX, eyeY, 0, eyeX, eyeY, eyeGlowRadius);
    eg.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
    eg.addColorStop(0.5, 'rgba(220, 38, 38, 0.4)');
    eg.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.fillStyle = eg;
    circle(ctx, eyeX, eyeY, eyeGlowRadius);

    // Crimson eyeball
    ctx.fillStyle = '#ef4444';
    circle(ctx, eyeX, eyeY, s * 0.1);

    // Bright eye core
    ctx.fillStyle = '#fecaca';
    circle(ctx, eyeX, eyeY - s * 0.02, s * 0.04);
  });

  ctx.restore();
}

export function drawHotSpring(ctx, x, y, ts, t, used = false) {
  ctx.save();
  ctx.translate(x, y);

  // Outer ambient warm glow
  if (!used) {
    const pulse = 1 + 0.08 * Math.sin(t * 3);
    const rad = ts * 0.75 * pulse;
    const g = ctx.createRadialGradient(0, 0, ts * 0.2, 0, 0, rad);
    g.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    g.addColorStop(0.6, 'rgba(56, 189, 248, 0.15)');
    g.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = g;
    circle(ctx, 0, 0, rad);
  }

  // Earthen stone rim
  ctx.fillStyle = '#3e2718';
  circle(ctx, 0, 0, ts * 0.48);
  ctx.fillStyle = '#65432a';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    circle(ctx, Math.cos(a) * ts * 0.38, Math.sin(a) * ts * 0.38, ts * 0.12);
  }

  // Water pool
  ctx.fillStyle = used ? '#0284c7' : '#38bdf8';
  circle(ctx, 0, 0, ts * 0.36);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  circle(ctx, -ts * 0.1, -ts * 0.08, ts * 0.18);

  // Animated steam and heart bubbles
  if (!used) {
    for (let i = 0; i < 3; i++) {
      const st = (t * 1.5 + i * 0.6) % 1;
      const sx = (Math.sin(i * 2.5 + t * 2) * 0.15) * ts;
      const sy = -ts * 0.15 - st * ts * 0.55;
      const sa = Math.sin(st * Math.PI) * 0.8;
      ctx.fillStyle = `rgba(255, 255, 255, ${sa * 0.55})`;
      circle(ctx, sx, sy, ts * (0.05 + st * 0.06));
    }

    // Little floating heart
    const ht = (t * 1.2) % 1;
    const hx = Math.sin(t * 3) * ts * 0.12;
    const hy = -ts * 0.2 - ht * ts * 0.4;
    const ha = Math.sin(ht * Math.PI);
    ctx.font = `${Math.round(ts * 0.28)}px sans-serif`;
    ctx.fillStyle = `rgba(244, 63, 94, ${ha * 0.9})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('❤️', hx, hy);
  }

  ctx.restore();
}

export function drawMolePeddler(ctx, x, y, ts, t) {
  ctx.save();
  ctx.translate(x, y);

  // Gentle idle bounce
  const bounce = Math.sin(t * 4) * ts * 0.03;

  // Wooden Pushcart
  ctx.fillStyle = '#5c3a21';
  ctx.fillRect(-ts * 0.42, -ts * 0.15 + bounce, ts * 0.4, ts * 0.35);
  ctx.fillStyle = '#3d2514';
  ctx.fillRect(-ts * 0.42, -ts * 0.15 + bounce, ts * 0.4, ts * 0.06);

  // Pushcart wheels
  ctx.fillStyle = '#1c1917';
  circle(ctx, -ts * 0.35, ts * 0.22 + bounce, ts * 0.09);
  circle(ctx, -ts * 0.12, ts * 0.22 + bounce, ts * 0.09);
  ctx.fillStyle = '#78716c';
  circle(ctx, -ts * 0.35, ts * 0.22 + bounce, ts * 0.03);
  circle(ctx, -ts * 0.12, ts * 0.22 + bounce, ts * 0.03);

  // Goods on cart: Glowing bottle & crystals
  ctx.fillStyle = '#06b6d4';
  oval(ctx, -ts * 0.3, -ts * 0.24 + bounce, ts * 0.05, ts * 0.08);
  ctx.fillStyle = '#f59e0b';
  oval(ctx, -ts * 0.18, -ts * 0.24 + bounce, ts * 0.05, ts * 0.07);

  // Small lantern hanging from pole
  ctx.strokeStyle = '#292524';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-ts * 0.38, -ts * 0.15 + bounce);
  ctx.lineTo(-ts * 0.38, -ts * 0.38 + bounce);
  ctx.stroke();
  const lanternGlow = 1 + 0.15 * Math.sin(t * 5);
  const lg = ctx.createRadialGradient(-ts * 0.38, -ts * 0.38 + bounce, 0, -ts * 0.38, -ts * 0.38 + bounce, ts * 0.25 * lanternGlow);
  lg.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
  lg.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = lg;
  circle(ctx, -ts * 0.38, -ts * 0.38 + bounce, ts * 0.25 * lanternGlow);
  ctx.fillStyle = '#fbbf24';
  circle(ctx, -ts * 0.38, -ts * 0.38 + bounce, ts * 0.05);

  // Mole Body
  ctx.fillStyle = '#292524';
  oval(ctx, ts * 0.16, ts * 0.05 + bounce, ts * 0.22, ts * 0.26);

  // Mole Snout
  ctx.fillStyle = '#f472b6';
  oval(ctx, ts * 0.16, ts * 0.04 + bounce, ts * 0.11, ts * 0.08);
  ctx.fillStyle = '#be185d';
  circle(ctx, ts * 0.16, ts * 0.01 + bounce, ts * 0.04);

  // Cool Black Sunglasses!
  ctx.fillStyle = '#09090b';
  oval(ctx, ts * 0.08, -ts * 0.08 + bounce, ts * 0.07, ts * 0.055);
  oval(ctx, ts * 0.24, -ts * 0.08 + bounce, ts * 0.07, ts * 0.055);
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ts * 0.02, -ts * 0.08 + bounce);
  ctx.lineTo(ts * 0.3, -ts * 0.08 + bounce);
  ctx.stroke();

  // White lens glint
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ts * 0.06, -ts * 0.1 + bounce);
  ctx.lineTo(ts * 0.09, -ts * 0.06 + bounce);
  ctx.moveTo(ts * 0.22, -ts * 0.1 + bounce);
  ctx.lineTo(ts * 0.25, -ts * 0.06 + bounce);
  ctx.stroke();

  // Little miner hardhat with a light
  ctx.fillStyle = '#ea580c';
  oval(ctx, ts * 0.16, -ts * 0.22 + bounce, ts * 0.18, ts * 0.09);
  circle(ctx, ts * 0.16, -ts * 0.24 + bounce, ts * 0.05);

  // "🕶️" floating badge
  const talkPulse = Math.sin(t * 3) * 2;
  ctx.fillStyle = '#fbbf24';
  ctx.font = `bold ${Math.round(ts * 0.24)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('🕶️', ts * 0.16, -ts * 0.38 + bounce + talkPulse);

  ctx.restore();
}

export function drawLuckyBox(ctx, x, y, ts, t, opened = false) {
  ctx.save();
  ctx.translate(x, y);

  if (!opened) {
    // Golden mystery aura
    const pulse = 1 + 0.1 * Math.sin(t * 4);
    const g = ctx.createRadialGradient(0, 0, ts * 0.1, 0, 0, ts * 0.6 * pulse);
    g.addColorStop(0, 'rgba(245, 158, 11, 0.55)');
    g.addColorStop(0.7, 'rgba(245, 158, 11, 0.15)');
    g.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = g;
    circle(ctx, 0, 0, ts * 0.6 * pulse);
  }

  // Chest Base
  const bw = ts * 0.62, bh = ts * 0.36;
  ctx.fillStyle = '#78350f';
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(-bw / 2, -bh / 2 + ts * 0.08, bw, bh, ts * 0.06);
  } else {
    ctx.rect(-bw / 2, -bh / 2 + ts * 0.08, bw, bh);
  }
  ctx.fill();

  // Wood planks
  ctx.fillStyle = '#92400e';
  ctx.fillRect(-bw / 2 + ts * 0.04, -bh / 2 + ts * 0.12, bw - ts * 0.08, bh - ts * 0.08);

  // Golden metal bands
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-bw * 0.35, -bh / 2 + ts * 0.08, ts * 0.06, bh);
  ctx.fillRect(bw * 0.35 - ts * 0.06, -bh / 2 + ts * 0.08, ts * 0.06, bh);

  if (!opened) {
    // Closed Lid
    ctx.fillStyle = '#b45309';
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-bw / 2 - ts * 0.02, -bh / 2 - ts * 0.12, bw + ts * 0.04, ts * 0.22, ts * 0.08);
    } else {
      ctx.rect(-bw / 2 - ts * 0.02, -bh / 2 - ts * 0.12, bw + ts * 0.04, ts * 0.22);
    }
    ctx.fill();

    // Golden lock
    ctx.fillStyle = '#fbbf24';
    circle(ctx, 0, -bh / 2 + ts * 0.04, ts * 0.07);
    ctx.fillStyle = '#451a03';
    circle(ctx, 0, -bh / 2 + ts * 0.04, ts * 0.025);

    // Sparkle star
    const starA = Math.abs(Math.sin(t * 3));
    ctx.fillStyle = `rgba(255, 255, 255, ${starA})`;
    ctx.font = `${Math.round(ts * 0.22)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('✨', bw * 0.38, -bh * 0.6);
  } else {
    // Open Lid
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(-bw / 2, -bh / 2 + ts * 0.08);
    ctx.lineTo(-bw / 2 - ts * 0.06, -bh / 2 - ts * 0.24);
    ctx.lineTo(bw / 2 + ts * 0.06, -bh / 2 - ts * 0.24);
    ctx.lineTo(bw / 2, -bh / 2 + ts * 0.08);
    ctx.closePath();
    ctx.fill();

    // Inner golden glow
    ctx.fillStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.fillRect(-bw * 0.4, -bh / 2 + ts * 0.06, bw * 0.8, ts * 0.12);
  }

  ctx.restore();
}
