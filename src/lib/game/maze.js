export const PATH = 0, SOFT = 1, STONE = 2, EXIT = 3;
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function createLevel(level) {
  const tier = Math.floor((level - 1) / 5);
  const cw = Math.min(15, 5 + tier * 4), ch = Math.min(19, 7 + tier * 4);
  const W = cw * 2 + 1, H = ch * 2 + 1;
  const grid = Array.from({ length: H }, () => Array(W).fill(STONE));
  const seen = Array.from({ length: ch }, () => Array(cw).fill(false));
  const stack = [[0, ch - 1]];
  seen[ch - 1][0] = true;
  grid[H - 2][1] = PATH;
  while (stack.length) {
    const [cx, cy] = stack[stack.length - 1];
    const next = shuffle(DIRS.slice()).find(([dx, dy]) => {
      const nx = cx + dx, ny = cy + dy;
      return nx >= 0 && ny >= 0 && nx < cw && ny < ch && !seen[ny][nx];
    });
    if (!next) { stack.pop(); continue; }
    const [dx, dy] = next, nx = cx + dx, ny = cy + dy;
    seen[ny][nx] = true;
    grid[cy * 2 + 1 + dy][cx * 2 + 1 + dx] = PATH;
    grid[ny * 2 + 1][nx * 2 + 1] = PATH;
    stack.push([nx, ny]);
  }
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++)
      if (grid[y][x] === STONE && x % 2 !== y % 2 && Math.random() < 0.42) grid[y][x] = SOFT;

  const start = { x: 1, y: H - 2 }, exit = { x: W - 2, y: 0 };
  grid[0][W - 2] = EXIT;

  // "Ancient Tree Roots" landmark: path cell closest to the maze center
  let landmark = null;
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      if (grid[y][x] !== PATH) continue;
      const d = Math.abs(x - (W - 1) / 2) + Math.abs(y - (H - 1) / 2);
      if (!landmark || d < landmark.d) landmark = { x, y, d };
    }

  const spots = [];
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const far = (p) => Math.abs(p.x - x) + Math.abs(p.y - y) > 3;
      if (grid[y][x] === PATH && !(x === landmark.x && y === landmark.y) && far(start) && far(exit)) spots.push([x, y]);
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

  return {
    level, W, H, grid, start, exit, landmark, carrots, droplets, materials,
    x: start.x + 0.5, y: start.y + 0.5, facing: { x: 0, y: -1 },
    stamina: 100, water: 0, freeDigs: 0, time: 0, digs: 0, particles: [], shake: 0, won: false, moving: false,
  };
}