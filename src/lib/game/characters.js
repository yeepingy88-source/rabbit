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

export function drawBunny(ctx, x, y, ts, facing, t, moving, drillActive = false) {
  const s = ts * 0.36, bob = moving ? Math.sin(t * 18) * 0.06 : 0;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,0.28)'; oval(ctx, 0, s * 0.25, s * 0.95, s * 1.05);
  ctx.rotate(Math.atan2(facing.y, facing.x) + Math.PI / 2);
  ctx.scale(1 + bob, 1 - bob);

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
