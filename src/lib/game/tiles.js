import { PATH, SOFT, EXIT } from './maze';

const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;
const dot = (ctx, x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
const bits = (h, s, m) => ((h >>> s) & m) / m;

function drawPath(ctx, px, py, ts, x, y) {
  const h = hash(x, y);
  ctx.fillStyle = (x + y) % 2 ? '#7a4e30' : '#7e5233';
  ctx.fillRect(px, py, ts + 1, ts + 1);
  ctx.fillStyle = 'rgba(52,30,16,0.35)';
  for (let i = 0; i < 4; i++) dot(ctx, px + bits(h, i * 6, 63) * ts, py + bits(h, i * 6 + 3, 63) * ts, ts * (0.025 + i * 0.008));
  ctx.fillStyle = 'rgba(214,160,108,0.2)';
  dot(ctx, px + bits(h, 7, 127) * ts, py + bits(h, 13, 127) * ts, ts * 0.04);
}

function drawSoft(ctx, px, py, ts, x, y) {
  const h = hash(x, y);
  ctx.fillStyle = '#7a4e30';
  ctx.fillRect(px, py, ts + 1, ts + 1);
  ctx.fillStyle = '#b37d4b';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(px + ts * 0.05, py + ts * 0.05, ts * 0.9, ts * 0.9, ts * 0.22);
  } else {
    ctx.rect(px + ts * 0.05, py + ts * 0.05, ts * 0.9, ts * 0.9);
  }
  ctx.fill();
  ctx.fillStyle = '#c99461';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(px + ts * 0.12, py + ts * 0.1, ts * 0.76, ts * 0.55, ts * 0.2);
  } else {
    ctx.rect(px + ts * 0.12, py + ts * 0.1, ts * 0.76, ts * 0.55);
  }
  ctx.fill();
  ctx.fillStyle = '#dcae7a';
  for (let i = 0; i < 5; i++) dot(ctx, px + ts * (0.2 + bits(h, i * 5, 15) * 0.6), py + ts * (0.2 + bits(h, i * 5 + 2, 15) * 0.6), ts * 0.035);
  const f = h & 1 ? 1 : -1;
  ctx.strokeStyle = 'rgba(110,70,38,0.7)'; ctx.lineWidth = ts * 0.035; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(px + ts * (0.5 - 0.2 * f), py + ts * 0.35); ctx.lineTo(px + ts * 0.5, py + ts * 0.5);
  ctx.lineTo(px + ts * (0.5 - 0.08 * f), py + ts * 0.7);
  ctx.moveTo(px + ts * 0.5, py + ts * 0.5); ctx.lineTo(px + ts * (0.5 + 0.2 * f), py + ts * 0.56);
  ctx.stroke();
}

function drawStone(ctx, px, py, ts, x, y) {
  const h = hash(x, y);
  ctx.fillStyle = '#342e29';
  ctx.fillRect(px, py, ts + 1, ts + 1);
  [[0.3, 0.32, 0.26], [0.7, 0.36, 0.22], [0.45, 0.72, 0.27], [0.8, 0.78, 0.16]].forEach(([rx, ry, rr], i) => {
    const j = bits(h, i * 4, 15) * 0.08;
    const cx = px + (rx + j - 0.04) * ts, cy = py + (ry - j + 0.04) * ts, r = rr * ts;
    ctx.fillStyle = '#4f4843'; dot(ctx, cx, cy + r * 0.14, r);
    ctx.fillStyle = '#6f675f'; dot(ctx, cx, cy, r * 0.92);
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; dot(ctx, cx - r * 0.3, cy - r * 0.3, r * 0.35);
  });
  if (y === 0) {
    ctx.fillStyle = '#6a9a47';
    ctx.fillRect(px, py, ts + 1, ts * 0.42);
    ctx.fillStyle = '#8cc063';
    for (let i = 0; i < 4; i++) {
      const bx = px + ts * (0.12 + i * 0.25);
      ctx.beginPath(); ctx.moveTo(bx - ts * 0.05, py + ts * 0.42); ctx.lineTo(bx, py + ts * 0.22); ctx.lineTo(bx + ts * 0.05, py + ts * 0.42); ctx.fill();
    }
  }
}

function drawExit(ctx, px, py, ts, t) {
  ctx.fillStyle = '#78ad52';
  ctx.fillRect(px, py, ts + 1, ts + 1);
  const g = ctx.createRadialGradient(px + ts / 2, py + ts / 2, 0, px + ts / 2, py + ts / 2, ts * 0.7);
  g.addColorStop(0, `rgba(255,241,180,${0.75 + 0.2 * Math.sin(t * 3)})`);
  g.addColorStop(1, 'rgba(255,241,180,0)');
  ctx.fillStyle = g; ctx.fillRect(px, py, ts, ts);
  ctx.fillStyle = '#5b3a22';
  ctx.beginPath(); ctx.ellipse(px + ts / 2, py + ts * 0.92, ts * 0.4, ts * 0.12, 0, 0, Math.PI * 2); ctx.fill();
}

export function drawTile(ctx, type, px, py, ts, x, y, t) {
  if (type === PATH) return drawPath(ctx, px, py, ts, x, y);
  if (type === SOFT) return drawSoft(ctx, px, py, ts, x, y);
  if (type === EXIT) return drawExit(ctx, px, py, ts, t);
  return drawStone(ctx, px, py, ts, x, y);
}