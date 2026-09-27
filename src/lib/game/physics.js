import { PATH, SOFT, STONE, EXIT } from './maze';

const HALF = 0.27, SPEED = 4.32; // +20% faster exploration (was 3.6)
// No passive regen — dig must cost real stamina; recover only from water / carrots / brew
export const DIG_COST = 28;

function solidAt(s, x, y) {
  const tx = Math.floor(x), ty = Math.floor(y);
  if (tx < 0 || ty < 0 || tx >= s.W || ty >= s.H) return true;
  const v = s.grid[ty][tx];
  return v === SOFT || v === STONE;
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
  const ix = input.x, iy = input.y;
  s.moving = !!(ix || iy);
  if (s.moving) {
    s.facing = { x: ix, y: iy };
    const d = SPEED * dt;
    const nx = s.x + ix * d;
    if (!hits(s, nx, s.y)) s.x = nx; else if (!iy) nudge(s, 'y', Math.sign(ix), d);
    const ny = s.y + iy * d;
    if (!hits(s, s.x, ny)) s.y = ny; else if (!ix) nudge(s, 'x', Math.sign(iy), d);
  }
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
  for (const m of s.materials) {
    if (!m.taken && Math.hypot(m.x + 0.5 + m.ox - s.x, m.y + 0.5 + m.oy - s.y) < 0.55) {
      m.taken = true;
      ev.push(m.type);
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

      // Check collision with bunny
      const dist = Math.hypot(s.x - b.x, s.y - b.y);
      if (dist < 0.65 && (!s.beetleCooldown || s.beetleCooldown <= 0)) {
        s.beetleCooldown = 1.0; // 1s invulnerability cooldown
        s.stamina = Math.max(0, s.stamina - 25);
        s.shake = 0.35; // screen shake
        ev.push('beetleBite');

        // Bunny bounces back 1 step
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
        for (let i = 0; i < 14; i++) {
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

  // Rock Breaker Drill: permanently destroys 1 solid stone wall (or soft wall)
  if (s.drillActive) {
    const stoneTarget = cands.find(([x, y]) => inside(x, y) && s.grid[y][x] === STONE);
    const target = stoneTarget || cands.find(([x, y]) => inside(x, y) && s.grid[y][x] === SOFT);
    if (target) {
      const [x, y] = target;
      s.grid[y][x] = PATH;
      s.drillActive = false;
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
  if (s.freeDigs > 0) s.freeDigs--;
  else if (s.stamina < DIG_COST) return 'tired';
  else s.stamina -= DIG_COST;
  s.grid[y][x] = PATH;
  s.digs++;
  s.shake = 0.12;
  for (let i = 0; i < 18; i++) {
    const a = Math.random() * Math.PI * 2, v = 1 + Math.random() * 3;
    s.particles.push({ x: x + 0.5, y: y + 0.5, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.4 + Math.random() * 0.4, c: i % 3 });
  }
  return 'dug';
}
