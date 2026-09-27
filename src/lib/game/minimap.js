import { PATH, SOFT, STONE, EXIT } from './maze';
import { drawCarrot } from './characters';

const COLORS = { [PATH]: '#ecd3a2', [SOFT]: '#d98a45', [STONE]: '#4a3526', [EXIT]: '#7fb35a' };
const circle = (ctx, x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };

export function drawMiniMap(ctx, s, w, h, t) {
  const ts = Math.min((w - 20) / s.W, (h - 20) / s.H);
  const ox = (w - ts * s.W) / 2, oy = (h - ts * s.H) / 2;
  ctx.clearRect(0, 0, w, h);
  for (let y = 0; y < s.H; y++)
    for (let x = 0; x < s.W; x++) {
      const v = s.grid[y][x];
      ctx.fillStyle = COLORS[v];
      ctx.fillRect(ox + x * ts, oy + y * ts, ts + 0.5, ts + 0.5);
      if (v === SOFT) {
        ctx.fillStyle = 'rgba(120,60,20,0.55)';
        ctx.fillRect(ox + x * ts + ts * 0.3, oy + y * ts + ts * 0.3, ts * 0.4, ts * 0.4);
      }
    }
  const cx = (x) => ox + (x + 0.5) * ts, cy = (y) => oy + (y + 0.5) * ts;
  ctx.fillStyle = '#5a331b'; circle(ctx, cx(s.start.x), cy(s.start.y), ts * 0.45);
  ctx.strokeStyle = '#fff4e0'; ctx.lineWidth = ts * 0.12; ctx.stroke();
  s.carrots.forEach((c) => { if (!c.taken) { ctx.fillStyle = '#f08a3c'; circle(ctx, cx(c.x), cy(c.y), ts * 0.2); } });
  drawCarrot(ctx, cx(s.exit.x), cy(s.exit.y) + ts * 0.2, ts * 1.5, 0, t);

  const bx = ox + s.x * ts, by = oy + s.y * ts, p = (Math.sin(t * 5) + 1) / 2;
  ctx.fillStyle = `rgba(255,107,139,${0.5 - 0.35 * p})`; circle(ctx, bx, by, ts * (0.6 + 1 * p));
  ctx.fillStyle = '#ffffff'; circle(ctx, bx, by, ts * 0.45);
  ctx.strokeStyle = '#ff6b8b'; ctx.lineWidth = ts * 0.16; ctx.stroke();
}