import { PATH, SOFT, STONE, EXIT, BEDROCK } from './maze';

const HALF = 0.27, SPEED = 4.32; // +20% faster exploration (was 3.6)
// In-level claw dig cost is fixed at 18 stamina per tile
export const DIG_COST = 18;

function solidAt(s, x, y) {
  const tx = Math.floor(x), ty = Math.floor(y);
  if (tx < 0 || ty < 0 || tx >= s.W || ty >= s.H) return true;
  const v = s.grid[ty][tx];
  return v === SOFT || v === STONE || v === BEDROCK;
}

function hits(s, x, y) {
  return solidAt(s, x - HALF, y - HALF) || solidAt(s, x + HALF, y - HALF) ||
    solidAt(s, x - HALF, y + HALF) || solidAt(s, x + HALF, y + HALF);
}

const clamp = (v, a) => Math.max(-a, Math.min(a, v));

function nudge(s, axis, dir, amt) {
  if (axis === 'y') {
    const row = Math.floor(s.y);
    if (solidAt(s, Math.floor(s.x) + dir + 0.5, row + 0.5)) return;
    const ny = s.y + clamp(row + 0.5 - s.y, amt);
    if (!hits(s, s.x, ny)) s.y = ny;
  } else {
    const col = Math.floor(s.x);
    if (solidAt(s, col + 0.5, Math.floor(s.y) + dir + 0.5)) return;
    const nx = s.x + clamp(col + 0.5 - s.x, amt);
    if (!hits(s, nx, s.y)) s.x = nx;
  }
}

export function step(s, input, dt, ev) {
  if (s.won) return;
  s.time += dt;
  // Intentionally NO passive stamina regen
  s.shake = Math.max(0, s.shake - dt);

  // Timers countdown
  if (s.speedTimer > 0) s.speedTimer = Math.max(0, s.speedTimer - dt);
  if (s.visionTimer > 0) s.visionTimer = Math.max(0, s.visionTimer - dt);

  const ix = input.x, iy = input.y;
  s.moving = !!(ix || iy);
  if (s.moving) {
    s.facing = { x: ix, y: iy };
    // Track horizontal orientation: scaleX(-1) when left, scaleX(1) when right
    if (ix < -0.05) {
      s.facingLeft = true;
    } else if (ix > 0.05) {
      s.facingLeft = false;
    }

    const currentSpeed = s.speedTimer > 0 ? SPEED * 1.6 : SPEED;
    const d = currentSpeed * dt;
    const nx = s.x + ix * d;
    if (!hits(s, nx, s.y)) s.x = nx; else if (!iy) nudge(s, 'y', Math.sign(ix), d);
    const ny = s.y + iy * d;
    if (!hits(s, s.x, ny)) s.y = ny; else if (!ix) nudge(s, 'x', Math.sign(iy), d);

    // Track revealed footprint trail
    const curTx = Math.floor(s.x);
    const curTy = Math.floor(s.y);
    if (curTx >= 0 && curTx < s.W && curTy >= 0 && curTy < s.H && s.visited) {
      s.visited[curTy][curTx] = true;
    }

    // Rocket shoes particles
    if (s.speedTimer > 0 && Math.random() < 0.4) {
      s.particles.push({
        x: s.x - ix * 0.25,
        y: s.y - iy * 0.25,
        vx: -ix * 1.5 + (Math.random() - 0.5) * 1.0,
        vy: -iy * 1.5 + (Math.random() - 0.5) * 1.0,
        life: 0.35,
        c: 3, // glowing cyan / orange trail
        drill: true,
      });
    }
  }

  // Smooth forward angle calculation (screen-space vertical tilt)
  // targetTilt is in [-π/2, π/2] (upwards is negative, downwards is positive, forward is 0).
  // Using Math.abs(ix) ensures targetTilt is strictly within [-π/2, π/2],
  // mathematically prohibiting upside-down flip while smoothly aligning with the forward vector.
  let targetTilt = s.smoothTilt !== undefined ? s.smoothTilt : 0;
  if (s.moving) {
    const absX = Math.abs(ix);
    targetTilt = Math.atan2(iy, absX);
  }
  const rotSpeed = 16; // snappy yet smooth transition
  s.smoothTilt = (s.smoothTilt !== undefined ? s.smoothTilt : 0) +
    (targetTilt - (s.smoothTilt !== undefined ? s.smoothTilt : 0)) * Math.min(1, dt * rotSpeed);

  for (const c of s.carrots) {
    if (!c.taken && Math.hypot(c.x + 0.5 - s.x, c.y + 0.5 - s.y) < 0.55) {
      c.taken = true;
      s.stamina = Math.min(100, s.stamina + 15);
      ev.push('pickup');
    }
  }
  for (const d of s.droplets) {
    if (!d.taken && Math.hypot(d.x + 0.5 + d.ox - s.x, d.y + 0.5 + d.oy - s.y) < 0.55) {
      d.taken = true;
      s.stamina = Math.min(100, s.stamina + 25);
      s.water++;
      ev.push('water');
    }
  }
  // Grass roots & craft materials pickup (comfortable 0.6 tile radius)
  for (const m of s.materials) {
    if (!m.taken && Math.hypot(m.x + 0.5 + m.ox - s.x, m.y + 0.5 + m.oy - s.y) < 0.6) {
      m.taken = true;
      ev.push(m.type);
    }
  }

  // Subterranean Encounters Interaction
  if (s.encounters) {
    for (const enc of s.encounters) {
      const dist = Math.hypot(enc.x + 0.5 - s.x, enc.y + 0.5 - s.y);

      // 1. Hot Spring (restores stamina to 100 & heart particles)
      if (enc.type === 'spring' && !enc.used && dist < 0.65) {
        enc.used = true;
        s.stamina = 100;
        // Healing particles
        for (let i = 0; i < 16; i++) {
          const a = Math.random() * Math.PI * 2, v = 1 + Math.random() * 2;
          s.particles.push({
            x: enc.x + 0.5,
            y: enc.y + 0.5,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v - 1.2,
            life: 0.6 + Math.random() * 0.4,
            c: 3,
            drill: true,
          });
        }
        ev.push('hotSpring');
      }

      // 2. Mole Peddler (near notification - trigger once per proximity approach)
      if (enc.type === 'merchant') {
        if (dist < 0.85 && !s.merchantNotified) {
          s.merchantNotified = true;
          ev.push('nearMerchant');
        } else if (dist > 1.8) {
          s.merchantNotified = false;
        }
      }

      // 3. Mysterious Lucky Box (chest opening)
      if (enc.type === 'chest' && !enc.opened && dist < 0.65) {
        enc.opened = true;
        const gotShard = Math.random() < 0.5;
        // Chest opening golden particles
        for (let i = 0; i < 24; i++) {
          const a = Math.random() * Math.PI * 2, v = 1.5 + Math.random() * 3.5;
          s.particles.push({
            x: enc.x + 0.5,
            y: enc.y + 0.5,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v - 1.5,
            life: 0.7 + Math.random() * 0.4,
            c: i % 4,
            drill: true,
          });
        }
        ev.push({ type: 'luckyBox', gotShard });
      }
    }
  }

  // Update Cave Beetles (Level 40+)
  if (s.beetles && s.beetles.length > 0) {
    if (s.beetleCooldown > 0) {
      s.beetleCooldown = Math.max(0, s.beetleCooldown - dt);
    }

    for (const b of s.beetles) {
      const bSpeed = b.speed || 1.85;
      if (b.axis === 'x') {
        const nx = b.x + b.dx * bSpeed * dt;
        const frontCol = Math.floor(nx + b.dx * 0.42);
        const row = Math.floor(b.y);
        const blocked = frontCol < 1 || frontCol >= s.W - 1 ||
                        row < 1 || row >= s.H - 1 ||
                        s.grid[row]?.[frontCol] !== PATH ||
                        nx < b.minCoord || nx > b.maxCoord;
        if (blocked) {
          b.dx = -b.dx;
        } else {
          b.x = nx;
        }
      } else {
        const ny = b.y + b.dy * bSpeed * dt;
        const frontRow = Math.floor(ny + b.dy * 0.42);
        const col = Math.floor(b.x);
        const blocked = frontRow < 1 || frontRow >= s.H - 1 ||
                        col < 1 || col >= s.W - 1 ||
                        s.grid[frontRow]?.[col] !== PATH ||
                        ny < b.minCoord || ny > b.maxCoord;
        if (blocked) {
          b.dy = -b.dy;
        } else {
          b.y = ny;
        }
      }

      // Check collision with bunny (< 0.7 tiles radius)
      const dist = Math.hypot(s.x - b.x, s.y - b.y);
      const isInvincible = (s.invincibleUntil && Date.now() < s.invincibleUntil) || (s.beetleCooldown > 0);
      if (dist < 0.7 && !isInvincible) {
        s.invincibleUntil = Date.now() + 2000;
        s.beetleCooldown = 2.0; // 2s invulnerability cooldown
        s.stamina = Math.max(0, s.stamina - 25);
        s.shake = 0.35; // screen shake
        ev.push('beetleBite');

        // Bunny bounces back 1 step (1 full tile knockback)
        let pushX = s.x - b.x;
        let pushY = s.y - b.y;
        const len = Math.hypot(pushX, pushY) || 1;
        pushX /= len;
        pushY /= len;
        if (Math.abs(pushX) < 0.05 && Math.abs(pushY) < 0.05) {
          pushX = -b.dx || -1;
          pushY = -b.dy || 0;
        }
        const bounceDist = 1.0;
        const bx = s.x + pushX * bounceDist;
        const by = s.y + pushY * bounceDist;
        if (!hits(s, bx, by)) {
          s.x = bx;
          s.y = by;
        } else if (!hits(s, s.x + pushX * 0.5, s.y + pushY * 0.5)) {
          s.x += pushX * 0.5;
          s.y += pushY * 0.5;
        }

        // Damage particles
        for (let i = 0; i < 16; i++) {
          const a = Math.random() * Math.PI * 2, v = 1.5 + Math.random() * 3.5;
          s.particles.push({
            x: s.x,
            y: s.y,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v,
            life: 0.35 + Math.random() * 0.3,
            c: 4, // red damage particle
          });
        }

        if (s.stamina <= 0) {
          ev.push('exhaustedByBeetle');
        }
      }
    }
  }

  s.particles = s.particles.filter((p) => (p.life -= dt) > 0);
  s.particles.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.9; p.vy *= 0.9; });
  if (s.grid[Math.floor(s.y)]?.[Math.floor(s.x)] === EXIT) { s.won = true; ev.push('win'); }
}

export function dig(s) {
  const fx = Math.sign(s.facing.x), fy = Math.sign(s.facing.y);
  const tx = Math.floor(s.x), ty = Math.floor(s.y);
  const cands = fx && fy ? [[tx + fx, ty], [tx, ty + fy], [tx + fx, ty + fy]] : [[tx + fx, ty + fy]];
  // Dig only interior walls (keep outer border solid)
  const inside = (x, y) => x > 0 && y > 0 && x < s.W - 1 && y < s.H - 1;

  // Bedrock Protection: Cannot be drilled or dug
  const bedrock = cands.some(([x, y]) => inside(x, y) && s.grid[y]?.[x] === BEDROCK);
  if (bedrock && (!s.drillActive || !cands.some(([x, y]) => inside(x, y) && (s.grid[y][x] === STONE || s.grid[y][x] === SOFT)))) {
    s.shake = 0.2;
    return 'bedrock';
  }

  // Rock Breaker Drill: permanently destroys 1 solid stone wall (or soft wall)
  if (s.drillActive) {
    const stoneTarget = cands.find(([x, y]) => inside(x, y) && s.grid[y][x] === STONE);
    const target = stoneTarget || cands.find(([x, y]) => inside(x, y) && s.grid[y][x] === SOFT);
    if (target) {
      const [x, y] = target;
      s.grid[y][x] = PATH;
      if (s.drillUses && s.drillUses > 1) {
        s.drillUses -= 1;
      } else {
        s.drillActive = false;
        s.drillUses = 0;
      }
      s.digs++;
      s.shake = 0.35;
      for (let i = 0; i < 32; i++) {
        const a = Math.random() * Math.PI * 2, v = 2 + Math.random() * 4.5;
        s.particles.push({
          x: x + 0.5,
          y: y + 0.5,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          life: 0.5 + Math.random() * 0.5,
          c: i % 4,
          drill: true,
        });
      }
      return 'drillStone';
    } else {
      const outerStone = cands.some(([x, y]) => !inside(x, y) && s.grid[y]?.[x] === STONE);
      if (outerStone) {
        s.shake = 0.15;
        return 'borderWall';
      }
    }
  }

  const soft = cands.find(([x, y]) => inside(x, y) && s.grid[y][x] === SOFT);
  if (!soft) {
    const stone = cands.some(([x, y]) => s.grid[y]?.[x] === STONE);
    if (stone) s.shake = 0.2;
    return stone ? 'stone' : 'none';
  }
  const [x, y] = soft;
  const cost = s.digCost || DIG_COST;
  if (s.freeDigs > 0) s.freeDigs--;
  else if (s.stamina < cost) return 'tired';
  else s.stamina -= cost;
  s.grid[y][x] = PATH;
  s.digs++;
  s.shake = 0.12;
  for (let i = 0; i < 18; i++) {
    const a = Math.random() * Math.PI * 2, v = 1 + Math.random() * 3;
    s.particles.push({ x: x + 0.5, y: y + 0.5, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.4 + Math.random() * 0.4, c: i % 3 });
  }
  return 'dug';
}
