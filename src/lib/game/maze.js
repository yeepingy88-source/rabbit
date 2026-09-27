export const PATH = 0, SOFT = 1, STONE = 2, EXIT = 3;
export const TILE = { PATH: 0, SOFT: 1, STONE: 2, WALL: 2, EXIT: 3 };
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** BFS distance map from (sx,sy) over PATH cells */
function bfsDist(grid, W, H, sx, sy) {
  const dist = Array.from({ length: H }, () => Array(W).fill(-1));
  const q = [[sx, sy]];
  dist[sy][sx] = 0;
  for (let i = 0; i < q.length; i++) {
    const [x, y] = q[i];
    for (const [dx, dy] of DIRS) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      if (grid[ny][nx] !== PATH && grid[ny][nx] !== EXIT) continue;
      if (dist[ny][nx] >= 0) continue;
      dist[ny][nx] = dist[y][x] + 1;
      q.push([nx, ny]);
    }
  }
  return dist;
}

/**
 * Recursive-backtracker maze with:
 * - deeper branching (prefer unexplored neighbors randomly)
 * - random start & far exit
 * - solid outer border (no edge soft walls → no "hug the wall" dig-through)
 */
export function createLevel(level) {
  const isFinal = level >= 20;
  const tier = Math.min(4, Math.floor((level - 1) / 5));
  const cw = isFinal ? 16 : Math.min(17, 6 + Math.min(3, tier) * 3 + Math.floor((level - 1) % 5));
  const ch = isFinal ? 19 : Math.min(21, 8 + Math.min(3, tier) * 3 + Math.floor((level - 1) % 5));
  const W = cw * 2 + 1, H = ch * 2 + 1;
  const grid = Array.from({ length: H }, () => Array(W).fill(STONE));
  const seen = Array.from({ length: ch }, () => Array(cw).fill(false));

  // True recursive DFS — long corridors & real dead-ends
  const carve = (cx, cy) => {
    seen[cy][cx] = true;
    grid[cy * 2 + 1][cx * 2 + 1] = PATH;
    for (const [dx, dy] of shuffle(DIRS.slice())) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= cw || ny >= ch || seen[ny][nx]) continue;
      // knock down wall between cells
      grid[cy * 2 + 1 + dy][cx * 2 + 1 + dx] = PATH;
      carve(nx, ny);
    }
  };
  // Random DFS seed for layout variety
  carve(Math.floor(Math.random() * cw), Math.floor(Math.random() * ch));

  // Soft diggable walls ONLY deep inside (never on outer two rings)
  // → prevents "dig along the edge" shortcuts
  for (let y = 2; y < H - 2; y++) {
    for (let x = 2; x < W - 2; x++) {
      if (grid[y][x] !== STONE) continue;
      // only wall cells between corridors (odd/even mix)
      if (x % 2 === y % 2) continue;
      // fewer soft walls early, more later — still sparse for challenge
      const softChance = 0.28 + tier * 0.04;
      if (Math.random() < softChance) grid[y][x] = SOFT;
    }
  }

  // Collect interior PATH cells
  const paths = [];
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++)
      if (grid[y][x] === PATH) paths.push([x, y]);

  // Random start, then exit = farthest PATH cell (forces deep route)
  const [sx, sy] = paths[Math.floor(Math.random() * paths.length)];
  const dist = bfsDist(grid, W, H, sx, sy);
  let best = [sx, sy], bestD = 0;
  for (const [x, y] of paths) {
    if (dist[y][x] > bestD) { bestD = dist[y][x]; best = [x, y]; }
  }
  const [ex, ey] = best;

  // Place EXIT; keep outer border STONE except the exit cell itself
  grid[ey][ex] = EXIT;
  for (let x = 0; x < W; x++) {
    if (grid[0][x] !== EXIT) grid[0][x] = STONE;
    if (grid[H - 1][x] !== EXIT) grid[H - 1][x] = STONE;
  }
  for (let y = 0; y < H; y++) {
    if (grid[y][0] !== EXIT) grid[y][0] = STONE;
    if (grid[y][W - 1] !== EXIT) grid[y][W - 1] = STONE;
  }

  const start = { x: sx, y: sy }, exit = { x: ex, y: ey };

  // Landmark: PATH nearest center, not start/exit
  let landmark = null;
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      if (grid[y][x] !== PATH) continue;
      if ((x === sx && y === sy) || (x === ex && y === ey)) continue;
      const d = Math.abs(x - (W - 1) / 2) + Math.abs(y - (H - 1) / 2);
      if (!landmark || d < landmark.d) landmark = { x, y, d };
    }
  if (!landmark) landmark = { x: sx, y: sy, d: 0 };

  // Detect dead ends (corridors with only 1 open direction)
  const deadEnds = [];
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      if (grid[y][x] !== PATH) continue;
      if ((x === sx && y === sy) || (x === ex && y === ey)) continue;
      let openCount = 0;
      for (const [dx, dy] of DIRS) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < W && ny < H) {
          if (grid[ny][nx] === PATH || grid[ny][nx] === EXIT) {
            openCount++;
          }
        }
      }
      if (openCount === 1) {
        deadEnds.push({ x, y, dist: dist[y][x] });
      }
    }
  }
  deadEnds.sort((a, b) => b.dist - a.dist);

  // Rare Deep Core Shard: occasionally spawns at the end of deep dead ends
  let shardSpot = null;
  if (deadEnds.length > 0 && (Math.random() < 0.75 || level >= 2)) {
    shardSpot = deadEnds[0];
  }

  const spots = [];
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const far = (p) => Math.abs(p.x - x) + Math.abs(p.y - y) > 3;
      if (
        grid[y][x] === PATH &&
        !(x === landmark.x && y === landmark.y) &&
        !(shardSpot && x === shardSpot.x && y === shardSpot.y) &&
        far(start) &&
        far(exit)
      )
        spots.push([x, y]);
    }
  shuffle(spots);
  const nC = 4 + level;
  const carrots = spots.slice(0, nC).map(([x, y]) => ({ x, y, taken: false }));
  const rest = spots.slice(nC);
  const mk = (n, type) => rest.splice(0, n).map(([x, y]) => ({
    x, y, type, ox: (Math.random() - 0.5) * 0.5, oy: (Math.random() - 0.5) * 0.5, taken: false,
  }));
  const droplets = mk(3 + Math.floor(level / 2), 'water');
  const materials = [...mk(2 + tier, 'fiber'), ...mk(1 + tier, 'clay')];

  if (shardSpot) {
    materials.push({
      x: shardSpot.x,
      y: shardSpot.y,
      type: 'shard',
      ox: 0,
      oy: 0,
      taken: false,
    });
  }

  return {
    level, W, H, grid, start, exit, landmark, carrots, droplets, materials,
    x: start.x + 0.5, y: start.y + 0.5, facing: { x: 0, y: -1 },
    stamina: 100, water: 0, freeDigs: 0, drillActive: false, time: 0, digs: 0, particles: [], shake: 0, won: false, moving: false,
  };
}
